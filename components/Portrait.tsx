'use client';
import { useState } from 'react';

const initials = (value: string) =>
  value.split(/\s+/).filter(Boolean).map((word) => word[0]).join('').slice(0, 2).toUpperCase();

// Plain portrait box with a monogram fallback, so a missing or broken image never leaves a hole in the layout.
export default function Portrait({ src, alt, name, className = '' }: { src?: string; alt: string; name: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  const visible = Boolean(src) && !failed;

  return (
    <div className={`overflow-hidden border border-ivory/10 bg-[#101114] ${className}`}>
      <div className="aspect-[4/5]">
        {visible ? (
          <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full w-full place-items-center">
            <span className="font-display text-6xl text-ivory/10">{initials(name)}</span>
          </div>
        )}
      </div>
    </div>
  );
}