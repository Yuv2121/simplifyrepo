import { forwardRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Github, Clock, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Scan {
  id: string;
  repo_name: string;
  repo_url: string;
  created_at: string;
}

interface RecentScansProps {
  onSelectRepo: (url: string) => void;
}

export const RecentScans = forwardRef<HTMLDivElement, RecentScansProps>(({ onSelectRepo }, ref) => {
  const { data: scans, isLoading } = useQuery({
    queryKey: ["recent-scans"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("scans")
        .select("id, repo_name, repo_url, created_at")
        .order("created_at", { ascending: false })
        .limit(6);

      if (error) throw error;
      return data as Scan[];
    },
  });

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-16">
        <div className="text-center mb-6">
          <div className="h-6 w-32 bg-muted rounded shimmer mx-auto" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-xl bg-muted shimmer" />
          ))}
        </div>
      </div>
    );
  }

  if (!scans || scans.length === 0) {
    return null;
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.6 }}
      className="w-full max-w-4xl mx-auto mt-16"
    >
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-foreground">Recent Scans</h3>
        <p className="text-sm text-muted-foreground">See what others have analyzed</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {scans.map((scan, i) => (
          <motion.button
            key={scan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 + i * 0.1, duration: 0.4 }}
            onClick={() => onSelectRepo(scan.repo_url)}
            className="group glass-card rounded-xl p-4 text-left hover:border-primary/50 transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <Github className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-foreground truncate max-w-[160px]">
                    {scan.repo_name}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" />
                    {formatTimeAgo(scan.created_at)}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
});

RecentScans.displayName = "RecentScans";
