import { useEffect, useMemo, useRef, useState } from 'react';
import { projects } from '../data/projects';

const domainColor: Record<string, string> = {
  'Electoral Systems': '#4ade80',
  'Health Policy': '#38bdf8',
  'Defence & Strategic Trade': '#fbbf24',
  'Climate & Water': '#a78bfa',
  'Media & Information': '#f472b6',
};

const domainOrbs = [
  { name: 'Electoral Systems', color: '#4ade80' },
  { name: 'Health Policy', color: '#38bdf8' },
  { name: 'Defence & Strategic Trade', color: '#fbbf24' },
  { name: 'Climate & Water', color: '#a78bfa' },
  { name: 'Media & Information', color: '#f472b6' },
];

type HoverInfo = { title: string; domain: string; color: string; x: number; y: number };

/* stars: x, y, radius, base opacity, twinkle delay (ms) */
const STARS: [number, number, number, number, number][] = [
  [92, 64, 1.4, 0.7, 0], [210, 140, 1, 0.45, 900], [338, 52, 1.2, 0.6, 1800],
  [452, 118, 0.9, 0.4, 400], [560, 40, 1.3, 0.65, 1300], [648, 96, 1, 0.5, 2200],
  [780, 58, 1.4, 0.7, 700], [902, 130, 0.9, 0.4, 2600], [1018, 70, 1.2, 0.6, 1100],
  [1130, 44, 1, 0.5, 3000], [1244, 122, 1.3, 0.6, 500], [1348, 66, 1.1, 0.55, 1900],
  [1420, 158, 0.9, 0.4, 2800], [160, 210, 0.8, 0.3, 2400], [700, 180, 0.8, 0.3, 1500],
  [1060, 200, 0.8, 0.3, 3400], [260, 260, 0.7, 0.25, 600], [1380, 250, 0.7, 0.25, 2100],
];

/* One orbiting domain orb. The wrapper revolves around the flower center;
   the glyph counter-rotates so its label stays upright. */
function Orb({ name, color, i, r }: { name: string; color: string; i: number; r: number }) {
  const oa = i * 72 - 90 + (i % 2 ? 24 : -12);
  const od = 70 + i * 17;
  const delay = -(i * 11);
  const short = name.split(' ')[0].toLowerCase();
  const shared = {
    '--oa': `${oa}deg`,
    '--od': `${od}s`,
    '--sp': `${od}`,
    '--odelay': `${delay}s`,
  } as React.CSSProperties;
  return (
    <div className="orbit" style={{ ...shared, '--or': `${r}px` } as React.CSSProperties}>
      <a
        className="orb"
        href={`/projects/?domain=${encodeURIComponent(name)}`}
        aria-label={`Open projects filtered to ${name}`}
        title={`projects: ${name}`}
      >
        {/* three nested spans: center the glyph, counter the revolution, counter the start angle */}
        <span className="orb-glyph">
          <span className="orb-spin">
            <span className="orb-correct" style={{ color } as React.CSSProperties}>
              <span className="orb-dot" style={{ background: color, boxShadow: `0 0 14px ${color}` }} />
              <span className="orb-label">{short}</span>
            </span>
          </span>
        </span>
      </a>
    </div>
  );
}

