import type { TradeDataMarketFit } from "@/lib/tradepulse-data";

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-md border border-border bg-canvas p-3">
      <h3 className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">{title}</h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="rounded-md border border-border bg-canvas p-3">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className={`num mt-1 text-lg font-semibold ${tone ?? "text-foreground"}`}>{value}</p>
    </div>
  );
}

function Bar({ value, tone = "bg-cyan" }: { value: number; tone?: string }) {
  return (
    <div className="h-1.5 w-full rounded-full bg-surface-hover" aria-hidden="true">
      <div className={`h-full rounded-full ${tone}`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

function Pill({ tone, children }: { tone: "green" | "amber" | "rose" | "muted"; children: React.ReactNode }) {
  const cls =
    tone === "green"
      ? "signal-green"
      : tone === "amber"
        ? "signal-amber"
        : tone === "rose"
          ? "signal-rose"
          : "border border-border bg-surface-hover text-muted-foreground";
  return <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${cls}`}>{children}</span>;
}

const impactTone = (s: "low" | "medium" | "high") => (s === "low" ? "green" : s === "medium" ? "amber" : "rose");

const usd0 = (n: number) => `$${Math.round(n).toLocaleString()}`;
const usd2 = (n: number) => `$${n.toFixed(2)}`;
const pct = (n: number) => `${n > 0 ? "+" : ""}${n.toFixed(1)}%`;

export function MacroDemandPanel({ fit }: { fit: TradeDataMarketFit }) {
  const d = fit.macroDemand;
  const max = Math.max(...d.seasonalityMonths.map((s) => s.importSharePercent));
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Stat label="Annual import value" value={usd0(d.annualImportValueUsd)} />
        <Stat
          label="Annual import quantity"
          value={`${d.annualImportQuantity.value.toLocaleString()} ${d.annualImportQuantity.unit.replace("_", " ")}`}
        />
        <Stat label="3–5yr CAGR" value={pct(d.cagr3To5Yr)} tone="text-signal-green" />
        <Stat label="YoY growth" value={pct(d.yoyGrowth)} tone={d.yoyGrowth >= 0 ? "text-signal-green" : "text-signal-rose"} />
      </div>

      <Card title="Classification">
        <dl className="grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-[11px] text-muted-foreground">HS6 code</dt>
            <dd className="num text-foreground">{d.hsCode6}</dd>
          </div>
          <div>
            <dt className="text-[11px] text-muted-foreground">National tariff line</dt>
            <dd className="num text-foreground">{d.nationalTariffLine}</dd>
          </div>
        </dl>
      </Card>

      <Card title="Seasonality — monthly import share">
        <ul className="grid grid-cols-12 items-end gap-1" aria-hidden="true">
          {d.seasonalityMonths.map((s) => (
            <li key={s.month} className="flex flex-col items-center gap-1">
              <span
                className="w-full rounded-sm bg-cyan"
                style={{ height: `${(s.importSharePercent / max) * 64 + 6}px` }}
              />
              <span className="text-[9px] text-muted-foreground">{s.month.slice(0, 1)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-[11px] text-muted-foreground">
          Peak month: {d.seasonalityMonths.reduce((a, b) => (b.importSharePercent > a.importSharePercent ? b : a)).month} ·
          share {max.toFixed(1)}%
        </p>
      </Card>
    </div>
  );
}

export function PricingPanel({ fit }: { fit: TradeDataMarketFit }) {
  const c = fit.commercialPricing;
  const b = c.landedCostBreakdownUsd;
  const maxPrice = Math.max(...c.multiYearPriceTrend.map((p) => p.unitPriceUsd));
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Stat label="Average unit value" value={usd2(c.averageUnitValueUsd)} />
        <div className="rounded-md border border-border bg-canvas p-3">
          <p className="text-[11px] text-muted-foreground">Unit value segment</p>
          <p className="mt-2">
            <Pill tone={c.unitValueSegment === "premium" ? "green" : c.unitValueSegment === "mid-tier" ? "amber" : "muted"}>
              {c.unitValueSegment}
            </Pill>
          </p>
        </div>
      </div>

      <Card title="Multi-year unit price trend">
        <ul className="space-y-2">
          {c.multiYearPriceTrend.map((p) => (
            <li key={p.year} className="grid grid-cols-[3rem_1fr_5rem] items-center gap-3">
              <span className="num text-xs text-muted-foreground">{p.year}</span>
              <Bar value={(p.unitPriceUsd / maxPrice) * 100} />
              <span className="num text-right text-xs text-foreground">{usd2(p.unitPriceUsd)}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card title="Landed cost breakdown (per unit)">
        <table className="w-full text-sm">
          <caption className="sr-only">Landed cost breakdown per unit</caption>
          <tbody>
            {[
              ["FOB price", b.fobPrice],
              ["Freight + insurance", b.estimatedFreightInsurance],
              ["Applied duty cost", b.appliedDutyCost],
            ].map(([label, value]) => (
              <tr key={label as string} className="border-b border-border">
                <th scope="row" className="py-2 text-left font-normal text-muted-foreground">
                  {label}
                </th>
                <td className="num py-2 text-right text-foreground">{usd2(value as number)}</td>
              </tr>
            ))}
            <tr>
              <th scope="row" className="py-2 text-left font-medium">
                Effective landed price
              </th>
              <td className="num py-2 text-right text-lg font-semibold text-cyan">{usd2(b.effectiveLandedPrice)}</td>
            </tr>
          </tbody>
        </table>
      </Card>
    </div>
  );
}

export function TariffPanel({ fit }: { fit: TradeDataMarketFit }) {
  const t = fit.tariffAndRegulatory;
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Stat label="MFN tariff rate" value={`${t.mfnTariffRatePercent.toFixed(1)}%`} tone="text-signal-amber" />
        <Stat
          label={t.activeFtaName ? `Preferential (${t.activeFtaName})` : "Preferential rate"}
          value={t.preferentialFtaRatePercent === null ? "None available" : `${t.preferentialFtaRatePercent.toFixed(1)}%`}
          tone={t.preferentialFtaRatePercent === 0 ? "text-signal-green" : "text-foreground"}
        />
      </div>

      <Card title="Non-tariff measures">
        <ul className="space-y-3">
          {t.nonTariffMeasures.map((n) => (
            <li key={n.title} className="border-t border-border pt-3 first:border-0 first:pt-0">
              <div className="flex flex-wrap items-center gap-2">
                <Pill tone="muted">{n.type}</Pill>
                <span className="text-sm text-foreground">{n.title}</span>
              </div>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {n.mandatoryCertifications.map((c) => (
                  <Pill key={c} tone="amber">
                    {c}
                  </Pill>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <Card title="Trade barriers">
        <ul className="space-y-3">
          {t.tradeBarriers.map((b) => (
            <li key={b.description} className="border-t border-border pt-3 first:border-0 first:pt-0">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-medium text-foreground">{b.type}</span>
                <Pill tone={impactTone(b.impactLevel)}>{b.impactLevel} impact</Pill>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{b.description}</p>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

export function SupplyConcentrationPanel({ fit }: { fit: TradeDataMarketFit }) {
  const s = fit.supplyConcentration;
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Stat label="HHI concentration index" value={s.hhiIndexScore.toLocaleString()} />
        <div className="rounded-md border border-border bg-canvas p-3">
          <p className="text-[11px] text-muted-foreground">Market structure</p>
          <p className="mt-2">
            <Pill
              tone={
                s.hhiMarketType === "Highly Concentrated" ? "rose" : s.hhiMarketType === "Moderately Concentrated" ? "amber" : "green"
              }
            >
              {s.hhiMarketType}
            </Pill>
          </p>
        </div>
      </div>

      <Card title="Supplying countries — market share">
        <ul className="space-y-2">
          {s.supplyingCountriesBreakdown.map((c) => (
            <li key={c.country} className="grid grid-cols-[9rem_1fr_3rem] items-center gap-3">
              <span className="truncate text-xs text-foreground">
                <span aria-hidden="true">{c.flag}</span> {c.country}
              </span>
              <Bar value={c.marketSharePercent} />
              <span className="num text-right text-xs text-muted-foreground">{c.marketSharePercent}%</span>
            </li>
          ))}
        </ul>
      </Card>

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Active buyers" value={s.shipmentRecords.activeBuyerCount.toLocaleString()} />
        <Stat label="Active suppliers" value={s.shipmentRecords.activeSupplierCount.toLocaleString()} />
        <Stat label="Annual TEU volume" value={s.shipmentRecords.annualTeuVolume.toLocaleString()} />
      </div>
    </div>
  );
}

export function FitScorePanel({ fit }: { fit: TradeDataMarketFit }) {
  const a = fit.algorithmicFitScores;
  const rows: { label: string; value: number }[] = [
    { label: "Trade complementarity score", value: a.tradeComplementarityScore },
    { label: "Market attractiveness index", value: a.marketAttractivenessIndex },
  ];
  return (
    <div className="space-y-4">
      <Card title="Algorithmic demand fit">
        <ul className="space-y-3">
          {rows.map((r) => (
            <li key={r.label} className="space-y-1.5">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-muted-foreground">{r.label}</span>
                <span className="num text-sm font-semibold text-foreground">{r.value}/100</span>
              </div>
              <Bar value={r.value} tone={r.value >= 70 ? "bg-signal-green" : r.value >= 45 ? "bg-signal-amber" : "bg-signal-rose"} />
            </li>
          ))}
        </ul>
      </Card>

      <Stat
        label="Competitive distance (FOB vs local avg unit price)"
        value={`${a.competitiveDistanceUsd > 0 ? "+" : ""}${usd2(a.competitiveDistanceUsd)}`}
        tone={a.competitiveDistanceUsd < 0 ? "text-signal-green" : "text-signal-rose"}
      />
      <p className="text-[11px] text-muted-foreground">
        Negative distance means your FOB offer undercuts the prevailing imported unit value in this market.
      </p>
    </div>
  );
}

export function LogisticsMacroPanel({ fit }: { fit: TradeDataMarketFit }) {
  const l = fit.logisticsAndMacro;
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Stat label="Average transit time" value={`${l.averageTransitDays} days`} />
        <Stat label="Spot freight rate" value={`${usd0(l.spotFreightRatePerTeuUsd)}/TEU`} />
      </div>

      <Card title="Currency volatility">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="num text-sm text-foreground">
            {l.currencyVolatilityIndex.currencyCode} {pct(l.currencyVolatilityIndex.changeYoYPercent)} YoY
          </span>
          <Pill
            tone={
              l.currencyVolatilityIndex.stability === "Stable"
                ? "green"
                : l.currencyVolatilityIndex.stability === "Moderate"
                  ? "amber"
                  : "rose"
            }
          >
            {l.currencyVolatilityIndex.stability}
          </Pill>
        </div>
      </Card>

      <Card title="Geopolitical & sovereign risk">
        <dl className="grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-[11px] text-muted-foreground">Sovereign credit rating</dt>
            <dd className="num text-sm text-foreground">{l.geopoliticalSovereignRisk.creditRating}</dd>
          </div>
          <div>
            <dt className="text-[11px] text-muted-foreground">Ease of importing rank</dt>
            <dd className="num text-sm text-foreground">#{l.geopoliticalSovereignRisk.easeOfImportRank}</dd>
          </div>
        </dl>
      </Card>
    </div>
  );
}
