import { Card } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface DayData {
  day: string;
  cards: number;
}

interface WeeklyChartProps {
  data: DayData[];
  totalCards: number;
  percentChange: number;
}

export default function WeeklyChart({ data, totalCards, percentChange }: WeeklyChartProps) {
  const maxCards = Math.max(...data.map((d) => d.cards), 1);

  return (
    <Card className="p-6" data-testid="card-weekly-chart">
      <h3 className="text-lg font-bold mb-4">Your Week in Review</h3>
      <div className="flex items-end justify-between mb-2">
        <div>
          <span className="text-sm text-muted-foreground">Cards Completed</span>
          <p className="text-3xl font-bold">{totalCards} Cards</p>
        </div>
        <div className="flex items-center gap-1 text-green-600">
          <span className="text-sm">vs. Last Week</span>
          <span className="font-semibold">+{percentChange}%</span>
          <TrendingUp className="w-4 h-4" />
        </div>
      </div>
      <div className="flex items-end justify-between gap-2 h-32 mt-6">
        {data.map((day, index) => {
          const height = (day.cards / maxCards) * 100;
          const isHighest = day.cards === maxCards;
          return (
            <div key={day.day} className="flex flex-col items-center flex-1 gap-2">
              <div
                className={`w-full rounded-t-md transition-all ${
                  isHighest ? "bg-accent" : "bg-accent/50"
                }`}
                style={{ height: `${Math.max(height, 8)}%` }}
                data-testid={`bar-day-${index}`}
              />
              <span
                className={`text-xs ${isHighest ? "font-bold" : "text-muted-foreground"}`}
              >
                {day.day}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
