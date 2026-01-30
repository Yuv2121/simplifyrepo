import { useState, useCallback } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type ProMode = "visualize" | "wiki" | "summary";

interface ProResult {
  repoName: string;
  content: string;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export const useProAnalyze = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentMode, setCurrentMode] = useState<ProMode | null>(null);
  const [result, setResult] = useState<ProResult | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = useCallback((message: string) => {
    setLogs((prev) => [...prev, message]);
  }, []);

  const analyze = useCallback(async (repoUrl: string, mode: ProMode) => {
    setIsLoading(true);
    setCurrentMode(mode);
    setResult(null);
    setLogs([]);

    // Terminal log simulation
    addLog(`Initializing ${mode === "visualize" ? "Visualizer" : "Wiki Generator"}...`);
    
    try {
      // Get session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error("Please sign in to use Pro features");
      }

      addLog("Authenticating session...");
      await new Promise((r) => setTimeout(r, 500));
      
      addLog("Handshaking with GitHub API...");
      await new Promise((r) => setTimeout(r, 800));
      
      addLog("Fetching repository structure...");

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000);

      const response = await fetch(`${SUPABASE_URL}/functions/v1/summarize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ repoUrl, mode }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      addLog("Parsing response...");

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || `Request failed with status ${response.status}`);
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      addLog(mode === "visualize" ? "Rendering topology..." : "Compiling documentation...");
      await new Promise((r) => setTimeout(r, 500));

      addLog("✓ Process complete!");

      setResult({
        repoName: data.repoName,
        content: data.summary,
      });

      toast.success(
        mode === "visualize" 
          ? "Architecture map generated!" 
          : "README.md generated!"
      );

    } catch (err) {
      let errorMessage = "Analysis failed";
      
      if (err instanceof Error) {
        if (err.name === "AbortError") {
          errorMessage = "Request timed out. Please try again.";
        } else {
          errorMessage = err.message;
        }
      }
      
      addLog(`✗ Error: ${errorMessage}`);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [addLog]);

  const reset = useCallback(() => {
    setResult(null);
    setCurrentMode(null);
    setLogs([]);
  }, []);

  return {
    isLoading,
    currentMode,
    result,
    logs,
    analyze,
    reset,
  };
};
