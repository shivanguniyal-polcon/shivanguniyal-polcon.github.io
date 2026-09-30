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
        background: '#0d1117', border: '1px solid #2d3a47', borderRadius: 8,
        padding: '8px 12px', fontFamily: 'JetBrains Mono, monospace', fontSize: 12,
        color: '#e8edf2',
      }}
    >
      <div style={{ color: '#5c6b7a' }}>{label}</div>
      <div style={{ color: '#4ade80', fontWeight: 600 }}>{fmt(payload[0].value)}</div>
      {payload[0].payload?.state && (
        <div style={{ color: '#9aa7b4' }}>{payload[0].payload.state}</div>
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
                  <stop offset="0%" stopColor="#4ade80" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#4ade80" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#1f2933" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                stroke="#5c6b7a" tick={{ fill: '#5c6b7a', fontSize: 10.5, fontFamily: 'JetBrains Mono' }}
                tickLine={false} axisLine={{ stroke: '#1f2933' }}
              />
              <YAxis
                stroke="#5c6b7a" tick={{ fill: '#5c6b7a', fontSize: 10.5, fontFamily: 'JetBrains Mono' }}
                tickLine={false} axisLine={false} tickFormatter={(v: number) => `${v}cr`}
              />
              <Tooltip content={<TooltipBox />} />
              <Area
                type="monotone" dataKey="value" stroke="#4ade80" strokeWidth={2.2}
                fill="url(#pmjayFill)" animationDuration={1400}
                dot={{ r: 2.5, fill: '#4ade80', strokeWidth: 0 }}
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          ) : (
            <BarChart data={topStates} layout="vertical" margin={{ top: 4, right: 30, left: 40, bottom: 0 }}>
              <CartesianGrid stroke="#1f2933" strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis
                type="category" dataKey="state" width={132}
                stroke="#5c6b7a" tick={{ fill: '#9aa7b4', fontSize: 10.5, fontFamily: 'JetBrains Mono' }}
                tickLine={false} axisLine={false}
              />
              <Tooltip content={<TooltipBox />} cursor={{ fill: '#18212b55' }} />
              <Bar dataKey="admissions" animationDuration={1100} radius={[0, 3, 3, 0]}>
                {topStates.map((s, i) => (
                  <Cell key={s.state} fill={i === 0 ? '#38bdf8' : '#4ade80'} fillOpacity={1 - i * 0.06} />
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
