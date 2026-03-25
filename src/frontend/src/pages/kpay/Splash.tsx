import { motion } from "motion/react";
import { useEffect } from "react";

interface SplashProps {
  onDone: () => void;
}

export function Splash({ onDone }: SplashProps) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{
        background:
          "linear-gradient(160deg, #070B22 0%, #0F1640 50%, #0A0F2C 100%)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "backOut" }}
        className="flex flex-col items-center gap-6"
      >
        <div
          className="w-28 h-28 rounded-3xl flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #1A2255 0%, #0F1640 100%)",
            border: "2px solid rgba(245,166,35,0.4)",
            boxShadow: "0 0 60px rgba(245,166,35,0.3)",
          }}
        >
          <img
            src="/assets/generated/kpay-logo-transparent.dim_200x200.png"
            alt="KPAY"
            className="w-20 h-20 object-contain"
          />
        </div>

        <div className="text-center">
          <h1
            className="font-display font-bold text-5xl mb-2"
            style={{ color: "#F5A623" }}
          >
            KPAY
          </h1>
          <p className="text-lg opacity-60">Banking Made Simple</p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="flex gap-2 mt-8"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{ background: "#F5A623" }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1.2,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
