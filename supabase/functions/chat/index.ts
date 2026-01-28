import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  repoContext?: {
    repoName: string;
    summary: string;
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, repoContext }: ChatRequest = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build a context-aware system prompt
    let systemPrompt = `You are CodeBuddy, a friendly and patient coding assistant. Your mission is to help beginners understand code and programming concepts.

## Your Teaching Style:
- **Use Simple Analogies**: Compare coding concepts to everyday things (e.g., "A function is like a recipe - you give it ingredients and it gives you a dish")
- **Break Down Complex Ideas**: Explain step-by-step, like teaching a child
- **Use Real Examples**: Show simple code snippets when helpful
- **Be Encouraging**: Celebrate curiosity and make learning fun
- **Be Concise**: Keep explanations short but clear (2-3 paragraphs max)
- **Professional Yet Friendly**: Balance simplicity with accuracy

## Response Format:
- Start with a simple one-line answer
- Then explain "why" or "how" in beginner terms
- Use emojis sparingly to keep it friendly 🎯
- If relevant, give a tiny code example

## What You Can Help With:
- Explaining what code does line-by-line
- Clarifying programming concepts and keywords
- Suggesting best practices in simple terms
- Answering "why is this done this way?" questions`;

    // Add repository context if available
    if (repoContext?.repoName && repoContext?.summary) {
      systemPrompt += `

## Current Repository Context:
You're helping the user understand the repository: **${repoContext.repoName}**

Here's the analysis of this repository:
${repoContext.summary}

Use this context to give relevant, specific answers about this project's code structure, technologies, and patterns.`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit reached. Please wait a moment and try again." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI service temporarily unavailable" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Return streaming response
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });

  } catch (error) {
    console.error("Chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
