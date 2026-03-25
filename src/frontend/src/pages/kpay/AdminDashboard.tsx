import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Bell,
  CheckCircle,
  Clock,
  Loader2,
  Shield,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { KPayScreen } from "../../App";
import { formatNaira } from "../../data/nigerianData";
import {
  useAllTransactions,
  useIsCallerAdmin,
  useSendNotification,
} from "../../hooks/useQueries";

interface AdminDashboardProps {
  onNavigate: (screen: KPayScreen) => void;
}

const statusConfig: Record<
  string,
  { color: string; icon: typeof CheckCircle }
> = {
  completed: { color: "#22C55E", icon: CheckCircle },
  pending: { color: "#F5A623", icon: Clock },
  failed: { color: "#EF4444", icon: XCircle },
};

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const { data: isAdmin } = useIsCallerAdmin();
  const { data: transactions = [], isLoading } = useAllTransactions(!!isAdmin);
  const sendNotification = useSendNotification();

  const [notifTitle, setNotifTitle] = useState("");
  const [notifMessage, setNotifMessage] = useState("");

  const totalVolume = transactions.reduce((sum, tx) => sum + tx.amount, 0n);
  const pendingCount = transactions.filter(
    (tx) => String(tx.status) === "pending",
  ).length;

  const handleBroadcast = async () => {
    if (!notifTitle.trim() || !notifMessage.trim()) {
      toast.error("Please fill in both title and message");
      return;
    }
    try {
      await sendNotification.mutateAsync({
        title: notifTitle.trim(),
        message: notifMessage.trim(),
        user: null,
      });
      toast.success("Notification broadcast sent!");
      setNotifTitle("");
      setNotifMessage("");
    } catch {
      toast.error("Failed to send notification");
    }
  };

  return (
    <div
      className="flex flex-col h-full"
      style={{
        background: "linear-gradient(160deg, #070B22 0%, #0A0F2C 100%)",
      }}
    >
      <div className="flex-1 overflow-y-auto pb-6">
        {/* Header */}
        <div className="flex items-center gap-4 px-5 pt-8 pb-4">
          <button
            type="button"
            data-ocid="admin.back.button"
            onClick={() => onNavigate("profile")}
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-95"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Shield size={18} style={{ color: "#F5A623" }} />
              <h2 className="font-display font-bold text-xl">
                Admin Dashboard
              </h2>
            </div>
            <p className="text-xs opacity-40 mt-0.5">
              System overview & controls
            </p>
          </div>
        </div>

        <div className="px-5 space-y-5">
          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-3 gap-3"
          >
            {/* Total Transactions */}
            <div
              className="rounded-2xl p-4"
              style={{
                background: "rgba(79,110,247,0.12)",
                border: "1px solid rgba(79,110,247,0.25)",
                boxShadow:
                  "0 8px 32px rgba(79,110,247,0.15), inset 0 1px 0 rgba(255,255,255,0.05)",
              }}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center mb-3"
                style={{ background: "rgba(79,110,247,0.2)" }}
              >
                <Users size={15} style={{ color: "#4F6EF7" }} />
              </div>
              <p
                className="text-xl font-bold font-display"
                style={{ color: "#4F6EF7" }}
              >
                {transactions.length}
              </p>
              <p className="text-xs opacity-50 mt-0.5 leading-tight">
                Total Txns
              </p>
            </div>

            {/* Total Volume */}
            <div
              className="rounded-2xl p-4"
              style={{
                background: "rgba(245,166,35,0.1)",
                border: "1px solid rgba(245,166,35,0.25)",
                boxShadow:
                  "0 8px 32px rgba(245,166,35,0.12), inset 0 1px 0 rgba(255,255,255,0.05)",
              }}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center mb-3"
                style={{ background: "rgba(245,166,35,0.2)" }}
              >
                <TrendingUp size={15} style={{ color: "#F5A623" }} />
              </div>
              <p
                className="text-base font-bold font-display leading-tight"
                style={{ color: "#F5A623" }}
              >
                {formatNaira(totalVolume)}
              </p>
              <p className="text-xs opacity-50 mt-0.5 leading-tight">Volume</p>
            </div>

            {/* Pending */}
            <div
              className="rounded-2xl p-4"
              style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.2)",
                boxShadow:
                  "0 8px 32px rgba(239,68,68,0.12), inset 0 1px 0 rgba(255,255,255,0.05)",
              }}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center mb-3"
                style={{ background: "rgba(239,68,68,0.2)" }}
              >
                <Clock size={15} style={{ color: "#EF4444" }} />
              </div>
              <p
                className="text-xl font-bold font-display"
                style={{ color: "#EF4444" }}
              >
                {pendingCount}
              </p>
              <p className="text-xs opacity-50 mt-0.5 leading-tight">Pending</p>
            </div>
          </motion.div>

          {/* Transactions List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="font-display font-semibold text-base opacity-80 mb-3">
              All Transactions
            </h3>

            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: "rgba(20,27,66,0.6)",
                border: "1px solid rgba(255,255,255,0.07)",
                boxShadow:
                  "0 8px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)",
              }}
            >
              {isLoading ? (
                <div
                  className="flex items-center justify-center py-10"
                  data-ocid="admin.transactions.loading_state"
                >
                  <Loader2
                    className="animate-spin"
                    size={24}
                    style={{ color: "#F5A623" }}
                  />
                </div>
              ) : transactions.length === 0 ? (
                <div
                  className="text-center py-10 opacity-40"
                  data-ocid="admin.transactions.empty_state"
                >
                  <p className="text-sm">No transactions yet</p>
                </div>
              ) : (
                transactions.slice(0, 20).map((tx, i) => {
                  const statusStr = String(tx.status);
                  const cfg = statusConfig[statusStr] ?? statusConfig.pending;
                  const StatusIcon = cfg.icon;
                  return (
                    <div
                      key={tx.id}
                      data-ocid={`admin.transactions.item.${i + 1}`}
                      className="flex items-center gap-3 px-4 py-3"
                      style={{
                        borderBottom:
                          i < Math.min(transactions.length, 20) - 1
                            ? "1px solid rgba(255,255,255,0.05)"
                            : "none",
                      }}
                    >
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `${cfg.color}18` }}
                      >
                        <StatusIcon size={15} style={{ color: cfg.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate">
                          {String(tx.transactionType).toUpperCase()}
                        </p>
                        <p className="text-xs opacity-40 truncate font-mono">
                          {tx.reference}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p
                          className="text-sm font-semibold"
                          style={{ color: "#F5A623" }}
                        >
                          {formatNaira(tx.amount)}
                        </p>
                        <Badge
                          className="text-xs px-1.5 py-0 rounded-full mt-0.5"
                          style={{
                            background: `${cfg.color}20`,
                            color: cfg.color,
                            border: "none",
                          }}
                        >
                          {statusStr}
                        </Badge>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>

          {/* Send Notification */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl p-5 space-y-4"
            style={{
              background: "rgba(20,27,66,0.6)",
              border: "1px solid rgba(245,166,35,0.15)",
              boxShadow:
                "0 8px 40px rgba(245,166,35,0.05), inset 0 1px 0 rgba(255,255,255,0.04)",
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(245,166,35,0.15)" }}
              >
                <Bell size={15} style={{ color: "#F5A623" }} />
              </div>
              <div>
                <p className="text-sm font-semibold">Broadcast Notification</p>
                <p className="text-xs opacity-40">Send to all users</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs opacity-60">Title</Label>
              <Input
                data-ocid="admin.notification.input"
                placeholder="e.g. System Maintenance"
                value={notifTitle}
                onChange={(e) => setNotifTitle(e.target.value)}
                className="bg-white/5 border-white/10 h-10 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs opacity-60">Message</Label>
              <Textarea
                data-ocid="admin.notification.textarea"
                placeholder="Enter your notification message..."
                value={notifMessage}
                onChange={(e) => setNotifMessage(e.target.value)}
                rows={3}
                className="bg-white/5 border-white/10 text-sm resize-none"
              />
            </div>

            <Button
              data-ocid="admin.notification.submit_button"
              className="w-full h-11 rounded-xl font-bold text-sm"
              style={{
                background: "linear-gradient(135deg, #F5A623 0%, #E8952A 100%)",
                color: "#0A0F2C",
                boxShadow: "0 4px 20px rgba(245,166,35,0.35)",
              }}
              onClick={handleBroadcast}
              disabled={
                sendNotification.isPending ||
                !notifTitle.trim() ||
                !notifMessage.trim()
              }
            >
              {sendNotification.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Broadcasting...
                </>
              ) : (
                "Broadcast to All Users"
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
