import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface HeroCardProps {
  onStartWorkout?: () => void;
}

export default function HeroCard({ onStartWorkout }: HeroCardProps) {
  return (
    <Card
      className="flex flex-col md:flex-row items-center gap-6 p-6 overflow-hidden"
      data-testid="card-hero"
    >
      <div className="w-40 h-40 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-amber-400 to-primary text-white flex items-center justify-center">
        <span className="text-3xl">🏃‍♂️</span>
      </div>
      <div className="flex-1 text-center md:text-left">
        <h2 className="text-xl font-bold mb-2">Ready for your next challenge?</h2>
        <p className="text-muted-foreground mb-4">
          Start a new workout and keep the momentum going!
        </p>
        <Button
          onClick={onStartWorkout}
          className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-6"
          data-testid="button-start-workout"
        >
          Start Workout
        </Button>
      </div>
    </Card>
  );
}
