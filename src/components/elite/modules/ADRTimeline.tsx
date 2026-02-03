import { motion } from "framer-motion";
import { ScrollText, GitBranch, User, Calendar, ThumbsUp, ThumbsDown, MessageSquare, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const architectureDecisions = [
  {
    id: "ADR-001",
    title: "Adopt Microservices Architecture",
    status: "Accepted",
    date: "2023-03-15",
    author: "Sarah Chen",
    context: "The monolithic application is becoming difficult to scale and deploy. Team velocity has decreased by 40% due to deployment coupling.",
    decision: "Migrate to microservices using Domain-Driven Design principles. Start with payment and notification domains.",
    consequences: "Increased operational complexity, need for service mesh, but improved scalability and team autonomy.",
    stakeholders: ["CTO", "VP Engineering", "Platform Team"],
    relatedFiles: ["src/services/", "infrastructure/kubernetes/"],
    impact: "High",
    category: "Architecture"
  },
  {
    id: "ADR-002",
    title: "PostgreSQL as Primary Database",
    status: "Accepted",
    date: "2023-02-28",
    author: "Marcus Johnson",
    context: "Need a reliable, ACID-compliant database that supports complex queries and has strong ecosystem support.",
    decision: "Use PostgreSQL 15 with read replicas for scaling. Implement connection pooling with PgBouncer.",
    consequences: "Excellent query performance, strong consistency guarantees. Need expertise in PostgreSQL optimization.",
    stakeholders: ["DBA Team", "Backend Engineers"],
    relatedFiles: ["src/database/", "migrations/"],
    impact: "Critical",
    category: "Data"
  },
  {
    id: "ADR-003",
    title: "Event-Driven Architecture for Async Operations",
    status: "Accepted",
    date: "2023-04-10",
    author: "Sarah Chen",
    context: "Synchronous API calls are causing latency issues and tight coupling between services.",
    decision: "Implement event-driven architecture using Apache Kafka for inter-service communication.",
    consequences: "Better decoupling, improved resilience. Added complexity in debugging and eventual consistency handling.",
    stakeholders: ["Platform Team", "All Service Owners"],
    relatedFiles: ["src/events/", "src/consumers/"],
    impact: "High",
    category: "Integration"
  },
  {
    id: "ADR-004",
    title: "JWT-based Authentication with Refresh Tokens",
    status: "Superseded",
    supersededBy: "ADR-007",
    date: "2023-01-20",
    author: "Alex Thompson",
    context: "Need stateless authentication for microservices while maintaining security.",
    decision: "Use JWT tokens with short expiry and refresh token rotation.",
    consequences: "Stateless auth achieved, but token revocation complexity emerged.",
    stakeholders: ["Security Team", "Frontend Team"],
    relatedFiles: ["src/auth/"],
    impact: "Critical",
    category: "Security"
  },
  {
    id: "ADR-005",
    title: "React with TypeScript for Frontend",
    status: "Accepted",
    date: "2023-02-01",
    author: "James Kim",
    context: "Angular 8 is becoming outdated. Team wants modern tooling and better developer experience.",
    decision: "Migrate to React 18 with TypeScript, using Vite for build tooling.",
    consequences: "Improved DX, faster builds. Requires migration effort and team training.",
    stakeholders: ["Frontend Team", "Design Team"],
    relatedFiles: ["src/components/", "src/pages/"],
    impact: "High",
    category: "Frontend"
  },
];

const categoryColors: Record<string, string> = {
  "Architecture": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "Data": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "Integration": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  "Security": "bg-red-500/20 text-red-400 border-red-500/30",
  "Frontend": "bg-green-500/20 text-green-400 border-green-500/30",
};

export const ADRTimeline = () => {
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
              <ScrollText className="w-5 h-5 text-white" />
            </div>
            Architecture Decision Records
          </h1>
          <p className="text-slate-400 mt-1">AI-inferred historical context of architectural decisions</p>
        </div>
        <Button className="bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 text-black font-semibold">
          Generate New ADR
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-5 gap-4"
      >
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-white">47</p>
            <p className="text-xs text-slate-500">Total ADRs</p>
          </CardContent>
        </Card>
        <Card className="bg-green-500/10 border-green-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-green-400">38</p>
            <p className="text-xs text-green-400">Accepted</p>
          </CardContent>
        </Card>
        <Card className="bg-amber-500/10 border-amber-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-amber-400">5</p>
            <p className="text-xs text-amber-400">Superseded</p>
          </CardContent>
        </Card>
        <Card className="bg-red-500/10 border-red-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-red-400">2</p>
            <p className="text-xs text-red-400">Deprecated</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-500/10 border-blue-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-blue-400">2</p>
            <p className="text-xs text-blue-400">Proposed</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Timeline */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="relative"
      >
        {/* Timeline line */}
        <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-slate-700" />
        
        <div className="space-y-6">
          {architectureDecisions.map((adr, index) => (
            <motion.div
              key={adr.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              className="relative pl-12"
            >
              {/* Timeline dot */}
              <div className={`absolute left-3 w-4 h-4 rounded-full border-2 ${
                adr.status === "Accepted" ? "bg-green-500 border-green-400" :
                adr.status === "Superseded" ? "bg-amber-500 border-amber-400" :
                "bg-slate-500 border-slate-400"
              }`} />
              
              <Card className={`bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-colors ${
                adr.status === "Superseded" ? "opacity-70" : ""
              }`}>
                <CardContent className="p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <code className="text-amber-400 text-sm">{adr.id}</code>
                        <Badge className={
                          adr.status === "Accepted" ? "bg-green-500/20 text-green-400" :
                          adr.status === "Superseded" ? "bg-amber-500/20 text-amber-400" :
                          "bg-slate-500/20 text-slate-400"
                        }>
                          {adr.status}
                        </Badge>
                        <Badge className={categoryColors[adr.category]}>
                          {adr.category}
                        </Badge>
                        <Badge className={
                          adr.impact === "Critical" ? "bg-red-500/20 text-red-400" :
                          adr.impact === "High" ? "bg-orange-500/20 text-orange-400" :
                          "bg-blue-500/20 text-blue-400"
                        }>
                          {adr.impact} Impact
                        </Badge>
                      </div>
                      <h3 className="text-lg font-semibold text-white">{adr.title}</h3>
                      {adr.supersededBy && (
                        <p className="text-sm text-amber-400 mt-1">Superseded by {adr.supersededBy}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <User className="w-3 h-3" />
                      <span>{adr.author}</span>
                      <Calendar className="w-3 h-3 ml-2" />
                      <span>{adr.date}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-slate-500 font-medium mb-1">Context</p>
                      <p className="text-slate-300">{adr.context}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 font-medium mb-1">Decision</p>
                      <p className="text-slate-300">{adr.decision}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 font-medium mb-1">Consequences</p>
                      <p className="text-slate-300">{adr.consequences}</p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <GitBranch className="w-3 h-3" />
                        <span>{adr.relatedFiles.join(", ")}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {adr.stakeholders.map((s, i) => (
                        <Badge key={i} variant="outline" className="text-xs text-slate-400 border-slate-600">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
