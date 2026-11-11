import { codeToHtml } from "shiki";

const fencePattern = () => /^```([^\n`]*)\n([\s\S]*?)^```[ \t]*$/gm;

export function stampFences(markdown: string) {
  let index = 0;
  return markdown.replace(fencePattern(), () => {
    const token = `\n\nyzfence${index}yz\n\n`;
    index += 1;
    return token;
  });
}

export function fenceIndexFromToken(value: string) {
  const match = /^yzfence(\d+)yz$/.exec(value.trim());
  if (!match) return null;
  return Number(match[1]);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function renderFence(code: string, lang: string) {
  const language = lang || "text";
  try {
    return await codeToHtml(code, { lang: language, theme: "github-dark" });
  } catch {
    try {
      return await codeToHtml(code, { lang: "text", theme: "github-dark" });
    } catch {
      return `<pre class="shiki"><code>${escapeHtml(code)}</code></pre>`;
    }
  }
}

export async function highlightFences(markdown: string): Promise<string[]> {
  const blocks: string[] = [];
  for (const match of markdown.matchAll(fencePattern())) {
    const lang = match[1]?.trim().split(/\s+/)[0] ?? "";
    const code = match[2]?.replace(/\n$/, "") ?? "";
    blocks.push(await renderFence(code, lang));
  }
  return blocks;
}
