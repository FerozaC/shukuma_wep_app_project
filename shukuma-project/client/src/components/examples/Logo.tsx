import Logo from "../Logo";

export default function LogoExample() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <Logo size="sm" />
      <Logo size="md" />
      <Logo size="lg" />
      <Logo size="md" showText={false} />
    </div>
  );
}
