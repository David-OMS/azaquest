import type { Category } from "@/types/product";

interface CategoryFilterProps {
  categories: Category[];
  selected: string[];
  onChange: (slugs: string[]) => void;
}

export function CategoryFilter({ categories, selected, onChange }: CategoryFilterProps) {
  const toggle = (slug: string) => {
    const next = selected.includes(slug)
      ? selected.filter((s) => s !== slug)
      : [...selected, slug];
    onChange(next);
  };

  return (
    <fieldset>
      <legend className="mb-3 text-xs text-muted">Category</legend>
      <ul className="space-y-2">
        {categories.map((cat) => (
          <li key={cat.id}>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={selected.includes(cat.slug)}
                onChange={() => toggle(cat.slug)}
                className="h-3.5 w-3.5 accent-foreground"
              />
              {cat.name}
            </label>
          </li>
        ))}
      </ul>
    </fieldset>
  );
}
