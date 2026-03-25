import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Bell,
  ChevronRight,
  Eye,
  EyeOff,
  HelpCircle,
  KeyRound,
  Loader2,
  LogOut,
  Shield,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { KPayScreen } from "../../App";
import type { UserProfile } from "../../backend.d";
import { formatNaira } from "../../data/nigerianData";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";
import {
  useIsCallerAdmin,
  useIsPaystackConfigured,
  useSetPaystackKey,
} from "../../hooks/useQueries";

interface ProfileProps {
  profile: UserProfile;
  onNavigate: (screen: KPayScreen) => void;
  onSignOut: () => void;
}

const settingsItems = [
  { id: "pin", label: "Change PIN", icon: KeyRound, color: "#F5A623" },
  { id: "notifications", label: "Notifications", icon: Bell, color: "#4F6EF7" },
  { id: "help", label: "Help & Support", icon: HelpCircle, color: "#22C55E" },
];

export function Profile({ profile, onNavigate, onSignOut }: ProfileProps) {
  const { clear } = useInternetIdentity();
  const [paystackKey, setPaystackKey] = useState("");
  const [showKey, setShowKey] = useState(false);

  const { data: isConfigured } = useIsPaystackConfigured();
  const { data: isAdmin } = useIsCallerAdmin();
  const setKeyMutation = useSetPaystackKey();

  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleSignOut = () => {
    clear();
    onSignOut();
  };

  const handleSaveKey = async () => {
    if (!paystackKey.trim()) {
      toast.error("Please enter your Paystack secret key");
      return;
    }
    try {
      await setKeyMutation.mutateAsync(paystackKey.trim());
      toast.success("Paystack key saved successfully!");
      setPaystackKey("");
    } catch {
      toast.error("Failed to save key. Please try again.");
    }
  };

  const accountFormatted = profile.accountNumber
    ? profile.accountNumber.replace(/(\d{3})(\d{4})(\d{3})/, "$1 $2 $3")
    : "---";

  return (
    <div
      className="flex flex-col h-full"
      style={{
        background: "linear-gradient(160deg, #070B22 0%, #0A0F2C 100%)",
      }}
    >
      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center gap-4 px-5 pt-8 pb-6">
          <button
            type="button"
            data-ocid="profile.back.button"
            onClick={() => onNavigate("home")}
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.08)" }}
          >
            <ArrowLeft size={18} />
          </button>
          <h2 className="font-display font-bold text-xl">Profile</h2>
        </div>

        <div className="px-5 space-y-5">
          {/* User card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-6 text-center"
            style={{
              background: "rgba(20,27,66,0.6)",
              border: "1px solid rgba(245,166,35,0.15)",
            }}
          >
            <Avatar className="w-20 h-20 mx-auto mb-4 text-2xl">
              <AvatarFallback
                style={{
                  background: "rgba(245,166,35,0.15)",
                  color: "#F5A623",
                  fontSize: "1.5rem",
                }}
              >
                {initials}
              </AvatarFallback>
            </Avatar>
            <h3 className="font-display font-bold text-xl mb-1">
              {profile.name}
            </h3>
            <p className="opacity-60 text-sm mb-4">{profile.phone}</p>

            <div className="grid grid-cols-2 gap-3">
              <div
                className="rounded-xl p-3"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <p className="text-xs opacity-50 mb-1">Account Number</p>
                <p className="text-sm font-semibold font-mono">
                  {accountFormatted}
                </p>
              </div>
              <div
                className="rounded-xl p-3"
                style={{
                  background: "rgba(245,166,35,0.08)",
                  border: "1px solid rgba(245,166,35,0.15)",
                }}
              >
                <p className="text-xs opacity-50 mb-1">Balance</p>
                <p
                  className="text-sm font-semibold"
                  style={{ color: "#F5A623" }}
                >
                  {formatNaira(profile.balance)}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Admin Dashboard Button */}
          {isAdmin && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              <button
                type="button"
                data-ocid="profile.admin.button"
                onClick={() => onNavigate("admin")}
                className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all active:scale-[0.98]"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(245,166,35,0.15) 0%, rgba(232,149,42,0.08) 100%)",
                  border: "1px solid rgba(245,166,35,0.35)",
                  boxShadow:
                    "0 4px 20px rgba(245,166,35,0.15), inset 0 1px 0 rgba(245,166,35,0.1)",
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: "rgba(245,166,35,0.2)",
                    boxShadow: "0 2px 10px rgba(245,166,35,0.3)",
                  }}
                >
                  <Shield size={18} style={{ color: "#F5A623" }} />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-bold" style={{ color: "#F5A623" }}>
                    Admin Dashboard
                  </p>
                  <p className="text-xs opacity-50">
                    System overview & controls
                  </p>
                </div>
                <ChevronRight
                  size={16}
                  style={{ color: "#F5A623", opacity: 0.7 }}
                />
              </button>
            </motion.div>
          )}

          {/* Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl overflow-hidden"
            style={{
              background: "rgba(20,27,66,0.5)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            {settingsItems.map((item, i) => (
              <button
                type="button"
                key={item.id}
                data-ocid={`profile.${item.id}.button`}
                className="w-full flex items-center gap-4 px-5 py-4 hover:bg-white/5 transition-colors"
                style={{
                  borderBottom:
                    i < settingsItems.length - 1
                      ? "1px solid rgba(255,255,255,0.05)"
                      : "none",
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `${item.color}15` }}
                >
                  <item.icon size={18} style={{ color: item.color }} />
                </div>
                <span className="flex-1 text-left text-sm font-medium">
                  {item.label}
                </span>
                <ChevronRight size={16} className="opacity-40" />
              </button>
            ))}
          </motion.div>

          {/* API Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl p-5 space-y-4"
            style={{
              background: "rgba(20,27,66,0.6)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(245,166,35,0.12)",
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(34,197,94,0.12)" }}
                >
                  <Zap size={16} style={{ color: "#22C55E" }} />
                </div>
                <div>
                  <p className="text-sm font-semibold">Paystack Integration</p>
                  <p className="text-xs opacity-40">Real bank transfers</p>
                </div>
              </div>
              <span
                className="text-xs font-semibold px-2 py-1 rounded-full"
                style={
                  isConfigured
                    ? { background: "rgba(34,197,94,0.15)", color: "#22C55E" }
                    : {
                        background: "rgba(255,255,255,0.08)",
                        color: "rgba(255,255,255,0.4)",
                      }
                }
              >
                {isConfigured ? "Connected" : "Not configured"}
              </span>
            </div>

            <div className="space-y-2">
              <Label className="text-xs opacity-60">Paystack Secret Key</Label>
              <div className="relative">
                <Input
                  data-ocid="profile.paystack.key.input"
                  type={showKey ? "text" : "password"}
                  placeholder="sk_live_xxxxxxxxxxxxxxxx"
                  value={paystackKey}
                  onChange={(e) => setPaystackKey(e.target.value)}
                  className="bg-white/5 border-white/10 h-11 pr-10 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowKey((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-70 transition-opacity"
                >
                  {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <Button
              data-ocid="profile.paystack.save.button"
              className="w-full h-10 rounded-xl font-semibold text-sm"
              style={{
                background: "linear-gradient(135deg, #F5A623 0%, #E8952A 100%)",
                color: "#0A0F2C",
              }}
              onClick={handleSaveKey}
              disabled={setKeyMutation.isPending || !paystackKey.trim()}
            >
              {setKeyMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Key"
              )}
            </Button>
          </motion.div>

          {/* Sign Out */}
          <Button
            data-ocid="profile.signout.button"
            variant="outline"
            className="w-full h-12 rounded-xl font-semibold"
            style={{
              background: "rgba(239,68,68,0.08)",
              borderColor: "rgba(239,68,68,0.25)",
              color: "#EF4444",
            }}
            onClick={handleSignOut}
          >
            <LogOut size={16} className="mr-2" />
            Sign Out
          </Button>

          {/* Footer */}
          <p className="text-center text-xs opacity-30 pb-4">
            © {new Date().getFullYear()}.{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noreferrer"
              className="hover:opacity-60"
            >
              Built with love using caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
