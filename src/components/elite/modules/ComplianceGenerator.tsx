import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, CheckCircle, XCircle, AlertTriangle, Download, FileText, Lock, Database, Eye, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";

const frameworks = [
  { id: "soc2", name: "SOC 2 Type II", enabled: true, score: 94, status: "compliant" },
  { id: "hipaa", name: "HIPAA", enabled: false, score: 78, status: "partial" },
  { id: "gdpr", name: "GDPR", enabled: true, score: 91, status: "compliant" },
  { id: "pci", name: "PCI-DSS", enabled: false, score: 65, status: "non-compliant" },
  { id: "iso27001", name: "ISO 27001", enabled: true, score: 88, status: "compliant" },
];

const evidencePackages = [
  { name: "Access Control Evidence", items: 24, generated: true, lastUpdated: "2 hours ago" },
  { name: "Encryption & Data Protection", items: 18, generated: true, lastUpdated: "1 day ago" },
  { name: "Audit Trail Documentation", items: 42, generated: true, lastUpdated: "3 hours ago" },
  { name: "Incident Response Procedures", items: 12, generated: false, lastUpdated: "N/A" },
  { name: "Vendor Management Records", items: 8, generated: true, lastUpdated: "5 days ago" },
];

const dataFlows = [
  { source: "User Input", destination: "API Gateway", dataType: "PII", encrypted: true, logged: true },
  { source: "API Gateway", destination: "Auth Service", dataType: "Credentials", encrypted: true, logged: true },
  { source: "Auth Service", destination: "PostgreSQL", dataType: "User Records", encrypted: true, logged: true },
  { source: "Payment Service", destination: "Stripe API", dataType: "Financial", encrypted: true, logged: true },
  { source: "Analytics", destination: "BigQuery", dataType: "Behavioral", encrypted: true, logged: false },
];

const controlChecklist = [
  { control: "Multi-factor authentication enabled", status: "pass", framework: "SOC2" },
  { control: "Data encryption at rest (AES-256)", status: "pass", framework: "SOC2, GDPR" },
  { control: "Data encryption in transit (TLS 1.3)", status: "pass", framework: "SOC2, PCI" },
  { control: "Role-based access control implemented", status: "pass", framework: "SOC2, HIPAA" },
  { control: "Audit logging for all data access", status: "warning", framework: "SOC2, GDPR" },
  { control: "Data retention policies enforced", status: "pass", framework: "GDPR" },
  { control: "Right to erasure capability", status: "pass", framework: "GDPR" },
  { control: "Vulnerability scanning (weekly)", status: "pass", framework: "SOC2, PCI" },
  { control: "Penetration testing (annual)", status: "warning", framework: "SOC2, PCI" },
  { control: "Disaster recovery plan tested", status: "fail", framework: "SOC2" },
];

export const ComplianceGenerator = () => {
  const [enabledFrameworks, setEnabledFrameworks] = useState<Record<string, boolean>>({
    soc2: true,
    hipaa: false,
    gdpr: true,
    pci: false,
    iso27001: true,
  });

  const toggleFramework = (id: string) => {
    setEnabledFrameworks(prev => ({ ...prev, [id]: !prev[id] }));
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            Compliance Evidence Generator
          </h1>
          <p className="text-slate-400 mt-1">Automated compliance mapping and audit evidence generation</p>
        </div>
        <Button className="h-12 px-6 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold">
          <Download className="w-4 h-4 mr-2" />
          Export Full Audit Package
        </Button>
      </motion.div>

      {/* Framework Toggles */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm">Active Compliance Frameworks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-4">
              {frameworks.map((framework) => (
                <div
                  key={framework.id}
                  className={`p-4 rounded-lg border transition-all ${
                    enabledFrameworks[framework.id]
                      ? "bg-blue-500/10 border-blue-500/30"
                      : "bg-slate-800/30 border-slate-700/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-white">{framework.name}</span>
                    <Switch
                      checked={enabledFrameworks[framework.id]}
                      onCheckedChange={() => toggleFramework(framework.id)}
                    />
                  </div>
                  {enabledFrameworks[framework.id] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                    >
                      <Progress value={framework.score} className="h-1.5 mb-2" />
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400">{framework.score}%</span>
                        <Badge className={
                          framework.status === "compliant" ? "bg-green-500/20 text-green-400" :
                          framework.status === "partial" ? "bg-amber-500/20 text-amber-400" :
                          "bg-red-500/20 text-red-400"
                        }>
                          {framework.status}
                        </Badge>
                      </div>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-2 gap-6">
        {/* Control Checklist */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-slate-900/50 border-slate-800 h-full">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-400" />
                Control Assessment Checklist
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-[400px] overflow-y-auto">
              {controlChecklist.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + index * 0.03 }}
                  className="flex items-center gap-3 p-2 rounded bg-slate-800/30"
                >
                  {item.status === "pass" ? (
                    <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                  ) : item.status === "warning" ? (
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm text-slate-300">{item.control}</p>
                    <p className="text-xs text-slate-500">{item.framework}</p>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Evidence Packages */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                Audit Evidence Packages
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {evidencePackages.map((pkg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + index * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 border border-slate-700/50"
                >
                  <div>
                    <p className="text-sm font-medium text-white">{pkg.name}</p>
                    <p className="text-xs text-slate-500">{pkg.items} evidence items • {pkg.lastUpdated}</p>
                  </div>
                  {pkg.generated ? (
                    <Button size="sm" variant="outline" className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10">
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>
                  ) : (
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white">
                      Generate
                    </Button>
                  )}
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Data Flow Mapping */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-purple-400" />
              Sensitive Data Flow Mapping
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-xs text-slate-500 uppercase">Source</th>
                    <th className="text-left py-3 px-4 text-xs text-slate-500 uppercase">Destination</th>
                    <th className="text-left py-3 px-4 text-xs text-slate-500 uppercase">Data Type</th>
                    <th className="text-left py-3 px-4 text-xs text-slate-500 uppercase">Encrypted</th>
                    <th className="text-left py-3 px-4 text-xs text-slate-500 uppercase">Audit Logged</th>
                  </tr>
                </thead>
                <tbody>
                  {dataFlows.map((flow, index) => (
                    <tr key={index} className="border-b border-slate-800 hover:bg-slate-800/30">
                      <td className="py-3 px-4 text-sm text-slate-300">{flow.source}</td>
                      <td className="py-3 px-4 text-sm text-slate-300">{flow.destination}</td>
                      <td className="py-3 px-4">
                        <Badge className={
                          flow.dataType === "PII" || flow.dataType === "Credentials" 
                            ? "bg-red-500/20 text-red-400"
                            : flow.dataType === "Financial"
                              ? "bg-amber-500/20 text-amber-400"
                              : "bg-blue-500/20 text-blue-400"
                        }>
                          {flow.dataType}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        {flow.encrypted ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-400" />
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {flow.logged ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-400" />
                        )}
                      </td>
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
