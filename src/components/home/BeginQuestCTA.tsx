import Link from "next/link";

export function BeginQuestCTA() {
  return (
    <Link
      href="/shop"
      className="group inline-flex items-center gap-4 border border-foreground bg-foreground px-12 py-4 font-display text-sm font-semibold tracking-[0.45em] text-background transition-all hover:bg-transparent hover:text-foreground md:text-base"
    >
      FIND YOURS.
      <span className="text-lg transition-transform group-hover:translate-x-1">→</span>
    </Link>
  );
}
