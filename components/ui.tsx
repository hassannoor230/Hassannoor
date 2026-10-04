export const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-gold">{children}</p>
);
export function PageHeader({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <header className="mx-auto max-w-[1400px] px-6 pb-16 pt-40 md:px-12">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className="mt-6 font-display text-[clamp(2.75rem,8vw,7rem)] leading-[0.95] tracking-tight">{title}</h1>
      {intro && <p className="mt-8 max-w-2xl text-lg leading-relaxed text-silver">{intro}</p>}
    </header>
  );
}
export const Container = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`mx-auto max-w-[1400px] px-6 md:px-12 ${className}`}>{children}</div>
);
