import type { Metadata } from 'next';
import Reveal from '@/components/Reveal';
import { Container, PageHeader } from '@/components/ui';
import { process as steps } from '@/lib/data';
export const metadata: Metadata = { title: 'Process', alternates: { canonical: '/process' } };

export default function Process() {
  return (<><PageHeader eyebrow="Process" title="From idea to launch" />
    <Reveal><Container><ol className="border-l border-gold/40">{steps.map(([t, d], i) => (
      <li key={t} data-reveal className="relative pb-16 pl-10 md:pl-16">
        <span className="absolute -left-[5px] top-3 h-2.5 w-2.5 rounded-full bg-gold" />
        <span className="font-mono text-[11px] tracking-[0.3em] text-gold">{String(i + 1).padStart(2, '0')}</span>
        <h2 className="mt-2 font-display text-5xl">{t}</h2><p className="mt-3 max-w-xl text-lg text-silver">{d}</p>
      </li>))}</ol></Container></Reveal></>);
}
