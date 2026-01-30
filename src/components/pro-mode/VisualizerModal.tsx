import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import mermaid from "mermaid";

interface VisualizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  mermaidCode: string;
  repoName: string;
}

export const VisualizerModal = ({
  isOpen,
  onClose,
  mermaidCode,
  repoName,
}: VisualizerModalProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "dark",
      themeVariables: {
        primaryColor: "#d4af37",
        primaryTextColor: "#ffffff",
        primaryBorderColor: "#d4af37",
        lineColor: "#d4af37",
        secondaryColor: "#1e293b",
        tertiaryColor: "#0f172a",
        background: "#0f172a",
        mainBkg: "#1e293b",
        nodeBorder: "#d4af37",
        clusterBkg: "#1e293b",
        clusterBorder: "#d4af37",
        titleColor: "#ffffff",
        edgeLabelBackground: "#1e293b",
      },
      flowchart: {
        htmlLabels: true,
        curve: "basis",
      },
    });
  }, []);

  useEffect(() => {
    const renderDiagram = async () => {
      if (isOpen && containerRef.current && mermaidCode) {
        try {
          setError(null);
          containerRef.current.innerHTML = "";
          
          // Clean up the mermaid code
          let cleanCode = mermaidCode
            .replace(/```mermaid\n?/g, "")
            .replace(/```\n?/g, "")
            .trim();
          
          const { svg } = await mermaid.render("mermaid-diagram", cleanCode);
          containerRef.current.innerHTML = svg;
        } catch (err) {
          console.error("Mermaid render error:", err);
          setError("Failed to render diagram. The AI response may not be valid Mermaid syntax.");
        }
      }
    };

    renderDiagram();
  }, [isOpen, mermaidCode]);

  const handleDownload = () => {
    if (containerRef.current) {
      const svg = containerRef.current.querySelector("svg");
      if (svg) {
        const svgData = new XMLSerializer().serializeToString(svg);
        const blob = new Blob([svgData], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${repoName.replace("/", "-")}-architecture.svg`;
        a.click();
        URL.revokeObjectURL(url);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className={`relative bg-slate-950 border border-primary/30 rounded-2xl overflow-hidden ${
              isFullscreen ? "w-full h-full" : "w-full max-w-5xl h-[80vh]"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900/80 border-b border-primary/20">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                <h3 className="text-lg font-semibold text-foreground">
                  Architecture Map: {repoName}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDownload}
                  className="text-muted-foreground hover:text-primary"
                >
                  <Download className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="text-muted-foreground hover:text-primary"
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-5 h-5" />
                  ) : (
                    <Maximize2 className="w-5 h-5" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Diagram Container */}
            <div className="h-[calc(100%-4rem)] overflow-auto p-8 flex items-center justify-center">
              {error ? (
                <div className="text-center">
                  <p className="text-destructive mb-4">{error}</p>
                  <div className="glass-card p-4 rounded-lg max-w-2xl overflow-auto">
                    <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap">
                      {mermaidCode}
                    </pre>
                  </div>
                </div>
              ) : (
                <div
                  ref={containerRef}
                  className="w-full h-full flex items-center justify-center [&_svg]:max-w-full [&_svg]:h-auto"
                />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
