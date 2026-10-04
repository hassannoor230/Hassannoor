import Link from 'next/link';
import Hero from '@/components/Hero';
import Reveal from '@/components/Reveal';
import { Container, Eyebrow } from '@/components/ui';
import { ProjectMedia } from '@/components/ProjectGrid';
import { getProjects } from '@/lib/api';
import { process as steps } from '@/lib/data';
import { site } from '@/lib/site';

export const revalidate = 60;

export default async function Home() {
  const all = await getProjects();
  const featured = (all.some((p) => p.featured) ? all.filter((p) => p.featured) : all).slice(0, 3);
  const ld = { '@context': 'https://schema.org', '@type': 'Person', name: site.name, jobTitle: site.title, url: site.url, sameAs: site.socials.map((s) => s.href) };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <Hero />
      <Reveal>
        <section className="py-32">
          <Container>
            <div data-reveal className="flex items-end justify-between border-b border-ivory/10 pb-8">
              <div><Eyebrow>01 — Selected Work</Eyebrow><h2 className="mt-4 font-display text-5xl md:text-7xl">Recent projects</h2></div>
              <Link href="/projects" className="hidden font-mono text-[11px] uppercase tracking-[0.25em] text-gold md:block">All projects →</Link>
            </div>
            <ul className="mt-16 grid gap-10 md:grid-cols-3">
              {featured.map((p, i) => (
                <li key={p.slug} data-reveal className="group relative">
                  <div className="aspect-[16/10] overflow-hidden border border-ivory/10 bg-[#101114]"><ProjectMedia p={p} i={i} /></div>
                  <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.25em] text-gold">{p.category?.name}</p>
                  <h3 className="mt-2 font-display text-3xl"><Link href={`/projects/${p.slug}`} data-cursor="VIEW" className="after:absolute after:inset-0 after:content-['']">{p.title}</Link></h3>
                </li>
              ))}
            </ul>
          </Container>
        </section>
        <section className="border-y border-ivory/10 bg-charcoal py-32">
          <Container>
            <div data-reveal><Eyebrow>02 — Process</Eyebrow><h2 className="mt-4 font-display text-5xl md:text-7xl">How I work</h2></div>
            <ol className="mt-16 grid gap-px bg-ivory/10 md:grid-cols-3">
              {steps.map(([t, d], i) => (
                <li key={t} data-reveal className="bg-charcoal p-8">
                  <span className="font-mono text-[11px] tracking-[0.3em] text-gold">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="mt-6 font-grotesk text-2xl font-bold">{t}</h3><p className="mt-3 text-silver">{d}</p>
                </li>
              ))}
            </ol>
          </Container>
        </section>
        <section className="py-40 text-center">
          <Container>
            <div data-reveal>
              <Eyebrow>03 — Contact</Eyebrow>
              <h2 className="mx-auto mt-6 max-w-4xl font-display text-5xl leading-tight md:text-8xl">Have a project in mind?</h2>
              <Link href="/contact" data-cursor="WRITE" className="mt-12 inline-block bg-gold px-10 py-5 font-mono text-[11px] uppercase tracking-[0.25em] text-obsidian hover:bg-ivory">Start a Project</Link>
            </div>
          </Container>
        </section>
      </Reveal>
    </>
  );
}
