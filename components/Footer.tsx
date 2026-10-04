import Link from 'next/link';
import { site } from '@/lib/site';
import BackToTop from './BackToTop';

export default function Footer() {
  return (
    <footer className="mt-32 border-t border-ivory/10">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-6 py-16 md:grid-cols-3 md:px-12">
        <div>
          <p className="font-display text-3xl">Hassan <span className="text-gold">Noor</span></p>
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.25em] text-silver">{site.title}</p>
        </div>
        <ul className="space-y-3 font-mono text-[11px] uppercase tracking-[0.25em] text-silver">
          {site.socials.map((s) => (<li key={s.label}><a href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-gold">{s.label} ↗</a></li>))}
        </ul>
        <ul className="space-y-3 font-mono text-[11px] uppercase tracking-[0.25em] text-silver md:text-right">
          <li><Link href="/privacy" className="hover:text-gold">Privacy</Link></li>
          <li><Link href="/terms" className="hover:text-gold">Terms</Link></li>
          <li className="pt-4"><BackToTop /></li>
        </ul>
      </div>
      <p className="border-t border-ivory/10 py-6 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-silver/70">© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
    </footer>
  );
}
