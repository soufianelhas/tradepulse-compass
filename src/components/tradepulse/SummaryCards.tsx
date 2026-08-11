import { TrendingUp, Clock, Ship, Percent } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { PanelError } from "@/components/tradepulse/QueryStates";
import { summaryQuery } from "@/services/queries";
import type { SummaryCardData } from "@/types/tradepulse";

const ICONS: Record<SummaryCardData["icon"], LucideIcon> = {
  trending: TrendingUp,
  clock: Clock,
  ship: Ship,
  percent: Percent,
};

const toneText: Record<SummaryCardData["tone"], string> = {
  green: "text-signal-green",
  amber: "text-signal-amber",
  rose: "text-signal-rose",
  cyan: "text-cyan",
};

const PLACEHOLDERS: Pick<SummaryCardData, "id" | "label" | "icon" | "tone">[] = [
  { id: "intent", label: "Top Search Intent Growth", icon: "trending", tone: "green" },
  { id: "lead-time", label: "Pre-Border Inbound Lead Time", icon: "clock", tone: "cyan" },
  { id: "supply", label: "Inbound Supply Trend", icon: "ship", tone: "rose" },
  { id: "tariff", label: "Best Bilateral Tariff Lane", icon: "percent", tone: "amber" },
];

export function SummaryCards({ loading }: { loading: boolean }) {
  const { data, isPending, isError, refetch } = useQuery(summaryQuery());
  const pending = loading || isPending;

  if (isError && !loading) {
    return (
      <section aria-label="Executive signal summary">
        <PanelError message="Executive summary signals failed to load." onRetry={() => refetch()} />
      </section>
    );
  }

  const cards = pending || !data ? PLACEHOLDERS : data;

  return (
    <section aria-label="Executive signal summary" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((c) => {
        const Icon = ICONS[c.icon];
        return (
          <article key={c.id} className="panel p-4">
            <div className="flex min-w-0 items-center gap-2">
              <Icon className={`h-4 w-4 shrink-0 ${toneText[c.tone]}`} aria-hidden="true" />
              <h3 className="truncate text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                {c.label}
              </h3>
            </div>
            {pending || !("value" in c) ? (
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
        );
      })}
    </section>
  );
}
