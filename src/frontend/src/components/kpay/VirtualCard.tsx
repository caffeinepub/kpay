import { Wifi } from "lucide-react";
import { formatNaira } from "../../data/nigerianData";

interface VirtualCardProps {
  name: string;
  accountNumber: string;
  balance: bigint;
}

export function VirtualCard({
  name,
  accountNumber,
  balance,
}: VirtualCardProps) {
  const displayNumber = accountNumber.padEnd(16, "0");
  const formatted = `${displayNumber.slice(0, 4)} ${displayNumber.slice(4, 8)} ${displayNumber.slice(8, 12)} ${displayNumber.slice(12, 16)}`;
  const expiry = "12/28";

  return (
    <div className="animate-float" style={{ transformStyle: "preserve-3d" }}>
      <div
        className="relative rounded-2xl p-6 overflow-hidden glow-gold"
        style={{
          background:
            "linear-gradient(135deg, #0D1545 0%, #1A2560 45%, #0F1A50 100%)",
          minHeight: "185px",
          border: "1px solid rgba(245,166,35,0.3)",
        }}
      >
        {/* Decorative circles */}
        <div
          className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, #F5A623 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #F5A623 0%, transparent 70%)",
          }}
        />

        {/* Top row */}
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="flex items-center gap-2">
            <img
              src="/assets/generated/kpay-logo-transparent.dim_200x200.png"
              alt="KPAY"
              className="w-8 h-8 object-contain"
            />
            <span
              className="font-display font-bold text-lg"
              style={{ color: "#F5A623" }}
            >
              KPAY
            </span>
          </div>
          <Wifi
            size={20}
            style={{ color: "rgba(255,255,255,0.6)" }}
            className="rotate-90"
          />
        </div>

        {/* Balance */}
        <div className="mb-4 relative z-10">
          <p className="text-xs opacity-60 mb-1">Available Balance</p>
          <p
            className="font-display font-bold text-2xl"
            style={{ color: "#F5A623" }}
          >
            {formatNaira(balance)}
          </p>
        </div>

        {/* Card number */}
        <div className="mb-4 relative z-10">
          <p className="font-mono text-sm tracking-widest opacity-80">
            {formatted}
          </p>
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between relative z-10">
          <div>
            <p className="text-xs opacity-50">Card Holder</p>
            <p className="text-sm font-semibold uppercase tracking-wide">
              {name}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs opacity-50">Expires</p>
            <p className="text-sm font-semibold">{expiry}</p>
          </div>
          {/* Mastercard circles */}
          <div className="flex">
            <div
              className="w-8 h-8 rounded-full opacity-80"
              style={{ background: "#EB001B" }}
            />
            <div
              className="w-8 h-8 rounded-full -ml-4 opacity-70"
              style={{ background: "#F79E1B" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
