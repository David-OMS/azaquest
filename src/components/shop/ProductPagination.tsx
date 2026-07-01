interface ProductPaginationProps {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

export function ProductPagination({ page, pageCount, onPageChange }: ProductPaginationProps) {
  if (pageCount <= 1) return null;

  return (
    <div className="mt-10 flex items-center justify-center gap-3">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 0}
        aria-label="Previous page"
        className="border border-border px-3 py-1.5 text-xs tracking-wider text-muted hover:border-white hover:text-foreground disabled:opacity-30 disabled:hover:border-border disabled:hover:text-muted"
      >
        ←
      </button>
      <span className="min-w-[4rem] text-center text-xs tabular-nums text-muted">
        {page + 1} / {pageCount}
      </span>
      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= pageCount - 1}
        aria-label="Next page"
        className="border border-border px-3 py-1.5 text-xs tracking-wider text-muted hover:border-white hover:text-foreground disabled:opacity-30 disabled:hover:border-border disabled:hover:text-muted"
      >
        →
      </button>
    </div>
  );
}
