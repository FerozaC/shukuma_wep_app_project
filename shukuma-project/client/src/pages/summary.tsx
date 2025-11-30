import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import NavHeader from "@/components/NavHeader";
import SessionSummary from "@/components/SessionSummary";
import { useAuth, getAuthToken } from "@/lib/auth-context";
import { queryClient } from "@/lib/queryClient";

export default function SummaryPage() {
  const [, setLocation] = useLocation();
  const { user, isGuest } = useAuth();
  const token = getAuthToken();
  const [sessionData, setSessionData] = useState({
    cardsCompleted: 0,
    totalTime: "00m:00s:00ms",
  });
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("workoutSession");
    if (stored) {
      const data = JSON.parse(stored);
      setSessionData(data);
      if (data.sessionId) {
        setSessionId(data.sessionId);
      }
    }
  }, []);

  const reviewMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!token || !sessionId) {
        throw new Error("Cannot save review without authentication");
      }
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sessionId, content }),
      });
      if (!res.ok) throw new Error("Failed to save review");
      return res.json();
    },
  });

  const userName = user?.name || "Guest";

  const handlePublishReview = async (review: string) => {
    if (token && sessionId && !isGuest) {
      try {
        await reviewMutation.mutateAsync(review);
      } catch (error) {
        console.error("Failed to save review:", error);
      }
    }
    sessionStorage.removeItem("workoutSession");
    setLocation("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background" data-testid="page-summary">
      <NavHeader variant="simple" />

      <main className="max-w-lg mx-auto px-4 py-8">
        <SessionSummary
          userName={userName}
          cardsCompleted={sessionData.cardsCompleted}
          totalTime={sessionData.totalTime}
          onBackToDashboard={() => {
            sessionStorage.removeItem("workoutSession");
            setLocation("/dashboard");
          }}
          onPublishReview={handlePublishReview}
        />
      </main>
    </div>
  );
}
