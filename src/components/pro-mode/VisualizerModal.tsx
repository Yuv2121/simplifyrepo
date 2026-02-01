import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Maximize2, Minimize2, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import mermaid from "mermaid";
import { toast } from "sonner";

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
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    // Professional-grade mermaid configuration
    mermaid.initialize({
      startOnLoad: false,
      theme: "dark",
      themeVariables: {
        // Premium gold accent theme
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
        // Enhanced typography
        fontFamily: "Inter, system-ui, -apple-system, sans-serif",
        fontSize: "14px",
      },
      flowchart: {
        htmlLabels: true,
        curve: "basis",
        padding: 20,
        nodeSpacing: 50,
        rankSpacing: 60,
        useMaxWidth: false,
        diagramPadding: 20,
      },
      securityLevel: "loose",
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
          
          // Generate unique ID to prevent caching issues
          const uniqueId = `diagram-${Date.now()}`;
          const { svg } = await mermaid.render(uniqueId, cleanCode);
          
          // Enhance SVG for high-quality rendering
          const enhancedSvg = svg
            // Set proper viewBox and dimensions for crisp rendering
            .replace(/<svg /, '<svg style="min-width: 100%; height: auto; shape-rendering: geometricPrecision; text-rendering: optimizeLegibility;" ')
            // Improve font rendering
            .replace(/font-family:[^;]+;/g, 'font-family: Inter, system-ui, -apple-system, sans-serif;')
            // Ensure crisp edges
            .replace(/<rect /g, '<rect shape-rendering="crispEdges" ')
            // Improve line quality
            .replace(/<path /g, '<path stroke-linecap="round" stroke-linejoin="round" ')
            // Better text rendering
            .replace(/<text /g, '<text dominant-baseline="middle" ');
          
          containerRef.current.innerHTML = enhancedSvg;
          
          // Apply additional styling to SVG elements
          const svgElement = containerRef.current.querySelector("svg");
          if (svgElement) {
            svgElement.style.background = "transparent";
            svgElement.setAttribute("preserveAspectRatio", "xMidYMid meet");
            
            // Style all text elements for better readability
            const textElements = svgElement.querySelectorAll("text");
            textElements.forEach((text) => {
              text.style.fontWeight = "500";
              text.style.letterSpacing = "0.01em";
            });
            
            // Style nodes for premium look
            const nodes = svgElement.querySelectorAll(".node rect, .node polygon, .node circle");
            nodes.forEach((node) => {
              (node as SVGElement).style.filter = "drop-shadow(0 2px 4px rgba(212, 175, 55, 0.2))";
            });
          }
        } catch (err) {
          console.error("Mermaid render error:", err);
          setError("Failed to render diagram. The AI response may not be valid Mermaid syntax.");
        }
      }
    };

    renderDiagram();
  }, [isOpen, mermaidCode]);

  const handleDownloadSVG = () => {
    if (containerRef.current) {
      const svg = containerRef.current.querySelector("svg");
      if (svg) {
        // Clone and prepare SVG for download
        const svgClone = svg.cloneNode(true) as SVGElement;
        
        // Add white background for better visibility
        const bgRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        bgRect.setAttribute("width", "100%");
        bgRect.setAttribute("height", "100%");
        bgRect.setAttribute("fill", "#0f172a");
        svgClone.insertBefore(bgRect, svgClone.firstChild);
        
        const svgData = new XMLSerializer().serializeToString(svgClone);
        const blob = new Blob([svgData], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${repoName.replace("/", "-")}-architecture.svg`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success("High-quality SVG downloaded!");
      }
    }
  };

  const handleDownloadPNG = async () => {
    if (containerRef.current) {
      const svg = containerRef.current.querySelector("svg");
      if (svg) {
        try {
          // Create high-resolution canvas (2x for retina)
          const scale = 2;
          const bbox = svg.getBoundingClientRect();
          const canvas = document.createElement("canvas");
          canvas.width = bbox.width * scale;
          canvas.height = bbox.height * scale;
          
          const ctx = canvas.getContext("2d");
          if (!ctx) throw new Error("Canvas context not available");
          
          // Enable high-quality image rendering
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.scale(scale, scale);
          
          // Fill background
          ctx.fillStyle = "#0f172a";
          ctx.fillRect(0, 0, bbox.width, bbox.height);
          
          // Convert SVG to image
          const svgData = new XMLSerializer().serializeToString(svg);
          const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
          const url = URL.createObjectURL(svgBlob);
          
          const img = new Image();
          img.crossOrigin = "anonymous";
          
          await new Promise<void>((resolve, reject) => {
            img.onload = () => {
              ctx.drawImage(img, 0, 0, bbox.width, bbox.height);
              resolve();
            };
            img.onerror = reject;
            img.src = url;
          });
          
          URL.revokeObjectURL(url);
          
          // Download as high-quality PNG
          canvas.toBlob((blob) => {
            if (blob) {
              const pngUrl = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = pngUrl;
              a.download = `${repoName.replace("/", "-")}-architecture.png`;
              a.click();
              URL.revokeObjectURL(pngUrl);
              toast.success("High-resolution PNG downloaded!");
            }
          }, "image/png", 1.0);
        } catch (err) {
          console.error("PNG export error:", err);
          toast.error("Failed to export PNG. Try SVG instead.");
        }
      }
    }
  };

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 3));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.5));
  const handleResetZoom = () => setZoom(1);

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
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-primary/40 rounded-3xl overflow-hidden shadow-2xl shadow-primary/20 ${
              isFullscreen ? "w-full h-full" : "w-full max-w-6xl h-[85vh]"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Premium Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-900/90 to-slate-800/90 border-b border-primary/30 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                  <div className="absolute inset-0 w-3 h-3 rounded-full bg-primary/50 animate-ping" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    Architecture Map
                  </h3>
                  <p className="text-sm text-muted-foreground">{repoName}</p>
                </div>
              </div>
              
              {/* Toolbar */}
              <div className="flex items-center gap-2">
                {/* Zoom Controls */}
                <div className="flex items-center gap-1 mr-2 px-2 py-1 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleZoomOut}
                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <span className="text-xs text-muted-foreground min-w-[3rem] text-center">
                    {Math.round(zoom * 100)}%
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleZoomIn}
                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleResetZoom}
                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* Download Options */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDownloadSVG}
                  className="text-muted-foreground hover:text-primary"
                >
                  <Download className="w-4 h-4 mr-1" />
                  SVG
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDownloadPNG}
                  className="text-muted-foreground hover:text-primary"
                >
                  <Download className="w-4 h-4 mr-1" />
                  PNG
                </Button>
                
                <div className="w-px h-6 bg-slate-700" />
                
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
                  onClick={handleClose}
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Diagram Container with Zoom */}
            <div className="h-[calc(100%-4.5rem)] overflow-auto p-8 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
              {error ? (
                <div className="text-center py-12">
                  <p className="text-destructive mb-4 text-lg">{error}</p>
                  <div className="glass-card p-6 rounded-xl max-w-2xl mx-auto overflow-auto border border-destructive/30">
                    <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap text-left">
                      {mermaidCode}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center min-h-full">
                  <div
                    ref={containerRef}
                    className="transition-transform duration-200 ease-out origin-center [&_svg]:max-w-full [&_svg]:h-auto [&_text]:fill-foreground"
                    style={{ transform: `scale(${zoom})` }}
                  />
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
