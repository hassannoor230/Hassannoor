'use client';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import {
  Activity, ArrowUpRight, BriefcaseBusiness, Check, ChevronDown, ImagePlus,
  FolderKanban, LayoutDashboard, LogOut, Pencil, Plus, RefreshCw,
  Search, Tags, Trash2, Upload, User, X,
} from 'lucide-react';
import { absoluteUrl, apiBase } from '@/lib/api';

type View = 'overview' | 'projects' | 'categories' | 'profile';
type Session = { email: string; accessToken: string };
type Category = { id: string; name: string; slug: string; description?: string; order: number; active: boolean; projectCount: number };
type Profile = { id?: string; name?: string; role?: string; location?: string; availability?: string; focus?: string; bio?: string; updatedAt?: string; portrait?: { url?: string; publicId?: string; alt?: string } | null };
type Project = {
  id: string; title: string; slug: string; summary: string; description: string; categoryId: string;
  category: { name: string; slug: string } | null; projectType?: string; coverImage?: { url: string; publicId?: string; alt?: string };
  liveUrl: string; githubUrl?: string; technologies: string[]; featured: boolean;
  status: 'draft' | 'published'; order: number; updatedAt?: string;
};
type Overview = {
  stats: { projects: number; published: number; drafts: number; categories: number };
  recentProjects: Project[];
  recentActivity: { _id: string; action: string; resourceType?: string; createdAt: string; actor?: { email: string } }[];
};
type Editor = { kind: 'project' | 'category'; id?: string } | null;
type ProjectDraft = {
  title: string; slug: string; summary: string; description: string; categoryId: string; projectType: string;
  coverImageUrl: string; coverImagePublicId: string; liveUrl: string; githubUrl: string; technologies: string; featured: boolean;
  status: 'draft' | 'published'; order: string;
};
type CategoryDraft = { name: string; slug: string; description: string; order: string; active: boolean };
type ProfileDraft = {
  name: string; role: string; location: string; availability: string; focus: string; bio: string;
  portraitUrl: string; portraitPublicId: string; portraitAlt: string;
};

const emptyProject: ProjectDraft = {
  title: '', slug: '', summary: '', description: '', categoryId: '', projectType: '', coverImageUrl: '', coverImagePublicId: '',
  liveUrl: '', githubUrl: '', technologies: '', featured: false, status: 'draft', order: '0',
};
const emptyCategory: CategoryDraft = { name: '', slug: '', description: '', order: '0', active: true };
const emptyProfile: ProfileDraft = {
  name: 'Hassan Noor', role: 'Full Stack MERN Developer', location: 'Gujranwala, Pakistan', availability: '',
  focus: 'MERN applications, business and e-commerce websites, admin dashboards', bio: '',
  portraitUrl: '', portraitPublicId: '', portraitAlt: '',
};
const inputClass = 'w-full border border-ivory/15 bg-[#101114] px-3 py-3 text-sm text-ivory placeholder:text-silver/40 focus:border-gold focus:outline-none';
const labelClass = 'mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-silver';

