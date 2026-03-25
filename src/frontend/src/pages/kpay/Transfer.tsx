import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  Loader2,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { KPayScreen } from "../../App";
import {
  NIGERIAN_BANKS,
  NIGERIAN_BANK_CODES,
  formatNaira,
  mockBeneficiaryLookup,
} from "../../data/nigerianData";
import {
  useCreateTransfer,
  useInitiatePaystackTransfer,
  useIsPaystackConfigured,
  useResolvePaystackAccount,
} from "../../hooks/useQueries";

interface TransferProps {
  onNavigate: (screen: KPayScreen) => void;
  balance: bigint;
}

type Step = "form" | "pin" | "success";

const cardStyle = {
  background: "rgba(20,27,66,0.6)",
  backdropFilter: "blur(16px)",
  border: "1px solid rgba(245,166,35,0.12)",
};

const goldBtn = {
  background: "linear-gradient(135deg, #F5A623 0%, #E8952A 100%)",
  color: "#0A0F2C",
};

// ─── Internal (mock) transfer ──────────────────────────────────────────────

function InternalTransfer({
  balance,
  onSuccess,
}: { balance: bigint; onSuccess: () => void }) {
  const [step, setStep] = useState<Step>("form");
  const [form, setForm] = useState({
    bank: "",
    accountNumber: "",
    amount: "",
    narration: "",
  });
  const [beneficiary, setBeneficiary] = useState("");
  const [pin, setPin] = useState("");
  const [txRef, setTxRef] = useState("");
  const createTransfer = useCreateTransfer();

  const handleAccountChange = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 10);
    setForm((p) => ({ ...p, accountNumber: digits }));
    if (digits.length === 10) {
      setBeneficiary(mockBeneficiaryLookup(digits));
    } else {
      setBeneficiary("");
    }
  };

  const handleProceed = () => {
    if (!form.bank || form.accountNumber.length < 10 || !form.amount) {
      toast.error("Please fill in all required fields");
      return;
    }
    const amount = Number(form.amount);
    if (Number.isNaN(amount) || amount <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    if (BigInt(Math.round(amount * 100)) > balance) {
      toast.error("Insufficient balance");
      return;
    }
    setStep("pin");
  };

  const handlePinConfirm = async () => {
    if (pin !== "1234") {
      toast.error("Incorrect PIN. Use 1234 for demo.");
      return;
    }
    const reference = `KPAY-${Date.now()}`;
    try {
      await createTransfer.mutateAsync({
        bank: form.bank,
        reference,
        description: form.narration || "Transfer",
        accountNumber: form.accountNumber,
        amount: BigInt(Math.round(Number(form.amount) * 100)),
      });
      setTxRef(reference);
      setStep("success");
    } catch {
      toast.error("Transfer failed. Please try again.");
    }
  };

  if (step === "success") {
    return (
      <motion.div
        key="success"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="px-5 pb-6"
      >
        <div
          className="rounded-2xl p-8 text-center"
          style={{ ...cardStyle, border: "1px solid rgba(34,197,94,0.2)" }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.1 }}
            className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-6"
            style={{ background: "rgba(34,197,94,0.15)" }}
          >
            <CheckCircle size={40} style={{ color: "#22C55E" }} />
          </motion.div>
          <h3 className="font-display font-bold text-2xl mb-2">
            Transfer Successful!
          </h3>
          <p className="opacity-60 text-sm mb-6">
            Your money has been sent successfully
          </p>
          <div className="space-y-3 text-left mb-6">
            {[
              { label: "To", value: beneficiary || form.accountNumber },
              { label: "Bank", value: form.bank },
              {
                label: "Amount",
                value: `₦${Number(form.amount).toLocaleString()}`,
              },
              { label: "Reference", value: txRef },
              { label: "Status", value: "Successful" },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="flex justify-between items-center py-2"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
              >
                <span className="text-sm opacity-50">{label}</span>
                <span className="text-sm font-medium">{value}</span>
              </div>
            ))}
          </div>
          <Button
            data-ocid="transfer.done.button"
            className="w-full h-12 rounded-xl font-semibold"
            style={goldBtn}
            onClick={onSuccess}
          >
            Back to Home
          </Button>
        </div>
      </motion.div>
    );
  }

  if (step === "pin") {
    return (
      <motion.div
        key="pin"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -30 }}
        className="px-5 pb-6"
      >
        <div className="rounded-2xl p-6 text-center" style={cardStyle}>
          <div className="mb-6">
            <p className="opacity-60 text-sm mb-1">Sending to</p>
            <p className="font-semibold text-lg">
              {beneficiary || form.accountNumber}
            </p>
            <p className="opacity-60 text-sm">{form.bank}</p>
            <p
              className="font-display font-bold text-3xl mt-3"
              style={{ color: "#F5A623" }}
            >
              ₦{Number(form.amount).toLocaleString()}
            </p>
          </div>
          <p className="text-sm opacity-60 mb-4">
            Enter your 4-digit PIN to confirm
          </p>
          <div className="flex justify-center mb-6">
            <InputOTP
              data-ocid="transfer.pin.input"
              maxLength={4}
              value={pin}
              onChange={setPin}
            >
              <InputOTPGroup>
                <InputOTPSlot
                  index={0}
                  className="w-14 h-14 text-xl bg-white/5 border-white/20"
                />
                <InputOTPSlot
                  index={1}
                  className="w-14 h-14 text-xl bg-white/5 border-white/20"
                />
                <InputOTPSlot
                  index={2}
                  className="w-14 h-14 text-xl bg-white/5 border-white/20"
                />
                <InputOTPSlot
                  index={3}
                  className="w-14 h-14 text-xl bg-white/5 border-white/20"
                />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <p className="text-xs opacity-40 mb-6">Demo PIN: 1234</p>
          <Button
            data-ocid="transfer.internal.confirm.button"
            className="w-full h-12 rounded-xl font-semibold"
            style={goldBtn}
            onClick={handlePinConfirm}
            disabled={pin.length < 4 || createTransfer.isPending}
          >
            {createTransfer.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
              </>
            ) : (
              "Confirm Transfer"
            )}
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="form"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      className="px-5 pb-6 space-y-4"
    >
      <div className="rounded-2xl p-5 space-y-4" style={cardStyle}>
        <div className="space-y-2">
          <Label className="text-sm opacity-70">Select Bank</Label>
          <Select onValueChange={(v) => setForm((p) => ({ ...p, bank: v }))}>
            <SelectTrigger
              data-ocid="transfer.bank.select"
              className="bg-white/5 border-white/10 h-12"
            >
              <SelectValue placeholder="Choose bank..." />
            </SelectTrigger>
            <SelectContent className="max-h-64">
              {NIGERIAN_BANKS.map((b) => (
                <SelectItem key={b} value={b}>
                  {b}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-sm opacity-70">Account Number</Label>
          <Input
            data-ocid="transfer.account.input"
            placeholder="0123456789"
            value={form.accountNumber}
            onChange={(e) => handleAccountChange(e.target.value)}
            maxLength={10}
            className="bg-white/5 border-white/10 h-12"
          />
          {beneficiary && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm font-medium px-1"
              style={{ color: "#22C55E" }}
            >
              ✓ {beneficiary}
            </motion.p>
          )}
        </div>
        <div className="space-y-2">
          <Label className="text-sm opacity-70">Amount (NGN)</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm opacity-50">
              ₦
            </span>
            <Input
              data-ocid="transfer.amount.input"
              type="number"
              placeholder="0.00"
              value={form.amount}
              onChange={(e) =>
                setForm((p) => ({ ...p, amount: e.target.value }))
              }
              className="pl-7 bg-white/5 border-white/10 h-12"
            />
          </div>
          <p className="text-xs opacity-40 px-1">
            Balance: {formatNaira(balance)}
          </p>
        </div>
        <div className="space-y-2">
          <Label className="text-sm opacity-70">
            Narration <span className="opacity-40">(optional)</span>
          </Label>
          <Input
            data-ocid="transfer.narration.input"
            placeholder="Payment for services"
            value={form.narration}
            onChange={(e) =>
              setForm((p) => ({ ...p, narration: e.target.value }))
            }
            className="bg-white/5 border-white/10 h-12"
          />
        </div>
      </div>
      <Button
        data-ocid="transfer.proceed.button"
        className="w-full h-12 rounded-xl font-semibold text-base"
        style={goldBtn}
        onClick={handleProceed}
      >
        Proceed
      </Button>
    </motion.div>
  );
}

