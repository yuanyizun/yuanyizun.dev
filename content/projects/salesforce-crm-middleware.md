---
title: Salesforce CRM Integration Middleware
date: 2025-06-01
period: circa 2025
kind: Integrations
context: Momentum Media
role: Independent delivery
stack:
  - Laravel
  - PHP
  - OAuth
  - JWT
stages:
  - CMS and event platforms
  - OAuth and JWT
  - Queued writes
  - Salesforce CRM
summary: Laravel middleware connecting Salesforce CRM with CMS, marketing, and event platforms.
---

## Challenge

Salesforce CRM had to exchange data with several CMS, marketing, and event platforms without scattering credentials and retries across those systems.

## Approach

Independently built and maintained Laravel and PHP middleware to exchange data between Salesforce CRM and WordPress, Joomla, Drupal, Mautic, EventsAir, and Awards Force.

Centralised private-key management for OAuth 2.0 and JWT authentication and implemented data validation, transformation, rate limiting, and caching. Queued write requests with retries on failure, logged successful requests and errors, and sent critical error and exception alerts to Google Chat.

## Outcome

Writes, credentials, and failure alerts sat in one middleware instead of in each connected platform.
