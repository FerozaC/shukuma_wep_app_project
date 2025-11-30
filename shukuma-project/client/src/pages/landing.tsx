import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import { useAuth } from "@/lib/auth-context";

export default function LandingPage() {
  const { continueAsGuest } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-muted/30">
      <Card className="w-full max-w-sm p-8 text-center" data-testid="card-landing">
        <div className="flex flex-col items-center">
          <Logo size="lg" showText={false} />
          <h1 className="text-3xl font-bold mt-4" data-testid="text-app-name">
            Shukuma
          </h1>
          <p className="text-muted-foreground mt-2" data-testid="text-tagline">
            Move anytime, anywhere
          </p>
        </div>

        <div className="mt-8 space-y-3">
          <Link href="/register">
            <Button
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-full font-semibold"
              data-testid="button-create-account"
            >
              Create Account
            </Button>
          </Link>

          <Link href="/login">
            <Button
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-semibold"
              data-testid="button-login"
            >
              Login
            </Button>
          </Link>

          <Link href="/dashboard">
            <Button
              variant="ghost"
              onClick={continueAsGuest}
              className="w-full text-foreground hover:bg-transparent hover:underline"
              data-testid="button-guest"
            >
              Continue as Guest
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
