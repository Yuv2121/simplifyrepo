import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { InputSection } from "@/components/InputSection";
import { ResultCard } from "@/components/ResultCard";
import { RecentScans } from "@/components/RecentScans";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { useSummarize } from "@/hooks/useSummarize";

const Index = () => {
  const { isLoading, loadingStep, result, error, summarize, reset } = useSummarize();
  const queryClient = useQueryClient();

  const handleSubmit = async (url: string) => {
    await summarize(url);
    // Refresh recent scans after successful analysis
    queryClient.invalidateQueries({ queryKey: ["recent-scans"] });
  };

  const handleReset = () => {
    reset();
  };

  const handleSelectRepo = (url: string) => {
    handleSubmit(url);
  };

  return (
    <div className="min-h-screen relative">
      <BackgroundEffects />
      
      <div className="relative z-10 container mx-auto px-4 py-12 md:py-20">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="input"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <InputSection
                onSubmit={handleSubmit}
                isLoading={isLoading}
                loadingStep={loadingStep}
              />
              
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-3xl mx-auto mt-6"
                >
                  <div className="glass-card rounded-xl p-4 border-destructive/50">
                    <p className="text-destructive text-center">{error}</p>
                  </div>
                </motion.div>
              )}

              {!isLoading && <RecentScans onSelectRepo={handleSelectRepo} />}
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <ResultCard
                repoName={result.repoName}
                summary={result.summary}
                filesAnalyzed={result.filesAnalyzed}
                totalFiles={result.totalFiles}
                timestamp={result.timestamp}
                onReset={handleReset}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="text-foreground font-semibold">Code</span>
              <span className="text-primary font-semibold">Simplify</span>
            </div>
            <p>Powered by AI • Built for developers</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