/* Stylized ministry building at dusk, garden hedge, path, lampposts. */
function GardenBackdrop() {
  return (
    <div className="scene-backdrop" aria-hidden="true">
      <svg viewBox="0 0 1440 760" preserveAspectRatio="xMidYMax slice" fill="none">
        <defs>
          <linearGradient id="bd-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0a0e12" />
            <stop offset="0.62" stopColor="#0c141d" />
            <stop offset="1" stopColor="#12202b" />
          </linearGradient>
          <linearGradient id="bd-dome" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1a2833" />
            <stop offset="1" stopColor="#0e1720" />
          </linearGradient>
          <radialGradient id="bd-moonglow">
            <stop offset="0" stopColor="#dfe6ec" stopOpacity="0.22" />
            <stop offset="1" stopColor="#dfe6ec" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="bd-lamp">
            <stop offset="0" stopColor="#fbbf24" stopOpacity="0.4" />
            <stop offset="1" stopColor="#fbbf24" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="1440" height="760" fill="url(#bd-sky)" />

        {STARS.map(([x, y, r, o, d], i) => (
          <circle
            key={i} className="star" cx={x} cy={y} r={r} fill="#cfe3f2"
            style={{ '--so': o, animationDelay: `${d}ms` } as React.CSSProperties}
          />
        ))}

        {/* moon */}
        <circle cx="1186" cy="112" r="86" fill="url(#bd-moonglow)" />
        <circle cx="1186" cy="112" r="26" fill="#dfe6ec" opacity="0.85" />
        <circle cx="1178" cy="106" r="20" fill="#0c141d" opacity="0.55" />

        {/* paper clouds */}
        <g className="cloud" opacity="0.75">
          <ellipse cx="300" cy="150" rx="90" ry="16" fill="#141e29" />
          <ellipse cx="360" cy="140" rx="60" ry="12" fill="#141e29" />
        </g>
        <g className="cloud" opacity="0.6" style={{ animationDelay: '-30s' }}>
          <ellipse cx="920" cy="210" rx="110" ry="14" fill="#141e29" />
          <ellipse cx="980" cy="200" rx="66" ry="11" fill="#141e29" />
        </g>

        {/* distant skyline */}
        <path
          d="M0 520 L0 470 L60 470 L60 442 L118 442 L118 486 L176 486 L176 452 L240 452 L240 500 L300 500 L300 460 L364 460 L364 488 L430 488 L430 452 L500 452 L500 496 L940 496 L940 458 L1006 458 L1006 490 L1072 490 L1072 446 L1140 446 L1140 484 L1204 484 L1204 458 L1268 458 L1268 494 L1330 494 L1330 464 L1396 464 L1396 486 L1440 486 L1440 520 Z"
          fill="#0c1218" opacity="0.9"
        />
        {[80, 138, 268, 466, 960, 1092, 1226, 1352].map((x, i) => (
          <rect key={i} x={x} y={462 + (i % 3) * 8} width="6" height="8" fill="#fbbf24" opacity="0.16" />
        ))}

        {/* main ministry building */}
        <g stroke="#223140" strokeWidth="1">
          {/* steps */}
          <rect x="590" y="562" width="260" height="8" fill="#0f1720" />
          <rect x="578" y="570" width="284" height="8" fill="#101a24" />
          <rect x="566" y="578" width="308" height="8" fill="#111c26" />
          {/* wings */}
          <rect x="452" y="478" width="148" height="84" fill="#0f1922" />
          <rect x="840" y="478" width="148" height="84" fill="#0f1922" />
          {/* main block */}
          <rect x="600" y="440" width="240" height="122" fill="#101a24" />
          {/* columns */}
          {[614, 642, 670, 698, 742, 770, 798, 818].map((x, i) => (
            <rect key={i} x={x} y={448} width="11" height="106" fill="#15212d" />
          ))}
          {/* entablature + cornice */}
          <rect x="588" y="424" width="264" height="16" fill="#13202c" />
          <rect x="580" y="416" width="280" height="8" fill="#16242f" />
          {/* drum + dome */}
          <rect x="692" y="380" width="56" height="38" fill="#111c26" />
          <path d="M672 380 A 48 48 0 0 1 768 380 Z" fill="url(#bd-dome)" />
          <line x1="720" y1="332" x2="720" y2="318" stroke="#2d3a47" />
          <circle cx="720" cy="315" r="3" fill="#223140" />
        </g>
        {/* flag */}
        <g className="flag-wave">
          <rect x="721" y="286" width="22" height="4.5" fill="#f97316" opacity="0.7" />
          <rect x="721" y="290.5" width="22" height="4.5" fill="#e8edf2" opacity="0.75" />
          <rect x="721" y="295" width="22" height="4.5" fill="#4ade80" opacity="0.7" />
        </g>
        <line x1="720" y1="286" x2="720" y2="318" stroke="#2d3a47" strokeWidth="1.4" />
        {/* lit windows */}
        {[[470, 494], [500, 494], [560, 494], [880, 494], [910, 494], [946, 494]].map(([x, y], i) => (
          <rect key={i} x={x} y={y} width="12" height="14" fill="#fbbf24" opacity="0.13" />
        ))}
        {[[476, 522], [552, 522], [886, 522], [938, 522]].map(([x, y], i) => (
          <rect key={i} x={x} y={y} width="12" height="14" fill="#fbbf24" opacity="0.09" />
        ))}

        {/* garden hedges */}
        <g fill="#0d1713">
          <ellipse cx="150" cy="600" rx="170" ry="30" />
          <ellipse cx="420" cy="592" rx="150" ry="26" fill="#0f1a15" />
          <ellipse cx="1050" cy="592" rx="160" ry="27" />
          <ellipse cx="1310" cy="600" rx="160" ry="30" fill="#0f1a15" />
          <ellipse cx="260" cy="586" rx="26" ry="20" fill="#112018" />
          <ellipse cx="1190" cy="586" rx="26" ry="20" fill="#112018" />
        </g>

        {/* path from the steps to the viewer */}
        <path d="M660 586 L780 586 L980 760 L460 760 Z" fill="#121b25" opacity="0.9" />
        {/* paper scraps on the path */}
        <rect x="640" y="690" width="14" height="10" fill="#dfe6ec" opacity="0.1" transform="rotate(-14 647 695)" />
        <rect x="780" y="720" width="12" height="9" fill="#dfe6ec" opacity="0.12" transform="rotate(9 786 724)" />
        <rect x="720" y="662" width="10" height="8" fill="#dfe6ec" opacity="0.09" transform="rotate(-5 725 666)" />

        {/* lampposts */}
        <g>
          <line x1="470" y1="512" x2="470" y2="600" stroke="#1f2933" strokeWidth="3" />
          <path d="M470 498 L480 512 L470 526 L460 512 Z" fill="#fbbf24" opacity="0.8" />
          <circle cx="470" cy="512" r="26" fill="url(#bd-lamp)" className="lamp-glow" />
          <line x1="970" y1="512" x2="970" y2="600" stroke="#1f2933" strokeWidth="3" />
          <path d="M970 498 L980 512 L970 526 L960 512 Z" fill="#fbbf24" opacity="0.8" />
          <circle cx="970" cy="512" r="26" fill="url(#bd-lamp)" className="lamp-glow" />
        </g>

        {/* foreground grass */}
        <rect y="726" width="1440" height="34" fill="#0c1512" />
        <g stroke="#142019" strokeWidth="2">
          <path d="M120 760 C 122 748, 118 742, 122 734" />
          <path d="M148 760 C 150 750, 146 744, 150 738" />
          <path d="M360 760 C 362 750, 358 744, 362 736" />
          <path d="M1080 760 C 1082 750, 1078 744, 1082 736" />
          <path d="M1310 760 C 1312 748, 1308 742, 1312 734" />
          <path d="M1338 760 C 1340 750, 1336 744, 1340 738" />
        </g>
      </svg>
    </div>
  );
}

