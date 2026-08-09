import { useMemo, useState } from "react";
import { MARKETS, signum, type Market } from "@/lib/tradepulse-data";

const W = 720;
const H = 460;
const PAD = { top: 28, right: 24, bottom: 44, left: 56 };

export function SignalMatrix({
  markets,
  highlightId,
  onHover,
  onSelect,
}: {
  markets: Market[];
  highlightId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (m: Market) => void;
}) {
  const [tip, setTip] = useState<{ m: Market; x: number; y: number } | null>(null);

  const scale = useMemo(() => {
    const xs = MARKETS.map((m) => m.teuVolume);
    const ys = MARKETS.map((m) => m.searchVelocity);
    const xMin = Math.min(...xs) - 8;
    const xMax = Math.max(...xs) + 8;
    const yMin = Math.min(...ys) - 15;
    const yMax = Math.max(...ys) + 15;
    return {
      x: (v: number) => PAD.left + ((v - xMin) / (xMax - xMin)) * (W - PAD.left - PAD.right),
      y: (v: number) => H - PAD.bottom - ((v - yMin) / (yMax - yMin)) * (H - PAD.top - PAD.bottom),
    };
  }, []);

  const x0 = scale.x(0);
  const y0 = scale.y(0);

  return (
    <section className="panel relative flex min-w-0 flex-col p-4" aria-label="Bivariate signal matrix">
      <header className="mb-3">
        <h2 className="text-sm font-semibold">Bivariate Signal Matrix</h2>
        <p className="text-xs text-muted-foreground">
          Real-time search intent vs official inbound manifest supply
        </p>
      </header>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label="Scatter plot of destination countries by search velocity growth and inbound manifest TEU growth"
      >
        <rect
          x={PAD.left}
          y={PAD.top}
          width={x0 - PAD.left}
          height={y0 - PAD.top}
          fill="var(--color-green-bg)"
        />
        <rect
          x={x0}
          y={PAD.top}
          width={W - PAD.right - x0}
          height={y0 - PAD.top}
          fill="var(--color-amber-bg)"
        />
        <rect
          x={x0}
          y={y0}
          width={W - PAD.right - x0}
          height={H - PAD.bottom - y0}
          fill="var(--color-rose-bg)"
        />

        {[PAD.left, W - PAD.right].map((x) => (
          <line key={x} x1={x} y1={PAD.top} x2={x} y2={H - PAD.bottom} stroke="var(--border-subtle)" />
        ))}
        {[PAD.top, H - PAD.bottom].map((y) => (
          <line key={y} x1={PAD.left} y1={y} x2={W - PAD.right} y2={y} stroke="var(--border-subtle)" />
        ))}
        <line x1={x0} y1={PAD.top} x2={x0} y2={H - PAD.bottom} stroke="var(--border-strong)" strokeDasharray="4 4" />
        <line x1={PAD.left} y1={y0} x2={W - PAD.right} y2={y0} stroke="var(--border-strong)" strokeDasharray="4 4" />

        <text x={PAD.left + 10} y={PAD.top + 18} fontSize="11" fill="var(--color-green-text)">
          Unmet Market Demand
        </text>
        <text x={W - PAD.right - 10} y={PAD.top + 18} fontSize="11" textAnchor="end" fill="var(--color-amber-text)">
          High Growth / Competitive
        </text>
        <text x={W - PAD.right - 10} y={H - PAD.bottom - 10} fontSize="11" textAnchor="end" fill="var(--color-rose-text)">
          Inventory Glut / Over-Supply
        </text>

        <text x={W / 2} y={H - 10} fontSize="11" textAnchor="middle" fill="var(--text-muted)">
          Inbound Manifest Growth Rate (% TEUs)
        </text>
        <text
          x={-H / 2}
          y={16}
          fontSize="11"
          textAnchor="middle"
          transform="rotate(-90)"
          fill="var(--text-muted)"
        >
          Search Velocity Growth Rate (%)
        </text>

        {markets.map((m) => {
          const active = highlightId === m.id;
          return (
            <g key={m.id}>
              <circle
                cx={scale.x(m.teuVolume)}
                cy={scale.y(m.searchVelocity)}
                r={active ? 11 : 7}
                fill={active ? "var(--accent-cyan)" : "var(--accent-brand)"}
                stroke={active ? "var(--text-main)" : "transparent"}
                strokeWidth={2}
                className="cursor-pointer transition-all"
                tabIndex={0}
                role="button"
                aria-label={`${m.country}: search velocity ${signum(m.searchVelocity)} percent, TEU growth ${signum(m.teuVolume)} percent`}
                onMouseEnter={() =>
                  setTip({ m, x: scale.x(m.teuVolume), y: scale.y(m.searchVelocity) })
                }
                onMouseLeave={() => setTip(null)}
                onFocus={() => {
                  onHover(m.id);
                  setTip({ m, x: scale.x(m.teuVolume), y: scale.y(m.searchVelocity) });
                }}
                onBlur={() => setTip(null)}
                onPointerEnter={() => onHover(m.id)}
                onPointerLeave={() => onHover(null)}
                onClick={() => onSelect(m)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelect(m);
                  }
                }}
              />
              <text
                x={scale.x(m.teuVolume)}
                y={scale.y(m.searchVelocity) - 14}
                fontSize="10"
                textAnchor="middle"
                fill="var(--text-muted)"
                className="pointer-events-none"
              >
                {m.country}
              </text>
            </g>
          );
        })}
      </svg>

      {tip && (
        <div
          className="pointer-events-none absolute z-10 w-56 rounded-md border border-border-strong bg-surface p-3 text-xs shadow-[var(--shadow-panel)]"
          style={{ left: `${(tip.x / W) * 100}%`, top: `${(tip.y / H) * 88 + 6}%` }}
        >
          <p className="mb-2 font-semibold">
            {tip.m.flag} {tip.m.country}
          </p>
          <dl className="space-y-1 text-muted-foreground">
            <div className="flex justify-between gap-3">
              <dt>30d Search Growth</dt>
              <dd className="num text-signal-green">{signum(tip.m.searchVelocity)}%</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt>60d TEU Volume</dt>
              <dd className="num text-foreground">{signum(tip.m.teuVolume)}%</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt>Out-of-Stock Rate</dt>
              <dd className="num text-foreground">{tip.m.stockoutRate.toFixed(1)}%</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt>Bilateral Tariff</dt>
              <dd className="num text-foreground">{tip.m.tariffRate.toFixed(1)}%</dd>
            </div>
          </dl>
        </div>
      )}
    </section>
  );
}
