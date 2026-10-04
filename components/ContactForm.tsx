'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiBase } from '@/lib/api-client';

const schema = z.object({
  name: z.string().trim().min(2, 'Please enter your name').max(100),
  email: z.string().trim().email('Enter a valid email address'),
  company: z.string().trim().max(120).optional(),
  projectType: z.string().min(1, 'Select a project type'),
  budget: z.string().optional(),
  message: z.string().trim().min(20, 'Please write at least 20 characters').max(4000),
  consent: z.literal(true, { errorMap: () => ({ message: 'Consent is required to send your message' }) }),
  website: z.string().max(0).optional(), // honeypot
});
type Values = z.infer<typeof schema>;
const field = 'w-full border-0 border-b border-ivory/25 bg-transparent py-3 text-ivory placeholder:text-silver/50 focus:border-gold focus:outline-none';
const selectField = 'w-full appearance-none border-0 border-b border-ivory/25 bg-[#08090B] py-3 pr-10 text-ivory scheme-dark focus:border-gold focus:outline-none';

export default function ContactForm() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<Values>({ resolver: zodResolver(schema) });
  const [state, setState] = useState<{ ok: boolean; msg: string } | null>(null);

  async function onSubmit(v: Values) {
    setState(null);
    if (!apiBase) return setState({ ok: false, msg: 'The contact service is not configured yet, so your message was not sent.' });
    try {
      const r = await fetch(`${apiBase}/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(v) });
      const j = await r.json().catch(() => null);
      if (r.ok && j?.success) { reset(); setState({ ok: true, msg: "Thanks for contacting us. We'll get back to you within 24 hours." }); }
      else setState({ ok: false, msg: j?.error?.message || 'Your message could not be sent. Please try again.' });
    } catch { setState({ ok: false, msg: 'Network error. Your message was not sent.' }); }
  }
  const err = (k: keyof Values) => errors[k] && <p id={`${k}-err`} className="mt-2 text-sm text-[#e08a7a]">{errors[k]?.message as string}</p>;
  const aria = (k: keyof Values) => ({ 'aria-invalid': !!errors[k], 'aria-describedby': errors[k] ? `${k}-err` : undefined });
  const label = 'font-mono text-[11px] uppercase tracking-[0.25em] text-silver';

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-10">
      <div className="hidden" aria-hidden><label>Website<input tabIndex={-1} autoComplete="off" {...register('website')} /></label></div>
      <div className="grid gap-10 md:grid-cols-2">
        <div><label className={label} htmlFor="name">Name</label><input id="name" autoComplete="name" className={field} {...aria('name')} {...register('name')} />{err('name')}</div>
        <div><label className={label} htmlFor="email">Email</label><input id="email" type="email" autoComplete="email" className={field} {...aria('email')} {...register('email')} />{err('email')}</div>
        <div><label className={label} htmlFor="company">Company (optional)</label><input id="company" autoComplete="organization" className={field} {...register('company')} /></div>
        <div><label className={label} htmlFor="projectType">Project type</label>
          <div className="relative">
            <select id="projectType" defaultValue="" className={selectField} {...aria('projectType')} {...register('projectType')}>
              <option value="" disabled className="bg-[#08090B] text-silver">Select…</option>
              {['E-commerce website', 'Business website', 'Web application', 'Admin dashboard / CMS', 'Other'].map((o) => <option key={o} className="bg-[#08090B] text-ivory">{o}</option>)}
            </select>
            <ChevronDown aria-hidden="true" size={16} strokeWidth={1.5} className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-gold" />
          </div>{err('projectType')}</div>
        <div className="md:col-span-2"><label className={label} htmlFor="budget">Budget (optional)</label><input id="budget" className={field} placeholder="e.g. a range or 'not sure yet'" {...register('budget')} /></div>
      </div>
      <div><label className={label} htmlFor="message">Message</label><textarea id="message" rows={5} className={field} {...aria('message')} {...register('message')} />{err('message')}</div>
      <div>
        <label className="flex items-start gap-3 text-sm text-silver"><input type="checkbox" className="mt-1 accent-[#C7A56A]" {...aria('consent')} {...register('consent')} />
          <span>I agree to the handling of my details as described in the <a href="/privacy" className="text-gold underline">privacy notice</a>.</span></label>{err('consent')}
      </div>
      <div className="flex flex-wrap items-center gap-6">
        <button disabled={isSubmitting} className="bg-gold px-10 py-4 font-mono text-[11px] uppercase tracking-[0.25em] text-obsidian transition-colors hover:bg-ivory disabled:opacity-50">{isSubmitting ? 'Sending…' : 'Send Message'}</button>
        <p role="status" aria-live="polite" className={state ? (state.ok ? 'text-gold' : 'text-[#e08a7a]') : ''}>{state?.msg}</p>
      </div>
    </form>
  );
}
