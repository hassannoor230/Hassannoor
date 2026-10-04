'use client';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const SkillsCanvas = dynamic(() => import('./SkillsCanvas'), { ssr: false });

export default function SkillsVisual() {
  const root = useRef<HTMLDivElement>(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: no-preference)');
    setAnimate(motion.matches);
    const context = gsap.context(() => {
      if (motion.matches) {
        gsap.fromTo('.orbit-label', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, delay: 0.4, ease: 'power3.out' });
      }
    }, root);
    return () => context.revert();
  }, []);

  return (
    <div ref={root} aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <SkillsCanvas animate={animate} />
      <div className="absolute right-6 top-[30%] z-20 hidden font-mono text-[10px] uppercase tracking-[0.2em] text-ivory/70 md:block md:right-[10%]">
        <p className="orbit-label">Next.js <span className="text-gold">/ 01</span></p>
        <p className="orbit-label mt-24 translate-x-10">GSAP <span className="text-gold">/ 02</span></p>
        <p className="orbit-label mt-24 -translate-x-4">Three.js <span className="text-gold">/ 03</span></p>
      </div>
    </div>
  );
}