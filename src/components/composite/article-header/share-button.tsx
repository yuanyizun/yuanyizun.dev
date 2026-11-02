"use client";

import { useState } from "react";

export function ShareButton({ title }: { title: string }) {
  const [notice, setNotice] = useState("");

  async function onShare() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setNotice("Link copied");
    } catch {
      setNotice("Could not share this page");
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onShare}
        className="inline-flex min-h-11 items-center rounded-md bg-card px-4 text-sm"
      >
        Share
      </button>
      {notice ? (
        <p className="text-sm text-muted-foreground" role="status">
          {notice}
        </p>
      ) : null}
    </div>
  );
}
