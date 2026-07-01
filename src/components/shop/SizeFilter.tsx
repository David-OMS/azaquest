import { SIZE_OPTIONS } from "@/types/filters";

interface SizeFilterProps {
  selected: string[];
  onChange: (sizes: string[]) => void;
}

export function SizeFilter({ selected, onChange }: SizeFilterProps) {
  const toggle = (size: string) => {
    const next = selected.includes(size)
      ? selected.filter((s) => s !== size)
      : [...selected, size];
    onChange(next);
  };

  return (
    <fieldset>
      <legend className="mb-3 text-xs text-muted">Size</legend>
      <div className="flex flex-wrap gap-2">
        {SIZE_OPTIONS.map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => toggle(size)}
            className={`border px-3 py-1 text-xs transition-colors ${
              selected.includes(size)
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted hover:border-foreground hover:text-foreground"
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
