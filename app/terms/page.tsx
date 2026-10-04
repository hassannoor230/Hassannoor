import type { Metadata } from 'next';
import { Container, PageHeader } from '@/components/ui';
export const metadata: Metadata = { title: 'Terms of Use', alternates: { canonical: '/terms' } };
export default function Page() {
  return (<><PageHeader eyebrow="Legal" title="Terms of Use" /><Container><div className="max-w-2xl space-y-6 text-lg leading-relaxed text-silver">
<p>This is a starter document and should be reviewed and edited before relying on it.</p><p>The content on this site, including project descriptions and designs, belongs to its respective authors and clients. Links to third-party live sites are provided for reference; their content is the responsibility of their owners.</p><p>The site is provided as is, without warranties of any kind.</p>
  </div></Container></>);
}
