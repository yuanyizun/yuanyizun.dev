"use client";

import { useEffect } from "react";
import Link from "next/link";

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
    <main
      id="main-content"
      style={{
        margin: 0,
        minHeight: "100dvh",
        padding: "1.5rem",
        background: "#f7f5f0",
        color: "#242823",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <p style={{ margin: "0 0 1rem" }}>Something went wrong.</p>
      <button
        type="button"
        onClick={retry}
        style={{
          minHeight: "44px",
          marginRight: "0.75rem",
          padding: "0.5rem 0.875rem",
          border: "1px solid #d8dcd0",
          borderRadius: "0.5rem",
          background: "#fff",
          color: "inherit",
          font: "inherit",
        }}
      >
        Try again
      </button>
      <Link
        href="/interview/app"
        style={{
          display: "inline-flex",
          alignItems: "center",
          minHeight: "44px",
          color: "#bb4b2c",
        }}
      >
        Back to Interview app
      </Link>
    </main>
  );
}
