import { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Cell, LabelList,
} from 'recharts';
import looCsv from '../../data/RI_vs_Wildboot_Panel1_LOO.csv?raw';
import placeboCsv from '../../data/WCR_Female_Placebo_Cells.csv?raw';

type LooRow = { dropped: string; b: number; t: number };
type CellRow = { cell: string; b: number; p: number };

function parseLoo(csv: string): LooRow[] {
  return csv
    .trim()
    .split(/\r?\n/)
    .slice(1)
    .map((l) => {
      const [dropped, b, t] = l.split(',');
      return { dropped, b: parseFloat(b), t: parseFloat(t) };
    });
}

function parsePlacebo(csv: string): CellRow[] {
  const rows: CellRow[] = [];
  // quoted CSV: "cell name",b,t_obs,...,p_WCR_webb,... · b is 2nd, p_WCR_webb is 9th
  const re = /"([^"]+)",(-?[0-9.]+),(-?[0-9.]+),([^,]*),([^,]*),([^,]*),([0-9.]+)/;
  for (const line of csv.trim().split(/\r?\n/).slice(1)) {
    const m = line.match(re);
    if (m) rows.push({ cell: m[1].trim(), b: parseFloat(m[2]), p: parseFloat(m[7]) });
  }
  return rows;
}

const loo = parseLoo(looCsv);
const placebo = parsePlacebo(placeboCsv);

const shortCell = (c: string) =>
  c
    .replace('FEMALE dose x EC98, ', 'F · ')
    .replace('MALE   dose x EC98, ', 'M · ')
    .replace('treatment 98->99', '98→99 (treatment)')
    .replace('placebo   96->98', '96→98 (placebo)');

function TooltipBox({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: '#0d1117', border: '1px solid #2d3a47', borderRadius: 8,
        padding: '8px 12px', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#e8edf2',
      }}
    >
      <div style={{ color: '#5c6b7a' }}>{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ color: p.stroke || p.fill || '#4ade80' }}>
          β = {typeof p.value === 'number' ? p.value.toFixed(2) : p.value} {p.dataKey === 't' ? '(t-stat)' : ''}
        </div>
      ))}
    </div>
  );
}

export default function EVMChart() {
  const [view, setView] = useState<'loo' | 'forest'>('loo');

  const looStats = useMemo(() => {
    const bs = loo.map((r) => r.b);
    return { min: Math.min(...bs), max: Math.max(...bs) };
  }, []);

  return (
    <div className="chart-frame">
      <h4>The inference battery: what survives when you try to kill it</h4>
      <div className="sub">
        leave-one-state-out fragility · treatment vs placebo (WCR wild-bootstrap p-values)
      </div>

      <div className="toggle-row">
        <button className={`filter-btn ${view === 'loo' ? 'active' : ''}`} onClick={() => setView('loo')}>
          LOO fragility
        </button>
        <button className={`filter-btn ${view === 'forest' ? 'active' : ''}`} onClick={() => setView('forest')}>
          treatment vs placebo
        </button>
        <span className="readout">
          {view === 'loo'
            ? `β ∈ [${looStats.min.toFixed(2)}, ${looStats.max.toFixed(2)}] · no state flips the sign`
            : 'placebo cycle 96→98: null, as it should be'}
        </span>
      </div>

      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          {view === 'loo' ? (
            <LineChart data={loo} margin={{ top: 10, right: 12, left: -12, bottom: 6 }}>
              <CartesianGrid stroke="#1f2933" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="dropped" interval={3} angle={-40} textAnchor="end" height={58}
                stroke="#5c6b7a" tick={{ fill: '#5c6b7a', fontSize: 9.5, fontFamily: 'JetBrains Mono' }}
                tickLine={false} axisLine={{ stroke: '#1f2933' }}
              />
              <YAxis
                stroke="#5c6b7a" tick={{ fill: '#5c6b7a', fontSize: 10.5, fontFamily: 'JetBrains Mono' }}
                tickLine={false} axisLine={false}
                domain={['dataMin - 0.6', 'dataMax + 0.6']}
                tickFormatter={(v: number) => v.toFixed(0)}
              />
              <Tooltip content={<TooltipBox />} />
              <ReferenceLine y={0} stroke="#5c6b7a" strokeDasharray="4 4" />
              <Line
                type="monotone" dataKey="b" stroke="#38bdf8" strokeWidth={2}
                dot={{ r: 3, fill: '#38bdf8', strokeWidth: 0 }} animationDuration={1200}
              />
            </LineChart>
          ) : (
            <BarChart data={placebo} layout="vertical" margin={{ top: 8, right: 60, left: 8, bottom: 0 }}>
              <CartesianGrid stroke="#1f2933" strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" hide domain={['dataMin - 1', 'dataMax + 1']} />
              <YAxis
                type="category" dataKey="cell" width={210} tickFormatter={shortCell}
                stroke="#5c6b7a" tick={{ fill: '#9aa7b4', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                tickLine={false} axisLine={false}
              />
              <Tooltip content={<TooltipBox />} cursor={{ fill: '#18212b55' }} />
              <ReferenceLine x={0} stroke="#5c6b7a" />
              <Bar dataKey="b" animationDuration={1100} radius={[0, 3, 3, 0]}>
                {placebo.map((r) => (
                  <Cell key={r.cell} fill={r.p < 0.05 ? '#4ade80' : '#f87171'} />
                ))}
                <LabelList
                  dataKey="p" position="right"
                  formatter={(v: number) => `p=${v}`}
                  style={{ fill: '#9aa7b4', fontSize: 10.5, fontFamily: 'JetBrains Mono' }}
                />
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="data-note">
        few treated clusters → clustered SEs lie. Reported: WCR wild-bootstrap p-values; sign and size of the
        dose × EC98 effect stable under every leave-one-state-out permutation. Full battery on the{' '}
        <a href="https://shivang-thesis.streamlit.app/" target="_blank" rel="noopener">live dashboard ↗</a>
      </div>
    </div>
  );
}
