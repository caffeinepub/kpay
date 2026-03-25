import { motion } from "motion/react";
import { useEffect } from "react";

interface SplashProps {
  onDone: () => void;
}

export function Splash({ onDone }: SplashProps) {
  useEffect(() => {
    const t = setTimeout(onDone, 2800);
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
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(245,166,35,0.08) 0%, transparent 70%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.6, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
        className="flex flex-col items-center gap-6 relative z-10"
      >
        {/* Logo container with 3D depth */}
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotateX: [0, 5, 0],
          }}
          transition={{
            duration: 3.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          style={{ perspective: "800px", transformStyle: "preserve-3d" }}
        >
          <div
            className="w-32 h-32 rounded-3xl flex items-center justify-center relative"
            style={{
              background: "linear-gradient(135deg, #1A2255 0%, #0F1640 100%)",
              border: "2px solid rgba(245,166,35,0.5)",
              boxShadow:
                "0 0 80px rgba(245,166,35,0.35), 0 20px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)",
            }}
          >
            {/* Inner glow ring */}
            <div
              className="absolute inset-0 rounded-3xl"
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, rgba(245,166,35,0.12) 0%, transparent 60%)",
              }}
            />
            <img
              src="/assets/generated/kpay-logo-pro-transparent.dim_300x300.png"
              alt="KPAY"
              className="w-24 h-24 object-contain relative z-10"
            />
          </div>
        </motion.div>

        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="font-display font-bold text-5xl mb-2"
            style={{
              color: "#F5A623",
              textShadow: "0 0 40px rgba(245,166,35,0.4)",
            }}
          >
            KPAY
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.6 }}
            className="text-lg"
          >
            Banking Made Simple
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="flex gap-2 mt-6"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{ background: "#F5A623" }}
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
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
