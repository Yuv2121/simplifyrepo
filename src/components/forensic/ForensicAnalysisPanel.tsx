import { motion } from "framer-motion";
import { 
  FileSearch, 
  Loader2, 
  Target, 
  Workflow, 
  Boxes, 
  ShieldAlert,
  Lightbulb,
  Package,
  Gauge,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface ForensicAnalysis {
  purpose: string;
  logicFlow: string;
  keyComponents: Array<{
    name: string;
    type: string;
    description: string;
    lineRange?: string;
  }>;
  vulnerabilities: Array<{
    severity: "low" | "medium" | "high" | "critical";
    issue: string;
    suggestion: string;
  }>;
  imports: string[];
  complexity: "simple" | "moderate" | "complex" | "unknown";
  suggestions: string[];
}

interface FileAnalysisResult {
  fileName: string;
  filePath: string;
  fileSize: number;
  fileContent: string;
  analysis: ForensicAnalysis;
}

interface ForensicAnalysisPanelProps {
  result: FileAnalysisResult | null;
  isAnalyzing: boolean;
  selectedFile: string | null;
}

function getSeverityColor(severity: string) {
  switch (severity) {
    case "critical": return "bg-red-500/20 text-red-400 border-red-500/50";
    case "high": return "bg-orange-500/20 text-orange-400 border-orange-500/50";
    case "medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
    case "low": return "bg-blue-500/20 text-blue-400 border-blue-500/50";
    default: return "bg-slate-500/20 text-slate-400 border-slate-500/50";
  }
}

function getComplexityColor(complexity: string) {
  switch (complexity) {
    case "simple": return "text-green-400";
    case "moderate": return "text-yellow-400";
    case "complex": return "text-orange-400";
    default: return "text-slate-400";
  }
}

function getComponentTypeColor(type: string) {
  switch (type.toLowerCase()) {
    case "function": return "bg-blue-500/20 text-blue-400";
    case "component": return "bg-purple-500/20 text-purple-400";
    case "hook": return "bg-cyan-500/20 text-cyan-400";
    case "class": return "bg-orange-500/20 text-orange-400";
    case "interface": return "bg-green-500/20 text-green-400";
    case "constant": return "bg-slate-500/20 text-slate-400";
    default: return "bg-slate-500/20 text-slate-400";
  }
}

interface CollapsibleSectionProps {
  title: string;
  icon: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
  badge?: string | number;
  badgeVariant?: "default" | "warning" | "danger";
}

const CollapsibleSection = ({ 
  title, 
  icon, 
  defaultOpen = true, 
  children, 
  badge,
  badgeVariant = "default" 
}: CollapsibleSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="border border-slate-700/50 rounded-lg bg-slate-900/30 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 p-4 hover:bg-slate-800/30 transition-colors"
      >
        {isOpen ? (
          <ChevronDown className="w-4 h-4 text-cyan-400" />
        ) : (
          <ChevronRight className="w-4 h-4 text-slate-500" />
        )}
        <span className="text-cyan-400">{icon}</span>
        <span className="font-medium text-slate-200 flex-1 text-left">{title}</span>
        {badge !== undefined && (
          <Badge 
            variant="outline" 
            className={cn(
              "text-xs",
              badgeVariant === "warning" && "border-yellow-500/50 text-yellow-400",
              badgeVariant === "danger" && "border-red-500/50 text-red-400"
            )}
          >
            {badge}
          </Badge>
        )}
      </button>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="px-4 pb-4"
        >
          {children}
        </motion.div>
      )}
    </div>
  );
};

