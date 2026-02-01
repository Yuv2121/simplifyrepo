import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, FileCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface WikiGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  markdown: string;
  repoName: string;
}

export const WikiGenerator = ({
  isOpen,
  onClose,
  markdown,
  repoName,
}: WikiGeneratorProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      toast.success("README copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "README.md";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("README.md downloaded!");
  };

  const handleClose = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="relative w-full max-w-4xl h-[80vh] bg-slate-950 border border-primary/30 rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900/80 border-b border-primary/20">
              <div className="flex items-center gap-3">
                <FileCode className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">
                  README.md — {repoName}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleCopy}
                  variant="outline"
                  size="sm"
                  className="border-primary/30 hover:bg-primary/10"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2 text-green-500" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleDownload}
                  variant="outline"
                  size="sm"
                  className="border-primary/30 hover:bg-primary/10"
                >
                  Download
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClose}
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Editor Body */}
            <div className="h-[calc(100%-4rem)] overflow-hidden">
              {/* Line Numbers + Code */}
              <div className="flex h-full">
                {/* Line Numbers */}
                <div className="w-12 bg-slate-900/50 border-r border-primary/10 py-4 px-2 text-right font-mono text-xs text-muted-foreground/50 select-none overflow-hidden">
                  {markdown.split("\n").map((_, i) => (
                    <div key={i} className="leading-6">
                      {i + 1}
                    </div>
                  ))}
                </div>

                {/* Code Content */}
                <div className="flex-1 overflow-auto p-4 bg-slate-950">
                  <pre className="font-mono text-sm text-green-400/90 whitespace-pre-wrap leading-6">
                    {markdown}
                  </pre>
                </div>
              </div>
            </div>

            {/* Floating Copy Button */}
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              onClick={handleCopy}
              className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 flex items-center justify-center hover:scale-110 transition-transform"
            >
              {copied ? (
                <Check className="w-6 h-6" />
              ) : (
                <Copy className="w-6 h-6" />
              )}
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
