'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

// Brief once-per-session intro. The line is indeterminate (no fake percentage) and the overlay leaves when the page has actually loaded.
export default function Intro() {
  const [show, setShow] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let seen = false; try { seen = !!sessionStorage.getItem('intro'); } catch {}
    if (reduce || seen) return;
    setShow(true);
  }, []);
  useEffect(() => {
    if (!show || !root.current) return;
    const el = root.current;
    const tl = gsap.timeline();
    gsap.fromTo(el.querySelector('.line'), { xPercent: -100 }, { xPercent: 100, duration: 1.1, repeat: -1, ease: 'power1.inOut' });
    const done = () => {
      try { sessionStorage.setItem('intro', '1'); } catch {}
      tl.to(el, { opacity: 0, duration: 0.6, ease: 'power2.inOut', onComplete: () => setShow(false) });
    };
    const minimum = new Promise((r) => setTimeout(r, 900));
    const loaded = document.readyState === 'complete' ? Promise.resolve() : new Promise((r) => addEventListener('load', r, { once: true }));
    Promise.all([minimum, loaded]).then(done);
    return () => { tl.kill(); gsap.killTweensOf(el.querySelector('.line')); };
  }, [show]);
  if (!show) return null;
  return (
    <div ref={root} aria-hidden className="fixed inset-0 z-[100] grid place-items-center bg-obsidian">
      <div className="text-center">
        <p className="font-display text-5xl text-ivory">H<span className="text-gold">N</span></p>
        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.4em] text-silver">Hassan Noor</p>
        <div className="relative mx-auto mt-8 h-px w-48 overflow-hidden bg-ivory/10"><div className="line absolute inset-0 bg-gold" /></div>
      </div>
    </div>
  );
}
