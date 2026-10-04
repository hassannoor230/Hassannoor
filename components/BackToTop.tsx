'use client';
import { ArrowUp } from 'lucide-react';
export default function BackToTop() {
  return (
    <button onClick={() => scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })}
      className="group inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-silver hover:text-ivory">
      Back to top <ArrowUp className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-1" />
    </button>
  );
}
