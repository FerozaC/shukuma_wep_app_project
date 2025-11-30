import { useLocation } from "wouter";
import NavHeader from "@/components/NavHeader";
import ProfileHeader from "@/components/ProfileHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { Pencil, Settings, ChevronRight } from "lucide-react";

export default function ProfilePage() {
  const [, setLocation] = useLocation();
  const { user, logout, isGuest } = useAuth();

  const userName = user?.name || "Guest";
  const userEmail = user?.email || "guest@shukuma.app";

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-background" data-testid="page-profile">
      <NavHeader userName={userName} />

      <main className="max-w-md mx-auto px-4 py-8">
        <Card className="overflow-hidden">
          <ProfileHeader name={userName} email={userEmail} />

          <div className="p-4 space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-between h-auto py-4 px-4 hover-elevate"
              data-testid="button-edit-profile"
            >
              <div className="flex items-center gap-3">
                <Pencil className="w-5 h-5 text-muted-foreground" />
                <span>Edit Profile</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-between h-auto py-4 px-4 hover-elevate"
              data-testid="button-settings"
            >
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-muted-foreground" />
                <span>Settings</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </Button>
          </div>

          <div className="p-4 pt-0">
            <Button
              onClick={handleLogout}
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-full font-semibold"
              data-testid="button-logout"
            >
              {isGuest ? "Sign Up" : "Logout"}
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
}
