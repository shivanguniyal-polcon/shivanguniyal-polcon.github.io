import { useMemo, useState } from 'react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Cell,
} from 'recharts';

/**
 * Estimates from the corrected research record (EVM_Findings_Map_All_Strands.md):
 *  - dosage DDD (Sep 2026 re-run): DiD beta3 by gender margin, theta = 0.5
 *  - WCR placebo cells: treatment 98 to 99 vs placebo 96 to 98, with p-values
 * Rebuilt as an interactive chart from the published coefficients, not a screenshot.
 */

type Est = {
  name: string;
  beta: number;
  lo: number;
  hi: number;
  p: number;
  kind: 'pretrend' | 'did' | 'ancova' | 'placebo';
};

const dosage: Est[] = [
  { name: 'pre-trend 96→98 (M)', beta: 0.14, lo: -9.2, hi: 9.5, p: 0.97, kind: 'pretrend' },
  { name: 'pre-trend 96→98 (F)', beta: -2.10, lo: -11.4, hi: 7.2, p: 0.63, kind: 'pretrend' },
  { name: 'DiD 98→99 (M)', beta: -5.69, lo: -10.3, hi: -1.1, p: 0.018, kind: 'did' },
  { name: 'DiD 98→99 (F)', beta: -6.96, lo: -12.4, hi: -1.5, p: 0.016, kind: 'did' },
  { name: 'ANCOVA (M)', beta: -1.07, lo: -4.9, hi: 2.8, p: 0.59, kind: 'ancova' },
  { name: 'ANCOVA (F)', beta: -0.53, lo: -4.6, hi: 3.5, p: 0.81, kind: 'ancova' },
];

const placebo: Est[] = [
  { name: 'treatment 98→99 (F)', beta: -8.43, lo: -14.6, hi: -2.3, p: 0.039, kind: 'did' },
  { name: 'placebo 96→98 (F)', beta: -4.41, lo: -12.9, hi: 4.1, p: 0.367, kind: 'placebo' },
  { name: 'treatment 98→99 (M)', beta: -10.61, lo: -15.2, hi: -6.0, p: 0.013, kind: 'did' },
  { name: 'placebo 96→98 (M)', beta: -2.49, lo: -8.6, hi: 3.6, p: 0.426, kind: 'placebo' },
];

function TooltipBox({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as Est;
  return (
    <div style={{
      background: '#0d1117', border: '1px solid #2d3a47', borderRadius: 8,
      padding: '8px 12px', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#e8edf2',
    }}>
      <div style={{ color: '#5c6b7a' }}>{d.name}</div>
      <div style={{ color: d.p < 0.05 ? '#4ade80' : '#f87171' }}>
        β = {d.beta.toFixed(2)} pp · p = {d.p}
      </div>
      <div style={{ color: '#9aa7b4' }}>CI ≈ [{d.lo.toFixed(1)}, {d.hi.toFixed(1)}]</div>
    </div>
  );
}

export default function EVMEventStudy() {
  const [view, setView] = useState<'dosage' | 'placebo'>('dosage');
  const data = view === 'dosage' ? dosage : placebo;

  return (
    <div className="chart-frame">
      <h4>The estimates, effect by effect</h4>
      <div className="sub">
        rebuilt from the corrected record · dosage DDD (Sep 2026) and WCR wild-bootstrap cells ·
        state clusters · 529 districts
      </div>

      <div className="toggle-row">
        <button className={`filter-btn ${view === 'dosage' ? 'active' : ''}`} onClick={() => setView('dosage')}>
          dosage DDD
        </button>
        <button className={`filter-btn ${view === 'placebo' ? 'active' : ''}`} onClick={() => setView('placebo')}>
          treatment vs placebo
        </button>
        <span className="readout" style={{ color: '#4ade80' }}>
          {view === 'dosage'
            ? 'pre-trends null, DiD ≈ −6 to −7pp, ANCOVA washes out'
            : 'placebo cycles return null, as they should'}
        </span>
      </div>

      <div style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 18, right: 16, left: -8, bottom: 34 }}>
            <CartesianGrid stroke="#1f2933" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="name" angle={-24} textAnchor="end" height={64} interval={0}
              stroke="#5c6b7a" tick={{ fill: '#9aa7b4', fontSize: 10, fontFamily: 'JetBrains Mono' }}
              tickLine={false} axisLine={{ stroke: '#1f2933' }}
            />
            <YAxis
              stroke="#5c6b7a" tick={{ fill: '#5c6b7a', fontSize: 10.5, fontFamily: 'JetBrains Mono' }}
              tickLine={false} axisLine={false} unit="pp"
            />
            <Tooltip content={<TooltipBox />} cursor={{ fill: '#18212b55' }} />
            <ReferenceLine y={0} stroke="#5c6b7a" />
            <Bar dataKey="beta" radius={[3, 3, 0, 0]} isAnimationActive animationDuration={900}>
              {data.map((d) => (
                <Cell
                  key={d.name}
                  fill={d.kind === 'placebo' || d.kind === 'pretrend' ? '#3a4a5a' : d.p < 0.05 ? '#4ade80' : '#fbbf24'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="data-note">
        gray = null by design (pre-trends, placebos, ANCOVA) · green = significant at p &lt; 0.05 ·
        amber = suggestive only. The average effect stays ≈ −1 pp; the DiD dose gradient concentrates
        it in high-exposure districts. Inference details on the{' '}
        <a href="https://shivang-thesis.streamlit.app/" target="_blank" rel="noopener">live dashboard ↗</a>
      </div>
    </div>
  );
}
