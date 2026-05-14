export function SectionHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-3xl space-y-3">
      <h2 className="text-2xl font-bold text-[var(--foreground)] sm:text-3xl">{title}</h2>
      <p className="text-base leading-7 text-[var(--muted)]">{description}</p>
    </div>
  );
}
