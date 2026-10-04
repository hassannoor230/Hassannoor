export type Img = { url: string; alt?: string };
export type Category = { id?: string; name: string; slug: string; order?: number };
export type SiteProfile = {
  id?: string; name?: string; role?: string; location?: string; availability?: string; focus?: string; bio?: string;
  portrait?: { url?: string; publicId?: string; alt?: string } | null;
};
export type Project = {
  id?: string; title: string; slug: string; summary: string; description?: string;
  category: { name: string; slug: string } | null; projectType?: string;
  coverImage?: Img | null; gallery?: Img[]; technologies: string[];
  liveUrl: string; githubUrl?: string; featured?: boolean; order: number;
  caseStudy?: { problem?: string; solution?: string; process?: string; challenges?: string; features?: string[]; results?: string[] };
  seo?: { title?: string; description?: string };
};
