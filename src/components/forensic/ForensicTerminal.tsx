import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Code } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
interface ForensicLog {
  timestamp: Date;
  message: string;
  type: "info" | "success" | "error" | "warning";
}
interface ForensicTerminalProps {
  logs: ForensicLog[];
}
function getLogColor(type: ForensicLog["type"]) {
  switch (type) {
    case "success":
      return "text-green-400";
    case "error":
      return "text-red-400";
    case "warning":
      return "text-yellow-400";
    default:
      return "text-cyan-300";
  }
}
function formatTime(date: Date) {
  return date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}
export const ForensicTerminal = ({
  logs
}: ForensicTerminalProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);
  return <div className="h-full flex flex-col bg-slate-950 rounded-lg border border-slate-800/50 overflow-hidden">
      {/* Terminal Header */}
      <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/80 border-b border-slate-800/50">
        <Code className="w-4 h-4 text-cyan-500" />
        <span className="text-xs font-mono text-slate-400">Lab Terminal</span>
        <div className="flex-1" />
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
      </div>

      {/* Terminal Content */}
      <ScrollArea className="flex-1" ref={scrollRef}>
        <div className="p-4 font-mono text-xs space-y-1">
          {logs.length === 0 ? <div className="text-slate-600">
              <span className="text-cyan-500">$</span> Awaiting forensic commands...
            </div> : logs.map((log, index) => <motion.div key={index} initial={{
          opacity: 0,
          x: -10
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.15
        }} className="flex items-start gap-2">
                <span className="text-slate-600 shrink-0">[{formatTime(log.timestamp)}]</span>
                <span className={cn("flex-1", getLogColor(log.type))}>
                  {log.message}
                </span>
              </motion.div>)}
          
          {/* Blinking cursor */}
          <div className="flex items-center gap-1 text-slate-600">
            <span className="text-cyan-500">$</span>
            <motion.span animate={{
            opacity: [1, 0]
          }} transition={{
            duration: 0.8,
            repeat: Infinity
          }} className="w-2 h-4 bg-cyan-500/70" />
          </div>
        </div>
      </ScrollArea>
    </div>;
};