async function request(path: string, token?: string, init: RequestInit = {}) {
  if (!apiBase) throw new Error('Admin API is not configured.');
  const headers = new Headers(init.headers);
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const multipart = typeof FormData !== 'undefined' && init.body instanceof FormData;
  if (init.body && !multipart && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  const response = await fetch(`${apiBase}${path}`, { ...init, headers, credentials: 'include' });
  const result = await response.json().catch(() => null);
  if (!response.ok || !result?.success) throw new Error(result?.error?.message || 'The request could not be completed.');
  return result.data;
}

async function loadAdminData(token: string) {
  const [overview, projects, categories, profile] = await Promise.all([
    request('/admin/overview', token),
    request('/admin/projects', token),
    request('/admin/categories', token),
    request('/admin/profile', token),
  ]);
  return {
    overview: overview as Overview,
    projects: projects.items as Project[],
    categories: categories.items as Category[],
    profile: (profile ?? null) as Profile | null,
  };
}

function toProfileDraft(profile: Profile | null): ProfileDraft {
  if (!profile) return emptyProfile;
  return {
    name: profile.name ?? emptyProfile.name, role: profile.role ?? '', location: profile.location ?? '',
    availability: profile.availability ?? '', focus: profile.focus ?? '', bio: profile.bio ?? '',
    portraitUrl: profile.portrait?.url ?? '', portraitPublicId: profile.portrait?.publicId ?? '', portraitAlt: profile.portrait?.alt ?? '',
  };
}

function imageProblem(file: File) {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return 'Choose a JPEG, PNG, or WebP image.';
  if (file.size > 5 * 1024 * 1024) return 'Image must be 5 MB or smaller.';
  return '';
}

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function dateLabel(value?: string) {
  if (!value) return 'Just now';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Just now' : new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(date);
}

function messageFrom(error: unknown) {
  return error instanceof Error ? error.message : 'Something went wrong. Please try again.';
}

export default function AdminDashboard() {
  const [session, setSession] = useState<Session | null>(null);
  const [view, setView] = useState<View>('overview');
  const [overview, setOverview] = useState<Overview | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileDraft, setProfileDraft] = useState<ProfileDraft>(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published'>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [editor, setEditor] = useState<Editor>(null);
  const [projectDraft, setProjectDraft] = useState<ProjectDraft>(emptyProject);
  const [categoryDraft, setCategoryDraft] = useState<CategoryDraft>(emptyCategory);
  const [uploading, setUploading] = useState(false);
  const [pendingUploadId, setPendingUploadId] = useState('');
  const [uploadingPortrait, setUploadingPortrait] = useState(false);
  const [pendingPortraitId, setPendingPortraitId] = useState('');
  const coverFileInput = useRef<HTMLInputElement>(null);
  const portraitFileInput = useRef<HTMLInputElement>(null);

  function applyProfile(next: Profile | null) {
    setProfile(next);
    setProfileDraft(toProfileDraft(next));
  }

  useEffect(() => {
    let active = true;
    async function restoreSession() {
      if (!apiBase) {
        setError('Admin API is not configured.');
        setLoading(false);
        return;
      }
      try {
        const result = await request('/auth/refresh', undefined, { method: 'POST', headers: { 'X-Requested-With': 'fetch' } });
        const restored = { email: result.user.email as string, accessToken: result.accessToken as string };
        const data = await loadAdminData(restored.accessToken);
        if (active) {
          setSession(restored);
          setOverview(data.overview);
          setProjects(data.projects);
          setCategories(data.categories);
          applyProfile(data.profile);
        }
      } catch {
        if (active) setSession(null);
      } finally {
        if (active) setLoading(false);
      }
    }
    void restoreSession();
    return () => { active = false; };
  }, []);

  async function refreshData(token = session?.accessToken) {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const data = await loadAdminData(token);
      setOverview(data.overview);
      setProjects(data.projects);
      setCategories(data.categories);
      applyProfile(data.profile);
    } catch (cause) { setError(messageFrom(cause)); }
    finally { setLoading(false); }
  }

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    setBusy(true);
    setError('');
    try {
      const result = await request('/auth/login', undefined, {
        method: 'POST', body: JSON.stringify({ email: form.get('email'), password: form.get('password') }),
      });
      const nextSession = { email: result.user.email as string, accessToken: result.accessToken as string };
      const data = await loadAdminData(nextSession.accessToken);
      setSession(nextSession);
      setOverview(data.overview);
      setProjects(data.projects);
      setCategories(data.categories);
      applyProfile(data.profile);
      setNotice('Welcome back. Your studio is ready.');
      formElement.reset();
    } catch (cause) { setError(messageFrom(cause)); }
    finally { setBusy(false); setLoading(false); }
  }

  async function signOut() {
    await request('/auth/logout', undefined, { method: 'POST', headers: { 'X-Requested-With': 'fetch' } }).catch(() => null);
    setSession(null);
    setOverview(null);
    setProjects([]);
    setCategories([]);
    setProfile(null);
    setNotice('Signed out successfully.');
  }

  function openProject(project?: Project) {
    setError('');
    setPendingUploadId('');
    setProjectDraft(project ? {
      title: project.title, slug: project.slug, summary: project.summary ?? '', description: project.description ?? '',
      categoryId: project.categoryId ?? '', projectType: project.projectType ?? '', coverImageUrl: project.coverImage?.url ?? '',
      coverImagePublicId: project.coverImage?.publicId ?? '',
      liveUrl: project.liveUrl, githubUrl: project.githubUrl ?? '', technologies: project.technologies?.join(', ') ?? '',
      featured: project.featured, status: project.status, order: String(project.order ?? 0),
    } : emptyProject);
    setEditor({ kind: 'project', id: project?.id });
  }

  function openCategory(category?: Category) {
    setError('');
    setPendingUploadId('');
    setCategoryDraft(category ? {
      name: category.name, slug: category.slug, description: category.description ?? '',
      order: String(category.order ?? 0), active: category.active,
    } : emptyCategory);
    setEditor({ kind: 'category', id: category?.id });
  }

  async function uploadImage(file: File) {
    if (!session) throw new Error('Your session expired. Sign in again.');
    const form = new FormData();
    form.append('file', file);
    const uploaded = await request('/admin/uploads', session.accessToken, { method: 'POST', body: form });
    return { url: absoluteUrl(uploaded.url), publicId: uploaded.publicId as string };
  }

  function discardUpload(publicId: string) {
    if (!publicId || !session) return Promise.resolve();
    return request(`/admin/uploads/${publicId}`, session.accessToken, { method: 'DELETE' }).catch(() => null);
  }

  async function uploadCover(file?: File) {
    if (!file || !session) return;
    const problem = imageProblem(file);
    if (problem) {
      setError(problem);
      return;
    }
    setUploading(true);
    setError('');
    try {
      const uploaded = await uploadImage(file);
      await discardUpload(pendingUploadId);
      setProjectDraft((draft) => ({ ...draft, coverImageUrl: uploaded.url, coverImagePublicId: uploaded.publicId }));
      setPendingUploadId(uploaded.publicId);
      setNotice('Image uploaded. Save the project to publish the change.');
    } catch (cause) { setError(messageFrom(cause)); }
    finally { setUploading(false); }
  }

  async function uploadPortrait(file?: File) {
    if (!file || !session) return;
    const problem = imageProblem(file);
    if (problem) {
      setError(problem);
      return;
    }
    setUploadingPortrait(true);
    setError('');
    try {
      const uploaded = await uploadImage(file);
      await discardUpload(pendingPortraitId);
      setProfileDraft((draft) => ({
        ...draft,
        portraitUrl: uploaded.url,
        portraitPublicId: uploaded.publicId,
        portraitAlt: draft.portraitAlt || draft.name || 'Profile portrait',
      }));
      setPendingPortraitId(uploaded.publicId);
      setNotice('Portrait uploaded. Save the profile to publish it on the About page.');
    } catch (cause) { setError(messageFrom(cause)); }
    finally { setUploadingPortrait(false); }
  }

  async function removePortrait() {
    await discardUpload(profileDraft.portraitPublicId);
    setPendingPortraitId('');
    setProfileDraft((draft) => ({ ...draft, portraitUrl: '', portraitPublicId: '' }));
    setNotice('Portrait removed. Save the profile to apply it.');
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session) return;
    setBusy(true);
    setError('');
    try {
      const saved = await request('/admin/profile', session.accessToken, { method: 'PATCH', body: JSON.stringify(profileDraft) });
      setPendingPortraitId('');
      applyProfile(saved as Profile);
      setNotice('Profile saved. Your About page is updated.');
    } catch (cause) { setError(messageFrom(cause)); }
    finally { setBusy(false); }
  }

  function closeEditor() {
    setEditor(null);
    if (pendingUploadId && session) {
      void request(`/admin/uploads/${pendingUploadId}`, session.accessToken, { method: 'DELETE' }).catch(() => null);
    }
    setPendingUploadId('');
  }

  async function saveEditor(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session || !editor) return;
    setBusy(true);
    setError('');
    try {
      if (editor.kind === 'project') {
        const body = {
          ...projectDraft,
          slug: slugify(projectDraft.slug || projectDraft.title),
          technologies: projectDraft.technologies.split(',').map((item) => item.trim()).filter(Boolean),
          order: Number(projectDraft.order) || 0,
        };
        await request(editor.id ? `/admin/projects/${editor.id}` : '/admin/projects', session.accessToken, {
          method: editor.id ? 'PATCH' : 'POST', body: JSON.stringify(body),
        });
      } else {
        const body = { ...categoryDraft, slug: slugify(categoryDraft.slug || categoryDraft.name), order: Number(categoryDraft.order) || 0 };
        await request(editor.id ? `/admin/categories/${editor.id}` : '/admin/categories', session.accessToken, {
          method: editor.id ? 'PATCH' : 'POST', body: JSON.stringify(body),
        });
      }
      if (pendingUploadId && editor.kind === 'project' && projectDraft.coverImagePublicId !== pendingUploadId) {
        await request(`/admin/uploads/${pendingUploadId}`, session.accessToken, { method: 'DELETE' }).catch(() => null);
      }
      setEditor(null);
      setPendingUploadId('');
      setNotice(editor.id ? 'Changes saved.' : 'New item created.');
      await refreshData(session.accessToken);
    } catch (cause) { setError(messageFrom(cause)); }
    finally { setBusy(false); }
  }

  async function removeItem(kind: 'project' | 'category', item: Project | Category) {
    const collection = kind === 'project' ? 'projects' : 'categories';
    const label = 'title' in item ? item.title : item.name;
    if (!session || !window.confirm(`Delete “${label}”? This cannot be undone.`)) return;
    setError('');
    try {
      await request(`/admin/${collection}/${item.id}`, session.accessToken, { method: 'DELETE' });
      setNotice(`${kind === 'project' ? 'Project' : 'Category'} deleted.`);
      await refreshData(session.accessToken);
    } catch (cause) { setError(messageFrom(cause)); }
  }

  const filteredProjects = projects.filter((project) => {
    const matchesText = `${project.title} ${project.slug} ${project.category?.name ?? ''}`.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || project.categoryId === categoryFilter;
    return matchesText && matchesStatus && matchesCategory;
  });

  if (loading && !session) {
    return <div className="grid min-h-[75svh] place-items-center px-6 pt-24"><p className="font-mono text-[11px] uppercase tracking-[0.25em] text-silver">Checking secure session…</p></div>;
  }

  if (!session) {
    return (
      <section className="mx-auto min-h-[75svh] max-w-[1400px] px-6 pb-24 pt-40 md:px-12">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-gold">Studio console / Access</p>
        <h1 className="mt-6 font-display text-[clamp(2.75rem,8vw,7rem)] leading-[0.95]">Admin sign in</h1>
        <p className="mt-6 max-w-xl text-silver">Secure access to your project and category workspace.</p>
        <form onSubmit={signIn} className="mt-12 grid max-w-lg gap-7 border border-ivory/15 bg-graphite/40 p-6 sm:p-8">
          <div><label htmlFor="admin-email" className={labelClass}>Email</label><input id="admin-email" name="email" type="email" autoComplete="username" required className={inputClass} /></div>
          <div><label htmlFor="admin-password" className={labelClass}>Password</label><input id="admin-password" name="password" type="password" autoComplete="current-password" required className={inputClass} /></div>
          {error && <p role="alert" className="text-sm text-[#e08a7a]">{error}</p>}
          <button disabled={busy} className="w-fit bg-gold px-7 py-4 font-mono text-[11px] uppercase tracking-[0.2em] text-obsidian transition-colors hover:bg-ivory disabled:opacity-50">{busy ? 'Signing in…' : 'Enter console'}</button>
        </form>
      </section>
    );
  }

  const nav = [
    { id: 'overview' as const, label: 'Overview', icon: LayoutDashboard },
    { id: 'projects' as const, label: 'Projects', icon: FolderKanban, count: projects.length },
    { id: 'categories' as const, label: 'Categories', icon: Tags, count: categories.length },
    { id: 'profile' as const, label: 'Profile', icon: User },
  ];
  const viewTitles = { overview: 'Overview', projects: 'Project portfolio', categories: 'Project categories', profile: 'About page profile' };

  return (
    <section className="mx-auto min-h-[85svh] max-w-[1600px] px-4 pb-20 pt-28 sm:px-6 md:px-10">
      <header className="flex flex-wrap items-center justify-between gap-5 border-b border-ivory/15 pb-6">
        <div className="flex items-center gap-4"><div className="grid h-11 w-11 place-items-center border border-gold/50 font-display text-xl text-gold">H</div><div><p className="font-mono text-[10px] uppercase tracking-[0.25em] text-gold">Hassan Noor / Studio</p><h1 className="mt-1 font-display text-2xl text-ivory">Control room</h1></div></div>
        <div className="flex items-center gap-4"><span className="hidden items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em] text-silver sm:flex"><span className="h-1.5 w-1.5 rounded-full bg-[#8FA9A0]" /> Secure session</span><span className="hidden max-w-52 truncate border-l border-ivory/15 pl-4 text-sm text-silver md:block">{session.email}</span><button type="button" onClick={signOut} className="flex items-center gap-2 border border-ivory/15 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.15em] text-silver transition-colors hover:border-gold hover:text-gold"><LogOut size={14} /> Sign out</button></div>
      </header>

      <div className="mt-7 grid gap-8 lg:grid-cols-[210px_minmax(0,1fr)] lg:gap-12">
        <aside className="lg:border-r lg:border-ivory/10 lg:pr-6">
          <p className="mb-3 hidden font-mono text-[9px] uppercase tracking-[0.25em] text-silver/50 lg:block">Workspace</p>
          <nav aria-label="Admin workspace" className="flex gap-2 overflow-x-auto lg:grid lg:gap-1">
            {nav.map(({ id, label, icon: Icon, count }) => <button key={id} type="button" onClick={() => setView(id)} aria-current={view === id ? 'page' : undefined} className={`flex shrink-0 items-center gap-3 px-3 py-3 text-left text-sm transition-colors ${view === id ? 'bg-gold text-obsidian' : 'text-silver hover:bg-ivory/5 hover:text-ivory'}`}><Icon size={16} strokeWidth={1.7} /><span className="flex-1">{label}</span>{count !== undefined && <span className="font-mono text-[10px] opacity-70">{count}</span>}</button>)}
          </nav>
          <div className="mt-8 hidden border-t border-ivory/10 pt-5 lg:block"><p className="font-mono text-[9px] uppercase tracking-[0.2em] text-silver/45">System status</p><p className="mt-3 flex items-center gap-2 text-xs text-silver"><span className="h-1.5 w-1.5 rounded-full bg-[#8FA9A0]" /> API connected</p><p className="mt-2 text-xs text-silver/55">Data syncs directly with MongoDB.</p></div>
        </aside>

        <main className="min-w-0">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4 border-b border-ivory/10 pb-5">
            <div><p className="font-mono text-[9px] uppercase tracking-[0.25em] text-gold">Workspace / {view}</p><h2 className="mt-2 font-display text-3xl text-ivory">{viewTitles[view]}</h2></div>
            <div className="flex gap-2"><button type="button" onClick={() => void refreshData()} disabled={loading} className="grid h-10 w-10 place-items-center border border-ivory/15 text-silver transition-colors hover:border-gold hover:text-gold disabled:opacity-40" aria-label="Refresh dashboard"><RefreshCw size={15} className={loading ? 'animate-spin' : ''} /></button>{view === 'projects' && <button type="button" onClick={() => openProject()} className="flex h-10 items-center gap-2 bg-gold px-4 font-mono text-[10px] uppercase tracking-[0.15em] text-obsidian hover:bg-ivory"><Plus size={15} /> New project</button>}{view === 'categories' && <button type="button" onClick={() => openCategory()} className="flex h-10 items-center gap-2 bg-gold px-4 font-mono text-[10px] uppercase tracking-[0.15em] text-obsidian hover:bg-ivory"><Plus size={15} /> New category</button>}</div>
          </div>

          {error && <p role="alert" className="mb-5 border-l-2 border-[#e08a7a] bg-[#e08a7a]/5 px-4 py-3 text-sm text-[#e08a7a]">{error}</p>}
          {notice && <div role="status" className="mb-5 flex items-center justify-between border-l-2 border-gold bg-gold/5 px-4 py-3 text-sm text-ivory"><span>{notice}</span><button type="button" onClick={() => setNotice('')} aria-label="Dismiss notification"><X size={15} /></button></div>}

          {view === 'overview' && overview && <div>
            <div className="grid gap-px border border-ivory/10 bg-ivory/10 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { label: 'Total projects', value: overview.stats.projects, icon: BriefcaseBusiness },
                { label: 'Published', value: overview.stats.published, icon: ArrowUpRight },
                { label: 'Drafts', value: overview.stats.drafts, icon: Pencil },
                { label: 'Categories', value: overview.stats.categories, icon: Tags },
              ].map(({ label, value, icon: Icon }) => <div key={label} className="bg-[#0c0d0f] p-5 sm:p-6"><div className="flex items-center justify-between"><span className="font-mono text-[9px] uppercase tracking-[0.2em] text-silver">{label}</span><Icon size={16} className="text-gold/75" /></div><p className="mt-5 font-display text-4xl text-ivory">{value}</p></div>)}
            </div>
            <div className="mt-10 grid gap-12 xl:grid-cols-[minmax(0,1.5fr)_minmax(260px,0.8fr)]">
              <section><div className="mb-4 flex items-center justify-between"><h3 className="font-display text-2xl">Recently updated</h3><button type="button" onClick={() => setView('projects')} className="font-mono text-[9px] uppercase tracking-[0.15em] text-gold hover:text-ivory">All projects <ArrowUpRight size={12} className="ml-1 inline" /></button></div><div className="divide-y divide-ivory/10 border-y border-ivory/10">{overview.recentProjects.map((project) => <div key={project.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-4 sm:grid-cols-[minmax(0,1fr)_130px_100px]"><div className="min-w-0"><p className="truncate text-sm text-ivory">{project.title}</p><p className="mt-1 truncate font-mono text-[9px] uppercase tracking-[0.12em] text-silver/55">{project.category?.name ?? 'Uncategorized'}</p></div><span className="hidden font-mono text-[10px] text-silver sm:block">{dateLabel(project.updatedAt)}</span><span className={`justify-self-end border px-2 py-1 font-mono text-[9px] uppercase tracking-[0.1em] ${project.status === 'published' ? 'border-[#8FA9A0]/30 text-[#8FA9A0]' : 'border-gold/30 text-gold'}`}>{project.status}</span></div>)}{!overview.recentProjects.length && <p className="py-8 text-sm text-silver">No projects yet. Create your first project from the Projects tab.</p>}</div></section>
              <section><div className="mb-4 flex items-center gap-2"><Activity size={15} className="text-gold" /><h3 className="font-display text-2xl">Recent activity</h3></div><div className="border-y border-ivory/10">{overview.recentActivity.map((item) => <div key={item._id} className="border-b border-ivory/10 py-4 last:border-0"><p className="text-sm text-ivory">{item.action.replaceAll('.', ' ').replaceAll('_', ' ')}</p><p className="mt-1 font-mono text-[9px] text-silver/55">{item.resourceType ?? 'Workspace'} / {dateLabel(item.createdAt)}</p></div>)}{!overview.recentActivity.length && <p className="py-8 text-sm text-silver">Activity appears here as you manage the portfolio.</p>}</div></section>
            </div>
          </div>}

          {view === 'projects' && <div>
            <div className="mb-5 grid gap-3 sm:grid-cols-[minmax(0,1fr)_160px_190px]">
              <label className="relative"><span className="sr-only">Search projects</span><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-silver/55" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search projects…" className={`${inputClass} pl-9`} /></label>
              <label className="relative"><span className="sr-only">Filter by status</span><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)} className={`${inputClass} appearance-none pr-8`}><option value="all">All statuses</option><option value="published">Published</option><option value="draft">Drafts</option></select><ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gold" /></label>
              <label className="relative"><span className="sr-only">Filter by category</span><select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className={`${inputClass} appearance-none pr-8`}><option value="all">All categories</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select><ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gold" /></label>
            </div>
            <div className="overflow-x-auto border-y border-ivory/10"><table className="w-full min-w-[760px] border-collapse text-left"><thead><tr className="border-b border-ivory/10 font-mono text-[9px] uppercase tracking-[0.18em] text-silver/60"><th className="py-3 pr-4 font-normal">Project</th><th className="px-3 py-3 font-normal">Category</th><th className="px-3 py-3 font-normal">Status</th><th className="px-3 py-3 font-normal">Updated</th><th className="px-3 py-3 text-right font-normal">Actions</th></tr></thead><tbody className="divide-y divide-ivory/10">{filteredProjects.map((project) => <tr key={project.id} className="group hover:bg-ivory/[0.025]"><td className="py-4 pr-4"><p className="text-sm text-ivory">{project.title}</p><p className="mt-1 font-mono text-[9px] text-silver/45">/{project.slug}</p></td><td className="px-3 py-4 text-sm text-silver">{project.category?.name ?? 'Uncategorized'}</td><td className="px-3 py-4"><span className={`font-mono text-[9px] uppercase tracking-[0.12em] ${project.status === 'published' ? 'text-[#8FA9A0]' : 'text-gold'}`}>{project.status}</span>{project.featured && <span className="ml-2 font-mono text-[8px] uppercase text-silver/45">Featured</span>}</td><td className="px-3 py-4 font-mono text-[10px] text-silver/65">{dateLabel(project.updatedAt)}</td><td className="px-3 py-4"><div className="flex justify-end gap-2"><button type="button" onClick={() => openProject(project)} aria-label={`Edit ${project.title}`} className="grid h-8 w-8 place-items-center border border-ivory/15 text-silver hover:border-gold hover:text-gold"><Pencil size={13} /></button><button type="button" onClick={() => void removeItem('project', project)} aria-label={`Delete ${project.title}`} className="grid h-8 w-8 place-items-center border border-ivory/15 text-silver hover:border-[#e08a7a] hover:text-[#e08a7a]"><Trash2 size={13} /></button></div></td></tr>)}{!filteredProjects.length && <tr><td colSpan={5} className="py-12 text-center text-sm text-silver">No projects match these filters.</td></tr>}</tbody></table></div>
            <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.16em] text-silver/50">Showing {filteredProjects.length} of {projects.length} projects</p>
          </div>}

          {view === 'profile' && <form onSubmit={saveProfile} className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="grid gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div><label className={labelClass}>Your name</label><input required maxLength={80} value={profileDraft.name} onChange={(event) => setProfileDraft({ ...profileDraft, name: event.target.value })} className={inputClass} /></div>
                <div><label className={labelClass}>Role</label><input maxLength={120} value={profileDraft.role} onChange={(event) => setProfileDraft({ ...profileDraft, role: event.target.value })} placeholder="Full Stack MERN Developer" className={inputClass} /></div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div><label className={labelClass}>Based in</label><input maxLength={120} value={profileDraft.location} onChange={(event) => setProfileDraft({ ...profileDraft, location: event.target.value })} placeholder="Gujranwala, Pakistan" className={inputClass} /></div>
                <div><label className={labelClass}>Availability badge</label><input maxLength={80} value={profileDraft.availability} onChange={(event) => setProfileDraft({ ...profileDraft, availability: event.target.value })} placeholder="Available for work" className={inputClass} /></div>
              </div>
              <div><label className={labelClass}>Focus</label><input maxLength={200} value={profileDraft.focus} onChange={(event) => setProfileDraft({ ...profileDraft, focus: event.target.value })} placeholder="MERN applications, business and e-commerce websites" className={inputClass} /></div>
              <div>
                <label className={labelClass}>About me</label>
                <textarea maxLength={4000} rows={8} value={profileDraft.bio} onChange={(event) => setProfileDraft({ ...profileDraft, bio: event.target.value })} placeholder="Leave a blank line between paragraphs." className={inputClass} />
                <p className="mt-2 text-xs text-silver/60">Leave a blank line between paragraphs. Empty text falls back to the copy in <span className="font-mono text-[10px]">client/lib/site.ts</span>.</p>
              </div>
            </div>

            <div className="grid content-start gap-5">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-silver/50">Your photo</p>
              <div className="grid aspect-[4/5] max-w-[280px] place-items-center overflow-hidden border border-ivory/15 bg-[#101114]">
                {profileDraft.portraitUrl
                  ? <img src={profileDraft.portraitUrl} alt={profileDraft.portraitAlt || 'Profile portrait preview'} className="h-full w-full object-cover" />
                  : <div className="flex flex-col items-center gap-2 text-silver/45"><ImagePlus size={24} strokeWidth={1.4} /><span className="font-mono text-[9px] uppercase tracking-[0.15em]">No portrait</span></div>}
              </div>
              <input ref={portraitFileInput} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => { void uploadPortrait(event.currentTarget.files?.[0]); event.currentTarget.value = ''; }} />
              <div className="flex flex-wrap gap-2">
                <button type="button" disabled={uploadingPortrait || busy} onClick={() => portraitFileInput.current?.click()} className="flex items-center gap-2 border border-gold/50 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-gold transition-colors hover:bg-gold hover:text-obsidian disabled:opacity-50"><Upload size={14} />{uploadingPortrait ? 'Uploading…' : 'Choose image'}</button>
                {profileDraft.portraitUrl && <button type="button" onClick={() => void removePortrait()} disabled={uploadingPortrait} className="flex items-center gap-2 border border-ivory/15 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-silver transition-colors hover:border-[#e08a7a] hover:text-[#e08a7a] disabled:opacity-50"><Trash2 size={14} /> Remove</button>}
              </div>
              <p className="text-xs leading-relaxed text-silver/65">A portrait (4:5 works best) shown at the top of your public About page. JPEG, PNG, or WebP up to 5 MB.</p>
              <div><label className={labelClass}>Image description</label><input maxLength={160} value={profileDraft.portraitAlt} onChange={(event) => setProfileDraft({ ...profileDraft, portraitAlt: event.target.value })} placeholder="Portrait of Hassan Noor" className={inputClass} /></div>
              <p className="text-xs leading-relaxed text-silver/60">No photo yet? Drop one at <span className="font-mono text-[10px]">client/public/portrait.jpg</span> and it stays in use until you upload one here.</p>
              <button disabled={busy || uploadingPortrait} className="flex items-center justify-center gap-2 bg-gold px-5 py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-obsidian hover:bg-ivory disabled:opacity-50">{busy ? 'Saving…' : <><Check size={14} /> Save profile</>}</button>
              {profile?.updatedAt && <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-silver/45">Last saved {dateLabel(profile.updatedAt)}</p>}
            </div>
          </form>}

          {view === 'categories' && <div className="overflow-x-auto border-y border-ivory/10"><table className="w-full min-w-[620px] border-collapse text-left"><thead><tr className="border-b border-ivory/10 font-mono text-[9px] uppercase tracking-[0.18em] text-silver/60"><th className="py-3 pr-4 font-normal">Category</th><th className="px-3 py-3 font-normal">Projects</th><th className="px-3 py-3 font-normal">Visibility</th><th className="px-3 py-3 font-normal">Order</th><th className="px-3 py-3 text-right font-normal">Actions</th></tr></thead><tbody className="divide-y divide-ivory/10">{categories.map((category) => <tr key={category.id} className="hover:bg-ivory/[0.025]"><td className="py-4 pr-4"><p className="text-sm text-ivory">{category.name}</p><p className="mt-1 font-mono text-[9px] text-silver/45">/{category.slug}</p></td><td className="px-3 py-4 font-mono text-sm text-ivory">{category.projectCount}</td><td className="px-3 py-4 text-sm text-silver">{category.active ? 'Active' : 'Hidden'}</td><td className="px-3 py-4 font-mono text-sm text-silver">{String(category.order).padStart(2, '0')}</td><td className="px-3 py-4"><div className="flex justify-end gap-2"><button type="button" onClick={() => openCategory(category)} aria-label={`Edit ${category.name}`} className="grid h-8 w-8 place-items-center border border-ivory/15 text-silver hover:border-gold hover:text-gold"><Pencil size={13} /></button><button type="button" onClick={() => void removeItem('category', category)} aria-label={`Delete ${category.name}`} className="grid h-8 w-8 place-items-center border border-ivory/15 text-silver hover:border-[#e08a7a] hover:text-[#e08a7a]"><Trash2 size={13} /></button></div></td></tr>)}{!categories.length && <tr><td colSpan={5} className="py-12 text-center text-sm text-silver">No categories yet.</td></tr>}</tbody></table></div>}
        </main>
      </div>

      {editor && <div className="fixed inset-0 z-[150] bg-black/70" role="presentation" onMouseDown={(event) => { if (!uploading && event.target === event.currentTarget) closeEditor(); }}>
        <section role="dialog" aria-modal="true" aria-labelledby="editor-title" className="ml-auto h-full w-full max-w-[640px] overflow-y-auto border-l border-ivory/15 bg-[#0e0f11] shadow-2xl shadow-black/50">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-ivory/10 bg-[#0e0f11]/95 px-6 py-5 backdrop-blur sm:px-8"><div><p className="font-mono text-[9px] uppercase tracking-[0.22em] text-gold">Workspace / Editor</p><h2 id="editor-title" className="mt-1 font-display text-2xl">{editor.id ? 'Edit' : 'Create'} {editor.kind}</h2></div><button type="button" onClick={closeEditor} disabled={uploading} aria-label="Close editor" className="grid h-9 w-9 place-items-center border border-ivory/15 text-silver hover:border-gold hover:text-gold disabled:opacity-40"><X size={16} /></button></div>
          <form onSubmit={saveEditor} className="grid gap-5 px-6 py-7 sm:px-8">
            {editor.kind === 'project' ? <>
              <div className="grid gap-5 sm:grid-cols-2"><div><label className={labelClass}>Project title *</label><input required maxLength={120} value={projectDraft.title} onChange={(event) => setProjectDraft({ ...projectDraft, title: event.target.value })} className={inputClass} /></div><div><label className={labelClass}>URL slug</label><input value={projectDraft.slug} onChange={(event) => setProjectDraft({ ...projectDraft, slug: event.target.value })} placeholder={slugify(projectDraft.title) || 'project-name'} className={inputClass} /></div></div>
              <div className="grid gap-5 sm:grid-cols-2"><div><label className={labelClass}>Category</label><div className="relative"><select value={projectDraft.categoryId} onChange={(event) => setProjectDraft({ ...projectDraft, categoryId: event.target.value })} className={`${inputClass} appearance-none pr-9`}><option value="" className="bg-[#101114] text-silver">Uncategorized</option>{categories.map((category) => <option key={category.id} value={category.id} className="bg-[#101114] text-ivory">{category.name}</option>)}</select><ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gold" /></div></div><div><label className={labelClass}>Project type</label><input value={projectDraft.projectType} onChange={(event) => setProjectDraft({ ...projectDraft, projectType: event.target.value })} className={inputClass} /></div></div>
              <div><label className={labelClass}>Summary</label><textarea maxLength={300} rows={2} value={projectDraft.summary} onChange={(event) => setProjectDraft({ ...projectDraft, summary: event.target.value })} className={inputClass} /></div>
              <div><label className={labelClass}>Description</label><textarea maxLength={10000} rows={4} value={projectDraft.description} onChange={(event) => setProjectDraft({ ...projectDraft, description: event.target.value })} className={inputClass} /></div>
              <div className="grid gap-5 sm:grid-cols-2"><div><label className={labelClass}>Live URL *</label><input required type="url" value={projectDraft.liveUrl} onChange={(event) => setProjectDraft({ ...projectDraft, liveUrl: event.target.value })} className={inputClass} /></div><div><label className={labelClass}>GitHub URL</label><input type="url" value={projectDraft.githubUrl} onChange={(event) => setProjectDraft({ ...projectDraft, githubUrl: event.target.value })} className={inputClass} /></div></div>
              <div>
                <label className={labelClass}>Cover image</label>
                <div className="grid gap-4 sm:grid-cols-[240px_minmax(0,1fr)]">
                  <div className="grid aspect-[16/10] place-items-center overflow-hidden border border-ivory/15 bg-[#101114]">
                    {projectDraft.coverImageUrl
                      ? <img src={projectDraft.coverImageUrl} alt="Project cover preview" className="h-full w-full object-cover" />
                      : <div className="flex flex-col items-center gap-2 text-silver/45"><ImagePlus size={24} strokeWidth={1.4} /><span className="font-mono text-[9px] uppercase tracking-[0.15em]">No cover image</span></div>}
                  </div>
                  <div className="flex flex-col items-start justify-center gap-3">
                    <input ref={coverFileInput} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => { void uploadCover(event.currentTarget.files?.[0]); event.currentTarget.value = ''; }} />
                    <button type="button" disabled={uploading || busy} onClick={() => coverFileInput.current?.click()} className="flex items-center gap-2 border border-gold/50 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-gold transition-colors hover:bg-gold hover:text-obsidian disabled:opacity-50"><Upload size={14} />{uploading ? 'Uploading…' : 'Choose image'}</button>
                    <p className="text-xs leading-relaxed text-silver/65">JPEG, PNG, or WebP. Maximum 5 MB.</p>
                  </div>
                </div>
                <label className={`${labelClass} mt-5`}>Or use an image URL</label>
                <input type="url" value={projectDraft.coverImageUrl} onChange={(event) => setProjectDraft({ ...projectDraft, coverImageUrl: event.target.value, coverImagePublicId: '' })} placeholder="https://example.com/cover.webp" className={inputClass} />
              </div>
              <div className="grid gap-5 sm:grid-cols-[1fr_130px]"><div><label className={labelClass}>Technologies / comma separated</label><input value={projectDraft.technologies} onChange={(event) => setProjectDraft({ ...projectDraft, technologies: event.target.value })} placeholder="Next.js, TypeScript, MongoDB" className={inputClass} /></div><div><label className={labelClass}>Display order</label><input type="number" min="0" value={projectDraft.order} onChange={(event) => setProjectDraft({ ...projectDraft, order: event.target.value })} className={inputClass} /></div></div>
              <div className="flex flex-wrap items-center gap-6 border-y border-ivory/10 py-4"><span className={labelClass + ' mb-0'}>Publish status</span><label className="flex items-center gap-2 text-sm text-silver"><input type="radio" name="project-status" checked={projectDraft.status === 'draft'} onChange={() => setProjectDraft({ ...projectDraft, status: 'draft' })} className="accent-gold" /> Draft</label><label className="flex items-center gap-2 text-sm text-silver"><input type="radio" name="project-status" checked={projectDraft.status === 'published'} onChange={() => setProjectDraft({ ...projectDraft, status: 'published' })} className="accent-gold" /> Published</label><label className="ml-auto flex items-center gap-2 text-sm text-silver"><input type="checkbox" checked={projectDraft.featured} onChange={(event) => setProjectDraft({ ...projectDraft, featured: event.target.checked })} className="accent-gold" /> Featured</label></div>
            </> : <>
              <div><label className={labelClass}>Category name *</label><input required maxLength={80} value={categoryDraft.name} onChange={(event) => setCategoryDraft({ ...categoryDraft, name: event.target.value })} className={inputClass} /></div>
              <div><label className={labelClass}>URL slug</label><input value={categoryDraft.slug} onChange={(event) => setCategoryDraft({ ...categoryDraft, slug: event.target.value })} placeholder={slugify(categoryDraft.name) || 'category-name'} className={inputClass} /></div>
              <div><label className={labelClass}>Description</label><textarea maxLength={300} rows={3} value={categoryDraft.description} onChange={(event) => setCategoryDraft({ ...categoryDraft, description: event.target.value })} className={inputClass} /></div>
              <div className="grid gap-5 sm:grid-cols-2"><div><label className={labelClass}>Display order</label><input type="number" min="0" value={categoryDraft.order} onChange={(event) => setCategoryDraft({ ...categoryDraft, order: event.target.value })} className={inputClass} /></div><label className="mt-7 flex items-center gap-2 text-sm text-silver"><input type="checkbox" checked={categoryDraft.active} onChange={(event) => setCategoryDraft({ ...categoryDraft, active: event.target.checked })} className="accent-gold" /> Active on the public site</label></div>
            </>}
            {error && <p role="alert" className="border-l-2 border-[#e08a7a] px-3 py-2 text-sm text-[#e08a7a]">{error}</p>}
            <div className="sticky bottom-0 -mx-6 mt-3 flex justify-end gap-3 border-t border-ivory/10 bg-[#0e0f11]/95 px-6 py-4 backdrop-blur sm:-mx-8 sm:px-8"><button type="button" onClick={closeEditor} disabled={uploading} className="border border-ivory/15 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-silver hover:border-ivory/35 disabled:opacity-40">Cancel</button><button disabled={busy || uploading} className="flex items-center gap-2 bg-gold px-5 py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-obsidian hover:bg-ivory disabled:opacity-50">{busy ? 'Saving…' : <><Check size={14} /> Save {editor.kind}</>}</button></div>
          </form>
        </section>
      </div>}
    </section>
  );
}