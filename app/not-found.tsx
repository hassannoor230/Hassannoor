import Link from 'next/link';
import { Container, Eyebrow } from '@/components/ui';
export default function NotFound() {
  return (<Container className="grid min-h-[80svh] place-content-center pt-24 text-center"><Eyebrow>404</Eyebrow>
    <h1 className="mt-6 font-display text-7xl md:text-9xl">Page not found</h1>
    <Link href="/" className="mt-10 font-mono text-[11px] uppercase tracking-[0.25em] text-gold">← Back home</Link></Container>);
}