/* The paper-mache gardener: a crumpled-paper figure holding the stem.
   The bud itself is the live 3D flower component, positioned on the
   .hand-anchor point so the two always line up. */
function PaperFigure() {
  return (
    <svg viewBox="0 0 286 340" style={{ width: '100%', height: 'auto', display: 'block' }} fill="none">
      <defs>
        <filter id="paper-crinkle" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.055 0.045" numOctaves="4" seed="11" result="noise" />
          <feDiffuseLighting in="noise" lightingColor="#ffffff" surfaceScale="1.4" result="light">
            <feDistantLight azimuth="230" elevation="58" />
          </feDiffuseLighting>
          <feComposite in="light" in2="SourceGraphic" operator="arithmetic" k1="1" k2="0" k3="0" k4="0" />
        </filter>
      </defs>

      {/* ground shadow */}
      <ellipse cx="130" cy="326" rx="108" ry="11" fill="#000000" opacity="0.35" />

      <g filter="url(#paper-crinkle)">
        {/* legs */}
        <path d="M104 220 C 100 260, 96 292, 98 316 L118 316 C 118 288, 120 258, 124 226 Z" fill="#b9c4cf" />
        <path d="M136 224 C 140 260, 142 292, 142 316 L162 316 C 160 288, 156 256, 152 222 Z" fill="#b9c4cf" />
        {/* shoes */}
        <rect x="94" y="312" width="28" height="10" rx="4" fill="#1c2630" />
        <rect x="140" y="312" width="28" height="10" rx="4" fill="#1c2630" />
        {/* kurta */}
        <path d="M92 130 C 88 160, 90 202, 96 234 L166 234 C 172 202, 174 160, 168 130 C 150 118, 108 118, 92 130 Z" fill="#ccd6df" />
        {/* scarf */}
        <path d="M96 138 C 112 150, 150 150, 166 136 L166 150 C 150 164, 112 164, 96 152 Z" fill="#4ade80" opacity="0.45" />
        {/* collar + buttons */}
        <path d="M118 128 L130 148 L142 128" stroke="#8fa0ae" strokeWidth="2" />
        <line x1="130" y1="152" x2="130" y2="212" stroke="#8fa0ae" strokeWidth="1.6" strokeDasharray="2 6" />
        {/* hanging arm */}
        <path d="M96 138 C 84 160, 80 186, 84 206 L98 202 C 96 184, 100 162, 108 146 Z" fill="#c3cdd6" />
        {/* raised arm toward the bud */}
        <path d="M164 132 C 186 136, 202 148, 212 132 L222 138 C 210 156, 188 160, 164 148 Z" fill="#c3cdd6" />
        {/* neck + head */}
        <rect x="123" y="106" width="15" height="16" fill="#d9e1e8" />
        <circle cx="131" cy="84" r="30" fill="#dde4ea" />
      </g>

      {/* hand and stem sit outside the crinkle filter so they read sharp */}
      <circle cx="217" cy="126" r="7.5" fill="#d9e1e8" stroke="#aebbc6" strokeWidth="1" />
      <path className="stem" d="M218 122 C 220 108, 222 96, 224 84" stroke="#4ade80" strokeWidth="2.6" opacity="0.85" />
      <path className="stem" d="M221 104 C 227 100, 231 100, 235 103 C 231 107, 226 108, 221 106 Z" fill="#4ade80" opacity="0.6" />

      <g filter="url(#paper-crinkle)">
        {/* hair */}
        <path d="M101 84 C 100 62, 116 50, 131 50 C 148 50, 162 62, 161 82 C 154 70, 146 64, 131 64 C 116 64, 108 70, 101 84 Z" fill="#26313c" />
      </g>

      {/* glasses + face */}
      <rect x="112" y="77" width="15" height="11" rx="2.5" stroke="#1c2630" strokeWidth="1.8" fill="#10151b" fillOpacity="0.25" />
      <rect x="135" y="77" width="15" height="11" rx="2.5" stroke="#1c2630" strokeWidth="1.8" fill="#10151b" fillOpacity="0.25" />
      <line x1="127" y1="82" x2="135" y2="82" stroke="#1c2630" strokeWidth="1.8" />
      <circle cx="119.5" cy="83" r="1.7" fill="#10151b" />
      <circle cx="142.5" cy="83" r="1.7" fill="#10151b" />
      <path d="M124 99 Q 131 104 138 99" stroke="#8fa0ae" strokeWidth="1.8" />
    </svg>
  );
}

