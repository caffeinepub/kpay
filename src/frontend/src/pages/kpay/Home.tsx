import { Badge } from "@/components/ui/badge";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Bell,
  PhoneCall,
  Receipt,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import type { KPayScreen } from "../../App";
import type { UserProfile } from "../../backend.d";
import { VirtualCard } from "../../components/kpay/VirtualCard";
import { SAMPLE_TRANSACTIONS, formatNaira } from "../../data/nigerianData";
import { useTransactionHistory } from "../../hooks/useQueries";

interface HomeProps {
  profile: UserProfile;
  userName: string;
  onNavigate: (screen: KPayScreen) => void;
}

const quickActions = [
  {
    id: "transfer",
    label: "Transfer",
    icon: ArrowUpRight,
    screen: "transfer" as KPayScreen,
    color: "#4F6EF7",
  },
  {
    id: "airtime",
    label: "Airtime",
    icon: PhoneCall,
    screen: "airtime" as KPayScreen,
    color: "#22C55E",
  },
  {
    id: "bills",
    label: "Pay Bills",
    icon: Zap,
    screen: "bills" as KPayScreen,
    color: "#F5A623",
  },
  {
    id: "history",
    label: "History",
    icon: Receipt,
    screen: "history" as KPayScreen,
    color: "#A855F7",
  },
];

const statusColors: Record<string, string> = {
  completed: "#22C55E",
  pending: "#F5A623",
  failed: "#EF4444",
};

export function Home({ profile, userName, onNavigate }: HomeProps) {
  const { data: txData } = useTransactionHistory();

  const txList =
    txData && txData.length > 0
      ? txData.slice(0, 5).map((tx) => ({
          id: tx.id,
          label: `${tx.transactionType} • ${tx.reference}`,
          amount: tx.amount,
          date: new Date(Number(tx.createdAt) / 1_000_000).toLocaleDateString(),
          status: tx.status,
          isDebit:
            tx.transactionType === "transfer" ||
            tx.transactionType === "airtime" ||
            tx.transactionType === "bill",
        }))
      : SAMPLE_TRANSACTIONS.map((t) => ({
          id: t.id,
          label: t.label,
          amount: t.amount,
          date: t.date,
          status: t.status,
          isDebit: t.amount < 0n,
        }));

  const firstName = userName.split(" ")[0];

  return (
    <div
      className="flex flex-col h-full"
      style={{
        background: "linear-gradient(160deg, #070B22 0%, #0A0F2C 100%)",
      }}
    >
      <div className="flex-1 overflow-y-auto pb-4">
        {/* Header */}
        <div className="px-5 pt-8 pb-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <p className="text-sm opacity-50 mb-1">Good day,</p>
              <h2 className="font-display font-bold text-2xl">
                Welcome Back, {firstName}! 👋
              </h2>
            </div>
            <button
              type="button"
              data-ocid="home.notification.button"
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-90"
              style={{
                background: "rgba(245,166,35,0.1)",
                border: "1px solid rgba(245,166,35,0.2)",
                boxShadow: "0 4px 12px rgba(245,166,35,0.12)",
              }}
            >
              <Bell size={18} style={{ color: "#F5A623" }} />
            </button>
          </motion.div>
        </div>

        {/* Virtual Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="px-5 mb-6"
        >
          <VirtualCard
            name={profile.name}
            accountNumber={profile.accountNumber}
            balance={profile.balance}
          />
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="px-5 mb-6"
        >
          <h3 className="font-display font-semibold text-base mb-4 opacity-80">
            Quick Actions
          </h3>
          <div className="grid grid-cols-4 gap-3">
            {quickActions.map((action, i) => (
              <motion.button
                key={action.id}
                data-ocid={`home.${action.id}.button`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.06, y: -2 }}
                whileTap={{ scale: 0.92, y: 2 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                onClick={() => onNavigate(action.screen)}
                className="flex flex-col items-center gap-2"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{
                    background: `${action.color}18`,
                    border: `1px solid ${action.color}35`,
                    boxShadow: `0 6px 24px ${action.color}25, inset 0 1px 0 ${action.color}20`,
                  }}
                >
                  <action.icon size={22} style={{ color: action.color }} />
                </div>
                <span className="text-xs opacity-70 text-center leading-tight">
                  {action.label}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="px-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-base opacity-80">
              Recent Transactions
            </h3>
            <button
              type="button"
              data-ocid="home.history.link"
              onClick={() => onNavigate("history")}
              className="text-xs font-medium"
              style={{ color: "#F5A623" }}
            >
              See All
            </button>
          </div>

          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "rgba(20,27,66,0.5)",
              border: "1px solid rgba(255,255,255,0.07)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
            }}
          >
            {txList.map((tx, i) => (
              <div
                key={tx.id}
                data-ocid={`home.transactions.item.${i + 1}`}
                className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-white/[0.02]"
                style={{
                  borderBottom:
                    i < txList.length - 1
                      ? "1px solid rgba(255,255,255,0.05)"
                      : "none",
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: tx.isDebit
                      ? "rgba(239,68,68,0.15)"
                      : "rgba(34,197,94,0.15)",
                    boxShadow: tx.isDebit
                      ? "0 2px 8px rgba(239,68,68,0.15)"
                      : "0 2px 8px rgba(34,197,94,0.15)",
                  }}
                >
                  {tx.isDebit ? (
                    <ArrowUpRight size={16} style={{ color: "#EF4444" }} />
                  ) : (
                    <ArrowDownLeft size={16} style={{ color: "#22C55E" }} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{tx.label}</p>
                  <p className="text-xs opacity-50">{tx.date}</p>
                </div>
                <div className="text-right">
                  <p
                    className="text-sm font-semibold"
                    style={{ color: tx.isDebit ? "#EF4444" : "#22C55E" }}
                  >
                    {tx.isDebit ? "-" : "+"}
                    {formatNaira(
                      tx.isDebit
                        ? tx.amount < 0n
                          ? -tx.amount
                          : tx.amount
                        : tx.amount,
                    )}
                  </p>
                  <div
                    className="inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-0.5"
                    style={{
                      background: `${statusColors[tx.status as string] ?? "#F5A623"}20`,
                      color: statusColors[tx.status as string] ?? "#F5A623",
                    }}
                  >
                    {String(tx.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
