import type { Metadata } from 'next';
import { Container, PageHeader } from '@/components/ui';
import { experience } from '@/lib/data';
export const metadata: Metadata = { title: 'Experience', alternates: { canonical: '/experience' } };

export default function Experience() {
  return (<><PageHeader eyebrow="Experience" title="Where I've worked" />
    <Container><ol>{experience.map((e) => (
      <li key={e.role} className="grid gap-4 border-t border-ivory/10 py-10 md:grid-cols-12">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-gold md:col-span-3">{e.period}</p>
        <div className="md:col-span-9"><h2 className="font-display text-4xl">{e.role}</h2><p className="mt-1 text-silver">{e.org}</p><p className="mt-4 max-w-2xl text-lg">{e.text}</p></div>
      </li>))}</ol></Container></>);
}
