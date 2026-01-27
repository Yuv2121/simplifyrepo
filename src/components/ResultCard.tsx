import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Github, FileCode, Clock, ExternalLink, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ResultCardProps {
  repoName: string;
  summary: string;
  filesAnalyzed: number;
  totalFiles: number;
  timestamp: Date;
  onReset: () => void;
}

export const ResultCard = ({
  repoName,
  summary,
  filesAnalyzed,
  totalFiles,
  timestamp,
  onReset,
}: ResultCardProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const repoUrl = `https://github.com/${repoName}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="glass-card rounded-2xl p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Github className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{repoName}</h2>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                <span className="flex items-center gap-1">
                  <FileCode className="w-4 h-4" />
                  {filesAnalyzed} files analyzed
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {timestamp.toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="gap-2"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              asChild
            >
              <a href={repoUrl} target="_blank" rel="noopener noreferrer" className="gap-2">
                <ExternalLink className="w-4 h-4" />
                View Repo
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="glass-card rounded-2xl p-8"
      >
        <div className="markdown-content">
          <ReactMarkdown>{summary}</ReactMarkdown>
        </div>
      </motion.div>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span>{totalFiles} total files in repo</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent" />
            <span>Powered by AI</span>
          </div>
        </div>
        <Button
          onClick={onReset}
          variant="ghost"
          className="text-primary hover:text-primary/80"
        >
          Analyze another repo →
        </Button>
      </motion.div>
    </motion.div>
  );
};
