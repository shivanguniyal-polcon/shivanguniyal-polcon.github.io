import { useMemo, useState } from 'react';

/**
 * Manifesto taxonomy view: how a zero-temperature LLM pipeline turns
 * six manifestos of raw promises into a 17-section agenda dataset.
 * The left panel walks one promise through the pipeline; the right panel
 * shows the taxonomy the classifier must choose from. All illustrative,
 * the real corpus lives in the project repo.
 */

const SECTIONS = [
  'Agriculture', 'Economy & Finance', 'Education', 'Energy & Environment',
  'Foreign Policy', 'Governance & Anti-Corruption', 'Health', 'Infrastructure',
  'Labour & Employment', 'Rural Development', 'SC/ST/OBC', 'Social Justice & Minorities',
  'Urban Development', 'Women & Child Development', 'Youth & Sports',
  'Defence & Security', 'Other',
];

const EXAMPLES = [
  { text: 'Double farmers\' income through MSP expansion and drip-irrigation subsidies', label: 'Agriculture', tricky: false },
  { text: 'Free power for all tube wells in water-stressed blocks', label: 'Agriculture → disambiguated from Energy', tricky: true },
  { text: 'One medical college in every district hospital', label: 'Health', tricky: false },
  { text: 'Conditional cash transfer of ₹6,000 per year for pregnant women', label: 'Women & Child Development', tricky: true },
  { text: 'Two aircraft carriers by 2030', label: 'Defence & Security', tricky: false },
  { text: 'Guaranteed 200 days of urban wage employment', label: 'Labour & Employment', tricky: false },
];

export default function TaxonomyChart() {
  const [idx, setIdx] = useState(0);
  const ex = EXAMPLES[idx];

  const prompt = useMemo(
    () =>
      `You are a political science research assistant. Classify this manifesto promise into EXACTLY ONE of the 17 sections. Output only the section name. If it spans domains, choose the primary one. Promise: "${ex.text}" Answer:`,
    [ex.text]
  );

  return (
    <div className="chart-frame">
      <h4>The classification pipeline, one promise at a time</h4>
      <div className="sub">
        temperature = 0 · max_tokens = 10 · output enforced against the 17-section list · sampled manual audits
      </div>

      <div className="toggle-row">
        {EXAMPLES.map((e, i) => (
          <button key={i} className={`filter-btn ${i === idx ? 'active' : ''}`} onClick={() => setIdx(i)}>
            promise {i + 1}{e.tricky ? ' *' : ''}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginTop: 10 }} className="taxo-grid">
        <div>
          <div className="mono faint" style={{ fontSize: 11, marginBottom: 6 }}>INPUT · raw promise</div>
          <div className="card" style={{ padding: '14px 16px', fontSize: 14.5, fontStyle: 'italic' }}>
            &ldquo;{ex.text}&rdquo;
          </div>
          <div className="mono faint" style={{ fontSize: 11, margin: '14px 0 6px' }}>PROMPT · zero temperature</div>
          <div
            className="mono"
            style={{
              fontSize: 11.5, lineHeight: 1.7, padding: '12px 14px', borderRadius: 8,
              background: 'var(--code-bg)', border: '1px solid var(--line-bright)', color: 'var(--ink-dim)',
              whiteSpace: 'pre-wrap',
            }}
          >
            {prompt}
            <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{ex.label.split(' → ')[0]}</span>
          </div>
        </div>
        <div>
          <div className="mono faint" style={{ fontSize: 11, marginBottom: 6 }}>TAXONOMY · exactly one primary domain</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {SECTIONS.map((s) => {
              const hit = s === ex.label.split(' → ')[0];
              return (
                <span
                  key={s}
                  className="chip"
                  style={
                    hit
                      ? { borderColor: 'var(--accent)', color: '#05130a', background: 'var(--accent)', fontWeight: 700 }
                      : undefined
                  }
                >
                  {s}
                </span>
              );
            })}
          </div>
          {ex.tricky && (
            <div className="data-note" style={{ marginTop: 14 }}>
              * a disambiguation case: the promise spans domains, the pipeline must choose the primary one. This is
              where naive keyword tagging fails and the audit workbooks earn their keep.
            </div>
          )}
        </div>
      </div>

      <div className="data-note">
        Six manifestos (BJP and INC, 2014 to 2024) run through this pipeline promise by promise; two manual code-review
        workbooks validate sampled output against human gold sets. The methodology memo became{' '}
        <em>A Voter&apos;s Guide to Reading a Manifesto</em> with the Vidhi Centre for Legal Policy.
      </div>

      <style>{`
        @media (max-width: 820px) { .taxo-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
