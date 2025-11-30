import HeroCard from "../HeroCard";

export default function HeroCardExample() {
  return (
    <div className="p-4 max-w-2xl">
      <HeroCard onStartWorkout={() => console.log("Start workout clicked")} />
    </div>
  );
}
