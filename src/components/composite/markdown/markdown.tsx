import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { slugifyHeading } from "@/utils/markdown";
import "./markdown.module.css";

function nodeText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(nodeText).join("");
  }
  if (node && typeof node === "object" && "props" in node) {
    const props = node.props as { children?: ReactNode };
    return nodeText(props.children);
  }
  return "";
}

export function Markdown({ children }: { children: string }) {
  const seen = new Map<string, number>();

  return (
    <div className="articleProse">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children: nodes }) => <h2>{nodes}</h2>,
          h2: ({ children: nodes }) => {
            const title = nodeText(nodes);
            const base = slugifyHeading(title);
            const count = seen.get(base) ?? 0;
            seen.set(base, count + 1);
            const id = count === 0 ? base : `${base}-${count + 1}`;
            return <h2 id={id}>{nodes}</h2>;
          },
          a: ({ href, children: nodes }) => (
            <a href={href} className="underline underline-offset-4">
              {nodes}
            </a>
          ),
          pre: ({ children: nodes }) => (
            <pre className="overflow-x-auto rounded-xl bg-inverse p-4 text-sm text-inverse-foreground">
              {nodes}
            </pre>
          ),
          blockquote: ({ children: nodes }) => (
            <blockquote className="border-l-0 bg-card px-5 py-4 font-heading text-2xl leading-snug tracking-heading">
              {nodes}
            </blockquote>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
