---
title: How do you handle caching?
order: 6
label: How do you handle caching?
---

## Question

How do you handle caching?

## Answer

when make a request to the database, or external service, or any other resource, I consider how expensive it is to retrieve, how frequently it is accessed and how fresh it needs to be.

### Action

- use redis for the query results which are rarely changed and frequently accessed.
- invalidate the cache when the data is updated.
- use short expired cache for the data that is frequently changed.

### Result

For example, I used redis cache for CRM platform to show the campaign code list to the users, because the campaign code list is rarely changed and frequently accessed. and only invalidate the cache when the campaign code is updated daily.
