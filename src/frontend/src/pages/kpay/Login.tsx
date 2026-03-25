import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";

interface LoginProps {
  onGoRegister: () => void;
}

export function Login({ onGoRegister }: LoginProps) {
  const [showPass, setShowPass] = useState(false);
  const { login, isLoggingIn } = useInternetIdentity();

  const handleConnect = () => {
    login();
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background:
          "linear-gradient(160deg, #070B22 0%, #0F1640 50%, #0A0F2C 100%)",
      }}
    >
      {/* Top decoration */}
      <div className="relative overflow-hidden pt-16 pb-8 px-6">
        <div
          className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #F5A623 0%, transparent 70%)",
            transform: "translate(30%, -30%)",
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-10"
        >
          <img
            src="/assets/generated/kpay-logo-transparent.dim_200x200.png"
            alt="KPAY"
            className="w-10 h-10 object-contain"
          />
          <span
            className="font-display font-bold text-2xl"
            style={{ color: "#F5A623" }}
          >
            KPAY
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          <h1 className="font-display font-bold text-4xl mb-2">Welcome Back</h1>
          <p className="opacity-60 text-base">Sign in to your KPAY account</p>
        </motion.div>
      </div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.5 }}
        className="flex-1 px-6 pb-8"
      >
        <div
          className="rounded-2xl p-6 mb-6"
          style={{
            background: "rgba(20,27,66,0.6)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(245,166,35,0.15)",
          }}
        >
          <div className="space-y-4 mb-6">
            <div className="space-y-2">
              <Label className="text-sm opacity-70">Email Address</Label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40"
                />
                <Input
                  data-ocid="login.input"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10 bg-white/5 border-white/10 focus:border-primary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm opacity-70">Password</Label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40"
                />
                <Input
                  data-ocid="login.input"
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10 bg-white/5 border-white/10 focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-70"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          <div className="text-right mb-6">
            <button
              type="button"
              className="text-sm"
              style={{ color: "#F5A623" }}
            >
              Forgot Password?
            </button>
          </div>

          <Button
            data-ocid="login.submit_button"
            className="w-full h-12 text-base font-semibold rounded-xl"
            style={{
              background: "linear-gradient(135deg, #F5A623 0%, #E8952A 100%)",
              color: "#0A0F2C",
            }}
            onClick={handleConnect}
            disabled={isLoggingIn}
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Connecting...
              </>
            ) : (
              "Sign In with Internet Identity"
            )}
          </Button>
        </div>

        <div className="relative flex items-center gap-4 mb-6">
          <div
            className="flex-1 h-px"
            style={{ background: "rgba(255,255,255,0.1)" }}
          />
          <span className="text-sm opacity-40">or</span>
          <div
            className="flex-1 h-px"
            style={{ background: "rgba(255,255,255,0.1)" }}
          />
        </div>

        <p className="text-center text-sm opacity-60">
          New to KPAY?{" "}
          <button
            type="button"
            data-ocid="login.register.link"
            onClick={onGoRegister}
            className="font-semibold"
            style={{ color: "#F5A623" }}
          >
            Create Account
          </button>
        </p>

        {/* Demo note */}
        <div
          className="mt-6 p-4 rounded-xl text-center"
          style={{
            background: "rgba(245,166,35,0.08)",
            border: "1px solid rgba(245,166,35,0.15)",
          }}
        >
          <p className="text-xs opacity-60">
            Connect with Internet Identity to access your account securely.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
