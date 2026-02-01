import { useState, useCallback } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type ProMode = "visualize" | "wiki" | "summary" | "report";

interface ProResult {
  repoName: string;
  content: string;
}

interface ReportResult {
  repoName: string;
  architecture: string;
  readme: string;
  summary: string;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export const useProAnalyze = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentMode, setCurrentMode] = useState<ProMode | null>(null);
  const [result, setResult] = useState<ProResult | null>(null);
  const [reportResult, setReportResult] = useState<ReportResult | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [showVisualizerModal, setShowVisualizerModal] = useState(false);
  const [showWikiModal, setShowWikiModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const addLog = useCallback((message: string) => {
    setLogs((prev) => [...prev, message]);
  }, []);

  const fetchWithMode = async (repoUrl: string, mode: string, session: { access_token: string }) => {
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

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error || `Request failed with status ${response.status}`);
    }

    if (data?.error) {
      throw new Error(data.error);
    }

    return data;
  };

  const analyze = useCallback(async (repoUrl: string, mode: ProMode) => {
    setIsLoading(true);
    setCurrentMode(mode);
    setResult(null);
    setReportResult(null);
    setLogs([]);

    const modeLabels: Record<ProMode, string> = {
      visualize: "Visualizer",
      wiki: "Wiki Generator",
      summary: "Summarizer",
      report: "Complete Report Generator",
    };

    addLog(`Initializing ${modeLabels[mode]}...`);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error("Please sign in to use Pro features");
      }

      addLog("Authenticating session...");
      await new Promise((r) => setTimeout(r, 500));
      
      addLog("Handshaking with GitHub API...");
      await new Promise((r) => setTimeout(r, 800));
      
      addLog("Fetching repository structure...");

      if (mode === "report") {
        // Fetch all three in parallel for complete report
        addLog("Generating architecture diagram...");
        const archPromise = fetchWithMode(repoUrl, "visualize", session);
        
        addLog("Creating professional README...");
        const wikiPromise = fetchWithMode(repoUrl, "wiki", session);
        
        addLog("Analyzing repository structure...");
        const summaryPromise = fetchWithMode(repoUrl, "summary", session);

        const [archData, wikiData, summaryData] = await Promise.all([
          archPromise,
          wikiPromise,
          summaryPromise,
        ]);

        addLog("Compiling complete report...");
        await new Promise((r) => setTimeout(r, 500));

        addLog("✓ Complete analysis finished!");

        setReportResult({
          repoName: archData.repoName,
          architecture: archData.summary,
          readme: wikiData.summary,
          summary: summaryData.summary,
        });

        setShowReportModal(true);
        toast.success("Complete report generated successfully!");
      } else {
        const data = await fetchWithMode(repoUrl, mode, session);

        addLog("Parsing response...");
        addLog(mode === "visualize" ? "Rendering topology..." : "Compiling documentation...");
        await new Promise((r) => setTimeout(r, 500));

        addLog("✓ Process complete!");

        setResult({
          repoName: data.repoName,
          content: data.summary,
        });

        if (mode === "visualize") {
          setShowVisualizerModal(true);
        } else if (mode === "wiki") {
          setShowWikiModal(true);
        }

        toast.success(
          mode === "visualize" 
            ? "Architecture map generated!" 
            : "README.md generated!"
        );
      }

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

  const closeVisualizerModal = useCallback(() => {
    setShowVisualizerModal(false);
    setResult(null);
    setCurrentMode(null);
  }, []);

  const closeWikiModal = useCallback(() => {
    setShowWikiModal(false);
    setResult(null);
    setCurrentMode(null);
  }, []);

  const closeReportModal = useCallback(() => {
    setShowReportModal(false);
    setReportResult(null);
    setCurrentMode(null);
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setReportResult(null);
    setCurrentMode(null);
    setLogs([]);
    setShowVisualizerModal(false);
    setShowWikiModal(false);
    setShowReportModal(false);
  }, []);

  return {
    isLoading,
    currentMode,
    result,
    reportResult,
    logs,
    analyze,
    reset,
    showVisualizerModal,
    showWikiModal,
    showReportModal,
    closeVisualizerModal,
    closeWikiModal,
    closeReportModal,
  };
};
