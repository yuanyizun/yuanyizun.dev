---
title: How would you investigate (a slow Laravel endpoint) issue?
order: 5
label: Slow Laravel endpoint
---

## Question

How would you investigate (a slow Laravel endpoint) issue?

## Answer

first, I would identify the issues, so I can understand if it's an application issue, database issue, infrastructure issue, or external service issue like cloudflare.

### Action

- checking the application logs (and use tools like debugbar to check the request and response time).
- check the slow queries and process list in the database.
- check infrastructure utilization like CPU, memory, and network usage.
- check the external service status page, see if it's having any issues.

### Result

For example, if it's a database issue such as N+1 queries, I would optimize the queries with eager loading ,pagination and short expired cache.
