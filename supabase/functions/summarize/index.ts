import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RepoFile {
  path: string;
  type: string;
}

interface GitHubTreeResponse {
  tree: RepoFile[];
  truncated: boolean;
}

interface GitHubContentResponse {
  content: string;
  encoding: string;
}

// Key files to analyze for understanding a project
const KEY_FILES = [
  "package.json",
  "requirements.txt",
  "README.md",
  "readme.md",
  "Readme.md",
  "Dockerfile",
  "dockerfile",
  "docker-compose.yml",
  "docker-compose.yaml",
  "pyproject.toml",
  "Cargo.toml",
  "go.mod",
  "pom.xml",
  "build.gradle",
  "Gemfile",
  "mix.exs",
  ".env.example",
  "setup.py",
  "tsconfig.json",
  "vite.config.ts",
  "next.config.js",
  "nuxt.config.js",
];

async function fetchGitHubTree(owner: string, repo: string): Promise<{ tree: RepoFile[]; error?: string }> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/trees/HEAD?recursive=1`,
      {
        headers: {
          "Accept": "application/vnd.github.v3+json",
          "User-Agent": "CodeSimplify-Bot",
        },
      }
    );

    if (response.status === 404) {
      return { tree: [], error: "Repository not found. Please check the URL or ensure the repository is public." };
    }

    if (response.status === 403) {
      return { tree: [], error: "Rate limit exceeded or access denied. Please try again later." };
    }

    if (!response.ok) {
      return { tree: [], error: `GitHub API error: ${response.status}` };
    }

    const data: GitHubTreeResponse = await response.json();
    return { tree: data.tree };
  } catch (error) {
    console.error("Error fetching tree:", error);
    return { tree: [], error: "Failed to connect to GitHub. Please try again." };
  }
}

async function fetchFileContent(owner: string, repo: string, path: string): Promise<string | null> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        headers: {
          "Accept": "application/vnd.github.v3+json",
          "User-Agent": "CodeSimplify-Bot",
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const data: GitHubContentResponse = await response.json();
    
    if (data.encoding === "base64" && data.content) {
      const decoded = atob(data.content.replace(/\n/g, ""));
      // Truncate if too large (max 5000 chars per file)
      return decoded.length > 5000 ? decoded.substring(0, 5000) + "\n...[truncated]" : decoded;
    }

    return null;
  } catch (error) {
    console.error(`Error fetching ${path}:`, error);
    return null;
  }
}

interface RepoUrlValidation {
  isValid: boolean;
  error?: string;
  parsed?: { owner: string; repo: string };
}

function validateAndParseRepoUrl(url: string): RepoUrlValidation {
  // Length validation - prevent DoS via large input
  if (!url || typeof url !== 'string') {
    return { isValid: false, error: 'Repository URL is required' };
  }

  if (url.length > 500) {
    return { isValid: false, error: 'URL is too long' };
  }

  // Trim and normalize
  const trimmedUrl = url.trim();

  // Parse GitHub URL formats
  const patterns = [
    /^https?:\/\/github\.com\/([^\/]+)\/([^\/\?#]+)/,
    /^github\.com\/([^\/]+)\/([^\/\?#]+)/,
    /^([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_.-]+)$/,
  ];

  let owner: string | null = null;
  let repo: string | null = null;

  for (const pattern of patterns) {
    const match = trimmedUrl.match(pattern);
    if (match) {
      owner = match[1];
      repo = match[2].replace(/\.git$/, "");
      break;
    }
  }

  if (!owner || !repo) {
    return { isValid: false, error: 'Invalid GitHub repository URL. Use format: https://github.com/owner/repo' };
  }

  // Validate owner name (GitHub allows alphanumeric, hyphen; max 39 chars)
  const validOwnerPattern = /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/;
  if (!validOwnerPattern.test(owner) || owner.length > 39) {
    return { isValid: false, error: 'Invalid repository owner name' };
  }

  // Validate repo name (GitHub allows alphanumeric, hyphen, underscore, dot; max 100 chars)
  const validRepoPattern = /^[a-zA-Z0-9_.-]+$/;
  if (!validRepoPattern.test(repo) || repo.length > 100) {
    return { isValid: false, error: 'Invalid repository name' };
  }

  // Check for path traversal attempts
  if (owner.includes('..') || repo.includes('..')) {
    return { isValid: false, error: 'Invalid characters in repository path' };
  }

  // Prevent reserved names that could cause issues
  const reservedNames = ['api', 'raw', 'gist', 'enterprise', 'settings', 'organizations'];
  if (reservedNames.includes(owner.toLowerCase())) {
    return { isValid: false, error: 'Invalid repository owner' };
  }

  return { isValid: true, parsed: { owner, repo } };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse and validate request body
    let requestBody: { repoUrl?: unknown };
    try {
      requestBody = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid request body" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { repoUrl } = requestBody;

    // Type check and validate the URL
    if (!repoUrl || typeof repoUrl !== 'string') {
      return new Response(
        JSON.stringify({ error: "Repository URL is required and must be a string" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Comprehensive URL validation
    const validation = validateAndParseRepoUrl(repoUrl);
    if (!validation.isValid || !validation.parsed) {
      return new Response(
        JSON.stringify({ error: validation.error || "Invalid GitHub repository URL" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { owner, repo } = validation.parsed;
    console.log(`Analyzing repository: ${owner}/${repo}`);

    // Step 1: Fetch repository tree
    const { tree, error: treeError } = await fetchGitHubTree(owner, repo);
    
    if (treeError) {
      return new Response(
        JSON.stringify({ error: treeError }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Step 2: Build file structure summary
    const fileStructure = tree
      .filter((f) => f.type === "blob")
      .map((f) => f.path)
      .slice(0, 200); // Limit to first 200 files

    // Step 3: Identify and fetch key files
    const keyFilesFound: { path: string; content: string }[] = [];
    
    for (const file of tree) {
      const fileName = file.path.split("/").pop() || "";
      if (KEY_FILES.includes(fileName) && file.type === "blob") {
        const content = await fetchFileContent(owner, repo, file.path);
        if (content) {
          keyFilesFound.push({ path: file.path, content });
        }
      }
    }

    console.log(`Found ${keyFilesFound.length} key files to analyze`);

    // Step 4: Build prompt for AI
    const systemPrompt = `You are CodeSimplify, an expert code analyzer. Your job is to analyze GitHub repositories and provide clear, beginner-friendly summaries.

