import StatCard from "../StatCard";

export default function StatCardExample() {
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      <StatCard icon="streak" label="Current Streak" value="5 Days" color="orange" />
      <StatCard icon="cards" label="Total Cards" value="1,234" color="blue" />
      <StatCard icon="workout" label="Last Workout" value="Yesterday" color="yellow" />
      <StatCard icon="reps" label="Total Reps" value="24,680" color="green" />
    </div>
  );
}
