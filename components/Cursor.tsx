'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

// Desktop-only follower. Never replaces the cursor on touch, small screens, or reduced motion; never intercepts clicks.
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const ok = matchMedia('(hover: hover) and (pointer: fine) and (min-width: 1024px) and (prefers-reduced-motion: no-preference)').matches;
    if (!ok || !dot.current) return;
    document.body.classList.add('has-cursor');
    const x = gsap.quickTo(dot.current, 'x', { duration: 0.25, ease: 'power3' });
    const y = gsap.quickTo(dot.current, 'y', { duration: 0.25, ease: 'power3' });
    const move = (e: PointerEvent) => {
      x(e.clientX); y(e.clientY);
      const t = (e.target as HTMLElement | null)?.closest?.('[data-cursor]') as HTMLElement | null;
      const text = t?.dataset.cursor ?? '';
      if (label.current) label.current.textContent = text;
      gsap.to(dot.current, { scale: text ? 4 : (e.target as HTMLElement | null)?.closest?.('a,button') ? 2 : 1, duration: 0.3, overwrite: 'auto' });
      gsap.to(dot.current, { opacity: 1, duration: 0.2, overwrite: false });
    };
    addEventListener('pointermove', move);
    return () => { removeEventListener('pointermove', move); document.body.classList.remove('has-cursor'); };
  }, []);
  return (
    <div ref={dot} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[90] -ml-2 -mt-2 grid h-4 w-4 place-items-center rounded-full bg-gold opacity-0 mix-blend-difference">
      <span ref={label} className="font-mono text-[3px] uppercase tracking-widest text-obsidian" />
    </div>
  );
}
