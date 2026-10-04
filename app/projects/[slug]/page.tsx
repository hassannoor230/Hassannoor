import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container, Eyebrow } from '@/components/ui';
import { ProjectMedia } from '@/components/ProjectGrid';
import { getProject, getProjects } from '@/lib/api';

export const revalidate = 60;
type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() { return (await getProjects()).map((p) => ({ slug: p.slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getProject((await params).slug);
  if (!p) return { title: 'Project not found' };
  return { title: p.seo?.title || p.title, description: p.seo?.description || p.summary, alternates: { canonical: `/projects/${p.slug}` },
    openGraph: { title: p.seo?.title || p.title, description: p.seo?.description || p.summary, images: p.coverImage?.url ? [p.coverImage.url] : undefined } };
}

const Block = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="border-t border-ivory/10 py-10 md:grid md:grid-cols-12"><h2 className="font-mono text-[11px] uppercase tracking-[0.3em] text-gold md:col-span-3">{title}</h2><div className="mt-4 text-lg leading-relaxed text-ivory/90 md:col-span-9 md:mt-0">{children}</div></section>
);

export default async function ProjectPage({ params }: Props) {
  const slug = (await params).slug;
  const [p, all] = await Promise.all([getProject(slug), getProjects()]);
  if (!p) notFound();
  const idx = all.findIndex((x) => x.slug === p.slug);
  const prev = idx > 0 ? all[idx - 1] : null;
  const next = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null;
  const related = all.filter((x) => x.slug !== p.slug && x.category?.slug === p.category?.slug).slice(0, 2);
  const cs = p.caseStudy;
  return (
    <article>
      <Container className="pt-40">
        <Eyebrow>{p.category?.name ?? 'Project'}{p.projectType ? ` — ${p.projectType}` : ''}</Eyebrow>
        <h1 className="mt-6 font-display text-[clamp(2.75rem,8vw,7rem)] leading-[0.95]">{p.title}</h1>
        <div className="mt-12 aspect-[16/10] overflow-hidden border border-ivory/10 bg-[#101114]"><ProjectMedia p={p} i={Math.max(idx, 0)} /></div>
        <div className="mt-16">
          <Block title="Overview"><p>{p.description || p.summary}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="bg-gold px-8 py-4 font-mono text-[11px] uppercase tracking-[0.25em] text-obsidian hover:bg-ivory">Visit live site ↗</a>
              {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="border border-ivory/30 px-8 py-4 font-mono text-[11px] uppercase tracking-[0.25em] hover:border-gold hover:text-gold">Repository ↗</a>}
            </div></Block>
          {p.technologies.length > 0 && <Block title="Technologies"><p className="font-mono text-sm">{p.technologies.join(' · ')}</p></Block>}
          {cs?.problem && <Block title="The problem"><p>{cs.problem}</p></Block>}
          {cs?.solution && <Block title="The solution"><p>{cs.solution}</p></Block>}
          {cs?.features && cs.features.length > 0 && <Block title="Confirmed features"><ul className="list-disc space-y-2 pl-5">{cs.features.map((f) => <li key={f}>{f}</li>)}</ul></Block>}
          {cs?.process && <Block title="Development approach"><p>{cs.process}</p></Block>}
          {cs?.challenges && <Block title="Challenges"><p>{cs.challenges}</p></Block>}
          {cs?.results && cs.results.length > 0 && <Block title="Results"><ul className="list-disc space-y-2 pl-5">{cs.results.map((f) => <li key={f}>{f}</li>)}</ul></Block>}
          {p.gallery && p.gallery.length > 0 && <Block title="Gallery"><div className="grid gap-4 md:grid-cols-2">{p.gallery.map((g) => <img key={g.url} src={g.url} alt={g.alt || ''} loading="lazy" className="w-full border border-ivory/10" />)}</div></Block>}
        </div>
        {related.length > 0 && (
          <section className="mt-24"><Eyebrow>Related</Eyebrow>
            <ul className="mt-6 grid gap-6 md:grid-cols-2">{related.map((r) => <li key={r.slug}><Link href={`/projects/${r.slug}`} className="block border border-ivory/10 p-8 font-display text-3xl hover:border-gold">{r.title}</Link></li>)}</ul></section>)}
        <nav aria-label="Project navigation" className="mt-24 flex justify-between border-t border-ivory/10 pt-8 font-mono text-[11px] uppercase tracking-[0.25em]">
          {prev ? <Link href={`/projects/${prev.slug}`} className="hover:text-gold">← {prev.title}</Link> : <span />}
          {next ? <Link href={`/projects/${next.slug}`} className="hover:text-gold">{next.title} →</Link> : <span />}
        </nav>
      </Container>
    </article>
  );
}
