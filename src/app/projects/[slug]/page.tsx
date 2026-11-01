import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Markdown } from "@/components/markdown";
import { extractHeadings } from "@/lib/headings";
import { getProject, getProjects, type Project } from "@/lib/content";
import type { Placement, RelatedItem } from "@/theme/contracts";
import { PageFrame } from "@/theme/PageFrame";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) {
    return { title: "Projects" };
  }
  return {
    title: project.title,
    description: project.summary,
  };
}

function relatedProjects(projects: Project[], current: Project): RelatedItem[] {
  const others = projects.filter((project) => project.slug !== current.slug);
  const sameKind = others.filter((project) => project.kind && project.kind === current.kind);
  const rest = others.filter((project) => project.kind !== current.kind);
  return [...sameKind, ...rest].slice(0, 2).map((project) => ({
    href: `/projects/${project.slug}`,
    title: project.title,
    summary: project.summary,
    meta: [project.kind, project.period].filter(Boolean).join(" · "),
  }));
}

async function ProjectArticle({
  params,
}: {
  params: PageProps<"/projects/[slug]">["params"];
}) {
  const { slug } = await params;
  const [project, projects] = await Promise.all([
    getProject(slug),
    getProjects(),
  ]);
  if (!project) {
    notFound();
  }

  const headings = extractHeadings(project.content);
  const related = relatedProjects(projects, project);
  const positions: Placement = {
    "after-header": [
      {
        id: "project-breadcrumbs",
        type: "Breadcrumbs",
        props: {
          items: [
            { label: "Projects", href: "/projects" },
            { label: project.title },
          ],
        },
      },
    ],
    "main-before": [
      {
        id: "project-header",
        type: "CaseStudyHeader",
        props: {
          study: {
            title: project.title,
            summary: project.summary,
            period: project.period,
            context: project.context,
            role: project.role,
            stack: project.stack,
          },
        },
      },
    ],
    "main-middle": project.stages?.length
      ? [
          {
            id: "project-figure",
            type: "ArchitectureFigure",
            props: { stages: project.stages, title: project.title },
          },
        ]
      : [],
    sidebar: headings.length
      ? [
          {
            id: "project-contents",
            type: "CaseStudyNavigation",
            props: { headings, label: "On this page" },
          },
        ]
      : [],
    "main-after": related.length
      ? [
          {
            id: "project-related",
            type: "RelatedProjects",
            props: { items: related },
          },
        ]
      : [],
  };

  return (
    <PageFrame template="project" positions={positions}>
      <div className="reading-column flex flex-col gap-6">
        {project.url ? (
          <p>
            <a href={project.url}>View source</a>
          </p>
        ) : null}
        <article id="article-body" className="article-body">
          <Markdown>{project.content}</Markdown>
        </article>
      </div>
    </PageFrame>
  );
}

export default function ProjectPage(props: PageProps<"/projects/[slug]">) {
  return (
    <Suspense
      fallback={
        <main id="main-content" className="theme-container py-16">
          <p>Loading project…</p>
        </main>
      }
    >
      <ProjectArticle params={props.params} />
    </Suspense>
  );
}
