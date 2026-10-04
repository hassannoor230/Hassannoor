import type { Metadata } from 'next';
import Link from 'next/link';
import Portrait from '@/components/Portrait';
import { Container, PageHeader } from '@/components/ui';
import { getProfile } from '@/lib/api';
import { site } from '@/lib/site';
export const metadata: Metadata = { title: 'About', alternates: { canonical: '/about' } };
export const revalidate = 60;

export default async function About() {
  const profile = await getProfile();
  const name = profile?.name || site.name;
  const portrait = profile?.portrait?.url || site.portrait;
  const paragraphs = (profile?.bio || site.bio).split(/\n{2,}/).map((line) => line.trim()).filter(Boolean);

  return (<>
    <PageHeader eyebrow="About" title="Engineering with an eye for craft" />
    <Container className="grid gap-16 md:grid-cols-12">
      <Portrait src={portrait} alt={profile?.portrait?.alt || site.portraitAlt} name={name} className="w-full max-w-xs md:col-span-3" />
      <div className="space-y-6 text-xl leading-relaxed md:col-span-5">
        <p>{site.intro}</p>
        {paragraphs.map((text, index) => <p key={text} className={index === 0 ? '' : 'text-silver'}>{text}</p>)}
        <Link href="/projects" className="inline-block font-mono text-[11px] uppercase tracking-[0.25em] text-gold">See the work →</Link>
      </div>
      <dl className="space-y-8 border-t border-ivory/10 pt-8 md:col-span-4 md:col-start-9 md:border-0 md:pt-0">
        {[
          ['Role', profile?.role || site.title],
          ['Based in', profile?.location || site.location],
          ['Focus', profile?.focus || site.focus],
        ].map(([k, v]) => (
          <div key={k}><dt className="font-mono text-[11px] uppercase tracking-[0.3em] text-gold">{k}</dt><dd className="mt-2 text-silver">{v}</dd></div>))}
      </dl>
    </Container></>);
}