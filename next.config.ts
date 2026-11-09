import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    localPatterns: [
      { pathname: "/images/**", search: "" },
      // Static imports are served from this path. The portrait uses one.
      { pathname: "/_next/static/media/**", search: "" },
    ],
  },
  outputFileTracingExcludes: {
    "/*": ["./vibe-coder/**/*"],
  },
  outputFileTracingIncludes: {
    "/*": ["./content/**/*"],
  },
  turbopack: {
    root: projectRoot,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  webpack: (config) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ["**/node_modules/**", "**/vibe-coder/**"],
    };
    return config;
  },
};

export default nextConfig;
