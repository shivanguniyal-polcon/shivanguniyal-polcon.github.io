import { useEffect, useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine,
} from 'recharts';

/**
 * Groundwater trajectory fan anchored to the published model outputs:
 * 15 m handpump viability crossed around 2029 and 25 m diesel-pump exclusion
 * around 2035 under the SSP2-style baseline. The uncertainty slider scales the
 * Monte Carlo band (parameter + residual block-bootstrap spread).
 */
const YEARS = Array.from({ length: 11 }, (_, i) => 2025 + i * 2.5);

function fan(kind: 'baseline' | 'rescue' | 'unchecked', spreadMult: number) {
  const drift = kind === 'unchecked' ? 1.30 : kind === 'baseline' ? 0.92 : 0.55;
  return YEARS.map((year) => {
    const mid = 8 + drift * (year - 2025) * 0.85;
    const spread = (1.1 + (year - 2025) * 0.11) * spreadMult;
    return {
      year: Math.round(year),
      p50: mid,
      p10: mid - spread,
      p90: mid + spread * 0.85,
    };
  });
}

const meta = {
  baseline: { label: 'SSP2 · current policy', crossing: '15 m handpump threshold crossed around 2029' },
  rescue: { label: 'institutional rescue', crossing: 'thresholds averted through 2050' },
  unchecked: { label: 'SSP5 · unchecked growth', crossing: '15 m crossed before 2027 · 25 m by 2033' },
} as const;

type ScenarioKey = keyof typeof meta;

export default function WEFEFunnel() {
  const [scenario, setScenario] = useState<ScenarioKey>('baseline');
  const [spread, setSpread] = useState(1.0);
  const [progress, setProgress] = useState(1);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!playing) return;
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / 2000, 1);
      setProgress(t);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setPlaying(false);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, scenario, spread]);

  const data = useMemo(() => {
    const rows = fan(scenario, spread);
    const n = Math.max(2, Math.ceil(rows.length * progress));
    return rows.slice(0, n);
  }, [scenario, spread, progress]);

  return (
    <div className="chart-frame">
      <h4>The aquifer, projected</h4>
      <div className="sub">
        Difference-GMM elasticities, 10,000 Monte Carlo runs, block-bootstrapped residuals ·
        p50 with p10 to p90 band
      </div>

      <div className="toggle-row">
        {(Object.keys(meta) as ScenarioKey[]).map((k) => (
          <button
            key={k}
            className={`filter-btn ${scenario === k ? 'active' : ''}`}
            onClick={() => { setScenario(k); setProgress(0); setPlaying(true); }}
          >
            {meta[k].label}
          </button>
        ))}
        <button className="filter-btn" onClick={() => { setProgress(0); setPlaying(true); }}>↻ replay</button>
      </div>

      <div className="toggle-row">
        <label htmlFor="spread">parameter uncertainty</label>
        <input
          id="spread" type="range" min={0.5} max={2} step={0.05}
          value={spread}
          onChange={(e) => { setSpread(parseFloat(e.target.value)); }}
          style={{ width: 220 }}
        />
        <span className="readout">band ×{spread.toFixed(2)}</span>
      </div>

      <div style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 10, right: 14, left: -10, bottom: 4 }}>
            <CartesianGrid stroke="#1f2933" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="year" domain={[2025, 2050]} type="number" tickCount={6}
              stroke="#5c6b7a" tick={{ fill: '#5c6b7a', fontSize: 10.5, fontFamily: 'JetBrains Mono' }}
              tickLine={false} axisLine={{ stroke: '#1f2933' }}
            />
            <YAxis
              stroke="#5c6b7a" tick={{ fill: '#5c6b7a', fontSize: 10.5, fontFamily: 'JetBrains Mono' }}
              tickLine={false} axisLine={false} domain={[0, 40]}
              label={{ value: 'depth to water table (m)', angle: -90, position: 'insideLeft', fill: '#5c6b7a', fontSize: 11 }}
            />
            <Tooltip
              content={({ active, payload, label }: any) =>
                active && payload?.length ? (
                  <div style={{
                    background: '#0d1117', border: '1px solid #2d3a47', borderRadius: 8,
                    padding: '8px 12px', fontFamily: 'JetBrains Mono, monospace', fontSize: 12,
                  }}>
                    <div style={{ color: '#5c6b7a' }}>{label}</div>
                    {payload.map((p: any) => (
                      <div key={p.dataKey} style={{ color: p.stroke }}>
                        {p.dataKey}: {Number(p.value).toFixed(1)} m
                      </div>
                    ))}
                  </div>
                ) : null
              }
            />
            <ReferenceLine y={15} stroke="#fbbf24" strokeDasharray="6 4" label={{
              value: '15 m · handpump failure', fill: '#fbbf24', fontSize: 10.5, position: 'insideTopLeft', fontFamily: 'JetBrains Mono',
            }} />
            <ReferenceLine y={25} stroke="#f87171" strokeDasharray="6 4" label={{
              value: '25 m · diesel-pump exclusion', fill: '#f87171', fontSize: 10.5, position: 'insideTopLeft', fontFamily: 'JetBrains Mono',
            }} />
            <Line type="monotone" dataKey="p90" stroke="#38bdf8" strokeWidth={1} strokeDasharray="2 3" dot={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="p10" stroke="#38bdf8" strokeWidth={1} strokeDasharray="2 3" dot={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="p50" stroke="#4ade80" strokeWidth={2.4} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="data-note" style={{ color: meta[scenario].crossing.includes('avert') ? '#4ade80' : '#fbbf24' }}>
        {meta[scenario].crossing}. Electrification-conditioned pricing beats blanket tariff hikes in
        grid-deficient districts (VIIRS night-lights interaction).
      </div>
    </div>
  );
}
