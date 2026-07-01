import type { Category } from "@/types/product";
import { isWaistLengthCategory } from "@/lib/product-size";

interface ProductSizeFieldsProps {
  categories: Category[];
  categoryId: string;
  size: string;
  waist: string;
  length: string;
  onSizeChange: (value: string) => void;
  onWaistChange: (value: string) => void;
  onLengthChange: (value: string) => void;
  inputClassName?: string;
}

export function ProductSizeFields({
  categories,
  categoryId,
  size,
  waist,
  length,
  onSizeChange,
  onWaistChange,
  onLengthChange,
  inputClassName = "w-full border border-border bg-surface px-3 py-3 text-sm outline-none focus:border-white",
}: ProductSizeFieldsProps) {
  const category = categories.find((c) => c.id === categoryId);

  if (isWaistLengthCategory(category?.slug)) {
    return (
      <div className="grid grid-cols-2 gap-3">
        <input
          required
          inputMode="decimal"
          value={waist}
          onChange={(e) => onWaistChange(e.target.value)}
          placeholder="Waist (32)"
          className={inputClassName}
        />
        <input
          required
          inputMode="decimal"
          value={length}
          onChange={(e) => onLengthChange(e.target.value)}
          placeholder="Length (30)"
          className={inputClassName}
        />
      </div>
    );
  }

  return (
    <input
      value={size}
      onChange={(e) => onSizeChange(e.target.value)}
      placeholder="Size (XL, M...)"
      className={inputClassName}
    />
  );
}
