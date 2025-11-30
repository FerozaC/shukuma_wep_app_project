import { Link, useLocation } from "wouter";
import Logo from "./Logo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavHeaderProps {
  userName?: string;
  showNav?: boolean;
  variant?: "default" | "simple";
}

export default function NavHeader({
  userName = "User",
  showNav = true,
  variant = "default",
}: NavHeaderProps) {
  const [location] = useLocation();
  const initials = userName.slice(0, 1).toUpperCase();

  if (variant === "simple") {
    return (
      <header className="flex items-center justify-between px-6 py-4 border-b border-border">
        <Logo size="sm" />
        <Link href="/dashboard">
          <Button size="icon" variant="ghost" data-testid="button-home">
            <Home className="w-5 h-5" />
          </Button>
        </Link>
      </header>
    );
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border">
      <Logo size="sm" />
      {showNav && (
        <nav className="flex items-center gap-6">
          <Link href="/dashboard">
            <span
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location === "/dashboard" ? "text-primary" : "text-muted-foreground"
              }`}
              data-testid="link-dashboard"
            >
              Dashboard
            </span>
          </Link>
          <Link href="/history">
            <span
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location === "/history" ? "text-primary" : "text-muted-foreground"
              }`}
              data-testid="link-history"
            >
              History
            </span>
          </Link>
          <Link href="/profile">
            <span
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location === "/profile" ? "text-primary" : "text-muted-foreground"
              }`}
              data-testid="link-profile"
            >
              Profile
            </span>
          </Link>
          <Link href="/profile">
            <Avatar className="w-8 h-8 cursor-pointer" data-testid="button-avatar">
              <AvatarFallback className="bg-accent text-accent-foreground text-sm font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
          </Link>
        </nav>
      )}
    </header>
  );
}
