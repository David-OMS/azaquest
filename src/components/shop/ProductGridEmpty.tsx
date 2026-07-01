interface ProductGridEmptyProps {
  title: string;
  description?: string;
}

export function ProductGridEmpty({ title, description }: ProductGridEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="text-lg font-medium tracking-wide text-foreground">{title}</p>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-muted">{description}</p>
      )}
    </div>
  );
}
