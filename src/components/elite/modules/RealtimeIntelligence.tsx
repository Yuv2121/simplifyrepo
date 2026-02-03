import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, GitCommit, AlertTriangle, TrendingUp, TrendingDown, Activity, Clock, GitPullRequest, GitMerge, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, AreaChart, Area } from "recharts";

const complexityTrend = [
  { time: "00:00", complexity: 72, drift: 0 },
  { time: "04:00", complexity: 72, drift: 0 },
  { time: "08:00", complexity: 74, drift: 2 },
  { time: "09:00", complexity: 76, drift: 4 },
  { time: "10:00", complexity: 75, drift: 3 },
  { time: "11:00", complexity: 78, drift: 6 },
  { time: "12:00", complexity: 77, drift: 5 },
  { time: "13:00", complexity: 79, drift: 7 },
  { time: "14:00", complexity: 82, drift: 10 },
  { time: "15:00", complexity: 81, drift: 9 },
  { time: "16:00", complexity: 83, drift: 11 },
];

const liveEvents = [
  { id: 1, type: "commit", user: "sarah.chen", message: "Refactor payment validation logic", branch: "main", time: "2 min ago", impact: "medium" },
  { id: 2, type: "pr_merged", user: "marcus.j", message: "PR #847: Add rate limiting to API", branch: "main", time: "5 min ago", impact: "high" },
  { id: 3, type: "drift", message: "Architecture drift detected in auth-service", severity: "warning", time: "8 min ago", impact: "high" },
  { id: 4, type: "commit", user: "james.kim", message: "Update dashboard components", branch: "feature/dashboard-v2", time: "12 min ago", impact: "low" },
  { id: 5, type: "security", message: "New CVE detected in lodash@4.17.19", severity: "critical", time: "15 min ago", impact: "critical" },
  { id: 6, type: "pr_opened", user: "emily.r", message: "PR #848: Implement caching layer", branch: "feature/cache", time: "18 min ago", impact: "medium" },
  { id: 7, type: "commit", user: "alex.t", message: "Update CI/CD pipeline", branch: "infra/ci-updates", time: "25 min ago", impact: "low" },
];

const driftAlerts = [
  { module: "auth-service", type: "Circular Dependency", detected: "10 min ago", baseline: "v2.3.1", current: "HEAD", severity: "warning" },
  { module: "payment-gateway", type: "Complexity Increase", detected: "2 hours ago", baseline: "65", current: "78", severity: "warning" },
  { module: "api-gateway", type: "New External Dependency", detected: "4 hours ago", baseline: "12 deps", current: "14 deps", severity: "info" },
];

const healthMetrics = [
  { label: "Build Success Rate", value: "98.5%", trend: "up", change: "+0.3%" },
  { label: "Test Coverage", value: "76.2%", trend: "down", change: "-0.8%" },
  { label: "Mean PR Time", value: "4.2h", trend: "up", change: "-12%" },
  { label: "Deployment Frequency", value: "3.2/day", trend: "up", change: "+0.4" },
];

