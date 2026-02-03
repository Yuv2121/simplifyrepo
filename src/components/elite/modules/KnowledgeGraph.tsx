import { motion } from "framer-motion";
import { Users, AlertTriangle, Network, GitBranch, Clock, TrendingDown, User, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const teamMembers = [
  { 
    name: "Sarah Chen", 
    role: "Principal Engineer", 
    modules: ["payment-gateway", "auth-service", "core-api"],
    commits: 1247,
    coverage: 73,
    critical: true,
    busFactor: 3
  },
  { 
    name: "Marcus Johnson", 
    role: "Senior Developer", 
    modules: ["reporting-engine", "analytics"],
    commits: 892,
    coverage: 45,
    critical: true,
    busFactor: 2
  },
  { 
    name: "Emily Rodriguez", 
    role: "Backend Lead", 
    modules: ["notification-service", "queue-processor"],
    commits: 634,
    coverage: 28,
    critical: false,
    busFactor: 1
  },
  { 
    name: "James Kim", 
    role: "Full Stack Developer", 
    modules: ["frontend-dashboard", "admin-panel"],
    commits: 521,
    coverage: 22,
    critical: false,
    busFactor: 1
  },
  { 
    name: "Alex Thompson", 
    role: "DevOps Engineer", 
    modules: ["infrastructure", "ci-cd-pipeline"],
    commits: 312,
    coverage: 15,
    critical: true,
    busFactor: 1
  },
];

const criticalModules = [
  { name: "payment-gateway", owner: "Sarah Chen", contributors: 2, risk: "Critical", reason: "Single maintainer, handles $2.3M/month" },
  { name: "auth-service", owner: "Sarah Chen", contributors: 1, risk: "Critical", reason: "Zero knowledge overlap, mission-critical" },
  { name: "analytics", owner: "Marcus Johnson", contributors: 1, risk: "High", reason: "Complex algorithms, undocumented" },
  { name: "infrastructure", owner: "Alex Thompson", contributors: 1, risk: "Critical", reason: "Single point of failure for deployments" },
];

const knowledgeDistribution = [
  { area: "Payment Processing", shared: 23, siloed: 77 },
  { area: "Authentication", shared: 15, siloed: 85 },
  { area: "Frontend", shared: 68, siloed: 32 },
  { area: "Infrastructure", shared: 12, siloed: 88 },
  { area: "Database", shared: 45, siloed: 55 },
];

const recommendations = [
  { priority: "Critical", action: "Schedule knowledge transfer sessions for payment-gateway", impact: "Reduce $520K risk" },
  { priority: "Critical", action: "Document auth-service architecture and edge cases", impact: "Enable faster onboarding" },
  { priority: "High", action: "Cross-train 2 developers on infrastructure management", impact: "Eliminate single point of failure" },
  { priority: "Medium", action: "Create runbooks for critical system recovery", impact: "Reduce MTTR by 60%" },
];

export const KnowledgeGraph = () => {
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            Knowledge Graph & Bus Factor Analysis
          </h1>
          <p className="text-slate-400 mt-1">Team knowledge distribution and organizational risk assessment</p>
        </div>
      </motion.div>

      {/* Critical Alert */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-red-500/10 border-red-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-red-400">CRITICAL: Bus Factor Alert</h3>
                <p className="text-slate-300">If <strong className="text-white">Sarah Chen</strong> leaves, <strong className="text-red-400">73%</strong> of the Payment Logic will be orphaned. Estimated impact: <strong className="text-red-400">$1.2M</strong> in recovery costs.</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-red-400">2</p>
                <p className="text-xs text-slate-500">Overall Bus Factor</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Team Knowledge Map */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Network className="w-5 h-5 text-purple-400" />
              Team Knowledge Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  className={`p-4 rounded-lg border ${
                    member.critical 
                      ? "bg-amber-500/5 border-amber-500/30" 
                      : "bg-slate-800/30 border-slate-700/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">{member.name}</span>
                          {member.critical && (
                            <Badge className="bg-amber-500/20 text-amber-400">Key Person Risk</Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-500">{member.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-lg font-bold text-white">{member.commits}</p>
                        <p className="text-xs text-slate-500">Commits</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-purple-400">{member.coverage}%</p>
                        <p className="text-xs text-slate-500">Codebase</p>
                      </div>
                      <div className="text-center">
                        <p className={`text-lg font-bold ${member.busFactor <= 1 ? 'text-red-400' : member.busFactor === 2 ? 'text-amber-400' : 'text-green-400'}`}>
                          {member.busFactor}
                        </p>
                        <p className="text-xs text-slate-500">Bus Factor</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {member.modules.map((module, i) => (
                      <Badge key={i} variant="outline" className="text-slate-400 border-slate-600">
                        <GitBranch className="w-3 h-3 mr-1" />
                        {module}
                      </Badge>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-2 gap-6">
        {/* Critical Modules */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-slate-900/50 border-slate-800 h-full">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-400" />
                Single-Owner Critical Modules
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {criticalModules.map((module, index) => (
                <div key={index} className="p-3 rounded-lg bg-red-500/5 border border-red-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <code className="text-red-400">{module.name}</code>
                    <Badge className={
                      module.risk === "Critical" ? "bg-red-500/20 text-red-400" : "bg-orange-500/20 text-orange-400"
                    }>
                      {module.risk}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-400 mb-1">Owner: {module.owner}</p>
                  <p className="text-xs text-slate-500">{module.reason}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Knowledge Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-slate-900/50 border-slate-800 h-full">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-amber-400" />
                Knowledge Silo Risk
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {knowledgeDistribution.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-300">{item.area}</span>
                    <span className={`text-sm font-bold ${item.siloed > 70 ? 'text-red-400' : item.siloed > 50 ? 'text-amber-400' : 'text-green-400'}`}>
                      {item.siloed}% Siloed
                    </span>
                  </div>
                  <div className="flex h-2 rounded-full overflow-hidden bg-slate-800">
                    <div 
                      className="bg-green-500 transition-all" 
                      style={{ width: `${item.shared}%` }} 
                    />
                    <div 
                      className="bg-red-500 transition-all" 
                      style={{ width: `${item.siloed}%` }} 
                    />
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-4 pt-2 text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-green-500" />
                  <span>Shared Knowledge</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-red-500" />
                  <span>Siloed Knowledge</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-400" />
              Immediate Action Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {recommendations.map((rec, index) => (
                <div key={index} className={`p-4 rounded-lg border ${
                  rec.priority === "Critical" ? "bg-red-500/5 border-red-500/30" :
                  rec.priority === "High" ? "bg-orange-500/5 border-orange-500/30" :
                  "bg-slate-800/30 border-slate-700/50"
                }`}>
                  <Badge className={
                    rec.priority === "Critical" ? "bg-red-500/20 text-red-400" :
                    rec.priority === "High" ? "bg-orange-500/20 text-orange-400" :
                    "bg-amber-500/20 text-amber-400"
                  }>
                    {rec.priority}
                  </Badge>
                  <p className="text-sm text-white mt-2">{rec.action}</p>
                  <p className="text-xs text-green-400 mt-1">{rec.impact}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
