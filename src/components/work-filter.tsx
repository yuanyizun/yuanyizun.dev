"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";

export type WorkGroup = "applications" | "data" | "infrastructure";

export type WorkItem = {
  slug: string;
  title: string;
  summary: string;
  period?: string;
  group: WorkGroup;
};

const labels: Record<WorkGroup, string> = {
  applications: "Applications",
  data: "Data",
  infrastructure: "Infrastructure",
};

const groups: WorkGroup[] = ["applications", "data", "infrastructure"];

function subscribe() {
  return () => {};
}

function useIsClient() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}

function ProjectList({ items }: { items: WorkItem[] }) {
  return (
    <ul className="flex flex-col">
      {items.map((item) => (
        <li key={item.slug}>
          <Link
            href={`/projects/${item.slug}`}
            className="group grid gap-1 py-4 no-underline transition-colors hover:text-accent sm:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)_auto] sm:items-baseline sm:gap-6"
          >
            <span className="text-[1.05rem] font-semibold tracking-[-0.02em]">
              {item.title}
            </span>
            <span className="text-[0.95rem] text-muted-foreground group-hover:text-accent/80">
              {item.summary}
            </span>
            {item.period ? (
              <span className="text-[0.875rem] text-muted-foreground tabular-nums group-hover:text-accent/80 sm:text-right">
                {item.period}
              </span>
            ) : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function WorkFilter({ items }: { items: WorkItem[] }) {
  const isClient = useIsClient();
  const [active, setActive] = useState<WorkGroup>("applications");

  if (!isClient) {
    return (
      <div className="flex flex-col gap-10">
        {groups.map((group) => (
          <div key={group} className="flex flex-col gap-4">
            <h3 className="font-heading text-[1.25rem] font-semibold tracking-[-0.03em]">
              {labels[group]}
            </h3>
            <ProjectList items={items.filter((item) => item.group === group)} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div
        className="flex flex-wrap gap-2"
        role="tablist"
        aria-label="Work groups"
      >
        {groups.map((group) => {
          const selected = active === group;
          return (
            <button
              key={group}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(group)}
              className={`px-3.5 py-2 text-[0.875rem] font-semibold tracking-[-0.02em] transition-colors ${
                selected
                  ? "bg-foreground text-background"
                  : "bg-surface text-foreground hover:bg-foreground hover:text-background"
              }`}
            >
              {labels[group]}
            </button>
          );
        })}
      </div>
      <div role="tabpanel">
        <ProjectList items={items.filter((item) => item.group === active)} />
      </div>
    </div>
  );
}
