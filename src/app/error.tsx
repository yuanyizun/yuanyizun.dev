"use client";

import { useEffect } from "react";
import { RouteErrorContent } from "@/features/fallbacks";

export default function Error({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="main-content" className="theme-container py-16">
      <RouteErrorContent onRetry={retry} />
    </main>
  );
}
