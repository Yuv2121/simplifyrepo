import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  EliteTopNav,
  EliteSidebar,
  EliteModule,
  TechnicalDebtQuantifier,
  MADueDiligence,
  FeatureCostEstimator,
  ComplianceGenerator,
  DependencyRisk,
  KnowledgeGraph,
  OnboardingSuite,
  MigrationGenerator,
  ADRTimeline,
  RealtimeIntelligence,
} from "@/components/elite";

const moduleComponents: Record<EliteModule, React.ComponentType> = {
  "debt-quantifier": TechnicalDebtQuantifier,
  "ma-diligence": MADueDiligence,
  "cost-estimator": FeatureCostEstimator,
  "compliance": ComplianceGenerator,
  "dependency-risk": DependencyRisk,
  "knowledge-graph": KnowledgeGraph,
  "onboarding": OnboardingSuite,
  "migration": MigrationGenerator,
  "adr": ADRTimeline,
  "realtime": RealtimeIntelligence,
};

const EliteDashboard = () => {
  const [selectedRepo, setSelectedRepo] = useState("fintech-core-platform");
  const [activeModule, setActiveModule] = useState<EliteModule>("debt-quantifier");

  const ActiveComponent = moduleComponents[activeModule];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Subtle background pattern */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(245, 158, 11, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)
            `,
          }}
        />
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Top Navigation */}
      <EliteTopNav 
        selectedRepo={selectedRepo}
        onRepoChange={setSelectedRepo}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Left Sidebar */}
        <EliteSidebar 
          activeModule={activeModule}
          onModuleChange={setActiveModule}
        />

        {/* Main Arena */}
        <main className="flex-1 overflow-y-auto bg-[#0a0a0a]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ActiveComponent />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default EliteDashboard;
