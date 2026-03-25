import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { KPayScreen } from "../../App";
import { formatNaira } from "../../data/nigerianData";

interface AirtimeProps {
  onNavigate: (screen: KPayScreen) => void;
  balance: bigint;
}

const NETWORKS = [
  { id: "mtn", name: "MTN", color: "#FFCC00" },
  { id: "airtel", name: "Airtel", color: "#EF4444" },
  { id: "glo", name: "Glo", color: "#22C55E" },
  { id: "9mobile", name: "9mobile", color: "#22D3EE" },
];

const AIRTIME_AMOUNTS = ["100", "200", "500", "1000", "2000", "5000"];

const DATA_PLANS = [
  { id: "d1", label: "500MB – 1 day", price: "100" },
  { id: "d2", label: "1GB – 1 day", price: "200" },
  { id: "d3", label: "2GB – 7 days", price: "500" },
  { id: "d4", label: "5GB – 30 days", price: "1500" },
  { id: "d5", label: "10GB – 30 days", price: "2500" },
  { id: "d6", label: "20GB – 30 days", price: "4500" },
];

export function Airtime({ onNavigate, balance: _balance }: AirtimeProps) {
  const [network, setNetwork] = useState("mtn");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [dataPlan, setDataPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleBuy = async (type: "airtime" | "data") => {
    const val = type === "airtime" ? amount : dataPlan;
    if (!phone || !val) {
      toast.error("Fill all fields");
      return;
    }
    if (phone.length < 10) {
      toast.error("Enter a valid phone number");
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
          Purchase Successful!
        </h3>
        <p className="opacity-60 text-center mb-8">
          Your recharge was processed successfully
        </p>
        <Button
          data-ocid="airtime.done.button"
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
            data-ocid="airtime.back.button"
            onClick={() => onNavigate("home")}
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.08)" }}
          >
            <ArrowLeft size={18} />
          </button>
          <h2 className="font-display font-bold text-xl">Airtime & Data</h2>
        </div>

        <div className="px-5">
          {/* Network select */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {NETWORKS.map((n) => (
              <button
                type="button"
                key={n.id}
                data-ocid={`airtime.${n.id}.toggle`}
                onClick={() => setNetwork(n.id)}
                className="flex flex-col items-center gap-2 py-3 rounded-xl transition-all"
                style={{
                  background:
                    network === n.id ? `${n.color}18` : "rgba(20,27,66,0.6)",
                  border: `1px solid ${network === n.id ? `${n.color}50` : "rgba(255,255,255,0.07)"}`,
                }}
              >
                <div
                  className="w-8 h-8 rounded-full"
                  style={{ background: n.color }}
                />
                <span className="text-xs">{n.name}</span>
              </button>
            ))}
          </div>

          <div className="space-y-2 mb-6">
            <Label className="text-sm opacity-70">Phone Number</Label>
            <Input
              data-ocid="airtime.phone.input"
              placeholder="08012345678"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))
              }
              className="bg-white/5 border-white/10 h-12"
            />
          </div>

          <Tabs defaultValue="airtime">
            <TabsList
              className="w-full mb-4"
              style={{ background: "rgba(20,27,66,0.6)" }}
            >
              <TabsTrigger
                data-ocid="airtime.airtime.tab"
                value="airtime"
                className="flex-1"
              >
                Airtime
              </TabsTrigger>
              <TabsTrigger
                data-ocid="airtime.data.tab"
                value="data"
                className="flex-1"
              >
                Data
              </TabsTrigger>
            </TabsList>

            <TabsContent value="airtime">
              <div className="grid grid-cols-3 gap-3 mb-6">
                {AIRTIME_AMOUNTS.map((a) => (
                  <button
                    type="button"
                    key={a}
                    data-ocid={"airtime.amount.toggle"}
                    onClick={() => setAmount(a)}
                    className="py-3 rounded-xl text-sm font-medium transition-all"
                    style={{
                      background:
                        amount === a
                          ? "rgba(245,166,35,0.2)"
                          : "rgba(20,27,66,0.6)",
                      border: `1px solid ${amount === a ? "rgba(245,166,35,0.5)" : "rgba(255,255,255,0.07)"}`,
                      color: amount === a ? "#F5A623" : undefined,
                    }}
                  >
                    ₦{a}
                  </button>
                ))}
              </div>
              <div className="space-y-2 mb-6">
                <Label className="text-sm opacity-70">Or enter amount</Label>
                <Input
                  data-ocid="airtime.custom_amount.input"
                  type="number"
                  placeholder="Custom amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-white/5 border-white/10 h-12"
                />
              </div>
              <Button
                data-ocid="airtime.buy.button"
                className="w-full h-12 rounded-xl font-semibold"
                style={{
                  background:
                    "linear-gradient(135deg, #F5A623 0%, #E8952A 100%)",
                  color: "#0A0F2C",
                }}
                onClick={() => handleBuy("airtime")}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Processing...
                  </>
                ) : (
                  "Buy Airtime"
                )}
              </Button>
            </TabsContent>

            <TabsContent value="data">
              <div className="space-y-3 mb-6">
                {DATA_PLANS.map((plan) => (
                  <button
                    type="button"
                    key={plan.id}
                    data-ocid={"airtime.plan.toggle"}
                    onClick={() => setDataPlan(plan.price)}
                    className="w-full flex justify-between items-center px-4 py-3 rounded-xl transition-all"
                    style={{
                      background:
                        dataPlan === plan.price
                          ? "rgba(245,166,35,0.15)"
                          : "rgba(20,27,66,0.6)",
                      border: `1px solid ${dataPlan === plan.price ? "rgba(245,166,35,0.4)" : "rgba(255,255,255,0.07)"}`,
                    }}
                  >
                    <span className="text-sm">{plan.label}</span>
                    <span
                      className="text-sm font-semibold"
                      style={{
                        color: dataPlan === plan.price ? "#F5A623" : undefined,
                      }}
                    >
                      ₦{plan.price}
                    </span>
                  </button>
                ))}
              </div>
              <Button
                data-ocid="airtime.data.button"
                className="w-full h-12 rounded-xl font-semibold"
                style={{
                  background:
                    "linear-gradient(135deg, #F5A623 0%, #E8952A 100%)",
                  color: "#0A0F2C",
                }}
                onClick={() => handleBuy("data")}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Processing...
                  </>
                ) : (
                  "Buy Data"
                )}
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
