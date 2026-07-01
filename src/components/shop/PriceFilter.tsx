import { PRICE_BUCKETS, type PriceBucket } from "@/types/filters";

interface PriceFilterProps {
  selected: PriceBucket | null;
  onChange: (bucket: PriceBucket | null) => void;
}

export function PriceFilter({ selected, onChange }: PriceFilterProps) {
  return (
    <fieldset>
      <legend className="mb-3 text-xs text-muted">Price</legend>
      <ul className="space-y-2">
        {PRICE_BUCKETS.map((bucket) => (
          <li key={bucket.value}>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
              <input
                type="radio"
                name="price"
                checked={selected === bucket.value}
                onChange={() =>
                  onChange(selected === bucket.value ? null : bucket.value)
                }
                className="h-3.5 w-3.5 accent-foreground"
              />
              {bucket.label}
            </label>
          </li>
        ))}
      </ul>
    </fieldset>
  );
}
