import { ImageResponse } from "next/og";
import { siteName } from "@/utils/site-url";

const fontUrl =
  "https://cdn.jsdelivr.net/fontsource/fonts/newsreader@5.2.8/latin-500-normal.ttf";

function shorten(value: string, max: number) {
  const trimmed = value.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max - 1).trimEnd()}…`;
}

function isFont(data: ArrayBuffer) {
  if (data.byteLength < 4) return false;
  const bytes = new Uint8Array(data.slice(0, 4));
  const tag = String.fromCharCode(bytes[0] ?? 0, bytes[1] ?? 0, bytes[2] ?? 0, bytes[3] ?? 0);
  return tag === "OTTO" || tag === "wOFF" || tag === "true" || bytes[0] === 0;
}

async function loadTitleFont(): Promise<ArrayBuffer | null> {
  try {
    const response = await fetch(fontUrl);
    if (!response.ok) return null;
    const data = await response.arrayBuffer();
    return isFont(data) ? data : null;
  } catch {
    return null;
  }
}

function card({
  title,
  summary,
  compact,
  font,
}: {
  title: string;
  summary: string;
  compact: boolean;
  font: ArrayBuffer | null;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: compact ? "center" : "space-between",
        backgroundColor: "#f7f5f0",
        color: "#242823",
        padding: compact ? "28px" : "72px",
        fontFamily: font ? "Newsreader" : "serif",
      }}
    >
      <div style={{ display: "flex", fontSize: compact ? "36px" : "28px" }}>{siteName}</div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            width: compact ? "48px" : "72px",
            height: "8px",
            backgroundColor: "#bb4b2c",
            marginTop: compact ? "16px" : "0px",
            marginBottom: compact ? "16px" : "28px",
          }}
        />
        <div
          style={{
            display: "flex",
            fontSize: compact ? "28px" : "64px",
            lineHeight: 1.05,
          }}
        >
          {compact ? title : title === siteName ? summary : title}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: "24px",
            fontSize: "28px",
            lineHeight: 1.35,
            color: "#646b60",
          }}
        >
          {compact || title === siteName ? "" : summary}
        </div>
      </div>
    </div>
  );
}

export async function shareImage({
  title,
  summary = "",
  width = 1200,
  height = 630,
}: {
  title: string;
  summary?: string;
  width?: number;
  height?: number;
}) {
  const font = await loadTitleFont();
  const compact = width <= 256;
  const copy = shorten(summary, compact ? 80 : 180);
  const element = card({ title, summary: copy, compact, font });
  const size = { width, height };
  if (!font) {
    return new ImageResponse(element, size);
  }
  return new ImageResponse(element, {
    ...size,
    fonts: [{ name: "Newsreader", data: font, style: "normal", weight: 500 }],
  });
}
