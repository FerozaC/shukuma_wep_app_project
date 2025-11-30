import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import cardBackImage from "@/assets/cards/Shukuma Cards_Full Deck_1.jpg";

interface ExerciseCardProps {
  id: string;
  name: string;
  level: "Easy" | "Medium" | "Hard";
  cardNumber: number;
  suit?: "hearts" | "diamonds" | "clubs" | "spades";
  image?: string;
  onFlip?: () => void;
}

const levelColors = {
  Easy: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Medium: "bg-primary text-primary-foreground",
  Hard: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function ExerciseCard({
  id,
  name,
  level,
  cardNumber,
  image,
  onFlip,
}: ExerciseCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    onFlip?.();
  };

  return (
    <div
      className="perspective-1000 w-full max-w-xs mx-auto"
      data-testid={`exercise-card-${id}`}
    >
      <div
        className={`relative transition-transform duration-500 transform-style-preserve-3d ${
          isFlipped ? "rotate-y-180" : ""
        }`}
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front of card */}
        <Card
          className="p-6 relative overflow-visible"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex flex-col items-center text-primary">
              <span className="text-2xl font-bold">{cardNumber}</span>
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <Badge className={levelColors[level]}>{level}</Badge>
          </div>

          <div className="flex justify-center my-6">
            <div className="w-32 h-32 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center overflow-hidden">
              {image ? (
                <img src={image} alt={name} className="w-24 h-24 object-cover" />
              ) : (
                <div className="w-24 h-24 bg-muted rounded flex items-center justify-center text-muted-foreground text-xs">
                  Exercise
                </div>
              )}
            </div>
          </div>

          <h3 className="text-xl font-bold text-center mb-4">{name}</h3>

          <div className="flex justify-end">
            <div className="flex flex-col items-center text-primary rotate-180">
              <Heart className="w-4 h-4 fill-current" />
              <span className="text-lg font-bold">{cardNumber}</span>
            </div>
          </div>

          <Button
            onClick={handleFlip}
            className="w-full mt-4 bg-accent text-accent-foreground hover:bg-accent/90 rounded-full"
            data-testid="button-flip-card"
          >
            Flip Card
          </Button>
        </Card>

        {/* Back of card */}
        <Card
          className="absolute inset-0 p-0 overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <img
            src={cardBackImage}
            alt="Card back"
            className="w-full h-full object-cover"
          />
          <Button
            onClick={handleFlip}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-8"
            data-testid="button-flip-back"
          >
            Flip Card
          </Button>
        </Card>
      </div>
    </div>
  );
}
