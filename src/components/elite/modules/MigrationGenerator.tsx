import { motion } from "framer-motion";
import { Map, Clock, AlertTriangle, CheckCircle, ArrowRight, Calendar, Users, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const migrationPhases = [
  {
    phase: 1,
    name: "Assessment & Planning",
    duration: "2 weeks",
    status: "completed",
    tasks: ["Dependency audit", "Risk assessment", "Migration strategy", "Rollback planning"],
    effort: "80 hours",
    team: 2,
    risk: "Low"
  },
  {
    phase: 2,
    name: "Foundation Setup",
    duration: "3 weeks",
    status: "in-progress",
    progress: 65,
    tasks: ["New framework setup", "Build toolchain", "CI/CD updates", "Testing framework"],
    effort: "160 hours",
    team: 3,
    risk: "Medium"
  },
  {
    phase: 3,
    name: "Component Migration",
    duration: "8 weeks",
    status: "pending",
    tasks: ["Shared components", "Business logic", "State management", "API integration"],
    effort: "480 hours",
    team: 4,
    risk: "High"
  },
  {
    phase: 4,
    name: "Testing & Validation",
    duration: "3 weeks",
    status: "pending",
    tasks: ["E2E testing", "Performance testing", "Security audit", "User acceptance"],
    effort: "180 hours",
    team: 3,
    risk: "Medium"
  },
  {
    phase: 5,
    name: "Staged Rollout",
    duration: "2 weeks",
    status: "pending",
    tasks: ["Canary deployment", "Feature flags", "Monitoring", "Full rollout"],
    effort: "100 hours",
    team: 2,
    risk: "Medium"
  },
];

const migrationMetrics = {
  totalEffort: "1,000 hours",
  totalCost: "$185,000",
  timeline: "18 weeks",
  teamSize: "4-6 engineers",
  riskLevel: "Medium-High",
  breakEven: "14 months"
};

const riskMatrix = [
  { risk: "Data loss during migration", probability: "Low", impact: "Critical", mitigation: "Incremental migration with backup at each phase" },
  { risk: "Extended downtime", probability: "Medium", impact: "High", mitigation: "Blue-green deployment strategy" },
  { risk: "Feature parity gaps", probability: "High", impact: "Medium", mitigation: "Feature freeze + detailed mapping" },
  { risk: "Team velocity drop", probability: "High", impact: "Medium", mitigation: "Parallel development + training" },
];

const techStack = {
  from: { framework: "Angular 8", state: "NgRx", styling: "SCSS", testing: "Jasmine" },
  to: { framework: "React 18", state: "Redux Toolkit", styling: "Tailwind CSS", testing: "Vitest" }
};

export const MigrationGenerator = () => {
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Map className="w-5 h-5 text-white" />
            </div>
            Migration Path Generator
          </h1>
          <p className="text-slate-400 mt-1">AI-powered migration planning with effort estimation and risk mapping</p>
        </div>
        <Button className="bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 text-black font-semibold">
          Export Migration Plan
        </Button>
      </motion.div>

      {/* Tech Stack Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gradient-to-r from-slate-900 via-amber-900/10 to-slate-900 border-amber-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <p className="text-xs text-slate-500 uppercase tracking-wider">Current Stack</p>
                <div className="flex gap-3">
                  {Object.entries(techStack.from).map(([key, value]) => (
                    <Badge key={key} variant="outline" className="text-red-400 border-red-500/30">
                      {value}
                    </Badge>
                  ))}
                </div>
              </div>
              <ArrowRight className="w-8 h-8 text-amber-400 mx-8" />
              <div className="space-y-3">
                <p className="text-xs text-slate-500 uppercase tracking-wider">Target Stack</p>
                <div className="flex gap-3">
                  {Object.entries(techStack.to).map(([key, value]) => (
                    <Badge key={key} variant="outline" className="text-green-400 border-green-500/30">
                      {value}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="border-l border-slate-700 pl-8 ml-8">
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">{migrationMetrics.timeline}</p>
                    <p className="text-xs text-slate-500">Duration</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-amber-400">{migrationMetrics.totalCost}</p>
                    <p className="text-xs text-slate-500">Total Cost</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-400">{migrationMetrics.breakEven}</p>
                    <p className="text-xs text-slate-500">Break-Even</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Gantt Chart Style Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-400" />
              Phase-by-Phase Migration Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {migrationPhases.map((phase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className={`p-4 rounded-lg border ${
                  phase.status === "completed" ? "bg-green-500/10 border-green-500/30" :
                  phase.status === "in-progress" ? "bg-amber-500/10 border-amber-500/30" :
                  "bg-slate-800/30 border-slate-700/50"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      phase.status === "completed" ? "bg-green-500/20" :
                      phase.status === "in-progress" ? "bg-amber-500/20" :
                      "bg-slate-700/50"
                    }`}>
                      {phase.status === "completed" ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : phase.status === "in-progress" ? (
                        <div className="w-5 h-5 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
                      ) : (
                        <span className="text-sm font-bold text-slate-500">{phase.phase}</span>
                      )}
                    </div>
                    <div>
                      <h4 className="text-white font-medium">Phase {phase.phase}: {phase.name}</h4>
                      <p className="text-sm text-slate-500">{phase.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-400">{phase.effort}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-400">{phase.team} engineers</span>
                    </div>
                    <Badge className={
                      phase.risk === "Low" ? "bg-green-500/20 text-green-400" :
                      phase.risk === "Medium" ? "bg-amber-500/20 text-amber-400" :
                      "bg-red-500/20 text-red-400"
                    }>
                      {phase.risk} Risk
                    </Badge>
                  </div>
                </div>
                
                {phase.status === "in-progress" && phase.progress && (
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500">Progress</span>
                      <span className="text-amber-400">{phase.progress}%</span>
                    </div>
                    <Progress value={phase.progress} className="h-2" />
                  </div>
                )}
                
                <div className="flex flex-wrap gap-2">
                  {phase.tasks.map((task, i) => (
                    <Badge key={i} variant="outline" className="text-slate-400 border-slate-600">
                      {task}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Risk Matrix */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              Risk Assessment Matrix
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-xs text-slate-500 uppercase">Risk</th>
                    <th className="text-left py-3 px-4 text-xs text-slate-500 uppercase">Probability</th>
                    <th className="text-left py-3 px-4 text-xs text-slate-500 uppercase">Impact</th>
                    <th className="text-left py-3 px-4 text-xs text-slate-500 uppercase">Mitigation Strategy</th>
                  </tr>
                </thead>
                <tbody>
                  {riskMatrix.map((row, index) => (
                    <tr key={index} className="border-b border-slate-800 hover:bg-slate-800/30">
                      <td className="py-3 px-4 text-sm text-slate-300">{row.risk}</td>
                      <td className="py-3 px-4">
                        <Badge className={
                          row.probability === "Low" ? "bg-green-500/20 text-green-400" :
                          row.probability === "Medium" ? "bg-amber-500/20 text-amber-400" :
                          "bg-red-500/20 text-red-400"
                        }>
                          {row.probability}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={
                          row.impact === "Low" ? "bg-green-500/20 text-green-400" :
                          row.impact === "Medium" ? "bg-amber-500/20 text-amber-400" :
                          row.impact === "High" ? "bg-orange-500/20 text-orange-400" :
                          "bg-red-500/20 text-red-400"
                        }>
                          {row.impact}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-400">{row.mitigation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
