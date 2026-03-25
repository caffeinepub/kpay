import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, CheckCircle, Loader2, Tv, Wifi, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { KPayScreen } from "../../App";

interface BillsProps {
  onNavigate: (screen: KPayScreen) => void;
}

const BILL_CATEGORIES = [
  {
    id: "electricity",
    label: "Electricity",
    icon: Zap,
    color: "#F5A623",
    providers: [
      "EKEDC",
      "IKEDC",
      "PHED",
      "IBEDC",
      "KEDCO",
      "JED",
      "AEDC",
      "BEDC",
      "EEDC",
      "TSEDCO",
    ],
  },
  {
    id: "cable",
    label: "Cable TV",
    icon: Tv,
    color: "#A855F7",
    providers: ["DSTV", "GOtv", "Startimes"],
  },
  {
    id: "internet",
    label: "Internet",
    icon: Wifi,
    color: "#22D3EE",
    providers: ["Spectranet", "Smile", "Swift"],
  },
];

export function Bills({ onNavigate }: BillsProps) {
  const [category, setCategory] = useState("electricity");
  const [provider, setProvider] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const activeCategory = BILL_CATEGORIES.find((c) => c.id === category)!;

  const handlePay = async () => {
    if (!provider || !customerId || !amount) {
      toast.error("Please fill all fields");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setSuccess(true);
  };

  if (success) {
    return (
      <div
        className="flex flex-col h-full items-center justify-center px-5"
        style={{
          background: "linear-gradient(160deg, #070B22 0%, #0A0F2C 100%)",
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring" }}
          className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
          style={{ background: "rgba(34,197,94,0.15)" }}
        >
          <CheckCircle size={48} style={{ color: "#22C55E" }} />
        </motion.div>
        <h3 className="font-display font-bold text-2xl mb-2">
          Payment Successful!
        </h3>
        <p className="opacity-60 text-center mb-8">
          Your bill payment was processed
        </p>
        <Button
          data-ocid="bills.done.button"
          className="w-full h-12 rounded-xl font-semibold"
          style={{
            background: "linear-gradient(135deg, #F5A623 0%, #E8952A 100%)",
            color: "#0A0F2C",
          }}
          onClick={() => onNavigate("home")}
        >
          Back to Home
        </Button>
      </div>
    );
  }

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
            data-ocid="bills.back.button"
            onClick={() => onNavigate("home")}
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.08)" }}
          >
            <ArrowLeft size={18} />
          </button>
          <h2 className="font-display font-bold text-xl">Pay Bills</h2>
        </div>

        <div className="px-5 space-y-5">
          {/* Category tabs */}
          <div className="grid grid-cols-3 gap-3">
            {BILL_CATEGORIES.map((cat) => (
              <button
                type="button"
                key={cat.id}
                data-ocid={`bills.${cat.id}.tab`}
                onClick={() => {
                  setCategory(cat.id);
                  setProvider("");
                }}
                className="flex flex-col items-center gap-2 py-4 rounded-xl transition-all"
                style={{
                  background:
                    category === cat.id
                      ? `${cat.color}18`
                      : "rgba(20,27,66,0.6)",
                  border: `1px solid ${category === cat.id ? `${cat.color}40` : "rgba(255,255,255,0.07)"}`,
                }}
              >
                <cat.icon
                  size={22}
                  style={{
                    color:
                      category === cat.id ? cat.color : "rgba(255,255,255,0.5)",
                  }}
                />
                <span className="text-xs">{cat.label}</span>
              </button>
            ))}
          </div>

          <div
            className="rounded-2xl p-5 space-y-4"
            style={{
              background: "rgba(20,27,66,0.6)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(245,166,35,0.12)",
            }}
          >
            <div className="space-y-2">
              <Label className="text-sm opacity-70">Select Provider</Label>
              <Select value={provider} onValueChange={setProvider}>
                <SelectTrigger
                  data-ocid="bills.provider.select"
                  className="bg-white/5 border-white/10 h-12"
                >
                  <SelectValue placeholder="Choose provider..." />
                </SelectTrigger>
                <SelectContent>
                  {activeCategory.providers.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm opacity-70">
                {category === "electricity"
                  ? "Meter Number"
                  : category === "cable"
                    ? "Smart Card / IUC Number"
                    : "Account ID"}
              </Label>
              <Input
                data-ocid="bills.customer_id.input"
                placeholder="Enter ID"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="bg-white/5 border-white/10 h-12"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm opacity-70">Amount (NGN)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm opacity-50">
                  ₦
                </span>
                <Input
                  data-ocid="bills.amount.input"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-7 bg-white/5 border-white/10 h-12"
                />
              </div>
            </div>
          </div>

          <Button
            data-ocid="bills.pay.button"
            className="w-full h-12 rounded-xl font-semibold"
            style={{
              background: "linear-gradient(135deg, #F5A623 0%, #E8952A 100%)",
              color: "#0A0F2C",
            }}
            onClick={handlePay}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
              </>
            ) : (
              "Pay Bill"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
