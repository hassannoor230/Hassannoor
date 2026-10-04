import type { Config } from 'tailwindcss';
export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: { extend: {
    colors: { obsidian: '#08090B', charcoal: '#111318', graphite: '#202126', ivory: '#F5F1E8', gold: '#C7A56A', silver: '#A5A7AC', bronze: '#806848' },
    fontFamily: {
      display: ['"Bodoni Moda"', 'Georgia', 'serif'],
      grotesk: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
    },
  } },
  plugins: [],
} satisfies Config;
