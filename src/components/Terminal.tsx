import { useEffect, useState, useRef } from 'react';

type Line = { cmd?: string; out?: React.ReactNode };

const script: Line[] = [
  { cmd: 'whoami' },
  {
    out: (
      <>
        <span className="hl">Shivang Uniyal</span> · Policy Engineer · MPP, IIT Delhi
      </>
    ),
  },
  { cmd: 'cat research.sql' },
  {
    out: (
      <>
        <span className="c2">SELECT</span> evidence <span className="c2">FROM</span> messy_world
        <br />
        <span className="c2">WHERE</span> policy_questions <span className="c2">IS NOT NULL</span>;
      </>
    ),
  },
  { cmd: './run --causal --grid --nlp' },
  {
    out: (
      <>
        [ok] EVM × gender turnout <span className="hl">p_RI = 0.039</span> · 529 districts
        <br />
        [ok] PM-JAY calibrated · <span className="hl">9.19 cr</span> admissions traced to PIB
        <br />
        [ok] 48,780 mineral-trade dyads · OOD AUC <span className="hl">0.855</span>
        <br />
        [ok] aquifer memory → Difference-GMM → <span className="hl">2029</span> handpump threshold
      </>
    ),
  },
];

export default function Terminal() {
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !startedRef.current) {
          startedRef.current = true;
          setLineIdx(0);
          setCharIdx(0);
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!startedRef.current) return;
    if (lineIdx >= script.length) {
      const t = setInterval(() => setShowCursor((s) => !s), 530);
      return () => clearInterval(t);
    }
    const line = script[lineIdx];
    const text = line.cmd ?? '';
    if (charIdx < text.length) {
      const t = setTimeout(() => setCharIdx((c) => c + 1), line.cmd ? 34 + Math.random() * 46 : 0);
      return () => clearTimeout(t);
    }
    const pause = line.cmd ? 420 : 900;
    const t = setTimeout(() => {
      setLineIdx((l) => l + 1);
      setCharIdx(0);
    }, line.cmd && charIdx === text.length ? pause : 240);
    return () => clearTimeout(t);
  }, [lineIdx, charIdx, startedRef.current]);

  const done = lineIdx >= script.length;

  return (
    <div className="terminal" ref={rootRef}>
      <div className="terminal-head">
        <span className="tl" style={{ background: '#ff5f57' }} />
        <span className="tl" style={{ background: '#febc2e' }} />
        <span className="tl" style={{ background: '#28c840' }} />
        <span className="title">shivang@policy-engine · zsh</span>
      </div>
      <div className="terminal-body">
        {script.map((line, i) => {
          if (i > lineIdx) return null;
          const isCmd = !!line.cmd;
          const typing = i === lineIdx && !done;
          const text = isCmd ? line.cmd!.slice(0, charIdx) : null;
          return (
            <div key={i} className={isCmd ? 'cmd' : 'out'}>
              {isCmd ? (
                <>
                  <span className="prompt">➜</span>
                  {text}
                  {typing && <span className="cursor" />}
                </>
              ) : i < lineIdx || done ? (
                line.out
              ) : (
                <span style={{ opacity: 0 }}>.</span>
              )}
            </div>
          );
        })}
        {done && <span className="cursor" />}
      </div>
    </div>
  );
}
