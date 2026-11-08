import "server-only";

import fs from "node:fs";
import path from "node:path";

const contextPath = path.join(
  process.cwd(),
  "content",
  "profile",
  "yizun-context.txt",
);

let facts: string | undefined;

export function getProfileFacts(): string {
  facts ??= fs.readFileSync(contextPath, "utf8");
  return facts;
}
