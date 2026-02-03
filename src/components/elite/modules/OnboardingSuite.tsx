import { useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Clock, Target, CheckCircle, Circle, ArrowRight, User, BookOpen, Code, Database, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

type Role = "frontend" | "backend" | "fullstack" | "devops";

const roleMetrics: Record<Role, { avgTime: string; difficulty: string; modules: number }> = {
  frontend: { avgTime: "3.2 weeks", difficulty: "Medium", modules: 8 },
  backend: { avgTime: "4.1 weeks", difficulty: "High", modules: 12 },
  fullstack: { avgTime: "5.5 weeks", difficulty: "Very High", modules: 18 },
  devops: { avgTime: "2.8 weeks", difficulty: "Medium", modules: 6 },
};

const onboardingPath = {
  week1: [
    { task: "Environment Setup & Tooling", status: "completed", priority: "Required", hours: 4, icon: Code },
    { task: "Codebase Architecture Overview", status: "completed", priority: "Required", hours: 3, icon: BookOpen },
    { task: "Core Domain Models Deep-Dive", status: "in-progress", priority: "Required", hours: 6, icon: Database },
    { task: "Authentication Flow Walkthrough", status: "pending", priority: "Required", hours: 4, icon: Zap },
  ],
  week2: [
    { task: "Payment Gateway Integration", status: "pending", priority: "Critical", hours: 8, icon: Code },
    { task: "API Contract & Versioning", status: "pending", priority: "Required", hours: 4, icon: BookOpen },
    { task: "Testing Strategy & Coverage", status: "pending", priority: "Required", hours: 6, icon: Target },
    { task: "First Production PR (Guided)", status: "pending", priority: "Required", hours: 8, icon: Code },
  ],
  week3: [
    { task: "Monitoring & Observability", status: "pending", priority: "Important", hours: 4, icon: Zap },
    { task: "Incident Response Procedures", status: "pending", priority: "Important", hours: 3, icon: BookOpen },
    { task: "Performance Optimization Patterns", status: "pending", priority: "Optional", hours: 6, icon: Code },
    { task: "Independent Feature Development", status: "pending", priority: "Required", hours: 12, icon: Target },
  ],
  week4: [
    { task: "Code Review Ownership", status: "pending", priority: "Required", hours: 8, icon: Code },
    { task: "On-Call Rotation Training", status: "pending", priority: "Important", hours: 4, icon: Zap },
    { task: "Architecture Decision Participation", status: "pending", priority: "Optional", hours: 4, icon: BookOpen },
    { task: "Mentorship Readiness Assessment", status: "pending", priority: "Required", hours: 2, icon: GraduationCap },
  ],
};

const newHires = [
  { name: "David Park", role: "Senior Backend Developer", startDate: "2024-01-15", progress: 68, status: "On Track" },
  { name: "Lisa Wang", role: "Frontend Developer", startDate: "2024-01-22", progress: 42, status: "On Track" },
  { name: "Michael Brown", role: "DevOps Engineer", startDate: "2024-02-01", progress: 15, status: "Behind" },
];

export const OnboardingSuite = () => {
  const [selectedRole, setSelectedRole] = useState<Role>("backend");

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
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            Onboarding Intelligence Suite
          </h1>
          <p className="text-slate-400 mt-1">AI-generated personalized learning paths based on codebase analysis</p>
        </div>
        <Button className="bg-gradient-to-r from-purple-600 to-violet-500 hover:from-purple-500 hover:to-violet-400 text-white font-semibold">
          Generate New Path
        </Button>
      </motion.div>

      {/* Role Selector & Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-4 gap-4"
      >
        {(Object.keys(roleMetrics) as Role[]).map((role) => (
          <Card
            key={role}
            className={`cursor-pointer transition-all ${
              selectedRole === role
                ? "bg-purple-500/20 border-purple-500/50"
                : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
            }`}
            onClick={() => setSelectedRole(role)}
          >
            <CardContent className="p-4">
              <p className="text-sm font-medium text-white capitalize mb-3">{role} Developer</p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs text-slate-500">Time to Prod</span>
                  <span className="text-xs text-purple-400 font-bold">{roleMetrics[role].avgTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-slate-500">Complexity</span>
                  <span className="text-xs text-amber-400">{roleMetrics[role].difficulty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-slate-500">Modules</span>
                  <span className="text-xs text-slate-300">{roleMetrics[role].modules}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <div className="grid grid-cols-3 gap-6">
        {/* Learning Path Kanban */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="col-span-2"
        >
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-400" />
                4-Week Learning Path: {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Track
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                {Object.entries(onboardingPath).map(([week, tasks], weekIndex) => (
                  <div key={week} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-slate-400 uppercase">Week {weekIndex + 1}</h4>
                      <span className="text-xs text-slate-600">{tasks.reduce((a, t) => a + t.hours, 0)}h</span>
                    </div>
                    <div className="space-y-2">
                      {tasks.map((task, taskIndex) => (
                        <motion.div
                          key={taskIndex}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 + weekIndex * 0.1 + taskIndex * 0.05 }}
                          className={`p-3 rounded-lg border ${
                            task.status === "completed" ? "bg-green-500/10 border-green-500/30" :
                            task.status === "in-progress" ? "bg-amber-500/10 border-amber-500/30" :
                            "bg-slate-800/30 border-slate-700/50"
                          }`}
                        >
                          <div className="flex items-start gap-2 mb-2">
                            {task.status === "completed" ? (
                              <CheckCircle className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                            ) : task.status === "in-progress" ? (
                              <div className="w-4 h-4 rounded-full border-2 border-amber-400 border-t-transparent animate-spin shrink-0 mt-0.5" />
                            ) : (
                              <Circle className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                            )}
                            <p className="text-xs text-slate-300 leading-tight">{task.task}</p>
                          </div>
                          <div className="flex items-center justify-between">
                            <Badge className={
                              task.priority === "Critical" ? "bg-red-500/20 text-red-400 text-[10px]" :
                              task.priority === "Required" ? "bg-blue-500/20 text-blue-400 text-[10px]" :
                              task.priority === "Important" ? "bg-amber-500/20 text-amber-400 text-[10px]" :
                              "bg-slate-500/20 text-slate-400 text-[10px]"
                            }>
                              {task.priority}
                            </Badge>
                            <span className="text-[10px] text-slate-600">{task.hours}h</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Active New Hires */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="bg-slate-900/50 border-slate-800 h-full">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="w-5 h-5 text-violet-400" />
                Active New Hires
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {newHires.map((hire, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + index * 0.05 }}
                  className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white">{hire.name}</span>
                    <Badge className={
                      hire.status === "On Track" 
                        ? "bg-green-500/20 text-green-400" 
                        : "bg-red-500/20 text-red-400"
                    }>
                      {hire.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 mb-2">{hire.role}</p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Progress</span>
                      <span className="text-purple-400">{hire.progress}%</span>
                    </div>
                    <Progress value={hire.progress} className="h-1.5" />
                  </div>
                  <p className="text-[10px] text-slate-600 mt-2">Started: {hire.startDate}</p>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Time to Productivity Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-gradient-to-r from-purple-900/30 to-violet-900/20 border-purple-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Clock className="w-8 h-8 text-purple-400" />
                <div>
                  <h3 className="text-lg font-bold text-white">Time-to-Productivity Insights</h3>
                  <p className="text-sm text-slate-400">Based on historical onboarding data from your codebase</p>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">4.2</p>
                  <p className="text-xs text-slate-500">Avg Weeks to First PR</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-400">6.8</p>
                  <p className="text-xs text-slate-500">Weeks to Full Productivity</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-purple-400">$12,400</p>
                  <p className="text-xs text-slate-500">Onboarding Cost/Dev</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-amber-400">-23%</p>
                  <p className="text-xs text-slate-500">vs. Industry Avg</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
