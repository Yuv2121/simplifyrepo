import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, Clock, DollarSign, Gauge, Users, TrendingUp, Sparkles, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Estimation {
  hours: number;
  cost: string;
  complexity: "Low" | "Medium" | "High" | "Very High";
  breakdown: Array<{ task: string; hours: number; role: string }>;
  risks: string[];
  timeline: string;
  teamSize: number;
}

const mockEstimations: Record<string, Estimation> = {
  "default": {
    hours: 450,
    cost: "$65,000",
    complexity: "High",
    breakdown: [
      { task: "Architecture Design", hours: 40, role: "Senior Architect" },
      { task: "Backend Development", hours: 160, role: "Senior Developer" },
      { task: "Frontend Development", hours: 120, role: "Frontend Developer" },
      { task: "Database Schema", hours: 30, role: "DBA" },
      { task: "API Integration", hours: 50, role: "Integration Engineer" },
      { task: "Testing & QA", hours: 35, role: "QA Engineer" },
      { task: "Documentation", hours: 15, role: "Technical Writer" },
    ],
    risks: [
      "Third-party API rate limits may require caching layer",
      "Real-time sync adds 20% complexity overhead",
      "GDPR compliance requires additional data handling"
    ],
    timeline: "8-10 weeks",
    teamSize: 4
  }
};

const previousEstimates = [
  { feature: "Real-time Notifications System", hours: 280, cost: "$42,000", complexity: "Medium", date: "2024-01-15" },
  { feature: "Multi-tenant Architecture Upgrade", hours: 720, cost: "$108,000", complexity: "Very High", date: "2024-01-08" },
  { feature: "Advanced Analytics Dashboard", hours: 380, cost: "$57,000", complexity: "High", date: "2023-12-22" },
  { feature: "OAuth2/SAML SSO Integration", hours: 160, cost: "$24,000", complexity: "Medium", date: "2023-12-15" },
];

export const FeatureCostEstimator = () => {
  const [featureDescription, setFeatureDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [estimation, setEstimation] = useState<Estimation | null>(null);

  const handleEstimate = () => {
    if (!featureDescription.trim()) return;
    
    setIsAnalyzing(true);
    setTimeout(() => {
      setEstimation(mockEstimations.default);
      setIsAnalyzing(false);
    }, 2000);
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "Low": return "bg-green-500/20 text-green-400";
      case "Medium": return "bg-amber-500/20 text-amber-400";
      case "High": return "bg-orange-500/20 text-orange-400";
      case "Very High": return "bg-red-500/20 text-red-400";
      default: return "bg-slate-500/20 text-slate-400";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            Feature Cost Estimator
          </h1>
          <p className="text-slate-400 mt-1">AI-powered effort and cost estimation based on your codebase</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-6">
        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-slate-900/50 border-slate-800 h-full">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                Describe Your Feature
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={featureDescription}
                onChange={(e) => setFeatureDescription(e.target.value)}
                placeholder="Example: Build a real-time collaboration system that allows multiple users to edit documents simultaneously, with presence indicators, cursor tracking, and conflict resolution. Include version history and the ability to export to PDF."
                className="h-48 bg-slate-800/50 border-slate-700 text-slate-200 placeholder:text-slate-500 resize-none"
              />
              <Button
                onClick={handleEstimate}
                disabled={!featureDescription.trim() || isAnalyzing}
                className="w-full h-12 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-semibold"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing Codebase Context...
                  </>
                ) : (
                  <>
                    <Calculator className="w-4 h-4 mr-2" />
                    Generate Enterprise Estimate
                  </>
                )}
              </Button>

              {/* Previous Estimates */}
              <div className="mt-6">
                <h4 className="text-sm font-medium text-slate-400 mb-3">Recent Estimates</h4>
                <div className="space-y-2">
                  {previousEstimates.map((est, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.05 }}
                      className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:border-slate-600 cursor-pointer transition-colors"
                      onClick={() => setFeatureDescription(est.feature)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-300 truncate flex-1">{est.feature}</span>
                        <Badge className={getComplexityColor(est.complexity)}>{est.complexity}</Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                        <span>{est.hours} hours</span>
                        <span>{est.cost}</span>
                        <span>{est.date}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <AnimatePresence mode="wait">
            {!estimation ? (
              <Card className="bg-slate-900/50 border-slate-800 h-full flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
                    <Calculator className="w-8 h-8 text-slate-600" />
                  </div>
                  <p className="text-slate-500">Enter a feature description to receive an AI-powered cost estimate</p>
                </div>
              </Card>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-4"
              >
                {/* Summary Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-gradient-to-br from-emerald-900/30 to-green-900/20 border-emerald-500/30">
                    <CardContent className="p-4">
                      <DollarSign className="w-6 h-6 text-emerald-400 mb-2" />
                      <p className="text-3xl font-bold text-white">{estimation.cost}</p>
                      <p className="text-sm text-slate-400">Estimated Cost</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-blue-900/30 to-cyan-900/20 border-blue-500/30">
                    <CardContent className="p-4">
                      <Clock className="w-6 h-6 text-blue-400 mb-2" />
                      <p className="text-3xl font-bold text-white">{estimation.hours}h</p>
                      <p className="text-sm text-slate-400">Total Effort</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-amber-900/30 to-orange-900/20 border-amber-500/30">
                    <CardContent className="p-4">
                      <Gauge className="w-6 h-6 text-amber-400 mb-2" />
                      <p className="text-3xl font-bold text-white">{estimation.complexity}</p>
                      <p className="text-sm text-slate-400">Complexity</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-purple-900/30 to-violet-900/20 border-purple-500/30">
                    <CardContent className="p-4">
                      <Users className="w-6 h-6 text-purple-400 mb-2" />
                      <p className="text-3xl font-bold text-white">{estimation.teamSize} devs</p>
                      <p className="text-sm text-slate-400">{estimation.timeline}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Task Breakdown */}
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-slate-400">Task Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {estimation.breakdown.map((task, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded bg-slate-800/30">
                        <div>
                          <span className="text-sm text-white">{task.task}</span>
                          <span className="text-xs text-slate-500 ml-2">({task.role})</span>
                        </div>
                        <span className="text-sm text-amber-400 font-mono">{task.hours}h</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Risks */}
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-slate-400 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Risk Factors
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {estimation.risks.map((risk, index) => (
                        <li key={index} className="text-sm text-slate-300 flex items-start gap-2">
                          <span className="text-amber-400 mt-0.5">•</span>
                          {risk}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};
