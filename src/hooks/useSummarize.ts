import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface SummaryResult {
  repoName: string;
  summary: string;
  filesAnalyzed: number;
  totalFiles: number;
  timestamp: Date;
}

const LOADING_STEPS = [
  "Fetching repo tree...",
  "Reading config files...",
  "Analyzing structure...",
  "Summoning AI...",
  "Generating summary...",
];

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export const useSummarize = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [result, setResult] = useState<SummaryResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const summarize = async (repoUrl: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    // Simulate step-by-step loading experience
    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => {
        const currentIndex = LOADING_STEPS.indexOf(prev);
        const nextIndex = (currentIndex + 1) % LOADING_STEPS.length;
        return LOADING_STEPS[nextIndex];
      });
    }, 2000);

    setLoadingStep(LOADING_STEPS[0]);

    try {
      // Get current session for auth token
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error("Please sign in to analyze repositories");
      }

      // Use fetch with AbortController for timeout control (90 seconds for large repos)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 90000);

      const response = await fetch(`${SUPABASE_URL}/functions/v1/summarize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ repoUrl }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      clearInterval(stepInterval);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || `Request failed with status ${response.status}`);
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      setResult({
        repoName: data.repoName,
        summary: data.summary,
        filesAnalyzed: data.filesAnalyzed,
        totalFiles: data.totalFiles,
        timestamp: new Date(),
      });

      toast.success("Repository analyzed successfully!");
    } catch (err) {
      let errorMessage = "Failed to analyze repository";
      
      if (err instanceof Error) {
        if (err.name === "AbortError") {
          errorMessage = "Request timed out. The repository might be too large. Please try again.";
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      clearInterval(stepInterval);
      setIsLoading(false);
      setLoadingStep("");
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
  };

  return {
    isLoading,
    loadingStep,
    result,
    error,
    summarize,
    reset,
  };
};
