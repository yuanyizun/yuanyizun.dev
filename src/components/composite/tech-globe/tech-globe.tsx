"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useId, useState } from "react";
import {
  TECH_GLOBE_CATEGORIES,
  TECH_GLOBE_DEFAULT_SELECTED_ID,
  TECH_GLOBE_NODES,
} from "@/catalog/tech-globe";

const TechGlobeScene = dynamic(() => import("./tech-globe-scene"), {
  ssr: false,
});

function GraphLoading({ labelId }: { labelId: string }) {
  return (
    <div
      className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-card"
      role="status"
      aria-labelledby={labelId}
      aria-busy="true"
    >
      <div
        className="size-8 animate-spin rounded-full border-2 border-border border-t-primary"
        aria-hidden
      />
      <p
        id={labelId}
        className="font-mono text-xs tracking-[0.04em] text-muted-foreground"
      >
        Loading stack map…
      </p>
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
  const loadingLabelId = useId();
  const [selectedId, setSelectedId] = useState<string | null>(
    TECH_GLOBE_DEFAULT_SELECTED_ID,
  );
  const [reduceMotion, setReduceMotion] = useState(false);
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [sceneReady, setSceneReady] = useState(false);

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

  const handleReady = useCallback(() => {
    setSceneReady(true);
  }, []);

  const selected = TECH_GLOBE_NODES.find((node) => node.id === selectedId);
  const interactive = sceneReady;
  const showLoader = webgl !== false && !sceneReady;

  return (
    <div
      className="relative aspect-square min-h-[24rem] w-full overflow-hidden bg-card sm:min-h-[28rem] lg:aspect-auto lg:h-full lg:min-h-[32rem]"
      role="region"
      aria-labelledby={labelId}
      aria-busy={showLoader}
    >
      <p id={labelId} className="sr-only">
        Interactive tech stack network map. Drag to rotate. Tagged technologies:{" "}
        {TECH_GLOBE_NODES.map((node) => node.label).join(", ")}. Select a node
        for detail.
      </p>

      <div className="absolute inset-0">
        {webgl === false ? (
          <StaticFallback selectedId={selectedId} onSelect={setSelectedId} />
        ) : webgl === true ? (
          <div
            className={
              sceneReady
                ? "h-full w-full opacity-100 transition-opacity duration-300"
                : "h-full w-full opacity-0"
            }
            aria-hidden={!sceneReady}
          >
            <TechGlobeScene
              selectedId={selectedId}
              onSelect={setSelectedId}
              reduceMotion={reduceMotion}
              interactive={interactive}
              onReady={handleReady}
            />
          </div>
        ) : null}
      </div>

      {showLoader ? <GraphLoading labelId={loadingLabelId} /> : null}

      {interactive && selected ? (
        <aside
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-background via-background/90 to-transparent p-4 pt-16 sm:p-5 sm:pt-20"
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
      ) : null}

      {interactive && !selected ? (
        <p className="pointer-events-none absolute bottom-3 left-3 z-20 font-mono text-[0.7rem] text-muted-foreground">
          Drag to rotate · click a tagged node
        </p>
      ) : null}
    </div>
  );
}
