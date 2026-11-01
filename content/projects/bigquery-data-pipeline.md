---
title: BigQuery Data Pipeline Platform
date: 2025-05-01
period: circa 2025
kind: Data
context: Momentum Media
role: Independent delivery
stack:
  - Laravel
  - REST
  - BigQuery
stages:
  - Source systems
  - Scheduled fetch
  - Persisted records
  - BigQuery
summary: Laravel platform that centralised BigQuery scripts and credentials across media sites and business systems.
---

## Challenge

Integration scripts and BigQuery credentials were distributed across brand sites, Pipedream, and Zapier workflows.

## Approach

Independently built a Laravel platform to centralise those scripts and credentials. Integrated data from approximately 12 media sites, Mautic, Awards Force, EventsAir, Passendo, LinkedIn, Facebook, Instagram, Kevel, and several ecommerce sites. Used scheduled background jobs and REST APIs for timestamp-based incremental fetching with an overlapping lookback window to reduce missed records, and source unique keys or composite keys to prevent duplicates.

Persisted fetched records on the server before BigQuery import and tracked each record’s sync status so retries selected only unsynced records. Logged fetch and import tasks and sent critical error and exception alerts to Google Chat.

## Outcome

After launch, missing data was rare, backfilling was easier, and less manual maintenance was required.
