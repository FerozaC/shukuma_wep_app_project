import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import NavHeader from "@/components/NavHeader";
import DeckCard from "@/components/DeckCard";
import ExerciseCard from "@/components/ExerciseCard";
import breakImg1 from "@/assets/cards/Waterbreak1.jpg";
import breakImg2 from "@/assets/cards/Waterbreak2.jpg";

// Tweakable settings
const BREAK_FREQUENCY = 2; // insert a break after every N exercises
const BREAK_MESSAGES = [
  "Hydrate & breathe",
  "Stretch your muscles",
  "Roll shoulders, loosen neck",
  "Inhale 4s, exhale 4s",
];
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { getAuthToken, useAuth } from "@/lib/auth-context";
import { queryClient, apiRequest } from "@/lib/queryClient";

interface Exercise {
  id: string;
  name: string;
  level: "Easy" | "Medium" | "Hard";
  cardNumber: number;
}

type WorkoutItem =
  | ({ type: "exercise" } & Exercise)
  | ({ type: "break"; image: string; label: string });

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function WorkoutPage() {
  const [, setLocation] = useLocation();
  const { isGuest, refreshUser } = useAuth();
  const [items, setItems] = useState<WorkoutItem[]>([]);
  const [isShuffled, setIsShuffled] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(-1);
  const [completedCards, setCompletedCards] = useState(0);
  const [startTime] = useState(Date.now());

  const token = getAuthToken();

  const { data: exerciseData, isLoading } = useQuery<Exercise[]>({
    queryKey: ["/api/exercises"],
    queryFn: async () => {
      const res = await fetch("/api/exercises");
      if (!res.ok) throw new Error("Failed to fetch exercises");
      return res.json();
    },
  });

  useEffect(() => {
    if (exerciseData) {
      const base = exerciseData.slice(0, 8); // use up to 8 to allow more breaks
      // Shuffle helper
      const shuffled = shuffleArray(base);
      const withBreaks: WorkoutItem[] = [];
      for (let i = 0; i < shuffled.length; i++) {
        withBreaks.push({ type: "exercise", ...shuffled[i] });
        // Insert a break after configured frequency, except after the last item
        if ((i + 1) % BREAK_FREQUENCY === 0 && i !== shuffled.length - 1) {
          const img = ((i + 1) / BREAK_FREQUENCY) % 2 === 0 ? breakImg2 : breakImg1;
          const msgIndex = ((i + 1) / BREAK_FREQUENCY) % BREAK_MESSAGES.length;
          withBreaks.push({ type: "break", image: img, label: BREAK_MESSAGES[msgIndex] });
        }
      }
      setItems(withBreaks);
    }
  }, [exerciseData]);

  const saveSessionMutation = useMutation({
    mutationFn: async (sessionData: { cardsCompleted: number; totalTime: string; cards: string[] }) => {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(sessionData),
      });
      if (!res.ok) throw new Error("Failed to save session");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/sessions"] });
      refreshUser();
    },
  });

  const shuffleDeck = () => {
    if (exerciseData) {
      const base = exerciseData.slice(0, 8);
      const shuffled = shuffleArray(base);
      const withBreaks: WorkoutItem[] = [];
      for (let i = 0; i < shuffled.length; i++) {
        withBreaks.push({ type: "exercise", ...shuffled[i] });
        if ((i + 1) % BREAK_FREQUENCY === 0 && i !== shuffled.length - 1) {
          const img = ((i + 1) / BREAK_FREQUENCY) % 2 === 0 ? breakImg2 : breakImg1;
          const msgIndex = ((i + 1) / BREAK_FREQUENCY) % BREAK_MESSAGES.length;
          withBreaks.push({ type: "break", image: img, label: BREAK_MESSAGES[msgIndex] });
        }
      }
      setItems(withBreaks);
    }
    setIsShuffled(true);
  };

  const pullCard = () => {
    if (currentCardIndex < items.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  const completeCard = async () => {
    const current = items[currentCardIndex];
    // Only count exercises towards completion
    const nextCompleted = completedCards + (current?.type === "exercise" ? 1 : 0);
    setCompletedCards(nextCompleted);
    if (currentCardIndex < items.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      const elapsed = Date.now() - startTime;
      const minutes = Math.floor(elapsed / 60000);
      const seconds = Math.floor((elapsed % 60000) / 1000);
      const ms = Math.floor((elapsed % 1000) / 10);
      const timeString = `${minutes.toString().padStart(2, "0")}m:${seconds
        .toString()
        .padStart(2, "0")}s:${ms.toString().padStart(2, "0")}ms`;

      const sessionData = {
        cardsCompleted: nextCompleted,
        totalTime: timeString,
        cards: items.filter((i) => i.type === "exercise").map((e: any) => e.name),
      };

      sessionStorage.setItem("workoutSession", JSON.stringify(sessionData));

      if (token && !isGuest) {
        try {
          await saveSessionMutation.mutateAsync(sessionData);
        } catch (error) {
          console.error("Failed to save session:", error);
        }
      }
      
      setLocation("/summary");
    }
  };

  const currentItem = items[currentCardIndex];
  const totalExercises = items.filter((i) => i.type === "exercise").length;
  const progress = totalExercises > 0 ? (completedCards / totalExercises) * 100 : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background" data-testid="page-workout">
        <NavHeader variant="simple" />
        <main className="max-w-lg mx-auto px-4 py-8">
          <Skeleton className="h-8 w-48 mx-auto mb-4" />
          <Skeleton className="h-4 w-64 mx-auto mb-8" />
          <Skeleton className="h-80 w-full rounded-xl" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen" data-testid="page-workout">
      <NavHeader variant="simple" />

      <main className="max-w-lg mx-auto px-4 py-8">
        {currentCardIndex === -1 ? (
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Ready to Move?</h1>
            <p className="text-muted-foreground mb-8">
              Click the button below to shuffle the deck and discover your next
              exercise. Let's get started!
            </p>

            <Button
              onClick={shuffleDeck}
              disabled={isShuffled}
              className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-12 py-6 text-lg font-semibold mb-8"
              data-testid="button-shuffle"
            >
              Shuffle Deck
            </Button>

            {isShuffled && (
              <>
                <p className="text-muted-foreground mb-2">OR</p>
                <h2 className="text-xl font-bold mb-2">Deck is Shuffled!</h2>
                <p className="text-muted-foreground mb-6">
                  Drag up to pull your card
                </p>
              </>
            )}

            <DeckCard isShuffled={isShuffled} onPull={pullCard} />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Card {currentCardIndex + 1} of {items.length}
                </span>
                <span className="font-medium">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {currentItem?.type === "exercise" ? (
              <ExerciseCard
                id={(currentItem as any).id}
                name={(currentItem as any).name}
                level={(currentItem as any).level}
                cardNumber={(currentItem as any).cardNumber}
                onFlip={() => console.log("Card flipped")}
              />
            ) : (
              <div className="w-full max-w-xs mx-auto">
                <img src={(currentItem as any).image} alt="Break" className="w-full h-80 object-cover rounded-xl" />
                <p className="text-center mt-4 text-muted-foreground">{(currentItem as any).label}</p>
              </div>
            )}

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setLocation("/dashboard")}
                className="flex-1 rounded-full"
                data-testid="button-end-workout"
              >
                End Workout
              </Button>
              <Button
                onClick={completeCard}
                className="flex-1 rounded-full"
                data-testid="button-next-card"
              >
                {currentCardIndex === items.length - 1 ? "Complete" : "Next"}
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
