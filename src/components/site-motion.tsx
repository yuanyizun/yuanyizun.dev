"use client";

import { useEffect } from "react";

export function SiteMotion() {
  useEffect(() => {
    const roots = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    if (roots.length === 0) {
      return;
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      for (const root of roots) {
        root.dataset.revealed = "true";
      }
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            continue;
          }
          const target = entry.target as HTMLElement;
          target.dataset.revealed = "true";
          observer.unobserve(target);
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" },
    );

    for (const root of roots) {
      observer.observe(root);
    }

    return () => observer.disconnect();
  }, []);

  return null;
}
