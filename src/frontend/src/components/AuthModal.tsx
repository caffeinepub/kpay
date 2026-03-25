import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { AuthUser } from "../App";

interface AuthModalProps {
  open: boolean;
  mode: "signin" | "signup";
  onClose: () => void;
  onSuccess: (user: AuthUser) => void;
  onToggleMode: () => void;
}

export function AuthModal({
  open,
  mode,
  onClose,
  onSuccess,
  onToggleMode,
}: AuthModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "creator">("student");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const reset = () => {
    setName("");
    setEmail("");
    setPassword("");
    setRole("student");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all required fields.");
      return;
    }
    if (mode === "signup" && !name) {
      setError("Please enter your name.");
      return;
    }

    setLoading(true);
    // Simulate async auth
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);

    const userName = mode === "signup" ? name : email.split("@")[0];
    const userRole = mode === "signup" ? role : "student";

    const user: AuthUser = { name: userName, email, role: userRole };
    onSuccess(user);

    if (mode === "signin") {
      toast.success(`Welcome back, ${userName}! Ready to learn today?`, {
        duration: 4000,
      });
    } else {
      toast.success(`Account created! Welcome to CourseFlow, ${userName}!`, {
        duration: 4000,
      });
    }

    reset();
    onClose();
  };

  const handleToggle = () => {
    reset();
    onToggleMode();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) {
          reset();
          onClose();
        }
      }}
    >
      <DialogContent
        className="bg-card border-border max-w-md"
        data-ocid="auth.modal"
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {mode === "signup" && (
            <div className="space-y-1.5">
              <Label
                htmlFor="auth-name"
                className="text-sm text-muted-foreground"
              >
                Full Name
              </Label>
              <Input
                id="auth-name"
                placeholder="Alex Rivera"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-muted border-border"
                data-ocid="auth.name.input"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <Label
              htmlFor="auth-email"
              className="text-sm text-muted-foreground"
            >
              Email
            </Label>
            <Input
              id="auth-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-muted border-border"
              data-ocid="auth.email.input"
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="auth-password"
              className="text-sm text-muted-foreground"
            >
              Password
            </Label>
            <Input
              id="auth-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-muted border-border"
              data-ocid="auth.password.input"
            />
          </div>

          {mode === "signup" && (
            <div className="space-y-1.5">
              <Label className="text-sm text-muted-foreground">I am a...</Label>
              <Select
                value={role}
                onValueChange={(v) => setRole(v as "student" | "creator")}
              >
                <SelectTrigger
                  className="bg-muted border-border"
                  data-ocid="auth.role.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="student">
                    Student — I want to learn
                  </SelectItem>
                  <SelectItem value="creator">
                    Creator — I want to teach
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {error && (
            <p
              className="text-sm text-destructive"
              data-ocid="auth.error_state"
            >
              {error}
            </p>
          )}

          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={loading}
            data-ocid="auth.submit.button"
          >
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            {loading
              ? "Please wait..."
              : mode === "signin"
                ? "Sign In"
                : "Create Account"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            {mode === "signin"
              ? "Don't have an account?"
              : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={handleToggle}
              className="text-primary hover:underline font-medium"
              data-ocid="auth.toggle.button"
            >
              {mode === "signin" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
