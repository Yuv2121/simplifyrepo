import { motion } from "framer-motion";
import { DollarSign, TrendingUp, AlertCircle, ArrowUpRight, ArrowDownRight, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, RadialBarChart, RadialBar } from "recharts";

const debtScoreData = [
  { name: "Debt Score", value: 72, fill: "#f59e0b" },
];

const debtBreakdown = [
  { name: "Legacy Auth Module", value: 420000, category: "Critical", color: "#ef4444" },
  { name: "Deprecated APIs", value: 280000, category: "High", color: "#f97316" },
  { name: "Test Coverage Gap", value: 95000, category: "Medium", color: "#eab308" },
  { name: "Documentation", value: 55000, category: "Low", color: "#22c55e" },
];

const monthlyTrend = [
  { month: "Aug", debt: 780000, resolved: 45000 },
  { month: "Sep", debt: 820000, resolved: 62000 },
  { month: "Oct", debt: 795000, resolved: 88000 },
  { month: "Nov", debt: 850000, resolved: 73000 },
  { month: "Dec", debt: 850000, resolved: 91000 },
  { month: "Jan", debt: 850000, resolved: 0 },
];

const priorityMatrix = [
  { module: "payment-gateway-v1", effort: "3 weeks", roi: "4.2x", cost: "$125,000", impact: "Critical", savings: "$520K/year" },
  { module: "legacy-auth-service", effort: "6 weeks", roi: "3.8x", cost: "$285,000", impact: "Critical", savings: "$1.1M/year" },
  { module: "reporting-engine", effort: "2 weeks", roi: "2.5x", cost: "$65,000", impact: "High", savings: "$162K/year" },
  { module: "notification-queue", effort: "1 week", roi: "2.1x", cost: "$32,000", impact: "Medium", savings: "$67K/year" },
  { module: "cache-layer", effort: "4 days", roi: "1.8x", cost: "$18,000", impact: "Low", savings: "$32K/year" },
];

const chartConfig = {
  debt: { label: "Tech Debt", color: "#ef4444" },
  resolved: { label: "Resolved", color: "#22c55e" },
};

export const TechnicalDebtQuantifier = () => {
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
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            Technical Debt Quantifier
          </h1>
          <p className="text-slate-400 mt-1">Financial impact analysis of accumulated technical debt</p>
        </div>
        <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-sm px-3 py-1">
          Last Updated: 2 hours ago
        </Badge>
      </motion.div>

      {/* Top Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-4 gap-4"
      >
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Total Debt Value</p>
                <p className="text-3xl font-bold text-red-400 mt-1">$850,000</p>
              </div>
              <div className="flex items-center gap-1 text-red-400">
                <ArrowUpRight className="w-4 h-4" />
                <span className="text-sm">+8.2%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Annual Drain</p>
                <p className="text-3xl font-bold text-amber-400 mt-1">$2.3M</p>
              </div>
              <div className="flex items-center gap-1 text-amber-400">
                <Clock className="w-4 h-4" />
                <span className="text-sm">/year</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Resolved This Quarter</p>
                <p className="text-3xl font-bold text-green-400 mt-1">$252K</p>
              </div>
              <div className="flex items-center gap-1 text-green-400">
                <ArrowDownRight className="w-4 h-4" />
                <span className="text-sm">-12%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Break-Even Timeline</p>
                <p className="text-3xl font-bold text-blue-400 mt-1">14mo</p>
              </div>
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-6">
        {/* Debt Score Gauge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-slate-900/50 border-slate-800 h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Debt Score</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center h-[280px]">
              <ResponsiveContainer width="100%" height="80%">
                <RadialBarChart 
                  cx="50%" 
                  cy="50%" 
                  innerRadius="60%" 
                  outerRadius="90%" 
                  data={debtScoreData}
                  startAngle={180}
                  endAngle={0}
                >
                  <RadialBar
                    dataKey="value"
                    cornerRadius={10}
                    background={{ fill: '#1e293b' }}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="text-center -mt-16">
                <p className="text-5xl font-bold text-amber-400">72</p>
                <p className="text-sm text-slate-500">/ 100</p>
                <Badge className="mt-2 bg-amber-500/20 text-amber-400 border-amber-500/30">
                  MODERATE RISK
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Debt Breakdown Pie */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
        >
          <Card className="bg-slate-900/50 border-slate-800 h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Debt by Category</CardTitle>
            </CardHeader>
            <CardContent className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={debtBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {debtBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-slate-800 border border-slate-700 rounded-lg p-3">
                            <p className="text-white font-medium">{payload[0].name}</p>
                            <p className="text-amber-400">${(payload[0].value as number / 1000).toFixed(0)}K</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2 justify-center mt-2">
                {debtBreakdown.map((item) => (
                  <div key={item.name} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-slate-400">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Monthly Trend */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-slate-900/50 border-slate-800 h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Monthly Trend</CardTitle>
            </CardHeader>
            <CardContent className="h-[280px]">
              <ChartContainer config={chartConfig}>
                <BarChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(v) => `$${v/1000}K`} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="debt" fill="#ef4444" radius={[4, 4, 0, 0]} name="Tech Debt" />
                  <Bar dataKey="resolved" fill="#22c55e" radius={[4, 4, 0, 0]} name="Resolved" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Priority Matrix Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-400" />
              ROI Priority Matrix
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-xs text-slate-500 uppercase tracking-wider">Module</th>
                    <th className="text-left py-3 px-4 text-xs text-slate-500 uppercase tracking-wider">Effort</th>
                    <th className="text-left py-3 px-4 text-xs text-slate-500 uppercase tracking-wider">Refactor Cost</th>
                    <th className="text-left py-3 px-4 text-xs text-slate-500 uppercase tracking-wider">ROI</th>
                    <th className="text-left py-3 px-4 text-xs text-slate-500 uppercase tracking-wider">Annual Savings</th>
                    <th className="text-left py-3 px-4 text-xs text-slate-500 uppercase tracking-wider">Impact</th>
                  </tr>
                </thead>
                <tbody>
                  {priorityMatrix.map((row, index) => (
                    <motion.tr
                      key={row.module}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                      className="border-b border-slate-800 hover:bg-slate-800/30"
                    >
                      <td className="py-3 px-4">
                        <code className="text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded text-sm">{row.module}</code>
                      </td>
                      <td className="py-3 px-4 text-slate-300">{row.effort}</td>
                      <td className="py-3 px-4 text-red-400 font-mono">{row.cost}</td>
                      <td className="py-3 px-4 text-green-400 font-bold">{row.roi}</td>
                      <td className="py-3 px-4 text-emerald-400 font-mono">{row.savings}</td>
                      <td className="py-3 px-4">
                        <Badge className={
                          row.impact === "Critical" ? "bg-red-500/20 text-red-400" :
                          row.impact === "High" ? "bg-orange-500/20 text-orange-400" :
                          row.impact === "Medium" ? "bg-amber-500/20 text-amber-400" :
                          "bg-green-500/20 text-green-400"
                        }>
                          {row.impact}
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
    </div>
  );
};
