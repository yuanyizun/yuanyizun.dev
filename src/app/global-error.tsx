"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
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
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          background: "#F7F5F0",
          color: "#242823",
          fontFamily: "Georgia, serif",
        }}
      >
        <main
          style={{
            maxWidth: "36rem",
            margin: "0 auto",
            padding: "4rem 1.5rem",
          }}
        >
          <p style={{ fontSize: "1.5rem" }}>Yizun Yuan</p>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 400, lineHeight: 1.05 }}>
            The site failed to load.
          </h1>
          <p>This fallback does not use the site shell.</p>
          <p style={{ display: "flex", gap: "1rem" }}>
            <button
              type="button"
              onClick={() => retry()}
              style={{
                minHeight: "2.75rem",
                padding: "0 1rem",
                background: "#BB4B2C",
                color: "#fff",
                border: 0,
                borderRadius: "8px",
              }}
            >
              Try again
            </button>
            <Link href="/" style={{ color: "#242823" }}>
              Home
            </Link>
          </p>
        </main>
      </body>
    </html>
  );
}
