"use client";

import dynamic from "next/dynamic";
import { useEffect, useId, useState } from "react";
import {
  TECH_GLOBE_CATEGORIES,
  TECH_GLOBE_NODES,
} from "@/data/tech-globe";

const TechGlobeScene = dynamic(() => import("./tech-globe-scene"), {
  ssr: false,
  loading: () => <NetworkPlaceholder />,
});

function NetworkPlaceholder() {
  return (
    <div
      className="flex h-full w-full items-center justify-center bg-card"
      aria-hidden
    >
      <svg viewBox="0 0 240 180" className="h-full w-full text-foreground">
        <line x1="48" y1="96" x2="110" y2="72" stroke="#646B60" strokeWidth="1.2" />
        <line x1="110" y1="72" x2="168" y2="88" stroke="#646B60" strokeWidth="1.2" />
        <line x1="110" y1="72" x2="120" y2="130" stroke="#646B60" strokeWidth="1.2" />
        <line x1="168" y1="88" x2="190" y2="48" stroke="#646B60" strokeWidth="1.2" />
        <circle cx="48" cy="96" r="5" fill="#242823" />
        <circle cx="110" cy="72" r="6" fill="#BB4B2C" />
        <circle cx="168" cy="88" r="5" fill="#242823" />
        <circle cx="120" cy="130" r="5" fill="#242823" />
        <circle cx="190" cy="48" r="5" fill="#242823" />
      </svg>
    </div>
  );
}

function StaticFallback({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}) {
  return (
    <div className="flex h-full min-h-[18rem] flex-col gap-4 bg-card p-5">
      <p className="font-mono text-xs text-muted-foreground">
        Tech stack · static network
      </p>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {TECH_GLOBE_NODES.map((node) => {
          const active = node.id === selectedId;
          return (
            <li key={node.id}>
              <button
                type="button"
                onClick={() => onSelect(active ? null : node.id)}
                className={
                  active
                    ? "w-full rounded-md bg-primary px-2.5 py-2 text-left text-sm text-primary-foreground"
                    : "w-full rounded-md bg-background px-2.5 py-2 text-left text-sm text-foreground"
                }
              >
                {node.label}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl"),
    );
  } catch {
    return false;
  }
}

export function TechGlobe() {
  const labelId = useId();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [webgl, setWebgl] = useState<boolean | null>(null);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => setReduceMotion(motion.matches);
    syncMotion();
    motion.addEventListener("change", syncMotion);
    setWebgl(supportsWebGL());
    return () => motion.removeEventListener("change", syncMotion);
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedId]);

  const selected = TECH_GLOBE_NODES.find((node) => node.id === selectedId);

  return (
    <div
      className="relative aspect-square min-h-[24rem] w-full overflow-hidden bg-card sm:min-h-[28rem] lg:aspect-auto lg:h-full lg:min-h-[32rem]"
      role="region"
      aria-labelledby={labelId}
    >
      <p id={labelId} className="sr-only">
        Interactive tech stack network map. Drag to rotate. Tagged technologies:{" "}
        {TECH_GLOBE_NODES.map((node) => node.label).join(", ")}. Select a node
        for detail.
      </p>

      <div className="absolute inset-0">
        {webgl === false ? (
          <StaticFallback selectedId={selectedId} onSelect={setSelectedId} />
        ) : webgl === null ? (
          <NetworkPlaceholder />
        ) : (
          <TechGlobeScene
            selectedId={selectedId}
            onSelect={setSelectedId}
            reduceMotion={reduceMotion}
          />
        )}
      </div>

      {selected ? (
        <aside
          className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/90 to-transparent p-4 pt-16 sm:p-5 sm:pt-20"
          aria-live="polite"
        >
          <div className="pointer-events-auto max-w-md rounded-lg border border-border/70 bg-background/95 p-4 shadow-sm backdrop-blur-[2px]">
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.08em] text-muted-foreground">
              {TECH_GLOBE_CATEGORIES[selected.category]}
            </p>
            <p className="font-heading text-2xl tracking-[-0.03em]">
              {selected.label}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-foreground">
              {selected.detail}
            </p>
            <button
              type="button"
              className="mt-2 font-mono text-xs text-primary underline-offset-2 hover:underline"
              onClick={() => setSelectedId(null)}
            >
              Clear
            </button>
          </div>
        </aside>
      ) : (
        <p className="pointer-events-none absolute bottom-3 left-3 font-mono text-[0.7rem] text-muted-foreground">
          Drag to rotate · click a tagged node
        </p>
      )}
    </div>
  );
}
