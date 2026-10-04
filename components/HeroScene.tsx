'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const codeLines = [
  [{ text: 'const ', className: 'text-[#C7A56A]' }, { text: 'developer', className: 'text-[#E7D9B8]' }, { text: ' = {' }],
  [{ text: '  ' }, { text: 'name', className: 'text-[#9DBD9D]' }, { text: ': ' }, { text: "'Hassan Noor'", className: 'text-[#D89A82]' }, { text: ',' }],
  [{ text: '  ' }, { text: 'role', className: 'text-[#9DBD9D]' }, { text: ': ' }, { text: "'Full-stack developer'", className: 'text-[#D89A82]' }, { text: ',' }],
  [{ text: '  ' }, { text: 'focus', className: 'text-[#9DBD9D]' }, { text: ': [' }, { text: "'web'", className: 'text-[#D89A82]' }, { text: ', ' }, { text: "'ideas'", className: 'text-[#D89A82]' }, { text: '],' }],
  [{ text: '};' }],
  [{ text: ' ' }],
  [{ text: 'function ', className: 'text-[#C7A56A]' }, { text: 'buildSomething', className: 'text-[#E7D9B8]' }, { text: '() {' }],
  [{ text: '  ' }, { text: 'return ', className: 'text-[#C7A56A]' }, { text: "'made with intent'", className: 'text-[#D89A82]' }, { text: ';' }],
  [{ text: '}' }],
];

export default function HeroScene({ animate, visible }: { animate: boolean; visible: boolean }) {
  const scene = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scene.current || !animate) return;
    const context = gsap.context(() => {
      const lines = gsap.utils.toArray<HTMLElement>('.typed-line');
      const timeline = gsap.timeline({ repeat: -1, repeatDelay: 1.2, paused: !visible });
      gsap.set('.code-char', { opacity: 0 });
      lines.forEach((line) => {
        timeline.to(line.querySelectorAll('.code-char'), { opacity: 1, duration: 0.01, stagger: 0.035, ease: 'none' });
      });
      timeline.to('.code-caret', { opacity: 0, duration: 0.4, repeat: 5, yoyo: true, ease: 'none' })
        .to('.code-char', { opacity: 0, duration: 0.25, stagger: 0.006, ease: 'none' }, '+=0.8');
      return () => timeline.kill();
    }, scene);
    return () => context.revert();
  }, [animate, visible]);

  return (
    <div ref={scene} className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-gradient-to-l from-transparent via-obsidian/20 to-obsidian md:via-obsidian/5" />
      <div className="absolute right-[-12%] top-[12%] w-[min(76vw,680px)] rotate-[-5deg] opacity-75 sm:right-[-10%] sm:top-[19%] sm:w-[min(40vw,520px)]">
        <div className="overflow-hidden border border-ivory/10 bg-[#101110]/75 shadow-2xl shadow-black/30 backdrop-blur-[2px]">
          <div className="flex h-8 items-center gap-2 border-b border-ivory/10 px-3 sm:h-10 sm:px-4">
            <span className="h-2 w-2 rounded-full bg-[#C77C68]/80" />
            <span className="h-2 w-2 rounded-full bg-[#C7A56A]/80" />
            <span className="h-2 w-2 rounded-full bg-[#829B78]/80" />
            <span className="ml-3 font-mono text-[10px] text-silver/50">hassan-noor.ts</span>
          </div>
          <div className="grid grid-cols-[28px_1fr] gap-x-3 px-3 py-3 font-mono text-[9px] leading-[1.35] sm:grid-cols-[34px_1fr] sm:gap-x-4 sm:px-7 sm:py-7 sm:text-[13px] sm:leading-[2.15]">
            {codeLines.map((line, index) => (
              <div className="contents" key={index}>
                <span className="select-none text-right text-silver/25">{String(index + 1).padStart(2, '0')}</span>
                <span className="typed-line whitespace-pre text-ivory/75">
                  {line.map((token, tokenIndex) => (
                    <span key={tokenIndex} className={token.className}>
                      {Array.from(token.text).map((character, characterIndex) => (
                        <span key={characterIndex} className="code-char inline-block">{character === ' ' ? '\u00a0' : character}</span>
                      ))}
                    </span>
                  ))}
                  {index === 8 && <span className="code-caret ml-1 inline-block h-4 w-px translate-y-[3px] bg-gold" />}
                </span>
              </div>
            ))}
          </div>
          <div className="flex h-6 items-center justify-between border-t border-ivory/10 px-3 font-mono text-[8px] uppercase text-silver/40 sm:h-7 sm:px-4 sm:text-[9px]">
            <span>TypeScript</span>
            <span>Ln 09, Col 02</span>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(8,9,11,0.16)_65%,#08090B_100%)]" />
    </div>
  );
}
