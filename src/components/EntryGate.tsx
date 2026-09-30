import { useEffect, useState } from 'react';

/**
 * Entry gate: one question before the portfolio opens.
 * Accepts "people", "society", "public welfare", "welfare", "public good",
 * "public", and close synonyms, matched on whole words or phrases.
 * Passes are remembered for the browser session only.
 */

const KEY = 'lotus-gate-passed';

const ACCEPT = [
  'people', 'the people', 'society', 'public', 'the public', 'general public',
  'public welfare', 'welfare', 'public good', 'the public good',
  'common good', 'commons', 'community', 'communities', 'citizens', 'citizen',
  'humanity', 'everyone', 'all of us', 'us', 'majority', 'masses', 'the masses',
  'vulnerable', 'the vulnerable', 'poor', 'the poor', 'marginalized',
  'the marginalized', 'marginalised', 'the marginalised', 'nation', 'country',
  'individuals', 'individual', 'everybody', 'all people', 'ordinary people',
  'aam aadmi', 'aam janata', 'janata', 'log', 'janta', 'public interest',
];

const norm = (s: string) => s.toLowerCase().replace(/[^a-z\s]/g, ' ').replace(/\s+/g, ' ').trim();

function isAcceptable(raw: string): boolean {
  const t = norm(raw);
  if (!t) return false;
  // exact phrase hit
  if (ACCEPT.includes(t)) return true;
  // whole word/phrase containment ("it should serve the public good")
  return ACCEPT.some((a) => new RegExp(`(^|\\s)${a}(\\s|$)`).test(t));
}

export default function EntryGate() {
  const [status, setStatus] = useState<'loading' | 'gated' | 'open'>('loading');
  const [answer, setAnswer] = useState('');
  const [shake, setShake] = useState(false);
  const [hint, setHint] = useState(false);

  useEffect(() => {
    try {
      setStatus(sessionStorage.getItem(KEY) === '1' ? 'open' : 'gated');
    } catch {
      setStatus('gated');
    }
  }, []);

  // lock page scroll while the gate is up
  useEffect(() => {
    document.body.style.overflow = status === 'gated' ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [status]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAcceptable(answer)) {
      try { sessionStorage.setItem(KEY, '1'); } catch {}
      setStatus('open');
    } else {
      setShake(true);
      setHint(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  if (status !== 'gated') return null;

  return (
      <div className="gate-screen" role="dialog" aria-modal="true" aria-label="Entry question">
        <div className={`gate-card ${shake ? 'gate-shake' : ''}`}>
          <div className="gate-kicker">gate // one question</div>
          <h1 className="gate-q">Who do you think policies should serve?</h1>
          <form onSubmit={submit} className="gate-form">
            <input
              autoFocus
              className="gate-input"
              type="text"
              value={answer}
              onChange={(e) => { setAnswer(e.target.value); setHint(false); }}
              placeholder="type your answer"
              aria-label="Your answer"
              autoComplete="off"
            />
            <button className="btn primary gate-btn" type="submit">enter →</button>
          </form>
          {hint && (
            <p className="gate-hint">
              close. think simpler: people, society, public welfare, the public good.
            </p>
          )}
          <p className="gate-foot">your answer is not stored. it opens the page, nothing else.</p>
        </div>
        <style>{`
          .gate-screen {
            position: fixed; inset: 0; z-index: 500;
            display: flex; align-items: center; justify-content: center;
            background:
              radial-gradient(ellipse 80% 60% at 50% 38%, rgba(74,222,128,0.05), transparent 65%),
              var(--bg);
            padding: 24px;
          }
          .gate-card {
            max-width: 560px; width: 100%;
            background: var(--bg-card);
            border: 1px solid var(--line-bright);
            border-radius: 14px;
            padding: 44px 40px 36px;
            box-shadow: 0 30px 90px rgba(0,0,0,0.55);
            text-align: center;
          }
          .gate-kicker {
            font-family: var(--font-mono); font-size: 11.5px;
            letter-spacing: 0.16em; text-transform: uppercase;
            color: var(--accent); margin-bottom: 20px;
          }
          .gate-q {
            font-family: var(--font-mono); font-weight: 600; letter-spacing: -0.02em;
            font-size: clamp(24px, 3.4vw, 34px);
            color: var(--ink); line-height: 1.25; margin: 0 0 28px;
          }
          .gate-form { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
          .gate-input {
            flex: 1 1 240px; min-width: 0;
            background: var(--bg-raised); color: var(--ink);
            border: 1px solid var(--line-bright); border-radius: 8px;
            font-family: var(--font-mono); font-size: 14px;
            padding: 12px 14px; outline: none;
            transition: border-color 0.2s;
          }
          .gate-input:focus { border-color: var(--accent); }
          .gate-btn { flex: 0 0 auto; }
          .gate-hint {
            font-family: var(--font-mono); font-size: 12px;
            color: var(--amber); margin: 18px 0 0;
          }
          .gate-foot {
            font-family: var(--font-mono); font-size: 10.5px;
            color: var(--ink-faint); margin: 22px 0 0;
          }
          .gate-shake { animation: gateShake 0.45s ease; }
          @keyframes gateShake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-9px); }
            50% { transform: translateX(8px); }
            75% { transform: translateX(-5px); }
          }
          @media (prefers-reduced-motion: reduce) {
            .gate-shake { animation: none; }
          }
        `}</style>
      </div>
  );
}
