import { Markdown } from "@/components/composite/markdown/markdown";
import { PageFrame } from "@/components/composite/page-frame/page-frame";
import type { Placement } from "@/theme/contracts";
import { extractHeadings } from "@/utils/markdown";

type ProjectBody = {
  title: string;
  summary: string;
  content: string;
  url?: string;
  period?: string;
  context?: string;
  role?: string;
  stack?: string[];
  stages?: string[];
};

type RelatedLink = {
  href: string;
  title: string;
  summary: string;
  meta: string;
};

export function ProjectArticle({
  project,
  related,
}: {
  project: ProjectBody;
  related: RelatedLink[];
}) {
  const headings = extractHeadings(project.content);
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
      <div className="flex w-full max-w-[47.5rem] flex-col gap-6">
        {project.url ? (
          <p>
            <a href={project.url}>View source</a>
          </p>
        ) : null}
        <article id="article-body">
          <Markdown>{project.content}</Markdown>
        </article>
      </div>
    </PageFrame>
  );
}
