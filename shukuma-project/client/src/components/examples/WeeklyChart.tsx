import WeeklyChart from "../WeeklyChart";

// todo: remove mock functionality
const mockWeekData = [
  { day: "Mon", cards: 5 },
  { day: "Tue", cards: 7 },
  { day: "Wed", cards: 10 },
  { day: "Thu", cards: 6 },
  { day: "Fri", cards: 8 },
  { day: "Sat", cards: 7 },
  { day: "Sun", cards: 4 },
];

export default function WeeklyChartExample() {
  return (
    <div className="p-4 max-w-xl">
      <WeeklyChart data={mockWeekData} totalCards={35} percentChange={5} />
    </div>
  );
}
