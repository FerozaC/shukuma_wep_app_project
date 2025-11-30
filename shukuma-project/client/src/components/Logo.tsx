// Logo image not found; using styled text placeholder.

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-16 h-16",
};

const textSizeClasses = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-3xl",
};

export default function Logo({ size = "md", showText = true }: LogoProps) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`${sizeClasses[size]} rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold`}
        data-testid="img-logo"
        aria-label="Shukuma logo"
      >
        S
      </div>
      {showText && (
        <span
          className={`font-bold ${textSizeClasses[size]} text-foreground`}
          data-testid="text-logo-name"
        >
          Shukuma
        </span>
      )}
    </div>
  );
}
