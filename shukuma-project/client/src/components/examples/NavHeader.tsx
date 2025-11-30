import NavHeader from "../NavHeader";

export default function NavHeaderExample() {
  return (
    <div className="space-y-4">
      <NavHeader userName="Feroza" />
      <NavHeader variant="simple" />
    </div>
  );
}
