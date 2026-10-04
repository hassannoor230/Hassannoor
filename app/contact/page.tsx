import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';
import { Container, PageHeader } from '@/components/ui';
import { site } from '@/lib/site';
export const metadata: Metadata = { title: 'Contact', alternates: { canonical: '/contact' } };

export default function Contact() {
  return (<><PageHeader eyebrow="Contact" title="Start a project" intro="Tell me about what you're building. Your message will be sent securely, and I'll get back to you within 24 hours." />
    <Container className="grid gap-16 md:grid-cols-12">
      <div className="md:col-span-8"><ContactForm /></div>
      <aside className="md:col-span-3 md:col-start-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-gold">Elsewhere</p>
        <ul className="mt-4 space-y-3">{site.socials.map((s) => <li key={s.label}><a className="text-silver hover:text-gold" target="_blank" rel="noopener noreferrer" href={s.href}>{s.label} ↗</a></li>)}</ul>
      </aside>
    </Container></>);
}
