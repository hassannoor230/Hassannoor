import type { Metadata } from 'next';
import { Container, PageHeader } from '@/components/ui';
export const metadata: Metadata = { title: 'Privacy Notice', alternates: { canonical: '/privacy' } };
export default function Page() {
  return (<><PageHeader eyebrow="Legal" title="Privacy Notice" /><Container><div className="max-w-2xl space-y-6 text-lg leading-relaxed text-silver">
<p>This is a starter notice and should be reviewed and edited before relying on it. It does not claim compliance with any specific law.</p><p>When you use the contact form, the details you enter (name, email, optional company, project type, optional budget, and message) are stored so your enquiry can be answered. They are not shown publicly.</p><p>If email notifications are enabled, the enquiry may also be forwarded to the site owner by email. To ask about or remove your data, contact the site owner through the details on the contact page.</p>
  </div></Container></>);
}
