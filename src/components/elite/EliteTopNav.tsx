import { motion } from "framer-motion";
import { 
  Crown, 
  FileDown, 
  ChevronDown, 
  Building2,
  GitBranch,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface EliteTopNavProps {
  selectedRepo: string;
  onRepoChange: (repo: string) => void;
}

const mockRepos = [
  { name: "fintech-core-platform", org: "Goldman Sachs", status: "production" },
  { name: "trading-engine-v3", org: "Citadel Securities", status: "production" },
  { name: "risk-analytics-suite", org: "Blackrock", status: "staging" },
  { name: "payment-gateway-api", org: "Stripe Enterprise", status: "production" },
];

export const EliteTopNav = ({ selectedRepo, onRepoChange }: EliteTopNavProps) => {
  const currentRepo = mockRepos.find(r => r.name === selectedRepo) || mockRepos[0];

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-16 border-b border-amber-500/10 bg-black/80 backdrop-blur-xl flex items-center justify-between px-6"
    >
      {/* Left: Logo & Branding */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Crown className="w-7 h-7 text-amber-400" />
            <div className="absolute inset-0 blur-md bg-amber-500/30 -z-10" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">
              SimplifyRepo <span className="text-amber-400">ELITE</span>
            </h1>
            <p className="text-[10px] text-slate-500 -mt-0.5 tracking-widest uppercase">
              Enterprise Intelligence Platform
            </p>
          </div>
        </div>

        {/* Repo Selector */}
        <div className="ml-8 pl-8 border-l border-slate-800">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="h-10 px-4 bg-slate-900/50 border-slate-700 hover:bg-slate-800 hover:border-amber-500/30"
              >
                <GitBranch className="w-4 h-4 text-amber-400 mr-2" />
                <span className="text-slate-300">{currentRepo.org}/</span>
                <span className="text-white font-medium">{currentRepo.name}</span>
                <div className="ml-3 flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${currentRepo.status === 'production' ? 'bg-green-500' : 'bg-amber-500'} animate-pulse`} />
                  <span className="text-xs text-slate-500 uppercase">{currentRepo.status}</span>
                </div>
                <ChevronDown className="w-4 h-4 ml-2 text-slate-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 bg-slate-900 border-slate-700">
              {mockRepos.map((repo) => (
                <DropdownMenuItem
                  key={repo.name}
                  onClick={() => onRepoChange(repo.name)}
                  className="flex items-center gap-3 py-3 cursor-pointer hover:bg-slate-800"
                >
                  <Building2 className="w-4 h-4 text-amber-400" />
                  <div className="flex-1">
                    <p className="text-sm text-white">{repo.name}</p>
                    <p className="text-xs text-slate-500">{repo.org}</p>
                  </div>
                  <div className={`px-2 py-0.5 rounded text-xs ${repo.status === 'production' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    {repo.status}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20">
          <Shield className="w-4 h-4 text-green-400" />
          <span className="text-xs text-green-400 font-medium">SOC2 Compliant</span>
        </div>

        <Button 
          className="h-10 px-6 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-semibold shadow-lg shadow-amber-500/20"
        >
          <FileDown className="w-4 h-4 mr-2" />
          Export Board-Ready Report
        </Button>
      </div>
    </motion.header>
  );
};
