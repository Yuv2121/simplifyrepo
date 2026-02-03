import { motion } from "framer-motion";
import { AlertTriangle, Shield, Package, AlertCircle, CheckCircle, XCircle, ExternalLink, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const riskSummary = {
  critical: 3,
  high: 7,
  medium: 12,
  low: 28,
  total: 342,
  healthy: 292
};

const criticalDependencies = [
  {
    name: "log4j-core",
    version: "2.14.1",
    severity: "Critical",
    issue: "Remote Code Execution (CVE-2021-44228)",
    affectedModules: ["auth-service", "payment-gateway", "notification-engine"],
    recommendation: "Upgrade to 2.17.1+",
    exploitability: "Active in wild",
  },
  {
    name: "moment.js",
    version: "2.29.1",
    severity: "High",
    issue: "Abandoned library (last update: 3 years)",
    affectedModules: ["reporting-dashboard", "analytics"],
    recommendation: "Replace with date-fns or Luxon",
    exploitability: "No known exploits",
  },
  {
    name: "lodash",
    version: "4.17.19",
    severity: "High",
    issue: "Prototype Pollution (CVE-2020-8203)",
    affectedModules: ["core-utils", "data-transform"],
    recommendation: "Upgrade to 4.17.21+",
    exploitability: "PoC available",
  },
];

const licenseRisks = [
  { package: "react-pdf-viewer", license: "GPL-3.0", risk: "Copyleft violation in commercial product", impact: "Legal" },
  { package: "leaflet-draw", license: "GPL-2.0", risk: "Source disclosure required", impact: "Legal" },
  { package: "chart.js", license: "MIT", risk: "None", impact: "Safe" },
  { package: "axios", license: "MIT", risk: "None", impact: "Safe" },
];

const supplyChainMetrics = [
  { metric: "Direct Dependencies", value: 87, trend: "+3" },
  { metric: "Transitive Dependencies", value: 342, trend: "+12" },
  { metric: "Outdated Packages", value: 23, trend: "-5" },
  { metric: "Deprecated Packages", value: 4, trend: "0" },
  { metric: "Avg Package Age", value: "2.3 years", trend: "" },
  { metric: "Known Vulnerabilities", value: 22, trend: "+2" },
];

const abandonedPackages = [
  { name: "request", lastUpdate: "2020-02-11", downloads: "22M/week", alternative: "axios, node-fetch" },
  { name: "moment", lastUpdate: "2022-01-01", downloads: "18M/week", alternative: "date-fns, dayjs" },
  { name: "node-sass", lastUpdate: "2021-03-15", downloads: "4M/week", alternative: "dart-sass" },
];

export const DependencyRisk = () => {
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            Dependency Risk Intelligence
          </h1>
          <p className="text-slate-400 mt-1">Software supply chain security analysis</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
            Run Full Scan
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold">
            Generate SBOM
          </Button>
        </div>
      </motion.div>

      {/* Risk Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-6 gap-4"
      >
        <Card className="bg-red-500/10 border-red-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-4xl font-bold text-red-400">{riskSummary.critical}</p>
            <p className="text-xs text-red-400 uppercase mt-1">Critical</p>
          </CardContent>
        </Card>
        <Card className="bg-orange-500/10 border-orange-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-4xl font-bold text-orange-400">{riskSummary.high}</p>
            <p className="text-xs text-orange-400 uppercase mt-1">High</p>
          </CardContent>
        </Card>
        <Card className="bg-amber-500/10 border-amber-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-4xl font-bold text-amber-400">{riskSummary.medium}</p>
            <p className="text-xs text-amber-400 uppercase mt-1">Medium</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-500/10 border-blue-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-4xl font-bold text-blue-400">{riskSummary.low}</p>
            <p className="text-xs text-blue-400 uppercase mt-1">Low</p>
          </CardContent>
        </Card>
        <Card className="bg-green-500/10 border-green-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-4xl font-bold text-green-400">{riskSummary.healthy}</p>
            <p className="text-xs text-green-400 uppercase mt-1">Healthy</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4 text-center">
            <p className="text-4xl font-bold text-slate-300">{riskSummary.total}</p>
            <p className="text-xs text-slate-400 uppercase mt-1">Total Deps</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Critical Dependencies */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              Critical & High Risk Dependencies
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {criticalDependencies.map((dep, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className={`p-4 rounded-lg border ${
                  dep.severity === "Critical" 
                    ? "bg-red-500/5 border-red-500/30" 
                    : "bg-orange-500/5 border-orange-500/30"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Package className={dep.severity === "Critical" ? "w-5 h-5 text-red-400" : "w-5 h-5 text-orange-400"} />
                    <div>
                      <div className="flex items-center gap-2">
                        <code className="text-white font-mono">{dep.name}</code>
                        <Badge variant="outline" className="text-slate-400 border-slate-600">v{dep.version}</Badge>
                        <Badge className={dep.severity === "Critical" ? "bg-red-500/20 text-red-400" : "bg-orange-500/20 text-orange-400"}>
                          {dep.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-400 mt-1">{dep.issue}</p>
                    </div>
                  </div>
                  <Badge className={
                    dep.exploitability.includes("Active") 
                      ? "bg-red-500/20 text-red-400" 
                      : "bg-amber-500/20 text-amber-400"
                  }>
                    {dep.exploitability}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div>
                    <span className="text-slate-500">Affected: </span>
                    <span className="text-slate-300">{dep.affectedModules.join(", ")}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Fix: </span>
                    <span className="text-green-400">{dep.recommendation}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-2 gap-6">
        {/* License Risks */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card className="bg-slate-900/50 border-slate-800 h-full">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-400" />
                License Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {licenseRisks.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
                  <div>
                    <code className="text-amber-400 text-sm">{item.package}</code>
                    <p className="text-xs text-slate-500">{item.license}</p>
                  </div>
                  <div className="text-right">
                    <Badge className={
                      item.impact === "Legal" 
                        ? "bg-red-500/20 text-red-400" 
                        : "bg-green-500/20 text-green-400"
                    }>
                      {item.impact}
                    </Badge>
                    {item.risk !== "None" && (
                      <p className="text-xs text-slate-500 mt-1">{item.risk}</p>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Abandoned Packages */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card className="bg-slate-900/50 border-slate-800 h-full">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-400" />
                Abandoned Package Detection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {abandonedPackages.map((pkg, index) => (
                <div key={index} className="p-3 rounded-lg bg-orange-500/5 border border-orange-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <code className="text-orange-400">{pkg.name}</code>
                    <Badge className="bg-orange-500/20 text-orange-400">Abandoned</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-500">Last update:</span>
                      <span className="text-slate-300 ml-1">{pkg.lastUpdate}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Downloads:</span>
                      <span className="text-slate-300 ml-1">{pkg.downloads}</span>
                    </div>
                  </div>
                  <div className="mt-2 text-xs">
                    <span className="text-slate-500">Replace with:</span>
                    <span className="text-green-400 ml-1">{pkg.alternative}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Supply Chain Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Supply Chain Health Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-6 gap-4">
              {supplyChainMetrics.map((item, index) => (
                <div key={index} className="text-center p-4 rounded-lg bg-slate-800/30">
                  <p className="text-2xl font-bold text-white">{item.value}</p>
                  <p className="text-xs text-slate-500 mt-1">{item.metric}</p>
                  {item.trend && (
                    <p className={`text-xs mt-1 ${
                      item.trend.startsWith("+") ? "text-red-400" : 
                      item.trend.startsWith("-") ? "text-green-400" : "text-slate-500"
                    }`}>
                      {item.trend}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
