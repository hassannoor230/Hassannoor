'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

const links = [['Home', '/'], ['Work', '/projects'], ['About', '/about'], ['Skills', '/skills'], ['Contact', '/contact']] as const;

export default function Nav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    addEventListener('keydown', esc); return () => removeEventListener('keydown', esc);
  }, []);
  const active = (h: string) => (h === '/' ? path === '/' : path.startsWith(h));
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-ivory/10 bg-obsidian/80 backdrop-blur-md">
      <nav aria-label="Primary" className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6 md:px-12">
        <Link href="/" className="font-display text-xl tracking-tight">Hassan <span className="text-gold">Noor</span></Link>
        <ul className="hidden items-center gap-10 md:flex">
          {links.map(([l, h]) => (
            <li key={h}>
              <Link href={h} aria-current={active(h) ? 'page' : undefined} className="group relative font-mono text-[11px] uppercase tracking-[0.25em] text-silver transition-colors hover:text-ivory aria-[current=page]:text-ivory">
                {l}
                <span className="absolute -bottom-2 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-500 group-hover:scale-x-100 group-aria-[current=page]:scale-x-100" />
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/contact" className="hidden border border-gold px-5 py-2 font-mono text-[11px] uppercase tracking-[0.25em] text-gold transition-colors hover:bg-gold hover:text-obsidian md:block">Start a Project</Link>
        <button aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)} className="md:hidden">
          {open ? <X /> : <Menu />}
        </button>
      </nav>
      {open && (
        <div id="mobile-menu" className="border-t border-ivory/10 bg-obsidian px-6 pb-8 md:hidden">
          <ul className="flex flex-col">
            {[...links, ['Start a Project', '/contact'] as const].map(([l, h]) => (
              <li key={l}><Link href={h} className="block border-b border-ivory/10 py-5 font-display text-3xl">{l}</Link></li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
