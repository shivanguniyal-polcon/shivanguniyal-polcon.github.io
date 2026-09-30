import { useEffect, useRef, useState } from 'react';

type StatDef = {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  label: string;
};

const stats: StatDef[] = [
  { value: 12, suffix: '', label: 'research builds shipped' },
  { value: 48780, label: 'trade observations engineered' },
  { value: 75000, suffix: '+', label: 'articles under NLP analysis' },
  { value: 9.19, decimals: 2, suffix: ' cr', label: 'PM-JAY admissions reconstructed' },
];

function useInView() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (e) => {
        if (e[0].isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, inView };
}

function Counter({ stat, run }: { stat: StatDef; run: boolean }) {
  const [display, setDisplay] = useState('0');
  useEffect(() => {
    if (!run) return;
    const duration = 1600;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 4);
      const val = stat.value * eased;
      setDisplay(
        stat.decimals != null
          ? val.toFixed(stat.decimals)
          : Math.round(val).toLocaleString('en-IN')
      );
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, stat]);

  return (
    <div className="stat">
      <div className="value">
        {stat.prefix}
        {display}
        {stat.suffix && <span className="unit">{stat.suffix}</span>}
      </div>
      <div className="label">{stat.label}</div>
    </div>
  );
}

export default function LiveCounters() {
  const { ref, inView } = useInView();
  return (
    <div className="stat-row" ref={ref}>
      {stats.map((s) => (
        <Counter key={s.label} stat={s} run={inView} />
      ))}
    </div>
  );
}
