import type { Metadata } from 'next';
import ProjectGrid from '@/components/ProjectGrid';
import { Container, PageHeader } from '@/components/ui';
import { getCategories, getProjects } from '@/lib/api';

export const revalidate = 60;
export const metadata: Metadata = { title: 'Work', description: 'Selected live projects by Hassan Noor.', alternates: { canonical: '/projects' } };

export default async function Projects() {
  const [projects, categories] = await Promise.all([getProjects(), getCategories()]);
  return (<><PageHeader eyebrow="Work" title="Selected projects" intro="Live websites and web applications. Each links to the real, running site." /><Container><ProjectGrid projects={projects} categories={categories} /></Container></>);
}
