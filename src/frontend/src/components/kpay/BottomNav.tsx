import { ArrowLeftRight, Clock, Home, User } from "lucide-react";
import type { KPayScreen } from "../../App";

interface BottomNavProps {
  current: KPayScreen;
  onNavigate: (screen: KPayScreen) => void;
}

const navItems = [
  { screen: "home" as KPayScreen, icon: Home, label: "Home" },
  { screen: "transfer" as KPayScreen, icon: ArrowLeftRight, label: "Transfer" },
  { screen: "history" as KPayScreen, icon: Clock, label: "History" },
  { screen: "profile" as KPayScreen, icon: User, label: "Profile" },
];

export function BottomNav({ current, onNavigate }: BottomNavProps) {
  return (
    <nav
      className="sticky bottom-0 z-50"
      style={{
        background: "rgba(10,15,44,0.95)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(245,166,35,0.15)",
      }}
    >
      <div className="flex items-center justify-around py-2">
        {navItems.map(({ screen, icon: Icon, label }) => {
          const active = current === screen;
          return (
            <button
              type="button"
              key={screen}
              data-ocid={`nav.${screen}.link`}
              onClick={() => onNavigate(screen)}
              className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all"
            >
              <div
                className="p-2 rounded-xl transition-all"
                style={{
                  background: active ? "rgba(245,166,35,0.15)" : "transparent",
                }}
              >
                <Icon
                  size={20}
                  style={{
                    color: active ? "#F5A623" : "rgba(255,255,255,0.45)",
                  }}
                />
              </div>
              <span
                className="text-xs font-medium"
                style={{ color: active ? "#F5A623" : "rgba(255,255,255,0.45)" }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
