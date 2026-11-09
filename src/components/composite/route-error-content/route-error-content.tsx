"use client";

import Link from "next/link";

export function RouteErrorContent({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex max-w-xl flex-col gap-6">
      <h1 className="font-heading text-display tracking-display">
        This page failed to load.
      </h1>
      <p className="text-lg leading-relaxed">
        Something went wrong while rendering this page. You can try again.
      </p>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex min-h-11 items-center rounded-md bg-primary px-4 text-sm text-primary-foreground"
        >
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex min-h-11 items-center rounded-md bg-card px-4 text-sm no-underline"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
