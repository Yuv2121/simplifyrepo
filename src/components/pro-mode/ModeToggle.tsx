import { motion } from "framer-motion";
import { Sparkles, Zap } from "lucide-react";

interface ModeToggleProps {
  isProMode: boolean;
  onToggle: () => void;
}

export const ModeToggle = ({ isProMode, onToggle }: ModeToggleProps) => {
  return (
    <motion.button
      onClick={onToggle}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative flex items-center gap-3 px-5 py-2.5 rounded-full
        font-medium text-sm transition-all duration-300
        ${
          isProMode
            ? "bg-gradient-to-r from-primary/20 to-amber-500/20 border border-primary/50 text-primary"
            : "bg-slate-800/50 border border-slate-700 text-muted-foreground hover:border-primary/50 hover:text-primary"
        }
      `}
    >
      {/* Glow Effect when active */}
      {isProMode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 rounded-full bg-primary/10 blur-xl"
        />
      )}

      <span className="relative z-10 flex items-center gap-2">
        {isProMode ? (
          <>
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-4 h-4" />
            </motion.div>
            <span>Pro Mode Active</span>
          </>
        ) : (
          <>
            <Zap className="w-4 h-4" />
            <span>Switch to Professional</span>
          </>
        )}
      </span>

      {/* Toggle Indicator */}
      <div
        className={`
          relative w-10 h-5 rounded-full transition-colors duration-300
          ${isProMode ? "bg-primary" : "bg-slate-700"}
        `}
      >
        <motion.div
          animate={{ x: isProMode ? 20 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={`
            absolute top-0.5 w-4 h-4 rounded-full
            ${isProMode ? "bg-white" : "bg-slate-400"}
          `}
        />
      </div>
    </motion.button>
  );
};
