import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import NavHeader from "@/components/NavHeader";
import HeroCard from "@/components/HeroCard";
import StatCard from "@/components/StatCard";
import WeeklyChart from "@/components/WeeklyChart";
import { useAuth, getAuthToken } from "@/lib/auth-context";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Info } from "lucide-react";

interface Stats {
  streak: number;
  totalCards: number;
  totalReps: number;
  lastWorkout: string | null;
  weeklyData: { day: string; cards: number }[];
}

export default function DashboardPage() {
  const [, setLocation] = useLocation();
  const { user, isGuest } = useAuth();
  const token = getAuthToken();

  const { data: stats, isLoading } = useQuery<Stats>({
    queryKey: ["/api/stats"],
    queryFn: async () => {
      if (!token) return null;
      const res = await fetch("/api/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
    enabled: !!token,
  });

  const userName = user?.name || "User";
  const streak = stats?.streak ?? user?.streak ?? 0;
  const totalCards = stats?.totalCards ?? user?.totalCards ?? 0;
  const totalReps = stats?.totalReps ?? user?.totalReps ?? 0;
  const weeklyData = stats?.weeklyData ?? [];
  const weeklyTotal = weeklyData.reduce((sum, d) => sum + d.cards, 0);

  const getLastWorkoutLabel = () => {
    if (!stats?.lastWorkout) return "No workouts yet";
    const lastDate = new Date(stats.lastWorkout);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const lastDateNorm = new Date(lastDate);
    lastDateNorm.setHours(0, 0, 0, 0);
    
    if (lastDateNorm.getTime() === today.getTime()) return "Today";
    if (lastDateNorm.getTime() === yesterday.getTime()) return "Yesterday";
    
    const diffDays = Math.floor((today.getTime() - lastDateNorm.getTime()) / (1000 * 60 * 60 * 24));
    return `${diffDays} days ago`;
  };

  return (
    <div className="min-h-screen bg-background" data-testid="page-dashboard">
      <NavHeader userName={userName} />

      <main className="max-w-5xl mx-auto px-4 py-8">
        {isGuest && (
          <Alert className="mb-6 border-primary/20 bg-primary/5">
            <Info className="w-4 h-4 text-primary" />
            <AlertDescription>
              You're using Shukuma as a guest. Sign up to save your progress and
              unlock all features!
            </AlertDescription>
          </Alert>
        )}

        <h1 className="text-2xl font-bold mb-6" data-testid="text-welcome-user">
          Welcome back, {userName}!
        </h1>

        <div className="space-y-6">
          <HeroCard onStartWorkout={() => setLocation("/workout")} />

          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon="streak"
                label="Current Streak"
                value={`${streak} Days`}
                color="orange"
              />
              <StatCard
                icon="cards"
                label="Total Cards"
                value={totalCards.toLocaleString()}
                color="blue"
              />
              <StatCard 
                icon="workout" 
                label="Last Workout" 
                value={getLastWorkoutLabel()} 
                color="yellow" 
              />
              <StatCard
                icon="reps"
                label="Total Reps"
                value={totalReps.toLocaleString()}
                color="green"
              />
            </div>
          )}

          {isLoading ? (
            <Skeleton className="h-64 rounded-xl" />
          ) : (
            <WeeklyChart data={weeklyData} totalCards={weeklyTotal} percentChange={5} />
          )}
        </div>
      </main>
    </div>
  );
}
