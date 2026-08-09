import { TrendingUp, Clock, Ship, Percent } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface CardSpec {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  tone: "green" | "amber" | "rose" | "cyan";
}

const CARDS: CardSpec[] = [
  {
    label: "Top Search Intent Growth",
    value: "+142%",
    detail: "Mexico · 30d search velocity",
    icon: TrendingUp,
    tone: "green",
  },
  {
    label: "Pre-Border Inbound Lead Time",
    value: "+52 Days",
    detail: "Manifest lead vs official customs statistics",
    icon: Clock,
    tone: "cyan",
  },
  {
    label: "Inbound Supply Trend",
    value: "-4.1%",
    detail: "Veracruz ports · 60d TEU volume",
    icon: Ship,
    tone: "rose",
  },
  {
    label: "Best Bilateral Tariff Lane",
    value: "0%",
    detail: "CPTPP FTA · preferential duty rate",
    icon: Percent,
    tone: "amber",
  },
];

const toneText: Record<CardSpec["tone"], string> = {
  green: "text-signal-green",
  amber: "text-signal-amber",
  rose: "text-signal-rose",
  cyan: "text-cyan",
};

export function SummaryCards({ loading }: { loading: boolean }) {
  return (
    <section aria-label="Executive signal summary" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {CARDS.map((c) => (
        <article key={c.label} className="panel p-4">
          <div className="flex min-w-0 items-center gap-2">
            <c.icon className={`h-4 w-4 shrink-0 ${toneText[c.tone]}`} aria-hidden="true" />
            <h3 className="truncate text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
              {c.label}
            </h3>
          </div>
          {loading ? (
            <>
              <Skeleton className="mt-3 h-8 w-28 bg-surface-hover" />
              <Skeleton className="mt-2 h-3 w-40 bg-surface-hover" />
            </>
          ) : (
            <>
              <p className={`num mt-3 text-3xl font-semibold ${toneText[c.tone]}`}>{c.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{c.detail}</p>
            </>
          )}
        </article>
      ))}
    </section>
  );
}
