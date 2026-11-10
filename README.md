This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Content

Posts live in `content/posts/*.md`. Projects live in `content/projects/*.md`. The filename, without `.md`, is the URL slug.

Post frontmatter: `title`, `date`, `summary`. Set `draft: true` to hide a file.

Project frontmatter: `title`, `date`, `summary`, and an optional `url`. Set `draft: true` to hide a file.

Published files are listed with the newest `date` first.

## Deploy

Deploy this repository on Vercel with the repository root as the project directory and the Next.js framework preset. `vibe-coder/` is listed in `.vercelignore` and is not part of the site.

Production environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL` — `https://yuanyizun.dev`
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` — GA4 measurement ID, for example `G-B12B13EBWM`. Omit it to leave the Google tag unloaded.
- `GOOGLE_GENERATIVE_AI_API_KEY` — Google AI Studio key for the profile chat. Server-only. Omit it and the chat answers that it is unavailable.

The Supabase values are the project URL and the anon key. Session identity is the Supabase Auth cookies. Do not set the service role key on Vercel; the app does not use it.
