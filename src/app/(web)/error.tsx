"use client";

import { useEffect } from "react";
import { Container } from "@/components/primitive/container/container";
import { RouteErrorContent } from "@/components/composite/route-error-content/route-error-content";

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
    <Container as="main" id="main-content" className="py-16">
      <RouteErrorContent onRetry={retry} />
    </Container>
  );
}
