import { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine,
} from 'recharts';
import raw from '../../data/wefe_scenarios.json';

/**
 * The real 10,000-run Monte Carlo trajectories from the WEFE study
 * (baked from wefe-dashboard/data/scenarios.json): median depth with
 * p05/p95 uncertainty bands for all five scenarios, 2022 to 2050, with
 * the four viability thresholds. Scenario toggles, band toggle.
 */

const data = raw as {
  years: number[];
  scenarios: Record<string, { mean: number[]; p05: number[]; p95: number[]; color: string }>;
  breach: Record<string, Record<string, string>>;
};

const SHORT: Record<string, string> = {
  'SSP5-8.5: Unchecked Climate & Agri-Growth': 'SSP5 unchecked',
  'SSP2-4.5: Moderate Climate & Incremental Reform': 'SSP2 moderate',
  'NPP Vision 2050: Infrastructure Rescue': 'NPP rescue',
  'Deep Aquifer Stress Test (Combined Extremes)': 'stress test',
  'Electrification-Conditioned Tariff Reform (Model D)': 'Model D tariff',
};

const THRESHOLDS = [
  { depth: 15, label: '15 m: handpumps fail', color: '#f87171' },
  { depth: 25, label: '25 m: diesel unviable', color: '#fbbf24' },
  { depth: 40, label: '40 m: aquifer stress', color: '#a78bfa' },
];

export default function WEFEScenarios() {
  const names = Object.keys(data.scenarios);
  const [active, setActive] = useState<string[]>([names[0], names[1]]);
  const [bands, setBands] = useState(true);

  const rows = useMemo(
    () =>
      data.years.map((year, i) => {
        const row: Record<string, number | string> = { year };
        for (const name of active) {
          const s = data.scenarios[name];
          row[SHORT[name] ?? name] = s.mean[i];
          row[(SHORT[name] ?? name) + '_lo'] = s.p05[i];
          row[(SHORT[name] ?? name) + '_hi'] = s.p95[i];
        }
        return row;
      }),
    [active]
  );

  const breach = (name: string) => data.breach[name]?.year_handpump_failure ?? '?';

  return (
    <div className="chart-frame">
      <h4>Groundwater trajectories to 2050: 10,000 Monte Carlo runs per scenario</h4>
      <div className="sub">
        real output of the projection engine V8, block-bootstrapped residuals; mean depth in metres below ground, with p05 to p95 bands
      </div>

      <div className="toggle-row">
        {names.map((name) => {
          const on = active.includes(name);
          const color = data.scenarios[name].color;
          return (
            <button
              key={name}
              className={`filter-btn ${on ? 'active' : ''}`}
              style={!on ? { borderColor: color, color } : { background: color, borderColor: color, color: '#05130a' }}
              onClick={() =>
                setActive((prev) => (prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]))
              }
            >
              {SHORT[name]}
            </button>
          );
        })}
        <label style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
          <input type="checkbox" checked={bands} onChange={(e) => setBands(e.target.checked)} />
          <span className="mono" style={{ fontSize: 12, color: 'var(--ink-dim)' }}>p05 to p95 bands</span>
        </label>
      </div>

      <ResponsiveContainer width="100%" height={340}>
        <LineChart data={rows} margin={{ top: 10, right: 14, left: -8, bottom: 4 }}>
          <CartesianGrid stroke="var(--line)" strokeDasharray="3 3" />
          <XAxis dataKey="year" type="number" domain={[2022, 2050]} tick={{ fill: 'var(--ink-faint)', fontSize: 11 }} />
          <YAxis
            domain={[0, 70]}
            tick={{ fill: 'var(--ink-faint)', fontSize: 11 }}
            label={{ value: 'depth (m)', angle: -90, position: 'insideLeft', fill: 'var(--ink-faint)', fontSize: 11 }}
          />
          <Tooltip
            contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--line-bright)', borderRadius: 8, fontSize: 12 }}
            labelStyle={{ color: 'var(--ink-faint)' }}
            formatter={(v: number | string, n: string) => (String(n).endsWith('_lo') || String(n).endsWith('_hi') ? null : [`${Number(v).toFixed(1)} m`, n])}
          />
          {THRESHOLDS.map((t) => (
            <ReferenceLine
              key={t.depth}
              y={t.depth}
              stroke={t.color}
              strokeDasharray="4 4"
              strokeOpacity={0.55}
              label={{ value: t.label, fill: t.color, fontSize: 9.5, position: 'insideBottomRight' }}
            />
          ))}
          {active.map((name) => {
            const key = SHORT[name] ?? name;
            const color = data.scenarios[name].color;
            return (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={color}
                strokeWidth={2.2}
                dot={false}
                isAnimationActive={false}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>

      <div className="data-note">
        {active.length === 0 && 'select at least one scenario.'}
        {active.map((name) => (
          <div key={name}>
            <span style={{ color: data.scenarios[name].color }}>■</span> {SHORT[name]}: 15 m handpump line crossed{' '}
            <strong>{breach(name)}</strong>; mean 2050 depth{' '}
            {data.scenarios[name].mean[data.scenarios[name].mean.length - 1].toFixed(1)} m
          </div>
        ))}
        {' '}Source: WEFE 2050 dashboard build, engine V8 (Arellano-Bond difference GMM profiles × 10,000 block-bootstrap runs, 205 districts).
      </div>
    </div>
  );
}
