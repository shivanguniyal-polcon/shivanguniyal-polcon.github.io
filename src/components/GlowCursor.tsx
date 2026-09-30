import { useEffect, useRef, useState } from 'react';

/**
 * Terminal glow cursor: a glowing pointer dot with a short trailing light.
 * Over links, buttons and petals it snaps into corner brackets.
 * Disabled on touch devices and for prefers-reduced-motion users.
 */
export default function GlowCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const bracketsRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return;
    setEnabled(true);
    document.body.classList.add('cursor-custom');

    const pos = { x: -100, y: -100 };
    const trail = { x: -100, y: -100 };
    let hovering = false;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      const t = e.target as HTMLElement | null;
      hovering = !!t?.closest('a, button, input, [role="button"], .petal, label');
    };

    window.addEventListener('mousemove', onMove, { passive: true });

    const tick = () => {
      trail.x += (pos.x - trail.x) * 0.16;
      trail.y += (pos.y - trail.y) * 0.16;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%)`;
      }
      if (trailRef.current) {
        trailRef.current.style.transform = `translate(${trail.x}px, ${trail.y}px) translate(-50%, -50%)`;
      }
      if (bracketsRef.current) {
        bracketsRef.current.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%)`;
        bracketsRef.current.style.opacity = hovering ? '1' : '0';
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
      document.body.classList.remove('cursor-custom');
    };
  }, []);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999 }}>
      {/* trailing glow */}
      <div
        ref={trailRef}
        style={{
          position: 'fixed', top: 0, left: 0, width: 26, height: 26, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(74,222,128,0.22) 0%, rgba(74,222,128,0) 70%)',
          filter: 'blur(2px)',
        }}
      />
      {/* pointer dot */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed', top: 0, left: 0, width: 7, height: 7, borderRadius: '50%',
          background: '#4ade80',
          boxShadow: '0 0 10px #4ade80, 0 0 22px rgba(74,222,128,0.55)',
        }}
      />
      {/* corner brackets over interactive targets */}
      <div
        ref={bracketsRef}
        style={{
          position: 'fixed', top: 0, left: 0, width: 34, height: 34,
          opacity: 0, transition: 'opacity 0.15s ease',
          color: '#38bdf8',
        }}
      >
        <svg width="34" height="34" viewBox="0 0 34 34" fill="none" style={{ filter: 'drop-shadow(0 0 5px rgba(56,189,248,0.7))' }}>
          <path d="M1 10 V1 H10" stroke="currentColor" strokeWidth="1.6" />
          <path d="M24 1 H33 V10" stroke="currentColor" strokeWidth="1.6" />
          <path d="M33 24 V33 H24" stroke="currentColor" strokeWidth="1.6" />
          <path d="M10 33 H1 V24" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      </div>
    </div>
  );
}
