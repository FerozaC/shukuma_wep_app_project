import { Card } from "@/components/ui/card";
import { ChevronUp } from "lucide-react";
import cardBackImage from "@/assets/cards/Shukuma Cards_Full Deck_1.jpg";

interface DeckCardProps {
  isShuffled?: boolean;
  onPull?: () => void;
}

export default function DeckCard({ isShuffled = false, onPull }: DeckCardProps) {
  return (
    <div className="relative w-64 mx-auto">
      {/* Shadow cards behind */}
      <div className="absolute -left-2 -top-2 w-full h-full">
        <Card className="w-full h-80 bg-sky-200 dark:bg-sky-900 rounded-xl border-2 border-sky-300 dark:border-sky-700" />
      </div>
      <div className="absolute -left-1 -top-1 w-full h-full">
        <Card className="w-full h-80 bg-sky-100 dark:bg-sky-800 rounded-xl border-2 border-sky-200 dark:border-sky-600" />
      </div>

      {/* Main card */}
      <Card
        className="relative w-full h-80 overflow-hidden rounded-xl cursor-pointer hover-elevate"
        onClick={onPull}
        data-testid="button-pull-card"
      >
        <img
          src={cardBackImage}
          alt="Exercise deck"
          className="w-full h-full object-cover"
        />
        {isShuffled && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <div className="flex flex-col items-center text-white">
              <ChevronUp className="w-6 h-6 animate-bounce" />
              <span className="text-sm font-medium">Pull Card</span>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
