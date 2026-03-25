import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDownLeft, ArrowLeft, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import type { KPayScreen } from "../../App";
import type { Transaction } from "../../backend.d";
import { SAMPLE_TRANSACTIONS, formatNaira } from "../../data/nigerianData";
import { useTransactionHistory } from "../../hooks/useQueries";

interface HistoryProps {
  onNavigate: (screen: KPayScreen) => void;
}

const statusColors: Record<string, { bg: string; text: string }> = {
  completed: { bg: "rgba(34,197,94,0.15)", text: "#22C55E" },
  pending: { bg: "rgba(245,166,35,0.15)", text: "#F5A623" },
  failed: { bg: "rgba(239,68,68,0.15)", text: "#EF4444" },
};

function TxRow({
  tx,
  index,
}: {
  tx: {
    id: string;
    label: string;
    amount: bigint;
    date: string;
    status: string;
    isDebit: boolean;
  };
  index: number;
}) {
  const colors = statusColors[tx.status] ?? statusColors.pending;
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
      data-ocid={`history.transactions.item.${index + 1}`}
      className="flex items-center gap-3 px-4 py-3"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{
          background: tx.isDebit
            ? "rgba(239,68,68,0.15)"
            : "rgba(34,197,94,0.15)",
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
            tx.isDebit ? (tx.amount < 0n ? -tx.amount : tx.amount) : tx.amount,
          )}
        </p>
        <span
          className="inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-0.5"
          style={{ background: colors.bg, color: colors.text }}
        >
          {tx.status}
        </span>
      </div>
    </motion.div>
  );
}

export function History({ onNavigate }: HistoryProps) {
  const { data: backendTx } = useTransactionHistory();

  const allTx =
    backendTx && backendTx.length > 0
      ? backendTx.map((tx: Transaction) => ({
          id: tx.id,
          label: `${tx.transactionType} · ${tx.reference}`,
          amount: tx.amount,
          date: new Date(Number(tx.createdAt) / 1_000_000).toLocaleDateString(),
          status: String(tx.status),
          isDebit: true,
          type: String(tx.transactionType),
        }))
      : SAMPLE_TRANSACTIONS.map((t) => ({
          ...t,
          type: t.type,
          status: t.status,
          isDebit: t.amount < 0n,
        }));

  const filterByType = (type: string) =>
    type === "all" ? allTx : allTx.filter((t) => t.type === type);

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
            data-ocid="history.back.button"
            onClick={() => onNavigate("home")}
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.08)" }}
          >
            <ArrowLeft size={18} />
          </button>
          <h2 className="font-display font-bold text-xl">
            Transaction History
          </h2>
        </div>

        <div className="px-5">
          <Tabs defaultValue="all">
            <TabsList
              className="w-full mb-4"
              style={{ background: "rgba(20,27,66,0.6)" }}
            >
              <TabsTrigger
                data-ocid="history.all.tab"
                value="all"
                className="flex-1"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                data-ocid="history.transfer.tab"
                value="transfer"
                className="flex-1"
              >
                Transfers
              </TabsTrigger>
              <TabsTrigger
                data-ocid="history.airtime.tab"
                value="airtime"
                className="flex-1"
              >
                Airtime
              </TabsTrigger>
              <TabsTrigger
                data-ocid="history.bills.tab"
                value="bill"
                className="flex-1"
              >
                Bills
              </TabsTrigger>
            </TabsList>

            {["all", "transfer", "airtime", "bill"].map((type) => (
              <TabsContent key={type} value={type}>
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{
                    background: "rgba(20,27,66,0.5)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  {filterByType(type).length === 0 ? (
                    <div
                      data-ocid="history.empty_state"
                      className="py-12 text-center opacity-40"
                    >
                      <p>No transactions found</p>
                    </div>
                  ) : (
                    filterByType(type).map((tx, i) => (
                      <TxRow key={tx.id} tx={tx} index={i} />
                    ))
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
