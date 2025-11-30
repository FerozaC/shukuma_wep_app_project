import SessionSummary from "../SessionSummary";

export default function SessionSummaryExample() {
  return (
    <div className="p-8 bg-background">
      <SessionSummary
        userName="Feroza"
        cardsCompleted={52}
        totalTime="00m:25s:16ms"
        onBackToDashboard={() => console.log("Back to dashboard")}
        onPublishReview={(review) => console.log("Review:", review)}
      />
    </div>
  );
}
