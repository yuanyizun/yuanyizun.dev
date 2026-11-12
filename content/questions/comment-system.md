---
title: Tell me about a (Laravel) project you built - (Comment System)
order: 3
label: Comment system
---

## Question

Tell me about a (Laravel) project you built - (Comment System)

## Answer

### What

One of the projects I built was a standalone comment system.

### Situation

we had comments on our media websites, but they were highly coupled to the websites and the comments system failed after website upgrades, and took team too much time to fix them.

### Plan

so we decided to build a standalone comment system that could be easily maintained and scaled. and I managed the project from scratch to production.

### Action (in order to do that)

- I met with the editorial team to discuss the requirements and design the system.
- used blade, tailwind, and alpine.js for the view layer.
- and installed fortify for backend authentication, sanctum for REST API authentication.
- Eloquent ORM and MySQL for the database layer.
- Redis for caching, horizon for background jobs.
- PEST for unit testing
- Coded with Cursor and made accceptance tests on staging environment.
- Deployed the system to our production environment through github webhook and Jenkins.

### Result

The new comment system was rolled out to 12 websites and is stable and reliable, and we also get more good comments because of the usability improvements.
