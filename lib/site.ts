export const site = {
  name: 'Hassan Noor',
  title: 'Full Stack MERN Developer',
  headline: ['ENGINEERING', 'DIGITAL', 'EXPERIENCES.'],
  intro: "I'm Hassan Noor, a Full Stack MERN Developer crafting sophisticated websites and digital experiences through thoughtful design, modern engineering, and purposeful interaction.",
  location: 'Gujranwala, Pakistan',
  availability: '', // set from the admin settings once the API exists; empty hides the badge
  cvUrl: '',        // the CV button only renders when this is set
  // Local fallback portrait: drop your photo at client/public/portrait.jpg. A portrait uploaded from
  // /admin → Profile always wins over this path, and this path is skipped if the file is missing.
  portrait: '/portrait.jpg',
  portraitAlt: 'Portrait of Hassan Noor',
  bio: 'I combine engineering, aesthetics, performance, and practical business functionality to build polished digital products — from interactive front ends to the APIs and databases behind them.',
  focus: 'MERN applications, business and e-commerce websites, admin dashboards',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  socials: [
    { label: 'GitHub', href: 'https://github.com/hassannoor230' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/hassannoor2309' },
  ],
};
