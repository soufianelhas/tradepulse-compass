import type { ExportMarketFit } from "@/lib/tradepulse-data";

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

const sentimentTone = (s: "positive" | "neutral" | "negative") =>
  s === "positive" ? "green" : s === "neutral" ? "amber" : "rose";

const severityTone = (s: "low" | "medium" | "high") => (s === "low" ? "green" : s === "medium" ? "amber" : "rose");

export function IntentPanel({ fit }: { fit: ExportMarketFit }) {
  const d = fit.demandSignals;
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Category mention volume" value={d.categoryVolume} />
        <Stat
          label="Growth velocity (MoM)"
          value={`${d.growthVelocityMom > 0 ? "+" : ""}${d.growthVelocityMom}%`}
          tone={d.growthVelocityMom >= 0 ? "text-signal-green" : "text-signal-rose"}
        />
        <Stat label="Cross-border chatter" value={d.crossBorderChatterVolume} tone="text-cyan" />
      </div>

      <Card title="Explicit purchase-intent phrases">
        <table className="w-full text-sm">
          <caption className="sr-only">Explicit purchase intent phrases with mention counts and growth</caption>
          <thead>
            <tr className="text-[11px] text-muted-foreground">
              <th scope="col" className="pb-2 text-left font-normal">Phrase</th>
              <th scope="col" className="pb-2 text-right font-normal">Mentions</th>
              <th scope="col" className="pb-2 text-right font-normal">Growth</th>
            </tr>
          </thead>
          <tbody>
            {d.explicitIntentPhrases.map((p) => (
              <tr key={p.phrase} className="border-t border-border">
                <td className="py-2 pr-3 text-foreground">“{p.phrase}”</td>
                <td className="num py-2 text-right text-muted-foreground">{p.count.toLocaleString()}</td>
                <td className="num py-2 text-right text-signal-green">{p.growth}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card title="Unmet need clusters">
        <ul className="space-y-3">
          {d.unmetNeedClusters.map((c) => (
            <li key={c.topic}>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="min-w-0 truncate text-foreground">{c.topic}</span>
                <span className="num shrink-0 text-xs text-signal-amber">{c.complaintShare} of complaints</span>
              </div>
              <div className="mt-1.5">
                <Bar value={Math.abs(c.sentimentRatio) * 100} tone="bg-signal-rose" />
              </div>
              <p className="num mt-1 text-[11px] text-muted-foreground">Sentiment ratio {c.sentimentRatio}</p>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

export function CompetitivePanel({ fit }: { fit: ExportMarketFit }) {
  const c = fit.competitiveBenchmark;
  const gap = c.netSentimentGap.brandSentiment - c.netSentimentGap.incumbentSentiment;
  return (
    <div className="space-y-4">
      <Card title="Share of voice — local vs imported">
        <div className="flex h-3 w-full overflow-hidden rounded-full" role="img" aria-label={`Local ${c.localVsImportedSOV.localShare}%, imported ${c.localVsImportedSOV.importShare}%`}>
          <div className="h-full bg-primary" style={{ width: `${c.localVsImportedSOV.localShare}%` }} />
          <div className="h-full bg-cyan" style={{ width: `${c.localVsImportedSOV.importShare}%` }} />
        </div>
        <div className="num mt-2 flex justify-between text-[11px] text-muted-foreground">
          <span>Local brands {c.localVsImportedSOV.localShare}%</span>
          <span>Imported {c.localVsImportedSOV.importShare}%</span>
        </div>
      </Card>

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Your net sentiment" value={`${c.netSentimentGap.brandSentiment}`} tone="text-signal-green" />
        <Stat label="Incumbent net sentiment" value={`${c.netSentimentGap.incumbentSentiment}`} />
        <Stat
          label="Sentiment gap"
          value={`${gap > 0 ? "+" : ""}${Math.round(gap * 10) / 10}`}
          tone={gap >= 0 ? "text-signal-green" : "text-signal-rose"}
        />
      </div>

      <Card title="Feature preference matrix">
        <ul className="space-y-3">
          {c.featurePreferenceMatrix.map((f) => (
            <li key={f.attribute}>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-foreground">{f.attribute}</span>
                <span className="flex items-center gap-2">
                  <Pill tone={sentimentTone(f.sentiment)}>{f.sentiment}</Pill>
                  <span className="num text-xs text-muted-foreground">{f.importanceScore}</span>
                </span>
              </div>
              <div className="mt-1.5">
                <Bar value={f.importanceScore} />
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <Card title={`Price sensitivity — ${c.priceSensitivityChatter.category}`}>
        <Bar value={c.priceSensitivityChatter.intensityScore} tone="bg-signal-amber" />
        <p className="num mt-2 text-xs text-muted-foreground">
          Intensity score {c.priceSensitivityChatter.intensityScore}/100
        </p>
      </Card>
    </div>
  );
}

export function LocalizationPanel({ fit }: { fit: ExportMarketFit }) {
  const l = fit.localizationContext;
  return (
    <div className="space-y-4">
      <Card title="Geo-linguistic sentiment">
        <ul className="space-y-3">
          {l.geoLinguisticSentiment.map((g) => (
            <li key={g.dialectRegion} className="border-t border-border pt-3 first:border-0 first:pt-0">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-foreground">{g.dialectRegion}</span>
                <span className={`num text-xs ${g.sentimentScore >= 0 ? "text-signal-green" : "text-signal-rose"}`}>
                  {g.sentimentScore > 0 ? "+" : ""}
                  {g.sentimentScore}
                </span>
              </div>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {g.topIdioms.map((i) => (
                  <Pill key={i} tone="muted">
                    {i}
                  </Pill>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <Card title="Usage contexts">
        <ul className="space-y-3">
          {l.usageContexts.map((u) => (
            <li key={u.occasion}>
              <div className="flex items-center justify-between text-sm">
                <span className="text-foreground">{u.occasion}</span>
                <span className="num text-xs text-muted-foreground">{u.frequencyShare}%</span>
              </div>
              <div className="mt-1.5">
                <Bar value={u.frequencyShare} />
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <Card title="Cultural attribute check">
        <ul className="space-y-3">
          {l.culturalAttributeSentiment.map((a) => (
            <li key={a.attribute} className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm text-foreground">{a.attribute}</p>
                <p className="text-[11px] text-muted-foreground">{a.details}</p>
              </div>
              <Pill tone={a.status === "compliant" ? "green" : "rose"}>{a.status}</Pill>
            </li>
          ))}
        </ul>
      </Card>

      <Card title="Seasonal demand spikes">
        <table className="w-full text-sm">
          <caption className="sr-only">Seasonal demand spikes by event</caption>
          <tbody>
            {l.seasonalSpikes.map((s) => (
              <tr key={s.eventName} className="border-t border-border first:border-0">
                <th scope="row" className="py-2 text-left font-normal text-foreground">
                  {s.eventName}
                </th>
                <td className="py-2 text-right text-xs text-muted-foreground">{s.month}</td>
                <td className="num py-2 pl-3 text-right text-signal-green">{s.volumeMultiplier}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

export function ChannelPanel({ fit }: { fit: ExportMarketFit }) {
  const c = fit.channelMapping;
  return (
    <div className="space-y-4">
      <Card title="Platform distribution">
        <ul className="space-y-3">
          {c.platformDistribution.map((p) => (
            <li key={p.platform}>
              <div className="flex items-center justify-between text-sm">
                <span className="text-foreground">{p.platform}</span>
                <span className="num text-xs text-muted-foreground">{p.sharePercentage}%</span>
              </div>
              <div className="mt-1.5">
                <Bar value={p.sharePercentage} />
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <Card title="Top KOLs & communities">
        <table className="w-full text-sm">
          <caption className="sr-only">Top key opinion leaders by reach and engagement</caption>
          <thead>
            <tr className="text-[11px] text-muted-foreground">
              <th scope="col" className="pb-2 text-left font-normal">Creator</th>
              <th scope="col" className="pb-2 text-left font-normal">Platform</th>
              <th scope="col" className="pb-2 text-right font-normal">Eng.</th>
              <th scope="col" className="pb-2 text-right font-normal">Reach</th>
            </tr>
          </thead>
          <tbody>
            {c.topKOLs.map((k) => (
              <tr key={k.handle} className="border-t border-border">
                <td className="py-2 pr-3">
                  <span className="block truncate text-foreground">{k.name}</span>
                  <span className="block truncate text-[11px] text-muted-foreground">{k.handle}</span>
                </td>
                <td className="py-2 pr-3 text-xs text-muted-foreground">{k.platform}</td>
                <td className="num py-2 text-right text-cyan">{k.engagementRate}</td>
                <td className="num py-2 text-right text-muted-foreground">{k.reach}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {c.eCommerceReviewSentiment.map((m) => (
        <Card key={m.marketplace} title={`${m.marketplace} review sentiment`}>
          <p className="num text-lg font-semibold text-foreground">{m.averageRating.toFixed(1)} / 5.0</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {m.positiveAspects.map((a) => (
              <Pill key={a} tone="green">
                {a}
              </Pill>
            ))}
            {m.negativeAspects.map((a) => (
              <Pill key={a} tone="rose">
                {a}
              </Pill>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}

export function RiskPanel({ fit }: { fit: ExportMarketFit }) {
  const r = fit.operationalRisks;
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Stat label="Last-mile logistics complaints" value={`${r.logisticsComplaintsShare}%`} tone="text-signal-amber" />
        <Stat label="Counterfeit / grey-market mentions" value={`${r.counterfeitMentionsShare}%`} tone="text-signal-rose" />
      </div>

      <Card title="Customs chatter spikes">
        <ul className="space-y-3">
          {r.customsChatterSpikes.map((s) => (
            <li key={s.issue} className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3 first:border-0 first:pt-0">
              <span className="min-w-0 text-sm text-foreground">{s.issue}</span>
              <span className="flex items-center gap-2">
                <span className="num text-xs text-muted-foreground">{s.trend}</span>
                <Pill tone={severityTone(s.severity)}>{s.severity}</Pill>
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
