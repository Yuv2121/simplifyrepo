import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
      const { data, error: fnError } = await supabase.functions.invoke("summarize", {
        body: { repoUrl },
      });

      clearInterval(stepInterval);

      if (fnError) {
        throw new Error(fnError.message);
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
      const errorMessage = err instanceof Error ? err.message : "Failed to analyze repository";
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
