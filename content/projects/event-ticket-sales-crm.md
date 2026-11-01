---
title: Event Ticket Sales CRM
date: 2026-01-01
period: "2026"
kind: Applications
context: Momentum Media
role: Independent delivery
stack:
  - Laravel
  - Blade
  - Tailwind CSS
  - Alpine.js
  - MySQL
  - Redis
stages:
  - Sales workflow
  - Laravel CRM
  - Redis and Horizon
  - AWS deployment
summary: Lightweight Laravel CRM for event ticket sales, adopted for daily call management.
---

## Challenge

The sales team wanted faster daily workflows than Salesforce for event ticket sales.

## Approach

Built a lightweight CRM with Laravel, PHP, Blade, Tailwind CSS, Alpine.js, and MySQL. Implemented company SAML SSO, role-based access control, contacts, call lists, events, activity tracking, and follow-up emails, with Redis caching and Laravel Horizon for queued jobs.

Deployed to AWS EC2 through a GitHub-based CI/CD workflow, with Pest unit tests and staging end-to-end and user acceptance testing.

## Outcome

Released the first version in approximately two weeks. Adopted for daily use; sales staff reported faster, easier call management.