export const RealtimeIntelligence = () => {
  const [events, setEvents] = useState(liveEvents);
  const [pulseActive, setPulseActive] = useState(true);

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseActive(p => !p);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const getEventIcon = (type: string) => {
    switch (type) {
      case "commit": return <GitCommit className="w-4 h-4 text-blue-400" />;
      case "pr_merged": return <GitMerge className="w-4 h-4 text-green-400" />;
      case "pr_opened": return <GitPullRequest className="w-4 h-4 text-purple-400" />;
      case "drift": return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case "security": return <Shield className="w-4 h-4 text-red-400" />;
      default: return <Activity className="w-4 h-4 text-slate-400" />;
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
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-500 ${pulseActive ? 'animate-ping' : ''}`} />
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-500" />
            </div>
            Real-Time Codebase Intelligence
          </h1>
          <p className="text-slate-400 mt-1">Live architecture drift detection and complexity monitoring</p>
        </div>
        <Badge className="bg-green-500/20 text-green-400 border-green-500/30 animate-pulse">
          <div className="w-2 h-2 rounded-full bg-green-400 mr-2" />
          LIVE
        </Badge>
      </motion.div>

      {/* Health Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-4 gap-4"
      >
        {healthMetrics.map((metric, index) => (
          <Card key={index} className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-500">{metric.label}</span>
                {metric.trend === "up" ? (
                  <TrendingUp className="w-4 h-4 text-green-400" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-400" />
                )}
              </div>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-bold text-white">{metric.value}</span>
                <span className={`text-sm ${metric.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                  {metric.change}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <div className="grid grid-cols-3 gap-6">
        {/* Live Event Feed */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="bg-slate-900/50 border-slate-800 h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm flex items-center gap-2">
                <Activity className="w-4 h-4 text-green-400" />
                Live Event Feed
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-[400px] overflow-y-auto">
              <AnimatePresence>
                {events.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.03 }}
                    className={`p-3 rounded-lg border ${
                      event.impact === "critical" ? "bg-red-500/10 border-red-500/30" :
                      event.impact === "high" ? "bg-amber-500/10 border-amber-500/30" :
                      "bg-slate-800/30 border-slate-700/50"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {getEventIcon(event.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">{event.message}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {event.user && (
                            <span className="text-xs text-slate-500">{event.user}</span>
                          )}
                          {event.branch && (
                            <Badge variant="outline" className="text-[10px] text-slate-400 border-slate-600">
                              {event.branch}
                            </Badge>
                          )}
                          {event.severity && (
                            <Badge className={
                              event.severity === "critical" ? "bg-red-500/20 text-red-400 text-[10px]" :
                              event.severity === "warning" ? "bg-amber-500/20 text-amber-400 text-[10px]" :
                              "bg-blue-500/20 text-blue-400 text-[10px]"
                            }>
                              {event.severity}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-600 whitespace-nowrap">{event.time}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* Complexity Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="col-span-2"
        >
          <Card className="bg-slate-900/50 border-slate-800 h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                  Complexity & Architecture Drift (24h)
                </span>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-0.5 bg-amber-400" />
                    <span className="text-slate-500">Complexity</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-0.5 bg-red-400" />
                    <span className="text-slate-500">Drift</span>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={complexityTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                    labelStyle={{ color: '#94a3b8' }}
                  />
                  <Area type="monotone" dataKey="complexity" stroke="#f59e0b" fill="#f59e0b20" strokeWidth={2} />
                  <Area type="monotone" dataKey="drift" stroke="#ef4444" fill="#ef444420" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Architecture Drift Alerts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              Architecture Drift Detection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-xs text-slate-500 uppercase">Module</th>
                    <th className="text-left py-3 px-4 text-xs text-slate-500 uppercase">Drift Type</th>
                    <th className="text-left py-3 px-4 text-xs text-slate-500 uppercase">Detected</th>
                    <th className="text-left py-3 px-4 text-xs text-slate-500 uppercase">Baseline</th>
                    <th className="text-left py-3 px-4 text-xs text-slate-500 uppercase">Current</th>
                    <th className="text-left py-3 px-4 text-xs text-slate-500 uppercase">Severity</th>
                  </tr>
                </thead>
                <tbody>
                  {driftAlerts.map((alert, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                      className="border-b border-slate-800 hover:bg-slate-800/30"
                    >
                      <td className="py-3 px-4">
                        <code className="text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded text-sm">{alert.module}</code>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-300">{alert.type}</td>
                      <td className="py-3 px-4 text-sm text-slate-500">{alert.detected}</td>
                      <td className="py-3 px-4 text-sm text-slate-400 font-mono">{alert.baseline}</td>
                      <td className="py-3 px-4 text-sm text-red-400 font-mono">{alert.current}</td>
                      <td className="py-3 px-4">
                        <Badge className={
                          alert.severity === "critical" ? "bg-red-500/20 text-red-400" :
                          alert.severity === "warning" ? "bg-amber-500/20 text-amber-400" :
                          "bg-blue-500/20 text-blue-400"
                        }>
                          {alert.severity}
                        </Badge>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Terminal Feed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-black border-slate-800">
          <CardHeader className="pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-xs text-slate-500 ml-2">intelligence_feed.log</span>
            </div>
          </CardHeader>
          <CardContent className="font-mono text-xs p-4 h-32 overflow-y-auto">
            <div className="space-y-1">
              <p className="text-green-400">[16:42:33] <span className="text-slate-500">INFO</span> Architecture scan completed. No critical drift detected.</p>
              <p className="text-amber-400">[16:42:28] <span className="text-slate-500">WARN</span> Complexity threshold exceeded in payment-gateway (78/70)</p>
              <p className="text-cyan-400">[16:42:15] <span className="text-slate-500">INFO</span> New commit detected: sarah.chen → main (a3f2d1b)</p>
              <p className="text-green-400">[16:41:55] <span className="text-slate-500">INFO</span> PR #847 merged successfully. Running impact analysis...</p>
              <p className="text-red-400">[16:41:22] <span className="text-slate-500">CRIT</span> CVE-2024-0001 detected in lodash@4.17.19. Immediate action required.</p>
              <p className="text-cyan-400">[16:40:18] <span className="text-slate-500">INFO</span> Webhook received from GitHub. Processing events...</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
