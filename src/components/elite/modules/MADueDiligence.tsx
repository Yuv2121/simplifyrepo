import { motion } from "framer-motion";
import { Briefcase, CheckCircle, XCircle, AlertTriangle, FileText, Download, Shield, Zap, Database, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const scorecardData = [
  { category: "Code Quality", grade: "A", score: 92, icon: CheckCircle, color: "text-green-400", details: "Low complexity, consistent patterns" },
  { category: "Scalability", grade: "A-", score: 88, icon: Zap, color: "text-green-400", details: "Microservices ready, horizontal scaling" },
  { category: "Security Posture", grade: "B+", score: 85, icon: Shield, color: "text-blue-400", details: "Minor vulnerabilities in dependencies" },
  { category: "Documentation", grade: "B", score: 78, icon: FileText, color: "text-amber-400", details: "API docs complete, architecture gaps" },
  { category: "Test Coverage", grade: "B-", score: 72, icon: CheckCircle, color: "text-amber-400", details: "Unit 78%, Integration 45%" },
  { category: "Technical Debt", grade: "B", score: 76, icon: AlertTriangle, color: "text-amber-400", details: "Moderate, well-documented" },
  { category: "Data Architecture", grade: "A", score: 94, icon: Database, color: "text-green-400", details: "Normalized, GDPR compliant" },
  { category: "Team Knowledge Distribution", grade: "C+", score: 68, icon: Users, color: "text-red-400", details: "Bus factor risk detected" },
];

const riskFindings = [
  { severity: "Critical", finding: "Single point of failure in payment processing module", mitigation: "Implement redundancy layer", cost: "$45,000" },
  { severity: "High", finding: "GPL-licensed dependency in commercial product", mitigation: "Replace with MIT alternative", cost: "$12,000" },
  { severity: "Medium", finding: "No disaster recovery documentation", mitigation: "Create DR runbook", cost: "$8,000" },
  { severity: "Low", finding: "Inconsistent logging format across services", mitigation: "Standardize with structured logging", cost: "$5,000" },
];

const valuationImpact = [
  { factor: "Technical Excellence", impact: "+$2.4M", direction: "up" },
  { factor: "Scalability Readiness", impact: "+$1.8M", direction: "up" },
  { factor: "Security Posture", impact: "+$1.2M", direction: "up" },
  { factor: "Technical Debt", impact: "-$850K", direction: "down" },
  { factor: "Knowledge Risk", impact: "-$320K", direction: "down" },
];

export const MADueDiligence = () => {
  const overallScore = 84;
  const overallGrade = "A-";

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
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            M&A Technical Due Diligence
          </h1>
          <p className="text-slate-400 mt-1">Comprehensive acquisition readiness assessment</p>
        </div>
        <Button className="h-12 px-6 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-semibold">
          <Download className="w-4 h-4 mr-2" />
          Generate 100-Page PE Audit Report
        </Button>
      </motion.div>

      {/* Overall Score Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gradient-to-r from-emerald-900/30 to-green-900/20 border-emerald-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                    <span className="text-4xl font-bold text-white">{overallGrade}</span>
                  </div>
                  <p className="text-slate-400 mt-2 text-sm">Overall Grade</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white">Acquisition Readiness: {overallScore}%</h3>
                  <p className="text-slate-400">This codebase meets enterprise M&A standards with minor remediation required</p>
                  <div className="flex gap-3 mt-3">
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">SOC2 Ready</Badge>
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">GDPR Compliant</Badge>
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">ISO 27001 Aligned</Badge>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500">Estimated Valuation Impact</p>
                <p className="text-3xl font-bold text-green-400">+$4.23M</p>
                <p className="text-sm text-slate-400">Net positive technical value</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Scorecard Grid */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="grid grid-cols-4 gap-4"
      >
        {scorecardData.map((item, index) => (
          <motion.div
            key={item.category}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + index * 0.05 }}
          >
            <Card className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                  <div className={`text-2xl font-bold ${item.color}`}>{item.grade}</div>
                </div>
                <p className="text-sm font-medium text-white mb-1">{item.category}</p>
                <Progress value={item.score} className="h-1.5 mb-2" />
                <p className="text-xs text-slate-500">{item.details}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-2 gap-6">
        {/* Risk Findings */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                Key Risk Findings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {riskFindings.map((risk, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + index * 0.05 }}
                  className="p-3 rounded-lg bg-slate-800/50 border border-slate-700"
                >
                  <div className="flex items-start justify-between mb-2">
                    <Badge className={
                      risk.severity === "Critical" ? "bg-red-500/20 text-red-400" :
                      risk.severity === "High" ? "bg-orange-500/20 text-orange-400" :
                      risk.severity === "Medium" ? "bg-amber-500/20 text-amber-400" :
                      "bg-green-500/20 text-green-400"
                    }>
                      {risk.severity}
                    </Badge>
                    <span className="text-sm text-red-400 font-mono">{risk.cost}</span>
                  </div>
                  <p className="text-sm text-white mb-1">{risk.finding}</p>
                  <p className="text-xs text-slate-500">Mitigation: {risk.mitigation}</p>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Valuation Impact */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-emerald-400" />
                Valuation Impact Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {valuationImpact.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + index * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50"
                >
                  <span className="text-slate-300">{item.factor}</span>
                  <span className={`font-bold font-mono ${item.direction === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                    {item.impact}
                  </span>
                </motion.div>
              ))}
              <div className="border-t border-slate-700 pt-3 mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-white">Net Technical Value</span>
                  <span className="text-2xl font-bold text-green-400">+$4.23M</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
