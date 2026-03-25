import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import type { UserProfile } from "./backend.d";
import { BottomNav } from "./components/kpay/BottomNav";
import { useActor } from "./hooks/useActor";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useUserProfile } from "./hooks/useQueries";
import { Airtime } from "./pages/kpay/Airtime";
import { Bills } from "./pages/kpay/Bills";
import { History } from "./pages/kpay/History";
import { Home } from "./pages/kpay/Home";
import { Login } from "./pages/kpay/Login";
import { Profile } from "./pages/kpay/Profile";
import { Register } from "./pages/kpay/Register";
import { Splash } from "./pages/kpay/Splash";
import { Transfer } from "./pages/kpay/Transfer";

export type KPayScreen =
  | "splash"
  | "login"
  | "register"
  | "home"
  | "transfer"
  | "airtime"
  | "bills"
  | "history"
  | "profile";

export default function App() {
  const [screen, setScreen] = useState<KPayScreen>("splash");
  const { identity, isInitializing } = useInternetIdentity();
  const { data: profile, isLoading: profileLoading } = useUserProfile();

  // After II login, check if user has a profile
  useEffect(() => {
    if (!isInitializing && identity && !identity.getPrincipal().isAnonymous()) {
      if (!profileLoading) {
        if (profile) {
          setScreen("home");
        } else {
          setScreen("register");
        }
      }
    }
  }, [identity, isInitializing, profile, profileLoading]);

  const showBottomNav = ["home", "transfer", "history", "profile"].includes(
    screen,
  );

  const handleSignOut = () => {
    setScreen("login");
  };

  const currentProfile: UserProfile = profile ?? {
    name: "User",
    accountNumber: "0000000000",
    phone: "",
    balance: 0n,
  };

  const renderScreen = () => {
    switch (screen) {
      case "splash":
        return <Splash onDone={() => setScreen("login")} />;
      case "login":
        return <Login onGoRegister={() => setScreen("register")} />;
      case "register":
        return <Register onSuccess={() => setScreen("home")} />;
      case "home":
        return (
          <Home
            profile={currentProfile}
            userName={currentProfile.name}
            onNavigate={setScreen}
          />
        );
      case "transfer":
        return (
          <Transfer onNavigate={setScreen} balance={currentProfile.balance} />
        );
      case "airtime":
        return (
          <Airtime onNavigate={setScreen} balance={currentProfile.balance} />
        );
      case "bills":
        return <Bills onNavigate={setScreen} />;
      case "history":
        return <History onNavigate={setScreen} />;
      case "profile":
        return (
          <Profile
            profile={currentProfile}
            onNavigate={setScreen}
            onSignOut={handleSignOut}
          />
        );
      default:
        return <Splash onDone={() => setScreen("login")} />;
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "#050818" }}
    >
      {/* Phone container */}
      <div
        className="relative w-full max-w-sm mx-auto flex flex-col overflow-hidden"
        style={{
          minHeight: "100svh",
          background: "#0A0F2C",
        }}
      >
        {/* Screen content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {renderScreen()}
        </div>

        {/* Bottom navigation */}
        {showBottomNav && <BottomNav current={screen} onNavigate={setScreen} />}
      </div>

      <Toaster richColors position="top-center" />
    </div>
  );
}

// Legacy CourseFlow type exports (backward compat)
export type Page = string;
export interface AuthUser {
  name: string;
  email: string;
  role: "student" | "creator";
}
