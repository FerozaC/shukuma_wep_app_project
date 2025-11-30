import ExerciseCard from "../ExerciseCard";

export default function ExerciseCardExample() {
  return (
    <div className="p-8 bg-background min-h-[400px] flex items-center justify-center">
      <ExerciseCard
        id="1"
        name="Jumping Jacks"
        level="Medium"
        cardNumber={7}
        onFlip={() => console.log("Card flipped")}
      />
    </div>
  );
}
