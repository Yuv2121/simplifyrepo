import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  badge?: string;
}

export const FeatureCard = ({
  icon: Icon,
  title,
  description,
  onClick,
  isLoading = false,
  disabled = false,
  badge,
}: FeatureCardProps) => {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || isLoading}
      whileHover={{ scale: disabled ? 1 : 1.02, y: disabled ? 0 : -4 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`
        relative group w-full text-left p-6 rounded-2xl
        bg-slate-900/40 backdrop-blur-xl
        border border-slate-700/50
        transition-all duration-300
        ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10"}
      `}
    >
      {/* Glow Effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Badge */}
      {badge && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/50 text-green-400 text-xs font-semibold"
        >
          {badge}
        </motion.div>
      )}

      {/* Content */}
      <div className="relative z-10">
        {/* Icon */}
        <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full"
            />
          ) : (
            <Icon className="w-6 h-6 text-primary" />
          )}
        </div>

        {/* Text */}
        <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>

        {/* Action Indicator */}
        <div className="mt-4 flex items-center gap-2 text-primary/60 group-hover:text-primary transition-colors">
          <span className="text-xs font-medium">
            {isLoading ? "Processing..." : "Click to activate"}
          </span>
          <motion.span
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            →
          </motion.span>
        </div>
      </div>

      {/* Border Glow on Hover */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-primary/30 transition-all duration-300" />
    </motion.button>
  );
};