export default function GardenScene() {
  const [phase, setPhase] = useState<'bud' | 'bloom'>('bud');
  const [hover, setHover] = useState<HoverInfo | null>(null);
  const [fit, setFit] = useState(1);
  const [bud, setBud] = useState({ x: -150, y: 120 });
  const [bloomY, setBloomY] = useState(40);
  const [orbitR, setOrbitR] = useState(250);
  const [dragging, setDragging] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const flowerRef = useRef<HTMLDivElement>(null);
  const handRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ on: false, moved: 0, sx: 0, sy: 0, rx: -22, ry: 0, ptrId: -1, captured: false });
  const suppress = useRef(false);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    /* with animations off the bud reveal never plays: open straight into the bloom.
       ?bloom=1 deep links the open state so it can be shared and tested. */
    if (reduced.current || new URLSearchParams(window.location.search).has('bloom')) {
      setPhase('bloom');
    }
  }, []);

  /* keep the bloom inside the stage and the bud glued to the figure's hands */
  useEffect(() => {
    const measure = () => {
      const el = stageRef.current;
      if (!el) return;
      const w = el.clientWidth;
      const h = el.clientHeight;
      /* cup geometry: heart at 10% below center, crown may use 72% of the
         stage height above it. Tallest petal: 750px x 1.11 max length
         factor, near-vertical (inner curl), with flutter margin. */
      const s = Math.max(0.3, Math.min((w / 2 - 40) / 440, (h * 0.72 - 30) / 840, 1));
      setFit(s);
      setBloomY(Math.round(h * 0.1));
      setOrbitR(Math.max(150, Math.min(Math.min(w, h) / 2 - 66, 310)));
      const hand = handRef.current;
      if (hand) {
        const sr = el.getBoundingClientRect();
        const hr = hand.getBoundingClientRect();
        const bx = hr.left + hr.width / 2 - (sr.left + sr.width / 2);
        const by = hr.top + hr.height / 2 - (sr.top + sr.height / 2) - 40;
        setBud({ x: bx, y: by });
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (stageRef.current) ro.observe(stageRef.current);
    window.addEventListener('resize', measure);
    const t = setTimeout(measure, 350);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
      clearTimeout(t);
    };
  }, []);

  const petals = useMemo(
    () =>
      projects.map((p, i) => ({
        ...p,
        angle: (360 / projects.length) * i,
        /* three rings: the inner ring curls subtly INWARD (negative lean),
           mid and outer rings lean out, so the crown reads as a layered cup
           with an incurved heart rather than a uniform cone. */
        lean: [-12, 26, 40][i % 3],
        pring: [0, 22, 44][i % 3],
        /* per-domain length factors break the uniform silhouette:
           the lone health petal (PM-JAY) stands tallest, defence shortest */
        len:
          ({ Electoral: 1.0, Health: 1.08, Defence: 0.9, Climate: 1.05, Media: 0.94 } as Record<string, number>)[
            p.domain
          ] ?? 1,
        flDur: 4.2 + (i % 4) * 0.8,
        flDelay: -(i * 0.9),
        color: domainColor[p.domain] ?? '#4ade80',
        delay: i * 60,
      })),
    []
  );

  const show = (e: React.MouseEvent | React.FocusEvent, p: (typeof petals)[number]) => {
    const target = e.currentTarget as HTMLElement;
    /* anchor the tooltip at the petal's visible tip, not its layout box center */
    const anchor = target.querySelector('.petal-anchor') as HTMLElement | null;
    const r = (anchor ?? target).getBoundingClientRect();
    setHover({ title: p.title, domain: p.domain, color: p.color, x: r.left + r.width / 2, y: r.top });
  };

  const resetTilt = () => {
    const tilt = tiltRef.current;
    if (tilt) {
      tilt.style.setProperty('--px', '0');
      tilt.style.setProperty('--py', '0');
    }
  };

  const bloom = () => {
    setPhase((prev) => {
      if (prev === 'bloom') return prev;
      const f = flowerRef.current;
      if (f) {
        f.style.setProperty('--frx', '-22deg');
        f.style.setProperty('--fry', '0deg');
      }
      drag.current.rx = -22;
      drag.current.ry = 0;
      return 'bloom';
    });
  };

  /* fold the open lotus back into the bud in the gardener's hands */
  const fold = () => {
    const f = flowerRef.current;
    if (f) {
      f.style.setProperty('--frx', '-22deg');
      f.style.setProperty('--fry', '0deg');
    }
    drag.current.rx = -22;
    drag.current.ry = 0;
    setHover(null);
    setPhase('bud');
  };

  const onDown = (e: React.PointerEvent) => {
    if (phase !== 'bloom' || reduced.current) return;
    /* pressing the fold control is not a drag */
    if ((e.target as HTMLElement).closest('.lotus-core')) return;
    const d = drag.current;
    d.on = true;
    d.moved = 0;
    d.captured = false;
    d.ptrId = e.pointerId;
    d.sx = e.clientX;
    d.sy = e.clientY;
    setDragging(true);
    setHover(null);
    /* NO setPointerCapture here: capturing on pointerdown retargets the
       derived click to the stage, which silently swallows petal clicks.
       Capture is taken in onMove once a real drag is underway. */
  };

  const onMove = (e: React.PointerEvent) => {
    const el = stageRef.current;
    const tilt = tiltRef.current;
    if (el && tilt && !reduced.current && !drag.current.on) {
      const r = el.getBoundingClientRect();
      tilt.style.setProperty('--px', ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
      tilt.style.setProperty('--py', ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
    }
    const d = drag.current;
    if (!d.on) return;
    const dx = e.clientX - d.sx;
    const dy = e.clientY - d.sy;
    d.moved = Math.max(d.moved, Math.abs(dx), Math.abs(dy));
    /* take pointer capture only once drag intent is clear, so plain clicks
       keep their normal target (the petal) and drags keep receiving moves */
    if (!d.captured && d.moved > 6 && stageRef.current) {
      try {
        stageRef.current.setPointerCapture(d.ptrId);
        d.captured = true;
      } catch {
        /* synthetic events may not support capture */
      }
    }
    /* yaw is unclamped: a full turntable spin around the stem axis.
       pitch: from near top-down (-100) to a look from underneath (+55) */
    d.ry = d.ry + dx * 0.35;
    d.rx = Math.max(-100, Math.min(55, d.rx - dy * 0.28));
    const f = flowerRef.current;
    if (f) {
      f.style.setProperty('--fry', `${d.ry}deg`);
      f.style.setProperty('--frx', `${d.rx}deg`);
    }
  };

  const onUp = () => {
    const d = drag.current;
    if (!d.on) return;
    d.on = false;
    setDragging(false);
    if (d.moved > 8) {
      suppress.current = true;
      setTimeout(() => {
        suppress.current = false;
      }, 150);
    }
  };

  const onClickCapture = (e: React.MouseEvent) => {
    if (suppress.current) {
      e.preventDefault();
      e.stopPropagation();
      suppress.current = false;
    }
  };

  return (
    <div
      className={`scene-stage phase-${phase} ${dragging ? 'is-dragging' : ''}`}
      ref={stageRef}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      onPointerLeave={() => {
        onUp();
        resetTilt();
      }}
      onClickCapture={onClickCapture}
      onMouseLeave={() => setHover(null)}
    >
      <div className="scene-tilt" ref={tiltRef}>
        <GardenBackdrop />

        <div className="scene-fig" aria-hidden="true">
          <PaperFigure />
          <div className="hand-anchor" ref={handRef} />
        </div>
        <div className="figure-tag mono">the gardener · shivang uniyal</div>

        {/* the orbital field tracks the flower so orbs always circle the bloom */}
        <div
          className="orbit-field"
          style={{ '--bx': `${bud.x}px`, '--by': `${bud.y}px` } as React.CSSProperties}
        >
          <div className="orbit-ring" style={{ '--ring': `${orbitR}px` } as React.CSSProperties} />
          {domainOrbs.map((d, i) => (
            <Orb key={d.name} name={d.name} color={d.color} i={i} r={orbitR - (i % 2) * 26} />
          ))}
        </div>

        <div className="scene-scrim" aria-hidden="true" />

        <div
          className="flower-pos"
          style={
            {
              '--bx': `${bud.x}px`,
              '--by': `${bud.y}px`,
              '--bloom-y': `${bloomY}px`,
            } as React.CSSProperties
          }
        >
          <div className="bud-glow" aria-hidden="true" />
          <div className="flower-bob">
            <div className="flower-scale" style={{ '--fit': fit } as React.CSSProperties}>
            <div className="flower3d" ref={flowerRef}>
              {phase === 'bud' && (
                <button className="bud-hit" onClick={bloom} aria-label="Bloom the project lotus" />
              )}
              <div className="f-spind" style={{ animationPlayState: hover ? 'paused' : 'running' }}>
                {petals.map((p, i) => (
                  <a
                    key={p.slug}
                    href={`/projects/${p.slug}/`}
                    className="petal3d"
                    style={
                      {
                        '--pa': `${p.angle}deg`,
                        '--lean': `${p.lean}deg`,
                        '--pring': `${p.pring}px`,
                        '--plen': `${(p.len * (i % 2 ? 1.03 : 0.99)).toFixed(3)}`,
                        '--pd': `${p.delay}ms`,
                        '--fl-dur': `${p.flDur}s`,
                        '--fl-delay': `${p.flDelay}s`,
                        color: p.color,
                      } as React.CSSProperties
                    }
                    aria-label={`${p.title} - ${p.domain}`}
                    aria-hidden={phase === 'bud' ? true : undefined}
                    tabIndex={phase === 'bud' ? -1 : 0}
                    onMouseEnter={(e) => show(e, p)}
                    onFocus={(e) => show(e, p)}
                    onBlur={() => setHover(null)}
                  >
                    <span className="petal-anchor" aria-hidden="true" />
                    <span className="petal-flutter" aria-hidden="true">
                    <svg
                      className="petal3d-shape"
                      width="330"
                      height="750"
                      viewBox="0 0 132 300"
                      fill="none"
                      style={{ overflow: 'visible', display: 'block' }}
                    >
                      <path
                        d="M66 150 C 96 170, 116 220, 110 258 C 105 282, 88 292, 66 294 C 44 292, 27 282, 22 258 C 16 220, 36 170, 66 150 Z"
                        fill={p.color}
                        fillOpacity={0.3}
                        stroke={p.color}
                        strokeWidth={1.8}
                        vectorEffect="non-scaling-stroke"
                      />
                      <path
                        d="M66 158 C 70 200, 72 240, 70 276"
                        stroke={p.color}
                        strokeOpacity={0.6}
                        strokeWidth={1.4}
                        strokeDasharray="3 5"
                        vectorEffect="non-scaling-stroke"
                      />
                    </svg>
                    </span>
                  </a>
                ))}
              </div>
            </div>
            </div>
          </div>

          <button
            type="button"
            className={`lotus-core ${phase === 'bloom' ? 'core-on' : ''}`}
            onClick={fold}
            tabIndex={phase === 'bloom' ? 0 : -1}
            aria-label="Fold the lotus back into the bud"
            aria-hidden={phase !== 'bloom'}
          >
            <span className="core-num">{projects.length}</span>
            <span className="core-txt">projects</span>
            <span className="core-fold">fold</span>
          </button>
        </div>

        <div className="bloom-hint mono">drag to turn · hover a petal to read · click to open · click the heart to fold</div>

        <div
          className="bud-hint mono"
          style={{ left: `calc(50% + ${bud.x + 46}px)`, top: `calc(50% + ${bud.y}px)` }}
        >
          click the bud
        </div>
      </div>

      {/* dusk layer: the landing script raises --skydim (0..1) as the visitor
          scrolls from the garden into the projects section, so the sky
          deepens toward the page background and the handoff is seamless */}
      <div className="sky-dim" aria-hidden="true" />

      {hover && (
        <div
          className={`lotus-tip ${hover.y < 110 ? 'lotus-tip-below' : ''}`}
          style={{ left: hover.x, top: hover.y, borderColor: hover.color }}
          role="status"
        >
          <span className="pl-domain" style={{ color: hover.color }}>{hover.domain}</span>
          {hover.title}
        </div>
      )}
    </div>
  );
}
