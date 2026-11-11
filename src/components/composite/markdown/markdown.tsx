import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { HeadingLink } from "./headings";
import { remarkHeadingIds } from "./headings";
import { fenceIndexFromToken, stampFences } from "./highlight";
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

export function Markdown({
  children,
  headings,
  highlighted,
}: {
  children: string;
  headings: HeadingLink[];
  highlighted: string[];
}) {
  return (
    <div className="articleProse">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkHeadingIds(headings)]}
        components={{
          h1: ({ children: nodes }) => <h2>{nodes}</h2>,
          p: ({ children: nodes }) => {
            const fenceIndex = fenceIndexFromToken(nodeText(nodes));
            const html = fenceIndex === null ? undefined : highlighted[fenceIndex];
            if (html) {
              return (
                <div
                  className="[&_code]:font-mono [&_pre]:m-0 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:bg-inverse! [&_pre]:p-4 [&_pre]:font-mono [&_pre]:text-sm [&_pre]:leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              );
            }
            return <p>{nodes}</p>;
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
        {stampFences(children)}
      </ReactMarkdown>
    </div>
  );
}
