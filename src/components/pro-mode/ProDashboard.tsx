import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Network, FileCode, ShieldCheck, Link2, AlertCircle, Sparkles, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FeatureCard } from "./FeatureCard";
import { VisualizerModal } from "./VisualizerModal";
import { WikiGenerator } from "./WikiGenerator";
import { SecurityGate } from "./SecurityGate";
import { TerminalLog } from "./TerminalLog";
import { OverallReport } from "./OverallReport";
import { useProAnalyze } from "@/hooks/useProAnalyze";

interface ProDashboardProps {
  initialRepoUrl?: string;
}

export const ProDashboard = ({ initialRepoUrl = "" }: ProDashboardProps) => {
  const [repoUrl, setRepoUrl] = useState(initialRepoUrl);
  const [isPrivateModeActive, setIsPrivateModeActive] = useState(false);
  const [showSecurityGate, setShowSecurityGate] = useState(false);

  const {
    isLoading,
    currentMode,
    result,
    reportResult,
    logs,
    analyze,
    showVisualizerModal,
    showWikiModal,
    showReportModal,
    closeVisualizerModal,
    closeWikiModal,
    closeReportModal,
  } = useProAnalyze();

  const handleVisualize = useCallback(() => {
    if (!repoUrl.trim()) return;
    analyze(repoUrl, "visualize");
  }, [repoUrl, analyze]);

  const handleWiki = useCallback(() => {
    if (!repoUrl.trim()) return;
    analyze(repoUrl, "wiki");
  }, [repoUrl, analyze]);

  const handleGenerateReport = useCallback(() => {
    if (!repoUrl.trim()) return;
    analyze(repoUrl, "report");
  }, [repoUrl, analyze]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen relative"
    >
      {/* Animated Grid Background */}
      <div className="fixed inset-0 bg-slate-950">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(212, 175, 55, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(212, 175, 55, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/50 to-slate-950" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Context Bar with Fetch Button */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="glass-card rounded-2xl p-6 border border-primary/20 bg-slate-900/60 backdrop-blur-xl">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                <span className="text-sm font-medium text-muted-foreground">
                  Active Repository
                </span>
              </div>
              
              <div className="flex-1 flex items-center gap-3 w-full">
                <div className="relative flex-1">
                  <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    placeholder="https://github.com/owner/repo"
                    className="pl-12 h-12 bg-slate-800/50 border-slate-700 font-mono text-sm focus:border-primary"
                  />
                </div>
                
                {/* Generate Complete Report Button */}
                <Button
                  onClick={handleGenerateReport}
                  disabled={!repoUrl.trim() || isLoading}
                  className="h-12 px-6 bg-gradient-to-r from-primary to-amber-500 hover:from-primary/90 hover:to-amber-500/90 text-primary-foreground font-semibold shadow-lg shadow-primary/30"
                >
                  {isLoading && currentMode === "report" ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Complete Report
                    </>
                  )}
                </Button>
                
                {isPrivateModeActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30"
                  >
                    <ShieldCheck className="w-4 h-4 text-green-500" />
                    <span className="text-xs font-medium text-green-400">Private Mode</span>
                  </motion.div>
                )}
              </div>
            </div>

            {!repoUrl.trim() && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 flex items-center gap-2 text-amber-400/80"
              >
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">Enter a repository URL to unlock Pro features</span>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Feature Cards Grid */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {/* Card A: Visualizer */}
          <FeatureCard
            icon={Network}
            title="Architecture Map"
            description="Generate an interactive flowchart visualizing the repository's architecture and component relationships."
            onClick={handleVisualize}
            isLoading={isLoading && currentMode === "visualize"}
            disabled={!repoUrl.trim()}
          />

          {/* Card B: Wiki Generator */}
          <FeatureCard
            icon={FileCode}
            title="Generate Official Wiki"
            description="Create a production-ready README.md with badges, installation steps, and comprehensive documentation."
            onClick={handleWiki}
            isLoading={isLoading && currentMode === "wiki"}
            disabled={!repoUrl.trim()}
          />

          {/* Card C: Enterprise Mode */}
          <FeatureCard
            icon={ShieldCheck}
            title="Enterprise Mode"
            description="Unlock private repository analysis with secure enterprise authentication and encrypted tunnels."
            onClick={() => setShowSecurityGate(true)}
            badge={isPrivateModeActive ? "Active" : undefined}
          />
        </motion.div>

        {/* Terminal Log */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <TerminalLog logs={logs} />
        </motion.div>

        {/* Back to Basic Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-primary"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            Use the toggle above to return to Basic Mode
          </Button>
        </motion.div>
      </div>

      {/* Modals */}
      <VisualizerModal
        isOpen={showVisualizerModal}
        onClose={closeVisualizerModal}
        mermaidCode={result?.content || ""}
        repoName={result?.repoName || ""}
      />

      <WikiGenerator
        isOpen={showWikiModal}
        onClose={closeWikiModal}
        markdown={result?.content || ""}
        repoName={result?.repoName || ""}
      />

      <OverallReport
        isOpen={showReportModal}
        onClose={closeReportModal}
        report={reportResult}
      />

      <SecurityGate
        isOpen={showSecurityGate}
        onClose={() => setShowSecurityGate(false)}
        onSuccess={() => setIsPrivateModeActive(true)}
      />
    </motion.div>
  );
};
