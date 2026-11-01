---
title: Standalone Laravel Comment System
date: 2026-02-01
period: "2026"
kind: Applications
context: Momentum Media
role: Independent delivery
stack:
  - Laravel
  - JavaScript
  - REST
  - SAML
stages:
  - Brand websites
  - Embedded JavaScript
  - REST API
  - Laravel moderation
summary: One Laravel comment system rolled out across all 12 websites, replacing CMS-coupled extensions.
---

## Challenge

Replaced third-party, CMS-coupled comment extensions so the same functionality did not have to be changed separately on every platform.

## Approach

Independently built a standalone Laravel comment system. Built an embedded frontend component in plain JavaScript and integrated websites through REST APIs, using a public API key for frontend requests and access tokens for backend requests. Implemented SAML SSO with company email and role-based access for editorial moderators to approve, reject, and manage comments. Readers authenticated on the content platform, which passed their name and email to create commenter records when needed.

Built comment posting, replies, voting, spam filtering, and new-comment notifications.

## Outcome

Rolled out across all 12 websites. Editorial staff reported easier moderation, alongside an observed increase in quality comments and user engagement.
