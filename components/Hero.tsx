'use client';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { site } from '@/lib/site';

const HeroScene = dynamic(() => import('./HeroScene'), { ssr: false });

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const [reduce, setReduce] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setReduce(matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    if (!root.current) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.05 });
    io.observe(root.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' }, delay: 0.2 });
      tl.from('.h-line > span', { yPercent: 110, duration: 1.2, stagger: 0.12 })
        .from('.h-fade', { y: 20, opacity: 0, duration: 0.9, stagger: 0.1 }, '-=0.7')
        .from('.h-scene', { opacity: 0, scale: 0.92, duration: 1.4 }, 0.3);
    }, root);
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} className="relative flex min-h-[100svh] items-end overflow-hidden pb-16 pt-28">
      <div className="h-scene pointer-events-none absolute inset-y-0 right-0 w-full sm:w-3/5" aria-hidden>
        <HeroScene animate={!reduce} visible={visible} />
      </div>
      <div className="relative mx-auto w-full max-w-[1400px] px-6 md:px-12">
        <p className="h-fade font-mono text-[11px] uppercase tracking-[0.3em] text-gold">{site.title} — {site.location}</p>
        <h1 className="mt-8 font-display text-[clamp(2.25rem,7.5vw,10rem)] leading-[0.9] tracking-tight">
          {site.headline.map((l) => (<span key={l} className="h-line block overflow-hidden"><span className="block">{l}</span></span>))}
        </h1>
        <p className="h-fade mt-10 max-w-xl text-lg leading-relaxed text-silver">{site.intro}</p>
        <div className="h-fade mt-10 flex flex-wrap items-center gap-4">
          <Link data-cursor="OPEN" href="/projects" className="bg-gold px-8 py-4 font-mono text-[11px] uppercase tracking-[0.25em] text-obsidian transition-colors hover:bg-ivory">Explore My Work</Link>
          <Link href="/contact" className="border border-ivory/30 px-8 py-4 font-mono text-[11px] uppercase tracking-[0.25em] transition-colors hover:border-gold hover:text-gold">Start a Project</Link>
          {site.cvUrl && <a href={site.cvUrl} download className="px-4 py-4 font-mono text-[11px] uppercase tracking-[0.25em] text-silver hover:text-ivory">Download My CV</a>}
          {site.availability && <span className="border border-gold/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-gold">{site.availability}</span>}
        </div>
      </div>
      <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 md:block" aria-hidden>
        <span className="block h-10 w-px bg-gradient-to-b from-gold to-transparent" />
      </div>
    </section>
  );
}
