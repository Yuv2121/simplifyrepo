import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Github, Sparkles, Loader2, LogIn, Microscope } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InputSectionProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
  loadingStep: string;
  isAuthenticated: boolean;
  authLoading: boolean;
}

export const InputSection = ({
  onSubmit,
  isLoading,
  loadingStep,
  isAuthenticated,
  authLoading
}: InputSectionProps) => {
  const [url, setUrl] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }
    if (url.trim() && !isLoading) {
      onSubmit(url.trim());
    }
  };

  const handleForensicLab = () => {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }
    const repoParam = url.trim() ? `?repo=${encodeURIComponent(url.trim())}` : "";
    navigate(`/forensic${repoParam}`);
  };
  const loadingSteps = ["Fetching repo tree...", "Reading config files...", "Analyzing structure...", "Summoning AI...", "Generating summary..."];
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.6,
    ease: "easeOut"
  }} className="w-full max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div initial={{
        scale: 0.9,
        opacity: 0
      }} animate={{
        scale: 1,
        opacity: 1
      }} transition={{
        delay: 0.2,
        duration: 0.5
      }} className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full glass-card">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm text-muted-foreground">AI-Powered Repository Analysis</span>
        </motion.div>

        <motion.h1 initial={{
        opacity: 0,
        y: 10
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.3,
        duration: 0.5
      }} className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
          <span className="text-foreground">Simplify</span>
          <span className="text-primary">repo</span>
        </motion.h1>

        <motion.p initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        delay: 0.4,
        duration: 0.5
      }} className="text-lg text-muted-foreground max-w-xl mx-auto">
          Paste any GitHub repo URL and get an instant, AI-powered summary. 
          Perfect for understanding new projects quickly.
        </motion.p>
      </div>

      {/* Input Form */}
      <motion.form onSubmit={handleSubmit} initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      delay: 0.5,
      duration: 0.5
    }} className="relative">
        <div className="glass-card rounded-2xl p-2 glow-primary">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input type="text" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://github.com/owner/repository" disabled={isLoading} className="w-full h-14 pl-12 pr-4 bg-background/50 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50" />
            </div>
            <Button 
              type="submit" 
              disabled={(!url.trim() || isLoading) && isAuthenticated} 
              className="h-14 px-8 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl transition-all glow-primary disabled:opacity-50 disabled:glow-primary/0"
            >
              {authLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : !isAuthenticated ? (
                <span className="flex items-center gap-2">
                  <LogIn className="w-5 h-5" />
                  Sign in to Analyze
                </span>
              ) : isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Simplify
                </span>
              )}
            </Button>
            
            {/* Forensic Lab Button */}
            <Button 
              type="button"
              onClick={handleForensicLab}
              disabled={isLoading}
              variant="outline"
              className="h-14 px-6 text-base font-semibold rounded-xl border-2 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400 transition-all disabled:opacity-50"
            >
              <Microscope className="w-5 h-5 mr-2" />
              🔍 Forensic Lab
            </Button>
          </div>
        </div>
      </motion.form>

      {/* Loading State */}
      {isLoading && <motion.div initial={{
      opacity: 0,
      height: 0
    }} animate={{
      opacity: 1,
      height: "auto"
    }} exit={{
      opacity: 0,
      height: 0
    }} className="mt-6">
          <div className="glass-card rounded-xl p-6">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-2 border-primary/30 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
                <div className="absolute inset-0 rounded-full pulse-glow" />
              </div>
              <div className="text-center">
                <p className="text-lg font-medium text-foreground mb-2">{loadingStep}</p>
                <div className="flex justify-center gap-2">
                  {loadingSteps.map((step, i) => <motion.div key={step} className={`w-2 h-2 rounded-full ${loadingSteps.indexOf(loadingStep) >= i ? "bg-primary" : "bg-muted"}`} initial={{
                scale: 0.8
              }} animate={{
                scale: loadingSteps.indexOf(loadingStep) === i ? [1, 1.3, 1] : 1
              }} transition={{
                repeat: Infinity,
                duration: 1
              }} />)}
                </div>
              </div>
            </div>
          </div>
        </motion.div>}

      {/* Example repos */}
      {!isLoading && <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      delay: 0.7,
      duration: 0.5
    }} className="mt-6 text-center">
          <p className="text-sm text-muted-foreground mb-3">Try these examples:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {["facebook/react", "vercel/next.js", "tailwindlabs/tailwindcss"].map(repo => <button key={repo} onClick={() => setUrl(`https://github.com/${repo}`)} className="px-3 py-1.5 text-sm rounded-lg bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">twbs/bootstrap{repo}
              </button>)}
          </div>
        </motion.div>}
    </motion.div>;
};