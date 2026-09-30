import { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { simulate, SCENARIOS, type ScenarioKey } from '../../lib/droneModel';

const colors: Record<ScenarioKey, string> = {
  baseline: '#5c6b7a',
  national_drone_mission: '#4ade80',
  export_led: '#38bdf8',
  combined: '#a78bfa',
  arms_race: '#f87171',
  combined_counter_drone: '#fbbf24',
};

type MetricKey = 'fleet' | 'capacity' | 'cuasFleet' | 'exportRev' | 'intercept';
const metricLabels: Record<MetricKey, string> = {
  fleet: 'active fleet (units)',
  capacity: 'manufacturing capacity (units/yr)',
  cuasFleet: 'counter-UAS fleet (systems)',
  exportRev: 'cumulative export revenue (₹ cr)',
  intercept: 'intercept rate (share)',
};

export default function DroneScenarios() {
  const [metric, setMetric] = useState<MetricKey>('fleet');

  const data = useMemo(() => {
    const sims = SCENARIOS.map((s) => ({ key: s.key, rows: simulate(s.key) }));
    const byT = new Map<number, any>();
    for (const s of sims) {
      for (const r of s.rows) {
        const e = byT.get(r.t) ?? { t: r.t };
        e[s.key] = r[metric];
        byT.set(r.t, e);
      }
    }
    return [...byT.values()].sort((a, b) => a.t - b.t);
  }, [metric]);

  return (
    <div className="chart-frame">
      <h4>Six futures, one model</h4>
      <div className="sub">
        the ODE core of India_Combat_Drone_SD_Model_v2.py, re-integrated live · learning curves,
        Sindoor / Spiderweb shocks, adversary coupling and budget shares included
      </div>

      <div className="toggle-row">
        {(Object.keys(metricLabels) as MetricKey[]).map((m) => (
          <button key={m} className={`filter-btn ${metric === m ? 'active' : ''}`} onClick={() => setMetric(m)}>
            {metricLabels[m]}
          </button>
        ))}
      </div>

      <div style={{ width: '100%', height: 340 }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 10, right: 16, left: -6, bottom: 0 }}>
            <CartesianGrid stroke="#1f2933" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="t" type="number" domain={[2024, 2035]} tickCount={6} tickFormatter={(v) => v.toFixed(0)}
              stroke="#5c6b7a" tick={{ fill: '#5c6b7a', fontSize: 10.5, fontFamily: 'JetBrains Mono' }}
              tickLine={false} axisLine={{ stroke: '#1f2933' }}
            />
            <YAxis
              stroke="#5c6b7a" tick={{ fill: '#5c6b7a', fontSize: 10.5, fontFamily: 'JetBrains Mono' }}
              tickLine={false} axisLine={false}
              tickFormatter={(v: number) => (metric === 'exportRev' ? `${Math.round(v / 1000)}k` : Math.round(v).toString())}
            />
            <Tooltip
              content={({ active, payload, label }: any) =>
                active && payload?.length ? (
                  <div style={{
                    background: '#0d1117', border: '1px solid #2d3a47', borderRadius: 8,
                    padding: '8px 12px', fontFamily: 'JetBrains Mono, monospace', fontSize: 12,
                  }}>
                    <div style={{ color: '#5c6b7a' }}>{Math.floor(label)}</div>
                    {payload
                      .slice()
                      .sort((a: any, b: any) => b.value - a.value)
                      .map((p: any) => (
                        <div key={p.dataKey} style={{ color: p.stroke }}>
                          {p.dataKey.replace(/_/g, ' ')}: {typeof p.value === 'number' ? p.value.toLocaleString('en-IN') : p.value}
                        </div>
                      ))}
                  </div>
                ) : null
              }
            />
            <Legend wrapperStyle={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10.5 }}
              formatter={(v: string) => v.replace(/_/g, ' ')} />
            {SCENARIOS.map((s) => (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                stroke={colors[s.key]}
                strokeWidth={s.key === 'baseline' ? 1.4 : 2.1}
                strokeDasharray={s.key === 'baseline' ? '4 4' : undefined}
                dot={false}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="data-note">
        national level · 2024 to 2035 · the arms-race scenario trades fleet size for counter-UAS
        depth; export-led growth is slower but compounds through the learning curve. Procurement
        composition beats procurement volume in early conflict windows.
      </div>
    </div>
  );
}
