import { useQuery } from "@tanstack/react-query";
import NavHeader from "@/components/NavHeader";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth, getAuthToken } from "@/lib/auth-context";
import { Calendar, Clock, Layers } from "lucide-react";

interface WorkoutSession {
  id: string;
  cardsCompleted: number;
  totalTime: string;
  cards: string[];
  createdAt: string;
}

export default function HistoryPage() {
  const { user, isGuest } = useAuth();
  const userName = user?.name || "User";
  const token = getAuthToken();

  const { data: sessions, isLoading } = useQuery<WorkoutSession[]>({
    queryKey: ["/api/sessions"],
    queryFn: async () => {
      if (!token) return [];
      const res = await fetch("/api/sessions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch sessions");
      return res.json();
    },
    enabled: !!token && !isGuest,
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const history = sessions || [];

  return (
    <div className="min-h-screen bg-background" data-testid="page-history">
      <NavHeader userName={userName} />

      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Workout History</h1>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
        ) : history.length > 0 ? (
          <div className="space-y-4">
            {history.map((workout, index) => (
              <Card
                key={workout.id}
                className="p-4 hover-elevate"
                data-testid={`card-history-${workout.id}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                      <Layers className="w-6 h-6 text-accent-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(workout.createdAt)}</span>
                      </div>
                      <p className="font-semibold mt-1">
                        {workout.cardsCompleted} cards completed
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-muted-foreground text-sm">
                      <Clock className="w-4 h-4" />
                      <span>{workout.totalTime.replace("m:", ":").replace("s:", "").replace("ms", "")}</span>
                    </div>
                    <p className="text-sm text-orange-500 font-medium mt-1">
                      Session #{history.length - index}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No workout history yet.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Complete your first workout to see it here!
            </p>
          </Card>
        )}

        {isGuest && (
          <Card className="p-8 text-center mt-6 border-primary/20 bg-primary/5">
            <p className="text-muted-foreground">
              Sign up to save your workout history and track your progress!
            </p>
          </Card>
        )}
      </main>
    </div>
  );
}
