import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ProfileHeaderProps {
  name: string;
  email: string;
}

export default function ProfileHeader({ name, email }: ProfileHeaderProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className="bg-primary text-primary-foreground p-8 flex flex-col items-center rounded-t-xl"
      data-testid="profile-header"
    >
      <Avatar className="w-20 h-20 border-4 border-primary-foreground/20">
        <AvatarFallback className="bg-orange-200 text-orange-800 text-2xl font-bold">
          {initials}
        </AvatarFallback>
      </Avatar>
      <h2 className="text-xl font-bold mt-4" data-testid="text-profile-name">
        {name}
      </h2>
      <p className="text-primary-foreground/80 text-sm" data-testid="text-profile-email">
        {email}
      </p>
    </div>
  );
}
