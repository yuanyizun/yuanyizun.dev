import "server-only";
import { cache } from "react";
import { getProjects, type Project } from "@/data/projects";
import {
  parseSelectedWorkQuery,
  type SelectedWorkFacets,
  type SelectedWorkSelection,
} from "@/utils/selected-work-query";

export type SelectedProject = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  period?: string;
  kind?: string;
};

const selectedSlugs = [
  "laravel-comment-system",
  "event-ticket-sales-crm",
  "salesforce-crm-middleware",
  "bigquery-data-pipeline",
  "shared-publishing-templates",
  "aws-hosting-restructure",
] as const;

function yearOf(date: string) {
  const year = Number(date.slice(0, 4));
  return Number.isInteger(year) ? year : null;
}

function byDateDescending(left: { date: string }, right: { date: string }) {
  if (left.date === right.date) return 0;
  return left.date < right.date ? 1 : -1;
}

function toSelectedProject(project: Project): SelectedProject {
  return {
    slug: project.slug,
    title: project.title,
    date: project.date,
    summary: project.summary,
    period: project.period,
    kind: project.kind,
  };
}

const loadSelectedProjects = cache(async (): Promise<SelectedProject[]> => {
  const projects = await getProjects();
  const bySlug = new Map(projects.map((project) => [project.slug, project]));

  return selectedSlugs
    .map((slug) => bySlug.get(slug))
    .filter((project): project is Project => Boolean(project))
    .filter((project) => project.group !== "personal")
    .map(toSelectedProject)
    .sort(byDateDescending);
});

function facetsFor(projects: SelectedProject[]): SelectedWorkFacets {
  const years = projects
    .map((project) => yearOf(project.date))
    .filter((year): year is number => year !== null);
  const types: string[] = [];

  for (const project of projects) {
    if (project.kind && !types.includes(project.kind)) {
      types.push(project.kind);
    }
  }

  return {
    minYear: years.length > 0 ? Math.min(...years) : 0,
    maxYear: years.length > 0 ? Math.max(...years) : 0,
    types,
  };
}

function filterSelectedProjects(
  projects: SelectedProject[],
  selection: SelectedWorkSelection,
) {
  return projects.filter((project) => {
    const year = yearOf(project.date);
    if (year === null || year < selection.fromYear || year > selection.toYear) {
      return false;
    }
    if (selection.types.length === 0) return true;
    return project.kind !== undefined && selection.types.includes(project.kind);
  });
}

export async function getSelectedWork(
  params: Record<string, string | string[] | undefined>,
) {
  const projects = await loadSelectedProjects();
  const facets = facetsFor(projects);
  const selection = parseSelectedWorkQuery(params, facets);
  return {
    projects: filterSelectedProjects(projects, selection),
    facets,
  };
}
