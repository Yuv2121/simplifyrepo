import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  DollarSign,
  Briefcase,
  Calculator,
  Shield,
  AlertTriangle,
  Users,
  GraduationCap,
  Map,
  ScrollText,
  Zap,
  ChevronRight
} from "lucide-react";

export type EliteModule = 
  | "debt-quantifier"
  | "ma-diligence"
  | "cost-estimator"
  | "compliance"
  | "dependency-risk"
  | "knowledge-graph"
  | "onboarding"
  | "migration"
  | "adr"
  | "realtime";

interface EliteSidebarProps {
  activeModule: EliteModule;
  onModuleChange: (module: EliteModule) => void;
}

const pillars = [
  {
    name: "Financial & M&A",
    icon: DollarSign,
    color: "from-emerald-500 to-green-600",
    modules: [
      { id: "debt-quantifier" as EliteModule, name: "Technical Debt Quantifier", icon: DollarSign, badge: "$2.3M" },
      { id: "ma-diligence" as EliteModule, name: "M&A Due Diligence", icon: Briefcase, badge: "A+" },
      { id: "cost-estimator" as EliteModule, name: "Feature Cost Estimator", icon: Calculator },
    ]
  },
  {
    name: "Compliance & Risk",
    icon: Shield,
    color: "from-blue-500 to-cyan-600",
    modules: [
      { id: "compliance" as EliteModule, name: "Compliance Evidence", icon: Shield, badge: "SOC2" },
      { id: "dependency-risk" as EliteModule, name: "Dependency Risk Intel", icon: AlertTriangle, badge: "3 Critical" },
    ]
  },
  {
    name: "People & Operations",
    icon: Users,
    color: "from-purple-500 to-violet-600",
    modules: [
      { id: "knowledge-graph" as EliteModule, name: "Knowledge Graph", icon: Users, badge: "Bus Factor: 2" },
      { id: "onboarding" as EliteModule, name: "Onboarding Intelligence", icon: GraduationCap },
    ]
  },
  {
    name: "Architecture & Engineering",
    icon: Zap,
    color: "from-amber-500 to-orange-600",
    modules: [
      { id: "migration" as EliteModule, name: "Migration Path Generator", icon: Map },
      { id: "adr" as EliteModule, name: "Architecture Decisions", icon: ScrollText },
      { id: "realtime" as EliteModule, name: "Real-Time Intelligence", icon: Zap, badge: "LIVE" },
    ]
  }
];

export const EliteSidebar = ({ activeModule, onModuleChange }: EliteSidebarProps) => {
  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-72 border-r border-slate-800/50 bg-black/50 flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-800/50">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
          Enterprise Matrix
        </h2>
      </div>

      {/* Pillars */}
      <div className="flex-1 overflow-y-auto py-2">
        {pillars.map((pillar, pillarIndex) => (
          <div key={pillar.name} className="mb-4">
            {/* Pillar Header */}
            <div className="px-4 py-2 flex items-center gap-2">
              <div className={cn(
                "w-6 h-6 rounded-md flex items-center justify-center bg-gradient-to-br",
                pillar.color
              )}>
                <pillar.icon className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {pillar.name}
              </span>
            </div>

            {/* Modules */}
            <div className="mt-1 space-y-0.5">
              {pillar.modules.map((module, moduleIndex) => {
                const isActive = activeModule === module.id;
                return (
                  <motion.button
                    key={module.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: pillarIndex * 0.1 + moduleIndex * 0.05 }}
                    onClick={() => onModuleChange(module.id)}
                    className={cn(
                      "w-full px-4 py-2.5 flex items-center gap-3 transition-all group",
                      isActive 
                        ? "bg-gradient-to-r from-amber-500/20 to-transparent border-l-2 border-amber-400" 
                        : "hover:bg-slate-800/50 border-l-2 border-transparent hover:border-slate-700"
                    )}
                  >
                    <module.icon className={cn(
                      "w-4 h-4 transition-colors",
                      isActive ? "text-amber-400" : "text-slate-500 group-hover:text-slate-400"
                    )} />
                    <span className={cn(
                      "flex-1 text-sm text-left transition-colors",
                      isActive ? "text-white font-medium" : "text-slate-400 group-hover:text-slate-300"
                    )}>
                      {module.name}
                    </span>
                    {module.badge && (
                      <span className={cn(
                        "px-1.5 py-0.5 rounded text-[10px] font-bold",
                        module.badge === "LIVE" 
                          ? "bg-green-500/20 text-green-400 animate-pulse"
                          : module.badge.includes("Critical")
                            ? "bg-red-500/20 text-red-400"
                            : "bg-amber-500/20 text-amber-400"
                      )}>
                        {module.badge}
                      </span>
                    )}
                    <ChevronRight className={cn(
                      "w-4 h-4 transition-all",
                      isActive ? "text-amber-400 translate-x-0" : "text-slate-700 -translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"
                    )} />
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Stats */}
      <div className="p-4 border-t border-slate-800/50 bg-slate-900/30">
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center">
            <p className="text-lg font-bold text-white">$4.7M</p>
            <p className="text-[10px] text-slate-500 uppercase">Total Value at Risk</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-green-400">94%</p>
            <p className="text-[10px] text-slate-500 uppercase">M&A Ready</p>
          </div>
        </div>
      </div>
    </motion.aside>
  );
};
