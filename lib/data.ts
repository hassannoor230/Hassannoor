import type { Project } from './types';
const neutral = (n: string) => `${n} is a live website built by Hassan Noor. A detailed description will be added once its purpose and features have been verified.`;
const c = (name: string, slug: string) => ({ name, slug });
// Fallback used only when the API is unset or unreachable. Mirrors the server seed.
export const fallbackProjects: Project[] = [
  { title: 'Bagswave', slug: 'bagswave', order: 1, featured: true, category: c('E-commerce', 'e-commerce'), projectType: 'E-commerce', technologies: [], liveUrl: 'https://bagswave.vercel.app/', summary: 'A luxury handbag shopping experience focused on product presentation, brand aesthetics, and online shopping.' },
  { title: 'GlowTeva', slug: 'glowteva', order: 2, featured: true, category: c('Beauty & Lifestyle', 'beauty-lifestyle'), projectType: 'Beauty & E-commerce', technologies: [], liveUrl: 'https://glowteva.vercel.app/', summary: 'An organic and skincare-focused e-commerce experience with premium product presentation and brand-led design.' },
  { title: 'Miti', slug: 'miti', order: 3, featured: true, category: c('Business Websites', 'business-websites'), projectType: 'Business Website / Web Application', technologies: [], liveUrl: 'https://miti-nine.vercel.app/', summary: neutral('Miti') },
  { title: 'Maestro Cafe Gujranwala', slug: 'maestro-cafe-gujranwala', order: 4, category: c('Restaurant & Hospitality', 'restaurant-hospitality'), projectType: 'Restaurant & Hospitality', technologies: [], liveUrl: 'https://maestro-cafe-gujranwala.vercel.app/', summary: 'A restaurant-focused digital experience for presenting hospitality-related information and brand identity.' },
  { title: 'Shiza Salon', slug: 'shiza-salon', order: 5, category: c('Beauty & Lifestyle', 'beauty-lifestyle'), projectType: 'Salon & Beauty', technologies: [], liveUrl: 'https://shiza-salon.vercel.app/', summary: 'A salon-focused website experience for service discovery and customer engagement.' },
  { title: 'Best Hair', slug: 'best-hair', order: 6, category: c('Beauty & Lifestyle', 'beauty-lifestyle'), projectType: 'Hair & Beauty', technologies: [], liveUrl: 'https://best-hair.vercel.app/', summary: neutral('Best Hair') },
];
export const skillGroups = [
  { group: 'Frontend engineering', focus: 'Accessible, responsive interfaces and modern application architecture.', items: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Tailwind CSS'] },
  { group: 'Motion & 3D', focus: 'Purposeful motion, scroll interactions, and real-time 3D for the web.', items: ['GSAP', 'ScrollTrigger', 'Three.js', 'React Three Fiber', 'Framer Motion'] },
  { group: 'Backend & data', focus: 'Reliable APIs and data models for full-stack applications.', items: ['Node.js', 'Express.js', 'REST APIs', 'MongoDB', 'Mongoose'] },
  { group: 'CMS & workflow', focus: 'Content management and the tools that keep delivery organized.', items: ['WordPress', 'Git', 'GitHub', 'Vercel'] },
];
export const process = [
  ['Discover', 'Understanding the business, audience, and what the website must accomplish.'],
  ['Plan', 'Defining structure, content, features, and the technical approach.'],
  ['Design', 'Shaping typography, layout, and interaction into a cohesive visual language.'],
  ['Develop', 'Building the interface and the API with maintainable, tested code.'],
  ['Test', 'Checking responsiveness, accessibility, forms, and critical flows.'],
  ['Deploy', 'Shipping to production, configuring environments, and handing over.'],
];
export const experience = [
  { role: 'Freelance Web Developer', org: 'Independent', period: '2022 – Present', text: 'Building websites and web applications for clients.' },
];
