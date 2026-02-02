import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Microscope, 
  Link2, 
  Loader2,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForensic } from "@/hooks/useForensic";
import { useAuth } from "@/hooks/useAuth";
import { FileTree } from "@/components/forensic/FileTree";
import { ForensicAnalysisPanel } from "@/components/forensic/ForensicAnalysisPanel";
import { ForensicTerminal } from "@/components/forensic/ForensicTerminal";
import { ForensicChat } from "@/components/forensic/ForensicChat";

const ForensicLab = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialRepoUrl = searchParams.get("repo") || "";
  
  const [repoUrl, setRepoUrl] = useState(initialRepoUrl);
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const {
    isLoadingTree,
    isAnalyzing,
    fileTree,
    repoName,
    selectedFile,
    analysisResult,
    error,
    logs,
    fetchFileTree,
    analyzeFile,
  } = useForensic();

  // Auto-fetch if repo URL is provided
  useEffect(() => {
    if (initialRepoUrl && isAuthenticated) {
      fetchFileTree(initialRepoUrl);
    }
  }, [initialRepoUrl, isAuthenticated, fetchFileTree]);

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [authLoading, isAuthenticated, navigate]);

  const handleFetchTree = useCallback(() => {
    if (repoUrl.trim()) {
      fetchFileTree(repoUrl);
    }
  }, [repoUrl, fetchFileTree]);

  const handleFileSelect = useCallback((filePath: string) => {
    if (repoUrl.trim()) {
      analyzeFile(repoUrl, filePath);
    }
  }, [repoUrl, analyzeFile]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleFetchTree();
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Subtle Grid Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(34, 211, 238, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(34, 211, 238, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/50 to-slate-950" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-slate-800/50 bg-slate-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="text-slate-400 hover:text-slate-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="flex items-center gap-2">
            <Microscope className="w-5 h-5 text-cyan-400" />
            <span className="font-bold text-slate-200">Forensic</span>
            <span className="font-bold text-cyan-400">Lab</span>
          </div>

          <div className="flex-1" />

          {repoName && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-sm font-mono text-cyan-300">{repoName}</span>
            </div>
          )}
        </div>
      </header>

      {/* URL Input Bar */}
      <div className="relative z-10 border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-2xl">
              <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="https://github.com/owner/repo"
                className="pl-12 h-11 bg-slate-800/50 border-slate-700 text-slate-200 font-mono text-sm focus:border-cyan-500 placeholder:text-slate-600"
              />
            </div>
            <Button
              onClick={handleFetchTree}
              disabled={!repoUrl.trim() || isLoadingTree}
              className="h-11 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium"
            >
              {isLoadingTree ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Microscope className="w-4 h-4 mr-2" />
                  Scan Repository
                </>
              )}
            </Button>
            {fileTree.length > 0 && (
              <Button
                variant="outline"
                size="icon"
                onClick={handleFetchTree}
                className="h-11 w-11 border-slate-700 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            )}
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-sm text-red-400"
            >
              {error}
            </motion.p>
          )}
        </div>
      </div>

      {/* Main Content - IDE Layout */}
      <div className="relative z-10 flex-1 flex overflow-hidden">
        {/* Left Panel - File Tree (Evidence Locker) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-72 lg:w-80 border-r border-slate-800/50 bg-slate-900/30 flex flex-col"
        >
          {/* Panel Header */}
          <div className="px-4 py-3 border-b border-slate-800/50 bg-slate-900/50">
            <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
              Evidence Locker
            </h3>
          </div>
          
          {/* File Tree */}
          <div className="flex-1 overflow-hidden">
            <FileTree
              files={fileTree}
              selectedFile={selectedFile}
              onFileSelect={handleFileSelect}
              isLoading={isLoadingTree}
            />
          </div>
        </motion.div>

        {/* Right Panel - Analysis (Autopsy Table) */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Main Analysis Area */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 overflow-hidden bg-slate-950/50"
          >
            <ForensicAnalysisPanel
              result={analysisResult}
              isAnalyzing={isAnalyzing}
              selectedFile={selectedFile}
            />
          </motion.div>

          {/* Terminal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="h-40 lg:h-48 border-t border-slate-800/50"
          >
            <ForensicTerminal logs={logs} />
          </motion.div>
        </div>
      </div>

      {/* Forensic Chat Assistant */}
      <ForensicChat
        fileContent={analysisResult?.fileContent || null}
        fileName={analysisResult?.fileName || null}
        filePath={analysisResult?.filePath || null}
      />
    </div>
  );
};

export default ForensicLab;
