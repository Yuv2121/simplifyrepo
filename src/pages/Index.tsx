import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { InputSection } from "@/components/InputSection";
import { ResultCard } from "@/components/ResultCard";
import { RecentScans } from "@/components/RecentScans";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { UserMenu } from "@/components/UserMenu";
import { ChatBot } from "@/components/ChatBot";
import { useSummarize } from "@/hooks/useSummarize";
import { useAuth } from "@/hooks/useAuth";
import { ModeToggle } from "@/components/pro-mode/ModeToggle";
import { ProDashboard } from "@/components/pro-mode/ProDashboard";
const Index = () => {
  const [isProMode, setIsProMode] = useState(false);
  const [lastRepoUrl, setLastRepoUrl] = useState("");
  const {
    isLoading,
    loadingStep,
    result,
    error,
    summarize,
    reset
  } = useSummarize();
  const {
    isAuthenticated,
    isLoading: authLoading
  } = useAuth();
  const queryClient = useQueryClient();
  const handleSubmit = async (url: string) => {
    setLastRepoUrl(url);
    await summarize(url);
    // Refresh recent scans after successful analysis
    queryClient.invalidateQueries({
      queryKey: ["recent-scans"]
    });
  };
  const handleReset = () => {
    reset();
  };
  const handleSelectRepo = (url: string) => {
    handleSubmit(url);
  };
  const handleToggleProMode = () => {
    setIsProMode(!isProMode);
  };
  return <div className="min-h-screen relative">
      {/* Background - conditional based on mode */}
      <AnimatePresence mode="wait">
        {!isProMode && <motion.div key="basic-bg" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} transition={{
        duration: 0.5
      }}>
            <BackgroundEffects />
          </motion.div>}
      </AnimatePresence>
      
      {/* Header with User Menu and Mode Toggle */}
      <header className="relative z-20 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-foreground">Simplify</span>
            <span className="text-xl font-bold text-primary">repo</span>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated && <ModeToggle isProMode={isProMode} onToggle={handleToggleProMode} />}
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Main Content - Animated Transition */}
      <AnimatePresence mode="wait">
        {isProMode ? <motion.div key="pro-mode" initial={{
        opacity: 0,
        scale: 0.95
      }} animate={{
        opacity: 1,
        scale: 1
      }} exit={{
        opacity: 0,
        scale: 0.95
      }} transition={{
        duration: 0.5,
        ease: "easeInOut"
      }}>
            <ProDashboard initialRepoUrl={lastRepoUrl || (result?.repoName ? `https://github.com/${result.repoName}` : "")} />
          </motion.div> : <motion.div key="basic-mode" initial={{
        opacity: 0,
        scale: 0.95
      }} animate={{
        opacity: 1,
        scale: 1
      }} exit={{
        opacity: 0,
        scale: 0.95
      }} transition={{
        duration: 0.5,
        ease: "easeInOut"
      }}>
            <div className="relative z-10 container mx-auto px-4 py-12 md:py-20">
              <AnimatePresence mode="wait">
                {!result ? <motion.div key="input" initial={{
              opacity: 0
            }} animate={{
              opacity: 1
            }} exit={{
              opacity: 0,
              y: -20
            }} transition={{
              duration: 0.3
            }}>
                    <InputSection onSubmit={handleSubmit} isLoading={isLoading} loadingStep={loadingStep} isAuthenticated={isAuthenticated} authLoading={authLoading} />
                    
                    {error && <motion.div initial={{
                opacity: 0,
                y: 10
              }} animate={{
                opacity: 1,
                y: 0
              }} className="max-w-3xl mx-auto mt-6">
                        <div className="glass-card rounded-xl p-4 border-destructive/50">
                          <p className="text-destructive text-center">{error}</p>
                        </div>
                      </motion.div>}

                    {!isLoading && isAuthenticated && <RecentScans onSelectRepo={handleSelectRepo} />}
                  </motion.div> : <motion.div key="result" initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} exit={{
              opacity: 0
            }} transition={{
              duration: 0.4
            }}>
                    <ResultCard repoName={result.repoName} summary={result.summary} filesAnalyzed={result.filesAnalyzed} totalFiles={result.totalFiles} timestamp={result.timestamp} onReset={handleReset} />
                  </motion.div>}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <footer className="relative z-10 border-t border-border/50 mt-auto">
              <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="text-foreground font-semibold">Simplify</span>
                    <span className="text-primary font-semibold">repo</span>
                  </div>
                  <p>Built in India with pride. Yuvraj Joshi</p>
                </div>
              </div>
            </footer>
          </motion.div>}
      </AnimatePresence>

      {/* AI Chatbot */}
      <ChatBot repoContext={result ? {
      repoName: result.repoName,
      summary: result.summary
    } : undefined} />
    </div>;
};
export default Index;