export const ForensicAnalysisPanel = ({ result, isAnalyzing, selectedFile }: ForensicAnalysisPanelProps) => {
  // Empty state
  if (!selectedFile && !isAnalyzing && !result) {
    return (
      <div className="h-full flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 max-w-md"
        >
          <div className="relative mx-auto w-20 h-20">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 animate-pulse" />
            <div className="absolute inset-2 rounded-full bg-slate-900 flex items-center justify-center">
              <FileSearch className="w-8 h-8 text-cyan-500/50" />
            </div>
          </div>
          <h3 className="text-lg font-medium text-slate-300">The Autopsy Table</h3>
          <p className="text-sm text-slate-500">
            Select a file from the Evidence Locker to begin forensic analysis.
          </p>
        </motion.div>
      </div>
    );
  }

  // Loading state
  if (isAnalyzing) {
    return (
      <div className="h-full flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center space-y-6"
        >
          <div className="relative mx-auto w-24 h-24">
            <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400 animate-spin" />
            <div className="absolute inset-4 rounded-full bg-slate-900/80 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-300">Extracting file content...</p>
            <p className="text-xs text-slate-500">Running heuristic scan...</p>
          </div>
          <div className="flex justify-center gap-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-cyan-500"
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.15,
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  // Results
  if (!result) return null;

  const { analysis, fileName, fileSize } = result;

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        {/* File Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between border-b border-slate-700/50 pb-4"
        >
          <div>
            <h2 className="text-xl font-bold text-slate-100 font-mono">{fileName}</h2>
            <p className="text-sm text-slate-500">{result.filePath}</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="font-mono">
              {fileSize > 1024 ? `${(fileSize / 1024).toFixed(1)} KB` : `${fileSize} B`}
            </Badge>
            <Badge 
              variant="outline" 
              className={cn("font-mono capitalize", getComplexityColor(analysis.complexity))}
            >
              <Gauge className="w-3 h-3 mr-1" />
              {analysis.complexity}
            </Badge>
          </div>
        </motion.div>

        {/* Purpose Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <CollapsibleSection 
            title="The Purpose" 
            icon={<Target className="w-4 h-4" />}
          >
            <p className="text-slate-300 leading-relaxed">{analysis.purpose}</p>
          </CollapsibleSection>
        </motion.div>

        {/* Logic Flow Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <CollapsibleSection 
            title="Logic Flow" 
            icon={<Workflow className="w-4 h-4" />}
          >
            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{analysis.logicFlow}</p>
          </CollapsibleSection>
        </motion.div>

        {/* Key Components Section */}
        {analysis.keyComponents && analysis.keyComponents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <CollapsibleSection 
              title="Key Functions & Classes" 
              icon={<Boxes className="w-4 h-4" />}
              badge={analysis.keyComponents.length}
            >
              <div className="space-y-3">
                {analysis.keyComponents.map((comp, index) => (
                  <div 
                    key={index}
                    className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/30"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <code className="text-cyan-300 font-mono text-sm">{comp.name}</code>
                      <Badge className={cn("text-xs", getComponentTypeColor(comp.type))}>
                        {comp.type}
                      </Badge>
                      {comp.lineRange && (
                        <span className="text-xs text-slate-600 font-mono">L{comp.lineRange}</span>
                      )}
                    </div>
                    <p className="text-sm text-slate-400">{comp.description}</p>
                  </div>
                ))}
              </div>
            </CollapsibleSection>
          </motion.div>
        )}

        {/* Imports Section */}
        {analysis.imports && analysis.imports.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <CollapsibleSection 
              title="Dependencies & Imports" 
              icon={<Package className="w-4 h-4" />}
              badge={analysis.imports.length}
              defaultOpen={false}
            >
              <div className="flex flex-wrap gap-2">
                {analysis.imports.map((imp, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="font-mono text-xs bg-slate-800/50"
                  >
                    {imp}
                  </Badge>
                ))}
              </div>
            </CollapsibleSection>
          </motion.div>
        )}

        {/* Vulnerabilities Section */}
        {analysis.vulnerabilities && analysis.vulnerabilities.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <CollapsibleSection 
              title="Vulnerability Scan" 
              icon={<ShieldAlert className="w-4 h-4" />}
              badge={analysis.vulnerabilities.length}
              badgeVariant={analysis.vulnerabilities.some(v => v.severity === "critical" || v.severity === "high") ? "danger" : "warning"}
            >
              <div className="space-y-3">
                {analysis.vulnerabilities.map((vuln, index) => (
                  <div 
                    key={index}
                    className={cn(
                      "p-3 rounded-lg border",
                      getSeverityColor(vuln.severity)
                    )}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={cn("text-xs uppercase", getSeverityColor(vuln.severity))}>
                        {vuln.severity}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium mb-1">{vuln.issue}</p>
                    <p className="text-xs text-slate-400">💡 {vuln.suggestion}</p>
                  </div>
                ))}
              </div>
            </CollapsibleSection>
          </motion.div>
        )}

        {/* Suggestions Section */}
        {analysis.suggestions && analysis.suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <CollapsibleSection 
              title="Recommendations" 
              icon={<Lightbulb className="w-4 h-4" />}
              badge={analysis.suggestions.length}
              defaultOpen={false}
            >
              <ul className="space-y-2">
                {analysis.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="text-cyan-400 mt-0.5">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </CollapsibleSection>
          </motion.div>
        )}
      </div>
    </ScrollArea>
  );
};
