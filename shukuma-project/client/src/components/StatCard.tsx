import { Card } from "@/components/ui/card";
import { Flame, Layers, Calendar, TrendingUp, type LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: "streak" | "cards" | "workout" | "reps" | LucideIcon;
  label: string;
  value: string | number;
  color?: "orange" | "blue" | "yellow" | "green";
}

const iconMap = {
  streak: Flame,
  cards: Layers,
  workout: Calendar,
  reps: TrendingUp,
};

const colorClasses = {
  orange: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
  blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  yellow: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
  green: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
};

export default function StatCard({ icon, label, value, color = "orange" }: StatCardProps) {
  const Icon = typeof icon === "string" ? iconMap[icon] : icon;

  return (
    <Card className="flex items-center gap-3 p-4" data-testid={`stat-card-${label.toLowerCase().replace(/\s+/g, "-")}`}>
      <div className={`rounded-full p-3 ${colorClasses[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground uppercase tracking-wide">{label}</span>
        <span className="text-lg font-bold">{value}</span>
      </div>
    </Card>
  );
}
