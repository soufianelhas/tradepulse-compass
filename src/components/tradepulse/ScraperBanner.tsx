import { useEffect, useState } from "react";
import { Check, Loader2, X } from "lucide-react";

const STEPS = [
  "Official Customs API Ingested",
  "Pre-Border Manifests Streamed",
  "Scraping Local Marketplace Stock",
];

export function ScraperBanner({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(6);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) return 100;
        return Math.min(100, p + Math.random() * 9);
      });
    }, 320);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const t = setTimeout(() => {
        setDismissed(true);
        onComplete();
      }, 700);
      return () => clearTimeout(t);
    }
  }, [progress, onComplete]);

  if (dismissed) return null;

  const done = [progress > 22, progress > 55, progress >= 100];

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-auto fixed inset-x-3 bottom-3 z-50 mx-auto max-w-3xl rounded-lg border border-border-strong bg-surface p-3 shadow-[var(--shadow-panel)]"
    >
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-foreground">Background scraper job running</p>
          <ul className="mt-2 space-y-1.5">
            {STEPS.map((s, i) => (
              <li key={s} className="flex items-center gap-2 text-xs">
                {done[i] ? (
                  <Check className="h-3.5 w-3.5 shrink-0 text-signal-green" aria-hidden="true" />
                ) : (
                  <Loader2
                    className="h-3.5 w-3.5 shrink-0 animate-spin text-cyan"
                    aria-hidden="true"
                  />
                )}
                <span className={done[i] ? "text-muted-foreground" : "text-foreground"}>
                  {s}
                  {i === 2 && !done[2] && (
                    <span className="num text-cyan"> ({Math.round(progress)}%)</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
          <div
            className="mt-2.5 h-1 w-full overflow-hidden rounded-full bg-surface-hover"
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Scraper job progress"
          >
            <div
              className="h-full rounded-full transition-[width] duration-300"
              style={{ width: `${progress}%`, background: "var(--gradient-brand)" }}
            />
          </div>
        </div>
        <button
          type="button"
          aria-label="Dismiss scraper progress banner"
          onClick={() => {
            setDismissed(true);
            onComplete();
          }}
          className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-muted-foreground hover:bg-surface-hover hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
