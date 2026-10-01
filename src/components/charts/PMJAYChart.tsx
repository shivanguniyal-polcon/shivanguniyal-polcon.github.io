import { useMemo, useState } from 'react';
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Cell,
} from 'recharts';
import seriesCsv from '../../data/pmjay_series.csv?raw';
import statesCsv from '../../data/pmjay_states.csv?raw';

type Row = { date: string; value: number; label: string };
type StateRow = { state: string; admissions: number };

function parseSeries(csv: string): Row[] {
  const lines = csv.trim().split(/\r?\n/).slice(1);
  const out: Row[] = [];
  for (const line of lines) {
    // date,indicator,value,unit,... (definition may contain commas → parse minimally)
    const m = line.match(/^([^,]+),admissions_crore,([0-9.]+),/);
    if (m) out.push({ date: m[1], value: parseFloat(m[2]), label: m[1] });
  }
  return out;
}

function parseStates(csv: string): StateRow[] {
  const lines = csv.trim().split(/\r?\n/).slice(1);
  const rows: StateRow[] = [];
  for (const line of lines) {
    const clean = line.replace(/\r$/, '');
    const m = clean.match(/^(.*?),(2018-19),(\d+),/);
    if (m && m[1] !== 'ALL INDIA') rows.push({ state: m[1], admissions: parseInt(m[3], 10) });
  }
  rows.sort((a, b) => b.admissions - a.admissions);
  return rows.slice(0, 10);
}

const series = parseSeries(seriesCsv);
const topStates = parseStates(statesCsv);

const fmt = (v: number) => `${v.toFixed(2)} cr`;

function TooltipBox({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: 'var(--code-bg)', border: '1px solid var(--line-bright)', borderRadius: 8,
        padding: '8px 12px', fontFamily: 'JetBrains Mono, monospace', fontSize: 12,
        color: 'var(--ink)',
      }}
    >
      <div style={{ color: 'var(--ink-faint)' }}>{label}</div>
      <div style={{ color: 'var(--accent)', fontWeight: 600 }}>{fmt(payload[0].value)}</div>
      {payload[0].payload?.state && (
        <div style={{ color: 'var(--ink-dim)' }}>{payload[0].payload.state}</div>
      )}
    </div>
  );
}

export default function PMJAYChart() {
  const [view, setView] = useState<'series' | 'states'>('series');

  return (
    <div className="chart-frame">
      <h4>AB PM-JAY · cumulative authorized hospital admissions</h4>
      <div className="sub">reconstructed from PIB releases, NHA annual reports &amp; Lok Sabha replies · every point source-linked</div>

      <div className="toggle-row">
        <button
          className={`filter-btn ${view === 'series' ? 'active' : ''}`}
          onClick={() => setView('series')}
        >
          adoption curve
        </button>
        <button
          className={`filter-btn ${view === 'states' ? 'active' : ''}`}
          onClick={() => setView('states')}
        >
          FY18-19 · top states
        </button>
        <span className="readout">
          {view === 'series'
            ? `latest: ${fmt(series[series.length - 1].value)} (Mar 2025)`
            : `first-year leader: ${topStates[0]?.state} (${topStates[0]?.admissions.toLocaleString('en-IN')})`}
        </span>
      </div>

      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          {view === 'series' ? (
            <AreaChart data={series} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="pmjayFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--line)" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                stroke="var(--ink-faint)" tick={{ fill: 'var(--ink-faint)', fontSize: 10.5, fontFamily: 'JetBrains Mono' }}
                tickLine={false} axisLine={{ stroke: 'var(--line)' }}
              />
              <YAxis
                stroke="var(--ink-faint)" tick={{ fill: 'var(--ink-faint)', fontSize: 10.5, fontFamily: 'JetBrains Mono' }}
                tickLine={false} axisLine={false} tickFormatter={(v: number) => `${v}cr`}
              />
              <Tooltip content={<TooltipBox />} />
              <Area
                type="monotone" dataKey="value" stroke="var(--accent)" strokeWidth={2.2}
                fill="url(#pmjayFill)" animationDuration={1400}
                dot={{ r: 2.5, fill: 'var(--accent)', strokeWidth: 0 }}
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          ) : (
            <BarChart data={topStates} layout="vertical" margin={{ top: 4, right: 30, left: 40, bottom: 0 }}>
              <CartesianGrid stroke="var(--line)" strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis
                type="category" dataKey="state" width={132}
                stroke="var(--ink-faint)" tick={{ fill: 'var(--ink-dim)', fontSize: 10.5, fontFamily: 'JetBrains Mono' }}
                tickLine={false} axisLine={false}
              />
              <Tooltip content={<TooltipBox />} cursor={{ fill: 'var(--chart-cursor)' }} />
              <Bar dataKey="admissions" animationDuration={1100} radius={[0, 3, 3, 0]}>
                {topStates.map((s, i) => (
                  <Cell key={s.state} fill={i === 0 ? 'var(--cyan)' : 'var(--accent)'} fillOpacity={1 - i * 0.06} />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="data-note">
        sources: PIB PRID 1546948 / 1813651 / 1928582 · NHA Annual Report 2024-25 · Lok Sabha Q&amp;A Aug 2024.
        See the <a href="/projects/pmjay-system-dynamics/">system-dynamics writeup</a>
      </div>
    </div>
  );
}
