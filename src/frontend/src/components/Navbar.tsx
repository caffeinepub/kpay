import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, LayoutDashboard, LogOut, Play } from "lucide-react";
import type { AuthUser, Page } from "../App";

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  user: AuthUser | null;
  onOpenAuth: (mode: "signin" | "signup") => void;
  onSignOut: () => void;
}

export function Navbar({
  currentPage,
  onNavigate,
  user,
  onOpenAuth,
  onSignOut,
}: NavbarProps) {
  return (
    <nav className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            type="button"
            onClick={() => onNavigate("landing")}
            className="flex items-center gap-2 group"
            data-ocid="nav.link"
          >
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Play className="w-4 h-4 text-primary-foreground fill-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">
              CourseFlow
            </span>
          </button>

          {/* Center links */}
          <div className="hidden md:flex items-center gap-1">
            <button
              type="button"
              onClick={() => onNavigate("courses")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage === "courses"
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
              data-ocid="nav.courses.link"
            >
              Courses
            </button>
            {user && (
              <button
                type="button"
                onClick={() =>
                  onNavigate(
                    user.role === "creator"
                      ? "creator-dashboard"
                      : "student-dashboard",
                  )
                }
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === "creator-dashboard" ||
                  currentPage === "student-dashboard"
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
                data-ocid="nav.dashboard.link"
              >
                Dashboard
              </button>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-secondary/50 transition-colors"
                    data-ocid="nav.user.dropdown_menu"
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-foreground hidden sm:block">
                      {user.name}
                    </span>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 bg-card border-border"
                >
                  <DropdownMenuItem
                    onClick={() =>
                      onNavigate(
                        user.role === "creator"
                          ? "creator-dashboard"
                          : "student-dashboard",
                      )
                    }
                    className="cursor-pointer"
                    data-ocid="nav.dashboard.button"
                  >
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={onSignOut}
                    className="cursor-pointer text-destructive focus:text-destructive"
                    data-ocid="nav.signout.button"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onOpenAuth("signin")}
                  className="text-muted-foreground hover:text-foreground"
                  data-ocid="nav.signin.button"
                >
                  Log In
                </Button>
                <Button
                  size="sm"
                  onClick={() => onOpenAuth("signup")}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  data-ocid="nav.signup.button"
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
