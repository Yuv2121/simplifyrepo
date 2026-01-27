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

function parseRepoUrl(url: string): { owner: string; repo: string } | null {
  // Handle various GitHub URL formats
  const patterns = [
    /github\.com\/([^\/]+)\/([^\/\?#]+)/,
    /^([^\/]+)\/([^\/]+)$/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      // Remove .git suffix if present
      const repo = match[2].replace(/\.git$/, "");
      return { owner: match[1], repo };
    }
  }

  return null;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { repoUrl } = await req.json();

    if (!repoUrl) {
      return new Response(
        JSON.stringify({ error: "Repository URL is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse the repository URL
    const parsed = parseRepoUrl(repoUrl);
    if (!parsed) {
      return new Response(
        JSON.stringify({ error: "Invalid GitHub repository URL. Please use format: https://github.com/owner/repo" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { owner, repo } = parsed;
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
