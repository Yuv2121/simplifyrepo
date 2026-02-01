import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Copy, Check, FileText, Network, BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import mermaid from "mermaid";
import { useEffect, useRef } from "react";

interface OverallReportProps {
  isOpen: boolean;
  onClose: () => void;
  report: {
    repoName: string;
    architecture: string;
    readme: string;
    summary: string;
  } | null;
}

export const OverallReport = ({ isOpen, onClose, report }: OverallReportProps) => {
  const [copied, setCopied] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState({
    architecture: true,
    readme: true,
    summary: true,
  });
  const diagramRef = useRef<HTMLDivElement>(null);

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
        fontFamily: "Inter, sans-serif",
        fontSize: "14px",
      },
      flowchart: {
        htmlLabels: true,
        curve: "basis",
        padding: 20,
        nodeSpacing: 50,
        rankSpacing: 50,
        useMaxWidth: false,
      },
    });
  }, []);

  useEffect(() => {
    const renderDiagram = async () => {
      if (isOpen && diagramRef.current && report?.architecture) {
        try {
          diagramRef.current.innerHTML = "";
          
          let cleanCode = report.architecture
            .replace(/```mermaid\n?/g, "")
            .replace(/```\n?/g, "")
            .trim();
          
          const { svg } = await mermaid.render("report-diagram", cleanCode);
          
          // Enhance SVG quality
          const enhancedSvg = svg
            .replace(/<svg /, '<svg style="min-width: 100%; height: auto;" ')
            .replace(/font-family:[^;]+;/g, 'font-family: Inter, system-ui, sans-serif;')
            .replace(/font-size:\s*\d+(\.\d+)?px/g, 'font-size: 14px');
          
          diagramRef.current.innerHTML = enhancedSvg;
        } catch (err) {
          console.error("Mermaid render error:", err);
          diagramRef.current.innerHTML = `<pre class="text-xs text-muted-foreground">${report.architecture}</pre>`;
        }
      }
    };

    renderDiagram();
  }, [isOpen, report?.architecture]);

  const handleCopy = async (content: string, type: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(type);
      toast.success(`${type} copied to clipboard!`);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleDownloadAll = () => {
    if (!report) return;
    
    const fullReport = `# ${report.repoName} - Complete Analysis Report

## Architecture Diagram (Mermaid)

\`\`\`mermaid
${report.architecture}
\`\`\`

---

## Generated README

${report.readme}

---

## Repository Summary

${report.summary}
`;
    
    const blob = new Blob([fullReport], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${report.repoName.replace("/", "-")}-complete-report.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Complete report downloaded!");
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  if (!report) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-6xl h-[90vh] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-primary/40 rounded-3xl overflow-hidden shadow-2xl shadow-primary/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Premium Header */}
            <div className="flex items-center justify-between px-8 py-5 bg-gradient-to-r from-slate-900/90 to-slate-800/90 border-b border-primary/30 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-4 h-4 rounded-full bg-primary animate-pulse" />
                  <div className="absolute inset-0 w-4 h-4 rounded-full bg-primary/50 animate-ping" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground tracking-tight">
                    Complete Analysis Report
                  </h3>
                  <p className="text-sm text-muted-foreground">{report.repoName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleDownloadAll}
                  variant="outline"
                  className="border-primary/40 hover:bg-primary/10 hover:border-primary"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Full Report
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="h-[calc(100%-5rem)] overflow-y-auto p-8 space-y-6 custom-scrollbar">
              {/* Architecture Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card rounded-2xl border border-primary/20 overflow-hidden"
              >
                <button
                  onClick={() => toggleSection("architecture")}
                  className="w-full flex items-center justify-between px-6 py-4 bg-slate-900/60 hover:bg-slate-800/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Network className="w-5 h-5 text-primary" />
                    <span className="font-semibold text-foreground">Architecture Diagram</span>
                    <span className="px-2 py-0.5 text-xs bg-primary/20 text-primary rounded-full">
                      Mermaid.js
                    </span>
                  </div>
                  {expandedSections.architecture ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>
                <AnimatePresence>
                  {expandedSections.architecture && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 bg-slate-950/50">
                        <div
                          ref={diagramRef}
                          className="w-full min-h-[300px] flex items-center justify-center overflow-x-auto [&_svg]:max-w-full [&_svg]:h-auto [&_text]:fill-foreground"
                        />
                        <div className="flex justify-end mt-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCopy(report.architecture, "Architecture")}
                            className="border-primary/30"
                          >
                            {copied === "Architecture" ? (
                              <Check className="w-4 h-4 mr-2 text-green-500" />
                            ) : (
                              <Copy className="w-4 h-4 mr-2" />
                            )}
                            Copy Mermaid Code
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* README Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card rounded-2xl border border-primary/20 overflow-hidden"
              >
                <button
                  onClick={() => toggleSection("readme")}
                  className="w-full flex items-center justify-between px-6 py-4 bg-slate-900/60 hover:bg-slate-800/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-primary" />
                    <span className="font-semibold text-foreground">Generated README.md</span>
                    <span className="px-2 py-0.5 text-xs bg-green-500/20 text-green-400 rounded-full">
                      Production Ready
                    </span>
                  </div>
                  {expandedSections.readme ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>
                <AnimatePresence>
                  {expandedSections.readme && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 bg-slate-950/50">
                        <div className="max-h-[400px] overflow-auto rounded-lg bg-slate-900/50 border border-slate-700/50">
                          <pre className="p-4 font-mono text-sm text-green-400/90 whitespace-pre-wrap leading-relaxed">
                            {report.readme}
                          </pre>
                        </div>
                        <div className="flex justify-end mt-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCopy(report.readme, "README")}
                            className="border-primary/30"
                          >
                            {copied === "README" ? (
                              <Check className="w-4 h-4 mr-2 text-green-500" />
                            ) : (
                              <Copy className="w-4 h-4 mr-2" />
                            )}
                            Copy README
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Summary Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card rounded-2xl border border-primary/20 overflow-hidden"
              >
                <button
                  onClick={() => toggleSection("summary")}
                  className="w-full flex items-center justify-between px-6 py-4 bg-slate-900/60 hover:bg-slate-800/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-primary" />
                    <span className="font-semibold text-foreground">Repository Summary</span>
                    <span className="px-2 py-0.5 text-xs bg-blue-500/20 text-blue-400 rounded-full">
                      Simplified
                    </span>
                  </div>
                  {expandedSections.summary ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>
                <AnimatePresence>
                  {expandedSections.summary && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 bg-slate-950/50">
                        <div className="prose prose-invert prose-sm max-w-none">
                          <div className="whitespace-pre-wrap text-foreground/90 leading-relaxed">
                            {report.summary}
                          </div>
                        </div>
                        <div className="flex justify-end mt-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCopy(report.summary, "Summary")}
                            className="border-primary/30"
                          >
                            {copied === "Summary" ? (
                              <Check className="w-4 h-4 mr-2 text-green-500" />
                            ) : (
                              <Copy className="w-4 h-4 mr-2" />
                            )}
                            Copy Summary
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
