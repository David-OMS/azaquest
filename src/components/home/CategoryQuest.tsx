import Link from "next/link";
import type { Category } from "@/types/product";

interface CategoryQuestProps {
  categories: Category[];
}

export function CategoryQuest({ categories }: CategoryQuestProps) {
  const featured = categories.slice(0, 8);

  return (
    <section className="border-t border-border px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex items-end justify-between">
          <h2 className="font-display text-2xl font-bold tracking-[0.12em] text-foreground md:text-3xl">
            SHOP BY CATEGORY
          </h2>
          <Link
            href="/shop"
            className="font-display text-xs tracking-[0.35em] text-muted transition-colors hover:text-foreground"
          >
            VIEW ALL
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {featured.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className="group border border-border px-4 py-8 text-center transition-colors hover:border-foreground hover:bg-foreground hover:text-background md:py-10"
            >
              <span className="font-display text-sm font-semibold tracking-[0.2em] md:text-base">
                {cat.name.toUpperCase()}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
