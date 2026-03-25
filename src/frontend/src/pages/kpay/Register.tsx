import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Phone, User } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { generateAccountNumber } from "../../data/nigerianData";
import { useCreateProfile } from "../../hooks/useQueries";

interface RegisterProps {
  onSuccess: (name: string) => void;
}

export function Register({ onSuccess }: RegisterProps) {
  const [form, setForm] = useState({ name: "", phone: "" });
  const createProfile = useCreateProfile();

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    const accountNumber = generateAccountNumber();
    try {
      await createProfile.mutateAsync({
        name: form.name,
        phone: form.phone,
        accountNumber,
      });
      toast.success("Account created successfully!");
      onSuccess(form.name);
    } catch (_e) {
      toast.error("Failed to create account. Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background:
          "linear-gradient(160deg, #070B22 0%, #0F1640 50%, #0A0F2C 100%)",
      }}
    >
      <div className="relative overflow-hidden pt-16 pb-6 px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-10"
        >
          <img
            src="/assets/generated/kpay-logo-transparent.dim_200x200.png"
            alt="KPAY"
            className="w-10 h-10 object-contain"
          />
          <span
            className="font-display font-bold text-2xl"
            style={{ color: "#F5A623" }}
          >
            KPAY
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="font-display font-bold text-4xl mb-2">
            Create Account
          </h1>
          <p className="opacity-60">Set up your KPAY banking profile</p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex-1 px-6 pb-8"
      >
        <div
          className="rounded-2xl p-6"
          style={{
            background: "rgba(20,27,66,0.6)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(245,166,35,0.15)",
          }}
        >
          <div className="space-y-4 mb-6">
            <div className="space-y-2">
              <Label className="text-sm opacity-70">Full Name</Label>
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40"
                />
                <Input
                  data-ocid="register.name.input"
                  placeholder="Chukwuemeka Obi"
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  className="pl-10 bg-white/5 border-white/10 focus:border-primary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm opacity-70">Phone Number</Label>
              <div className="relative">
                <Phone
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40"
                />
                <Input
                  data-ocid="register.phone.input"
                  placeholder="08012345678"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, phone: e.target.value }))
                  }
                  className="pl-10 bg-white/5 border-white/10 focus:border-primary"
                />
              </div>
            </div>
          </div>

          <Button
            data-ocid="register.submit_button"
            className="w-full h-12 text-base font-semibold rounded-xl"
            style={{
              background: "linear-gradient(135deg, #F5A623 0%, #E8952A 100%)",
              color: "#0A0F2C",
            }}
            onClick={handleSubmit}
            disabled={createProfile.isPending}
          >
            {createProfile.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating
                Account...
              </>
            ) : (
              "Create My Account"
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