// ─── Bank Transfer (Paystack) ───────────────────────────────────────────────

function BankTransfer({
  balance,
  onSuccess,
}: { balance: bigint; onSuccess: () => void }) {
  const [step, setStep] = useState<Step>("form");
  const [form, setForm] = useState({
    bank: "",
    accountNumber: "",
    amount: "",
    narration: "",
  });
  const [pin, setPin] = useState("");
  const [txResult, setTxResult] = useState<Record<string, unknown> | null>(
    null,
  );

  const { data: isConfigured } = useIsPaystackConfigured();
  const bankCode = form.bank ? (NIGERIAN_BANK_CODES[form.bank] ?? "") : "";
  const resolveQuery = useResolvePaystackAccount(form.accountNumber, bankCode);
  const initiateTransfer = useInitiatePaystackTransfer();

  const resolvedName =
    form.accountNumber.length === 10 && resolveQuery.data
      ? resolveQuery.data.accountName
      : null;
  const resolveError =
    form.accountNumber.length === 10 &&
    !resolveQuery.isFetching &&
    resolveQuery.isFetched &&
    !resolveQuery.data
      ? "Could not verify account"
      : null;

  const handleProceed = () => {
    if (!form.bank || form.accountNumber.length < 10 || !form.amount) {
      toast.error("Please fill in all required fields");
      return;
    }
    const amount = Number(form.amount);
    if (Number.isNaN(amount) || amount <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    if (BigInt(Math.round(amount * 100)) > balance) {
      toast.error("Insufficient balance");
      return;
    }
    setStep("pin");
  };

  const handlePinConfirm = async () => {
    const reference = `KPAY-PS-${Date.now()}`;
    try {
      const result = await initiateTransfer.mutateAsync({
        bankCode,
        accountNumber: form.accountNumber,
        amount: BigInt(Math.round(Number(form.amount) * 100)),
        narration: form.narration || "Transfer",
        reference,
      });
      if (result?.status === true || result?.status === "success") {
        setTxResult(result);
        setStep("success");
      } else {
        toast.error(result?.message || "Transfer failed. Please try again.");
      }
    } catch (err: any) {
      toast.error(err?.message || "Transfer failed. Please try again.");
    }
  };

  if (step === "success" && txResult) {
    const data = (txResult.data as Record<string, unknown>) ?? {};
    const ref =
      (data.reference as string) || (txResult.reference as string) || "--";
    const status = (data.status as string) || "success";
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="px-5 pb-6"
      >
        <div
          className="rounded-2xl p-8 text-center"
          style={{ ...cardStyle, border: "1px solid rgba(34,197,94,0.2)" }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.1 }}
            className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-6"
            style={{ background: "rgba(34,197,94,0.15)" }}
          >
            <CheckCircle size={40} style={{ color: "#22C55E" }} />
          </motion.div>
          <h3 className="font-display font-bold text-2xl mb-2">
            Transfer Initiated!
          </h3>
          <p className="opacity-60 text-sm mb-6">
            Your Paystack transfer is being processed
          </p>
          <div className="space-y-3 text-left mb-6">
            {[
              { label: "To", value: resolvedName || form.accountNumber },
              { label: "Bank", value: form.bank },
              {
                label: "Amount",
                value: `₦${Number(form.amount).toLocaleString()}`,
              },
              { label: "Reference", value: ref },
              { label: "Status", value: status },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="flex justify-between items-center py-2"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
              >
                <span className="text-sm opacity-50">{label}</span>
                <span className="text-sm font-medium">{value}</span>
              </div>
            ))}
          </div>
          <Button
            data-ocid="transfer.bank.done.button"
            className="w-full h-12 rounded-xl font-semibold"
            style={goldBtn}
            onClick={onSuccess}
          >
            Back to Home
          </Button>
        </div>
      </motion.div>
    );
  }

  if (step === "pin") {
    return (
      <motion.div
        key="pin"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -30 }}
        className="px-5 pb-6"
      >
        <div className="rounded-2xl p-6 text-center" style={cardStyle}>
          <div className="mb-6">
            <p className="opacity-60 text-sm mb-1">Sending to</p>
            <p className="font-semibold text-lg">
              {resolvedName || form.accountNumber}
            </p>
            <p className="opacity-60 text-sm">{form.bank}</p>
            <p
              className="font-display font-bold text-3xl mt-3"
              style={{ color: "#F5A623" }}
            >
              ₦{Number(form.amount).toLocaleString()}
            </p>
          </div>
          <p className="text-sm opacity-60 mb-4">
            Enter your 4-digit PIN to confirm
          </p>
          <div className="flex justify-center mb-6">
            <InputOTP
              data-ocid="transfer.bank.pin.input"
              maxLength={4}
              value={pin}
              onChange={setPin}
            >
              <InputOTPGroup>
                <InputOTPSlot
                  index={0}
                  className="w-14 h-14 text-xl bg-white/5 border-white/20"
                />
                <InputOTPSlot
                  index={1}
                  className="w-14 h-14 text-xl bg-white/5 border-white/20"
                />
                <InputOTPSlot
                  index={2}
                  className="w-14 h-14 text-xl bg-white/5 border-white/20"
                />
                <InputOTPSlot
                  index={3}
                  className="w-14 h-14 text-xl bg-white/5 border-white/20"
                />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <Button
            data-ocid="transfer.bank.confirm.button"
            className="w-full h-12 rounded-xl font-semibold"
            style={goldBtn}
            onClick={handlePinConfirm}
            disabled={pin.length < 4 || initiateTransfer.isPending}
          >
            {initiateTransfer.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
              </>
            ) : (
              "Confirm Transfer"
            )}
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="bank-form"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      className="px-5 pb-6 space-y-4"
    >
      {/* Paystack not configured banner */}
      {isConfigured === false && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 rounded-xl px-4 py-3"
          style={{
            background: "rgba(245,166,35,0.1)",
            border: "1px solid rgba(245,166,35,0.25)",
          }}
        >
          <AlertTriangle
            size={16}
            className="mt-0.5 shrink-0"
            style={{ color: "#F5A623" }}
          />
          <p className="text-xs leading-relaxed" style={{ color: "#F5A623" }}>
            Set up your Paystack key in <strong>Profile → API Settings</strong>{" "}
            to enable real transfers.
          </p>
        </motion.div>
      )}

      {/* Paystack badge */}
      <div className="flex items-center gap-2">
        <Zap size={14} style={{ color: "#22C55E" }} />
        <span className="text-xs opacity-60">
          Powered by Paystack — real money transfers
        </span>
      </div>

      <div className="rounded-2xl p-5 space-y-4" style={cardStyle}>
        <div className="space-y-2">
          <Label className="text-sm opacity-70">Select Bank</Label>
          <Select
            onValueChange={(v) =>
              setForm((p) => ({ ...p, bank: v, accountNumber: "" }))
            }
          >
            <SelectTrigger
              data-ocid="transfer.bank.real.select"
              className="bg-white/5 border-white/10 h-12"
            >
              <SelectValue placeholder="Choose bank..." />
            </SelectTrigger>
            <SelectContent className="max-h-64">
              {NIGERIAN_BANKS.map((b) => (
                <SelectItem key={b} value={b}>
                  {b}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-sm opacity-70">Account Number</Label>
          <div className="relative">
            <Input
              data-ocid="transfer.bank.account.input"
              placeholder="0123456789"
              value={form.accountNumber}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  accountNumber: e.target.value.replace(/\D/g, "").slice(0, 10),
                }))
              }
              maxLength={10}
              className="bg-white/5 border-white/10 h-12 pr-10"
            />
            {resolveQuery.isFetching && (
              <Loader2
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin opacity-50"
              />
            )}
          </div>
          {resolvedName && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm font-medium px-1"
              style={{ color: "#22C55E" }}
            >
              ✓ {resolvedName}
            </motion.p>
          )}
          {resolveError && (
            <p className="text-sm px-1" style={{ color: "#EF4444" }}>
              {resolveError}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label className="text-sm opacity-70">Amount (NGN)</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm opacity-50">
              ₦
            </span>
            <Input
              data-ocid="transfer.bank.amount.input"
              type="number"
              placeholder="0.00"
              value={form.amount}
              onChange={(e) =>
                setForm((p) => ({ ...p, amount: e.target.value }))
              }
              className="pl-7 bg-white/5 border-white/10 h-12"
            />
          </div>
          <p className="text-xs opacity-40 px-1">
            Balance: {formatNaira(balance)}
          </p>
        </div>
        <div className="space-y-2">
          <Label className="text-sm opacity-70">
            Narration <span className="opacity-40">(optional)</span>
          </Label>
          <Input
            data-ocid="transfer.bank.narration.input"
            placeholder="Payment for services"
            value={form.narration}
            onChange={(e) =>
              setForm((p) => ({ ...p, narration: e.target.value }))
            }
            className="bg-white/5 border-white/10 h-12"
          />
        </div>
      </div>
      <Button
        data-ocid="transfer.bank.proceed.button"
        className="w-full h-12 rounded-xl font-semibold text-base"
        style={goldBtn}
        onClick={handleProceed}
      >
        Proceed to Confirm
      </Button>
    </motion.div>
  );
}

