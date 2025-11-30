import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface SessionSummaryProps {
  userName: string;
  cardsCompleted: number;
  totalTime: string;
  onBackToDashboard?: () => void;
  onPublishReview?: (review: string) => void;
}

export default function SessionSummary({
  userName,
  cardsCompleted,
  totalTime,
  onBackToDashboard,
  onPublishReview,
}: SessionSummaryProps) {
  const [review, setReview] = useState("");

  const handlePublish = () => {
    onPublishReview?.(review);
    console.log("Review published:", review);
  };

  return (
    <div className="max-w-lg mx-auto space-y-6" data-testid="session-summary">
      <h1 className="text-2xl font-bold text-center">End of Workout</h1>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-green-600 font-medium">Progress</span>
            <span className="font-medium">100%</span>
          </div>
          <Progress value={100} className="h-2 bg-green-100 [&>div]:bg-green-500" />

          <div className="pt-4">
            <h2 className="text-2xl font-bold">Well Done {userName}!</h2>
            <div className="mt-4 space-y-1">
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">Cards Completed:</span>{" "}
                {cardsCompleted}
              </p>
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">Time:</span> {totalTime}
              </p>
            </div>
            <p className="mt-4 text-muted-foreground">
              Thank you for trying out <span className="font-semibold text-foreground">Shukuma</span>
            </p>
          </div>

          <Button
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-full font-semibold"
            data-testid="button-purchase-deck"
          >
            PURCHASE THE DECK
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-bold mb-2">Review</h3>
        <p className="text-muted-foreground text-sm mb-4">How was your experience?</p>
        <Textarea
          placeholder="Share your thoughts..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
          className="min-h-24 resize-none"
          data-testid="input-review"
        />
        <Button
          onClick={handlePublish}
          className="w-full mt-4 bg-accent text-accent-foreground hover:bg-accent/90 rounded-full font-semibold"
          data-testid="button-publish-review"
        >
          PUBLISH
        </Button>
      </Card>

      <Button
        variant="outline"
        onClick={onBackToDashboard}
        className="w-full rounded-full"
        data-testid="button-back-dashboard"
      >
        Back to Dashboard
      </Button>
    </div>
  );
}
