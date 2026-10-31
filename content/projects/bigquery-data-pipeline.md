---
title: BigQuery Data Pipeline Platform
date: 2025-05-01
period: circa 2025
summary: Laravel platform that centralised BigQuery scripts and credentials across media sites and business systems.
---

Independently built a Laravel platform to centralise integration scripts and BigQuery credentials previously distributed across brand sites, Pipedream, and Zapier workflows.

Integrated data from approximately 12 media sites, Mautic, Awards Force, EventsAir, Passendo, LinkedIn, Facebook, Instagram, Kevel, and several ecommerce sites. Used scheduled background jobs and REST APIs for timestamp-based incremental fetching with an overlapping lookback window to reduce missed records, and source unique keys or composite keys to prevent duplicates.

Persisted fetched records on the server before BigQuery import and tracked each record’s sync status so retries selected only unsynced records. Logged fetch and import tasks and sent critical error and exception alerts to Google Chat. After launch, missing data was rare, backfilling was easier, and less manual maintenance was required.
