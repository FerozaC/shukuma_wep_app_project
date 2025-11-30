import DeckCard from "../DeckCard";

export default function DeckCardExample() {
  return (
    <div className="p-8 bg-background flex items-center justify-center min-h-[420px]">
      <DeckCard isShuffled={true} onPull={() => console.log("Card pulled")} />
    </div>
  );
}
