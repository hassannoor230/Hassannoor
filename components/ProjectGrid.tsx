'use client';
import Link from 'next/link';
import { useState } from 'react';
import type { Category, Project } from '@/lib/types';

export function ProjectMedia({ p, i }: { p: Project; i: number }) {
  return p.coverImage?.url
    ? <img src={p.coverImage.url} alt={p.coverImage.alt || p.title} loading="lazy" className="h-full w-full object-contain" />
    : <div className="grid h-full w-full place-items-center bg-graphite"><span className="font-display text-[8rem] leading-none text-ivory/10">{String(i + 1).padStart(2, '0')}</span></div>;
}

export default function ProjectGrid({ projects, categories }: { projects: Project[]; categories: Category[] }) {
  const [cat, setCat] = useState('all');
  const shown = projects.filter((p) => cat === 'all' || p.category?.slug === cat);
  const tab = (active: boolean) => `border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors ${active ? 'border-gold bg-gold text-obsidian' : 'border-ivory/20 text-silver hover:border-gold hover:text-ivory'}`;
  return (
    <div>
      <div role="group" aria-label="Filter projects" className="mb-14 flex flex-wrap gap-3">
        <button aria-pressed={cat === 'all'} className={tab(cat === 'all')} onClick={() => setCat('all')}>All Projects</button>
        {categories.map(({ slug, name }) => (<button key={slug} aria-pressed={cat === slug} className={tab(cat === slug)} onClick={() => setCat(slug)}>{name}</button>))}
      </div>
      {shown.length === 0 && <p className="text-silver">No projects in this category yet.</p>}
      <ul className="grid gap-x-10 gap-y-20 md:grid-cols-12">
        {shown.map((p, i) => (
          <li key={p.slug} className={`group relative md:col-span-6 ${i % 3 === 1 ? 'md:mt-24' : ''} ${i % 3 === 2 ? 'md:col-start-4' : ''}`}>
            <div className="aspect-[16/10] overflow-hidden border border-ivory/10 bg-[#101114]"><ProjectMedia p={p} i={i} /></div>
            <div className="mt-6 flex items-start justify-between gap-6">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-gold">{String(i + 1).padStart(2, '0')} — {p.category?.name ?? 'Project'}</p>
                <h3 className="mt-3 font-display text-3xl md:text-4xl">
                  <Link href={`/projects/${p.slug}`} data-cursor="VIEW" className="after:absolute after:inset-0 after:content-['']">{p.title}</Link>
                </h3>
                <p className="mt-3 max-w-md text-silver">{p.summary}</p>
                {p.technologies.length > 0 && <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-silver/70">{p.technologies.join(' · ')}</p>}
              </div>
              <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${p.title} live site (opens in new tab)`}
                className="relative z-10 shrink-0 border border-ivory/20 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] hover:border-gold hover:text-gold">Live ↗</a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
