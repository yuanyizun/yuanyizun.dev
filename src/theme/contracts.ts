export const POSITION_NAMES = [
  "before-header",
  "header",
  "after-header",
  "main-before",
  "main-middle",
  "main-after",
  "sidebar",
  "before-footer",
  "footer",
  "after-footer",
] as const;

export type PositionName = (typeof POSITION_NAMES)[number];

export const SITE_POSITIONS = [
  "before-header",
  "header",
  "before-footer",
  "footer",
  "after-footer",
] as const satisfies readonly PositionName[];

export const ROUTE_POSITIONS = [
  "after-header",
  "main-before",
  "main-middle",
  "sidebar",
  "main-after",
] as const satisfies readonly PositionName[];

export type NavKey = "home" | "about" | "posts" | "projects" | "contact";

export type Crumb = { label: string; href?: string };

export type HeadingLink = { id: string; title: string };

export type ArticleMeta = {
  title: string;
  date: string;
  summary: string;
  minutes: number;
};

export type RelatedItem = {
  href: string;
  title: string;
  summary: string;
  meta: string;
};

export type CaseStudyMeta = {
  title: string;
  summary: string;
  period?: string;
  context?: string;
  role?: string;
  stack?: string[];
};

export type ModuleAssignment =
  | { id: string; type: "SiteHeader"; props: { active?: NavKey } }
  | { id: string; type: "SiteFooter"; props: Record<string, never> }
  | {
      id: string;
      type: "IntroHero";
      props: { title: string; summary: string };
    }
  | { id: string; type: "ProofPoints"; props: Record<string, never> }
  | {
      id: string;
      type: "PageIntro";
      props: { title: string; summary?: string; mark?: "monogram" };
    }
  | { id: string; type: "ResumeLink"; props: { href: string; label: string } }
  | { id: string; type: "Breadcrumbs"; props: { items: Crumb[] } }
  | { id: string; type: "ArticleHeader"; props: { article: ArticleMeta } }
  | { id: string; type: "ArticleCover"; props: { title: string } }
  | {
      id: string;
      type: "ArticleNavigation";
      props: { headings: HeadingLink[]; label?: string };
    }
  | { id: string; type: "AuthorBio"; props: Record<string, never> }
  | { id: string; type: "RelatedPosts"; props: { items: RelatedItem[] } }
  | { id: string; type: "CaseStudyHeader"; props: { study: CaseStudyMeta } }
  | {
      id: string;
      type: "ArchitectureFigure";
      props: { stages: string[]; title: string };
    }
  | {
      id: string;
      type: "CaseStudyNavigation";
      props: { headings: HeadingLink[]; label?: string };
    }
  | { id: string; type: "RelatedProjects"; props: { items: RelatedItem[] } }
  | {
      id: string;
      type: "ContactCTA";
      props: { variant?: "compact" | "full" };
    };

export type ModuleType = ModuleAssignment["type"];

export type Placement = Partial<Record<PositionName, ModuleAssignment[]>>;

export const REGISTRY_ALLOWED_POSITIONS: Record<ModuleType, readonly PositionName[]> =
  {
    SiteHeader: ["header"],
    SiteFooter: ["footer"],
    IntroHero: ["main-before"],
    ProofPoints: ["main-middle"],
    PageIntro: ["main-before"],
    ResumeLink: ["main-after"],
    Breadcrumbs: ["after-header"],
    ArticleHeader: ["main-before"],
    ArticleCover: ["main-middle"],
    ArticleNavigation: ["sidebar"],
    AuthorBio: ["main-after"],
    RelatedPosts: ["main-after"],
    CaseStudyHeader: ["main-before"],
    ArchitectureFigure: ["main-middle"],
    CaseStudyNavigation: ["sidebar"],
    RelatedProjects: ["main-after"],
    ContactCTA: ["main-after", "before-footer"],
  };

export type TemplateKey =
  | "home"
  | "about"
  | "posts"
  | "post"
  | "projects"
  | "project"
  | "contact"
  | "not-found"
  | "error";

export type FrameVariant = "wide" | "reading" | "compact";

const POSITION_SET = new Set<string>(POSITION_NAMES);

export function validatePlacement(placement: Placement): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();

  for (const [position, assignments] of Object.entries(placement)) {
    if (!POSITION_SET.has(position)) {
      errors.push(`Unknown position "${position}"`);
      continue;
    }

    for (const assignment of assignments ?? []) {
      if (ids.has(assignment.id)) {
        errors.push(`Duplicate assignment id "${assignment.id}"`);
      }
      ids.add(assignment.id);

      const allowed = REGISTRY_ALLOWED_POSITIONS[assignment.type];
      if (!allowed) {
        errors.push(`Unknown module "${assignment.type}"`);
        continue;
      }
      if (!allowed.includes(position as PositionName)) {
        errors.push(
          `${assignment.type} cannot be placed in "${position}"`,
        );
      }
    }
  }

  return errors;
}
