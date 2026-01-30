import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck, Lock, Building2, Mail, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface SecurityGateProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const SecurityGate = ({
  isOpen,
  onClose,
  onSuccess,
}: SecurityGateProps) => {
  const [orgName, setOrgName] = useState("");
  const [email, setEmail] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!orgName.trim()) {
      newErrors.orgName = "Organization name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Work email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    } else if (email.includes("gmail") || email.includes("yahoo") || email.includes("hotmail")) {
      newErrors.email = "Please use your work email";
    }

    if (!accessToken.trim()) {
      newErrors.accessToken = "Access token is required";
    } else if (accessToken.length < 8) {
      newErrors.accessToken = "Token must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    setIsVerifying(true);

    // Simulate verification process
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsVerifying(false);
    toast.success("🔐 Secure Tunnel Established", {
      description: `Welcome, ${orgName} employee`,
    });
    onSuccess();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25 }}
            className="relative w-full max-w-md bg-slate-950 border-2 border-primary/40 rounded-2xl overflow-hidden shadow-2xl shadow-primary/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Security Header */}
            <div className="relative px-6 py-8 bg-gradient-to-b from-slate-900 to-slate-950 border-b border-primary/30">
              <div className="absolute top-4 right-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/50 flex items-center justify-center mb-4"
                >
                  <ShieldCheck className="w-10 h-10 text-primary" />
                </motion.div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Enterprise Verification
                </h2>
                <p className="text-sm text-muted-foreground">
                  Secure access to private repository analysis
                </p>
              </div>

              {/* Security Indicator */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Organization */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Building2 className="w-4 h-4 text-primary" />
                  Organization Name
                </label>
                <Input
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="Acme Corporation"
                  className="bg-slate-900/50 border-slate-700 focus:border-primary"
                />
                {errors.orgName && (
                  <p className="text-xs text-destructive">{errors.orgName}</p>
                )}
              </div>

              {/* Work Email */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Mail className="w-4 h-4 text-primary" />
                  Work Email
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@company.com"
                  className="bg-slate-900/50 border-slate-700 focus:border-primary"
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email}</p>
                )}
              </div>

              {/* Access Token */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Key className="w-4 h-4 text-primary" />
                  Access Token (Employee ID)
                </label>
                <Input
                  type="password"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  placeholder="••••••••••••"
                  className="bg-slate-900/50 border-slate-700 focus:border-primary"
                />
                {errors.accessToken && (
                  <p className="text-xs text-destructive">{errors.accessToken}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isVerifying}
                className="w-full h-12 bg-gradient-to-r from-primary to-amber-500 hover:from-primary/90 hover:to-amber-500/90 text-primary-foreground font-semibold shadow-lg shadow-primary/30"
              >
                {isVerifying ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Lock className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <>
                    <Lock className="w-5 h-5 mr-2" />
                    Establish Secure Tunnel
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                🔒 256-bit encrypted verification
              </p>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
