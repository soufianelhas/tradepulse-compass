import { Skeleton } from "@/components/ui/skeleton";

export function PanelSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3" role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">Loading signals</span>
      <Skeleton className="h-4 w-40 bg-surface-hover" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full bg-surface-hover" />
      ))}
    </div>
  );
}

export function PanelError({
  message = "Signal feed unavailable.",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div role="alert" className="rounded-md border border-border bg-canvas p-4">
      <p className="text-xs text-signal-rose">{message}</p>
      <p className="mt-1 text-[11px] text-muted-foreground">
        The upstream data source did not respond. Retry to re-run this request.
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 inline-flex min-h-9 items-center rounded-md border border-border-strong bg-surface px-3 text-xs font-medium text-foreground transition-colors hover:border-cyan hover:text-cyan"
        >
          Retry
        </button>
      )}
    </div>
  );
}
