import { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { simulate, OFFICIAL_ADMISSIONS, CALIBRATED } from '../../lib/pmjayModel';

const fraudLevels = [0, 0.05, 0.1, 0.13, 0.2];

function fmtYear(t: number) {
  const y = Math.floor(t);
  const m = Math.round((t - y) * 12) + 1;
  return `${y}-${String(m).padStart(2, '0')}`;
}

export default function PMJAYCalibration() {
  const [fraud, setFraud] = useState(0);

  const { model, official } = useMemo(() => {
    const sim = simulate(CALIBRATED, fraud);
    // merge to yearly samples for chart size
    const model = sim
      .filter((r, i) => i % 6 === 0 || i === sim.length - 1)
      .map((r) => ({ t: r.t, model: +r.admissions.toFixed(3) }));
    const official = OFFICIAL_ADMISSIONS.map((o) => ({
      t: o.t, official: o.value,
    }));
    return { model, official };
  }, [fraud]);

  // merge series by nearest half-year bucket
  const data = useMemo(() => {
    const map = new Map<string, { t: number; model?: number; official?: number }>();
    const key = (t: number) => `${Math.floor(t)}-H${t - Math.floor(t) > 0.5 ? 2 : 1}`;
    for (const m of model) {
      const k = key(m.t);
      const e = map.get(k) ?? { t: m.t };
      e.model = m.model;
      map.set(k, e);
    }
    for (const o of official) {
      const k = key(o.t);
      const e = map.get(k) ?? { t: o.t };
      e.official = o.official;
      map.set(k, e);
    }
    return [...map.values()].sort((a, b) => a.t - b.t);
  }, [model, official]);

  const mar2025 = model.reduce((a, b) => (Math.abs(b.t - 2025.16) < Math.abs(a.t - 2025.16) ? b : a), model[0])?.model ?? 0;

  return (
    <div className="chart-frame">
      <h4>Calibrated model vs the official record</h4>
      <div className="sub">
        the exact ODE from pmjay_calibrate_model.py, re-integrated live in your browser ·
        differential-evolution fit to PIB / NHA / Lok Sabha anchors
      </div>

      <div className="toggle-row">
        <label htmlFor="fraudSel">assumed fraud share of claim value</label>
        <select
          id="fraudSel"
          value={fraud}
          onChange={(e) => setFraud(parseFloat(e.target.value))}
          style={{
            background: 'var(--bg-raised)', color: 'var(--amber)',
            border: '1px solid var(--line-bright)', borderRadius: 6,
            fontFamily: 'var(--font-mono)', fontSize: 12.5, padding: '6px 10px',
          }}
        >
          {fraudLevels.map((f) => (
            <option key={f} value={f}>{(f * 100).toFixed(0)}%</option>
          ))}
        </select>
        <span className="readout">
          modeled Mar 2025: {mar2025.toFixed(2)} cr admissions · official: 9.19 cr
        </span>
      </div>

      <div style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 10, right: 14, left: -14, bottom: 0 }}>
            <CartesianGrid stroke="var(--line)" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="t" type="number" domain={[2018.7, 2026]} tickCount={8}
              tickFormatter={fmtYear}
              stroke="var(--ink-faint)" tick={{ fill: 'var(--ink-faint)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
              tickLine={false} axisLine={{ stroke: 'var(--line)' }}
            />
            <YAxis
              stroke="var(--ink-faint)" tick={{ fill: 'var(--ink-faint)', fontSize: 10.5, fontFamily: 'JetBrains Mono' }}
              tickLine={false} axisLine={false}
              tickFormatter={(v: number) => `${v}cr`}
            />
            <Tooltip
              content={({ active, payload, label }: any) =>
                active && payload?.length ? (
                  <div style={{
                    background: 'var(--code-bg)', border: '1px solid var(--line-bright)', borderRadius: 8,
                    padding: '8px 12px', fontFamily: 'JetBrains Mono, monospace', fontSize: 12,
                  }}>
                    <div style={{ color: 'var(--ink-faint)' }}>{fmtYear(label)}</div>
                    {payload.map((p: any) => (
                      <div key={p.dataKey} style={{ color: p.stroke }}>
                        {p.dataKey}: {Number(p.value).toFixed(3)} cr
                      </div>
                    ))}
                  </div>
                ) : null
              }
            />
            <Legend
              wrapperStyle={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}
              formatter={(v: string) => (v === 'model' ? 'model (live)' : 'official anchors')}
            />
            <Line type="monotone" dataKey="official" stroke="var(--ink)" strokeWidth={0} dot={{ r: 4, fill: 'var(--ink)', strokeWidth: 0 }} isAnimationActive={false} />
            <Line type="monotone" dataKey="model" stroke="var(--accent)" strokeWidth={2.4} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="data-note">
        calibration note: the fraud share changes nothing in the admissions trajectory by design.
        Admissions are driven by enrollment and utilisation. Fraud drains the budget loop, which is
        the subject of the model's B2 block. Toggle it to see the modeled budget leak, not an
        admissions shift.
      </div>
    </div>
  );
}