Analyze the provided file structure and key configuration files. Generate a comprehensive summary with these exact sections:

## 🎯 The Problem It Solves
Explain what problem this project addresses and who it's for. Keep it simple and relatable.

## 🛠️ Tech Stack Explained
List the technologies used with brief explanations of what each does. Format as a bullet list.

## ✨ Key Features
Describe the main features and capabilities of the project. Be specific but concise.

## 📁 Project Structure
Briefly explain how the code is organized (main folders and their purposes).

## 🚀 Getting Started
If you can determine from the config files, provide a quick start guide (installation commands, etc).

Keep your response clear, well-organized, and suitable for a junior developer who might be unfamiliar with the technologies used.`;

    const userPrompt = `# Repository: ${owner}/${repo}

## File Structure (${fileStructure.length} files)
\`\`\`
${fileStructure.slice(0, 100).join("\n")}
${fileStructure.length > 100 ? `\n... and ${fileStructure.length - 100} more files` : ""}
\`\`\`

## Key Configuration Files

${keyFilesFound.map((f) => `### ${f.path}\n\`\`\`\n${f.content}\n\`\`\``).join("\n\n")}

Please analyze this repository and provide a comprehensive summary.`;

    // Step 5: Call AI for summarization
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 2000,
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "AI rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please contact support." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await aiResponse.text();
      console.error("AI API error:", aiResponse.status, errorText);
      throw new Error("Failed to generate summary");
    }

    const aiData = await aiResponse.json();
    const summary = aiData.choices?.[0]?.message?.content || "Unable to generate summary";

    // Step 6: Save to database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error: dbError } = await supabase.from("scans").insert({
      repo_name: `${owner}/${repo}`,
      repo_url: `https://github.com/${owner}/${repo}`,
      summary: summary,
    });

    if (dbError) {
      console.error("Database error:", dbError);
      // Don't fail the request if DB save fails
    }

    return new Response(
      JSON.stringify({
        success: true,
        repoName: `${owner}/${repo}`,
        summary,
        filesAnalyzed: keyFilesFound.length,
        totalFiles: fileStructure.length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in summarize function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "An unexpected error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