// ─── Main Transfer screen ───────────────────────────────────────────────────

export function Transfer({ onNavigate, balance }: TransferProps) {
  const [activeTab, setActiveTab] = useState("send");

  const isOnForm = true; // always show back nav

  return (
    <div
      className="flex flex-col h-full"
      style={{
        background: "linear-gradient(160deg, #070B22 0%, #0A0F2C 100%)",
      }}
    >
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center gap-4 px-5 pt-8 pb-4">
          <button
            type="button"
            data-ocid="transfer.back.button"
            onClick={() => onNavigate("home")}
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.08)" }}
          >
            <ArrowLeft size={18} />
          </button>
          <h2 className="font-display font-bold text-xl">Transfer</h2>
        </div>

        {/* Tabs */}
        <div className="px-5 pb-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList
              data-ocid="transfer.tab"
              className="w-full h-11 rounded-xl p-1"
              style={{
                background: "rgba(20,27,66,0.7)",
                border: "1px solid rgba(245,166,35,0.12)",
              }}
            >
              <TabsTrigger
                value="send"
                data-ocid="transfer.send.tab"
                className="flex-1 rounded-lg text-sm font-medium data-[state=active]:text-[#0A0F2C]"
                style={{}}
              >
                Send Money
              </TabsTrigger>
              <TabsTrigger
                value="bank"
                data-ocid="transfer.bank.tab"
                className="flex-1 rounded-lg text-sm font-medium data-[state=active]:text-[#0A0F2C]"
              >
                Bank Transfer
              </TabsTrigger>
            </TabsList>

            <div className="mt-4">
              <TabsContent value="send" className="mt-0">
                <AnimatePresence mode="wait">
                  <InternalTransfer
                    key="internal"
                    balance={balance}
                    onSuccess={() => onNavigate("home")}
                  />
                </AnimatePresence>
              </TabsContent>
              <TabsContent value="bank" className="mt-0">
                <AnimatePresence mode="wait">
                  <BankTransfer
                    key="bank"
                    balance={balance}
                    onSuccess={() => onNavigate("home")}
                  />
                </AnimatePresence>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>

      {/* suppress unused var warning */}
      {isOnForm && null}
    </div>
  );
}
