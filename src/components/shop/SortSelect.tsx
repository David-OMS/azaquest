import { SORT_OPTIONS, type SortOption } from "@/types/filters";

interface SortSelectProps {
  value: SortOption;
  onChange: (sort: SortOption) => void;
}

export function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <fieldset>
      <legend className="mb-3 text-xs text-muted">Sort</legend>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="w-full border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-foreground"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </fieldset>
  );
}
