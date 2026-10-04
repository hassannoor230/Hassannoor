import type { Metadata } from 'next';
import Reveal from '@/components/Reveal';
import SkillsVisual from '@/components/SkillsVisual';
import { Container } from '@/components/ui';
import { skillGroups } from '@/lib/data';
export const metadata: Metadata = { title: 'Skills', alternates: { canonical: '/skills' } };

export default function Skills() {
  return (
    <Reveal>
      <section className="relative isolate flex min-h-[72svh] items-end overflow-hidden border-b border-ivory/10 pb-16 pt-40 md:min-h-[78svh] md:pb-20">
        <SkillsVisual />
        <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(90deg,#08090B_0%,rgba(8,9,11,0.92)_34%,rgba(8,9,11,0.42)_68%,rgba(8,9,11,0.14)_100%)]" />
        <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(0deg,#08090B_0%,transparent_36%)]" />
        <div className="relative z-20 mx-auto w-full max-w-[1400px] px-6 md:px-12">
          <p data-reveal className="font-mono text-[11px] uppercase tracking-[0.3em] text-gold">Capabilities / 2026</p>
          <h1 data-reveal className="mt-7 max-w-4xl font-display text-[clamp(3rem,8.5vw,8rem)] leading-[0.9]">
            Engineering for<br />the modern web.
          </h1>
          <div data-reveal className="mt-8 grid gap-6 md:grid-cols-12 md:items-end">
            <p className="max-w-xl text-base leading-relaxed text-silver md:col-span-6 md:text-lg">
              A hands-on stack for building thoughtful interfaces, robust applications, expressive motion, and immersive 3D experiences.
            </p>
            <p className="font-mono text-[10px] uppercase leading-6 text-silver/65 md:col-span-3 md:col-start-10 md:text-right">
              Frontend / Motion / 3D<br />Backend / Content
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-ivory/10">
        <Container className="grid gap-8 py-8 sm:grid-cols-3 sm:items-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-gold">Stack overview</p>
          <p className="font-display text-2xl text-ivory sm:text-center">Four disciplines</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-silver sm:text-right">Design / Build / Ship</p>
        </Container>
      </section>

      <Container className="py-20 md:py-28">
        <div className="mb-10 grid gap-4 md:grid-cols-12 md:items-end">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold md:col-span-3">01 — Skill index</p>
          <p className="max-w-xl text-silver md:col-span-6">Tools selected for the work: from interface details to production-ready full-stack systems.</p>
        </div>
        {skillGroups.map((group, index) => (
          <section key={group.group} data-reveal className="grid gap-7 border-t border-ivory/15 py-9 md:grid-cols-12 md:gap-8 md:py-12">
            <div className="md:col-span-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-gold">{String(index + 1).padStart(2, '0')} / Discipline</p>
              <h2 className="mt-3 font-display text-3xl leading-tight md:text-4xl">{group.group}</h2>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-silver">{group.focus}</p>
            </div>
            <ul className="grid content-start grid-cols-2 gap-x-6 sm:grid-cols-3 md:col-span-8 md:gap-x-8">
              {group.items.map((skill, skillIndex) => (
                <li key={skill} className="group flex min-h-14 items-center justify-between gap-2 border-b border-ivory/10 py-3 transition-colors hover:border-gold/60">
                  <span className="font-grotesk text-base text-ivory transition-colors group-hover:text-gold sm:text-lg">{skill}</span>
                  <span className="font-mono text-[9px] text-silver/40">{String(skillIndex + 1).padStart(2, '0')}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </Container>
    </Reveal>
  );
}
