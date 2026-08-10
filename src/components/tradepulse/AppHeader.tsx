import { useEffect, useRef, useState } from "react";
import { Search, ChevronDown, LayoutGrid, User } from "lucide-react";

const ORIGINS = [
  { flag: "🇨🇳", name: "China" },
  { flag: "🇲🇽", name: "Mexico" },
  { flag: "🇻🇳", name: "Vietnam" },
  { flag: "🇮🇳", name: "India" },
  { flag: "🇲🇦", name: "Morocco" },
];
const CURRENCIES = ["USD", "EUR", "GBP", "MAD"];

function Selector({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">{label}</span>
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="num appearance-none rounded-md border border-border bg-surface py-1.5 pr-7 pl-2.5 text-xs text-foreground transition-colors hover:bg-surface-hover"
      >
        {options.map((o) => (
          <option key={o} value={o} className="bg-surface">
            {o}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 h-3.5 w-3.5 text-muted-foreground" />
    </label>
  );
}

export function AppHeader({
  origin,
  onOriginChange,
  currency,
  onCurrencyChange,
  query,
  onQueryChange,
}: {
  origin: string;
  onOriginChange: (v: string) => void;
  currency: string;
  onCurrencyChange: (v: string) => void;
  query: string;
  onQueryChange: (v: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad/.test(navigator.platform));
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-canvas/95 backdrop-blur supports-[backdrop-filter]:bg-canvas/80">
      <div className="mx-auto grid max-w-[1600px] grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-6">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="live-dot shrink-0" aria-hidden="true" />
          <span className="truncate text-sm font-semibold tracking-tight">TradePulse AI</span>
          <span className="sr-only">Live data stream active</span>
        </div>

        <div className="order-3 col-span-2 lg:order-none lg:col-span-1">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              aria-label="Command search: product or HS code"
              placeholder="Type product or HS code (e.g., 'Foldable Electric Wagons' or '8716.80')..."
              className="h-10 w-full rounded-md border border-border bg-surface pr-20 pl-9 text-sm text-foreground placeholder:text-muted-foreground focus:border-cyan focus:outline-none"
            />
            <kbd className="num pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 rounded border border-border-strong bg-surface-hover px-1.5 py-0.5 text-[10px] text-muted-foreground">
              {isMac ? "⌘" : "Ctrl"}+K
            </kbd>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          <Selector
            label="Export origin"
            value={origin}
            options={ORIGINS.map((o) => `${o.flag} ${o.name}`)}
            onChange={onOriginChange}
          />
          <Selector
            label="Currency"
            value={currency}
            options={CURRENCIES}
            onChange={onCurrencyChange}
          />
          <span className="signal-green num hidden rounded-full px-2.5 py-1 text-[11px] md:inline-flex md:items-center md:gap-1.5">
            <span className="live-dot" aria-hidden="true" />
            Manifests: Live
          </span>
          <button
            type="button"
            aria-label="Switch workspace"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-border bg-surface text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="User profile menu"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-border bg-surface text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
          >
            <User className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
