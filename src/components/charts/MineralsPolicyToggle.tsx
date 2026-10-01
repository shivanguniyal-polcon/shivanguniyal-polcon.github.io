import { useMemo, useState } from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceArea, ZAxis } from 'recharts';

/**
 * Simulated dyad-month risk scores shaped to the project's empirical moments:
 * OOD AUC 0.855, deployed recall 98.9%, disruptions defined as
 * >40% YoY volume drops with >2.0σ price spikes on a 271-dyad panel.
 * The slider is the policymaker's lever: the alert threshold.
 */
function makeDyads() {
  let seed = 42;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  const pts: { score: number; disrupted: boolean; size: number; name: string }[] = [];
  const names = ['Li–CL dyad', 'Co–IN dyad', 'Ni–JP dyad', 'Gr–US dyad', 'V–DE dyad',
    'Li–FI hub', 'Co–BE hub', 'Ni–KR dyad', 'Gr–IN dyad', 'Li–JP dyad'];
  // 140 quiet dyads (low risk), 22 disruptive events (high risk), a gray zone between
  for (let i = 0; i < 140; i++) {
    const score = rand() * 0.42;
    pts.push({ score, disrupted: false, size: 40 + rand() * 60, name: names[i % names.length] });
  }
  for (let i = 0; i < 16; i++) {
    const score = 0.62 + rand() * 0.36;
    pts.push({ score, disrupted: true, size: 90 + rand() * 160, name: names[i % names.length] });
  }
  for (let i = 0; i < 12; i++) {
    const score = 0.4 + rand() * 0.24; // gray zone: some disruption sneaks below 0.62
    pts.push({ score, disrupted: rand() > 0.5, size: 60 + rand() * 90, name: names[i % names.length] });
  }
  return pts;
}

const dyads = makeDyads();

export default function MineralsPolicyToggle() {
  const [threshold, setThreshold] = useState(0.62);

  const { alerts, caught, falseAlarms, recall, far } = useMemo(() => {
    const above = dyads.filter((d) => d.score >= threshold);
    const caught = dyads.filter((d) => d.disrupted && d.score >= threshold).length;
    const falseAlarms = above.length - caught;
    const totalDisrupted = dyads.filter((d) => d.disrupted).length;
    return {
      alerts: above.length,
      caught,
      falseAlarms,
      recall: (100 * caught) / totalDisrupted,
      far: (100 * falseAlarms) / Math.max(above.length, 1),
    };
  }, [threshold]);

  return (
    <div className="chart-frame">
      <h4>The policy toggle: choose your pain</h4>
      <div className="sub">
        271 bilateral dyads · disruption = &gt;40% volume drop ∧ &gt;2.0σ price spike · model OOD AUC 0.855
      </div>

      <div className="toggle-row">
        <label htmlFor="threshold">alert threshold</label>
        <input
          id="threshold" type="range" min={0.2} max={0.9} step={0.01}
          value={threshold}
          onChange={(e) => setThreshold(parseFloat(e.target.value))}
          style={{ width: 260 }}
        />
        <span className="readout" style={{ color: 'var(--amber)' }}>
          threshold {threshold.toFixed(2)}
        </span>
      </div>

      <div className="toggle-row" style={{ gap: 28, margin: '10px 0 16px' }}>
        <span className="readout" style={{ color: 'var(--accent)' }}>recall {recall.toFixed(0)}%</span>
        <span className="readout" style={{ color: 'var(--red)' }}>false alarms {far.toFixed(0)}%</span>
        <span className="readout" style={{ color: 'var(--cyan)' }}>alerts/yr {alerts}</span>
      </div>

      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <ScatterChart margin={{ top: 10, right: 16, left: -8, bottom: 10 }}>
            <CartesianGrid stroke="var(--line)" strokeDasharray="3 3" />
            <XAxis
              type="number" dataKey="score" domain={[0, 1]} name="risk score"
              stroke="var(--ink-faint)" tick={{ fill: 'var(--ink-faint)', fontSize: 10.5, fontFamily: 'JetBrains Mono' }}
              tickLine={false} axisLine={{ stroke: 'var(--line)' }}
              label={{ value: 'model risk score', position: 'insideBottom', offset: -6, fill: 'var(--ink-faint)', fontSize: 11 }}
            />
            <YAxis type="number" dataKey="size" hide domain={[0, 300]} />
            <ZAxis type="number" dataKey="size" range={[30, 260]} />
            <Tooltip
              content={({ active, payload }: any) =>
                active && payload?.length ? (
                  <div style={{
                    background: 'var(--code-bg)', border: '1px solid var(--line-bright)', borderRadius: 8,
                    padding: '8px 12px', fontFamily: 'JetBrains Mono, monospace', fontSize: 12,
                  }}>
                    <div style={{ color: 'var(--ink)' }}>{payload[0].payload.name}</div>
                    <div style={{ color: payload[0].payload.disrupted ? 'var(--red)' : 'var(--ink-dim)' }}>
                      {payload[0].payload.disrupted ? '● disrupted' : '○ quiet'}
                      {' · score '}{payload[0].payload.score.toFixed(2)}
                    </div>
                  </div>
                ) : null
              }
            />
            {/* alert zone */}
            <ReferenceArea x1={threshold} x2={1} fill="var(--accent)" fillOpacity={0.05} stroke="var(--accent)" strokeOpacity={0.25} strokeDasharray="4 4" />
            {/* miss zone (disruptions below threshold) */}
            <ReferenceArea x1={0} x2={threshold} fill="var(--red)" fillOpacity={0.03} />
            <Scatter data={dyads.filter((d) => !d.disrupted)} fill="var(--data-muted)" fillOpacity={0.75} />
            <Scatter data={dyads.filter((d) => d.disrupted && d.score >= threshold)} fill="var(--accent)" fillOpacity={0.9} />
            <Scatter data={dyads.filter((d) => d.disrupted && d.score < threshold)} fill="var(--red)" fillOpacity={0.9} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="data-note">
        green = disruption caught · red = disruption missed · gray = quiet dyad.
        Slide right for a quiet life and strategic exposure; slide left for a loud alarm and a full warehouse.
        Reserve sizing from this frontier: <strong style={{ color: 'var(--ink)' }}>$633M CapEx / $910M lifecycle</strong> under VaR.
      </div>
    </div>
  );
}
