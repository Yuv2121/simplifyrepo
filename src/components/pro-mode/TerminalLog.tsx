import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal } from "lucide-react";
interface TerminalLogProps {
  logs: string[];
}
export const TerminalLog = ({
  logs
}: TerminalLogProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} className="glass-card rounded-xl border border-primary/20 overflow-hidden">
      {/* Terminal Header */}
      <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/80 border-b border-primary/20">
        <Terminal className="w-4 h-4 text-primary" />
        <span className="text-xs font-mono text-primary/80">Terminal</span>
        <div className="flex gap-1.5 ml-auto">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
        </div>
      </div>

      {/* Terminal Body */}
      <div ref={scrollRef} className="p-4 h-32 overflow-y-auto bg-slate-950/90 font-mono text-xs">
        <AnimatePresence mode="popLayout">
          {logs.map((log, index) => <motion.div key={index} initial={{
          opacity: 0,
          x: -10
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.2
        }} className="flex items-start gap-2 mb-1">
              <span className="text-primary/60">{">"}</span>
              <span className="text-green-400/90">{log}</span>
            </motion.div>)}
        </AnimatePresence>
        {logs.length === 0 && <div className="text-muted-foreground/50">
            {">"} Awaiting commands...
          </div>}
        <motion.span animate={{
        opacity: [1, 0]
      }} transition={{
        duration: 0.8,
        repeat: Infinity
      }} className="inline-block w-2 h-4 bg-primary ml-1" />
      </div>
    </motion.div>;
};