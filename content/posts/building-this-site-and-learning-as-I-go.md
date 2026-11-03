---
title: Building this site, and learning as I go
date: 2026-11-02
summary: Why I built my own portfolio while applying for jobs, and how it became a practical project with Next.js, React, TypeScript, Supabase, and Vercel.
---

Applying for developer jobs has a way of making you look closely at your own skills. You read a job description, recognise some of the stack, and realise there are other tools you want more hands-on experience with.

That was part of the reason I built this site. I wanted somewhere to share my work, but I also wanted a real project to practise Next.js, React, TypeScript, Supabase, and Vercel. Something I could keep improving, deploy, break, fix, and talk about in an interview.

A portfolio felt like a useful place to start. It has a clear purpose, real content, and enough room to explore beyond a static page.

## Starting with something small

The first version began with a Next.js scaffold and a fairly simple idea: introduce myself, show selected projects, and leave space for a blog.

I kept the articles and project descriptions in Markdown files. Each file has a small block of metadata for its title, date, and summary. The site reads those files to build the listings and individual pages.

That decision kept writing straightforward. I can add a post without building an editor or managing a content database. Supabase has a separate job in the site; the blog itself still comes from Markdown.

Once the basic pages worked, I started changing the presentation. The design went through several iterations, from a straightforward personal page towards a technical blog with a bit more personality. Typography, spacing, project cards, and navigation all needed attention. Having the pages in place made it easier to judge those choices against actual content.

## The stack, and what I used it for

**Next.js and React** provide the application structure and interface. The App Router organises the pages, while React components let me reuse things like the header, article layout, project cards, and forms. Working on the site also gave me practice deciding which parts belong on the server and which need browser interaction.

**TypeScript** runs throughout the application. Component props, project filters, content models, and authentication state all gave me opportunities to work with types in a connected application. The useful part was seeing how a change in one place affects the code that depends on it.

**Tailwind CSS and shadcn/ui, with Radix UI primitives,** support the styling and interface components. I used them for shared elements such as buttons, cards, and authentication forms, then adapted the presentation to the site's own visual style.

**Supabase** handles authentication and stores user profiles and roles. The site includes email and password registration, Google sign-in, username setup, and logout. Adding those flows made this a much more useful learning exercise than a portfolio made only of public pages.

**Vercel** is the deployment platform. Taking the project there meant working through production environment variables, authentication redirect URLs, and domain configuration alongside the application code.

There are a few smaller pieces too. **gray-matter** reads the Markdown metadata, and **react-markdown** with **remark-gfm** renders the articles. **Three.js, React Three Fiber, and Drei** power the interactive technology map on the homepage.

## Adding features that gave me something to learn

The homepage tech map was one of the more playful additions. It evolved from a globe into a network of labelled technologies that visitors can rotate and select.

The interesting work came after the first visual version: giving it a loading state, keeping the controls inactive until the scene was ready, respecting reduced-motion preferences, and providing a static alternative when WebGL is unavailable. It was a useful reminder that an interactive feature needs more than a good screenshot.

The selected-work timeline brought a different kind of practice. I added filters for project type and starting year, with the selection reflected in the URL. That meant thinking about how the controls, query parameters, and filtered results fit together.

Authentication introduced more moving parts again. A successful sign-in needs to connect to a profile, resolve the username, update the header, and leave the visitor in a sensible place. I also added a sign-in gate to the contact page as a small way to exercise that authenticated state.

## The fixes were part of the process

Some of the most useful work was fixing things that initially looked finished.

Loading content could make the layout jump. The header needed a stable placeholder while account details resolved. Google sign-in needed the right navigation behaviour, and missing user profiles needed a recovery path. Session handling also exposed differences between what could happen during rendering and what needed to happen for an incoming request.

Those issues pushed me to understand the framework more carefully. They also led to refactoring: separating page composition, reusable components, data access, and application logic so that each change was easier to follow.

I kept feature notes and records of fixes as I went. They help me trace why a decision was made and give me material for posts like this one.

## Why keep working on a personal site?

The job search gave this project its initial push. I wanted practical experience with a stack I could discuss confidently, backed by something I had actually built.

Now the site gives that practice somewhere to continue. There will always be another article to write, a project to explain more clearly, or a rough edge to improve. I can try an idea, see how it behaves in the application, and keep what works.

This is the first post replacing the original placeholder. It feels like a fitting subject: the site itself, what went into it, and what I am learning by building it.
