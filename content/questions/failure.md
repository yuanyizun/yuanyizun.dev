---
title: How would you handle the failure?
order: 8
label: How would you handle failure?
---

## Question

How would you handle the failure?

## Answer

when something fails, I first keep the impact small, keep the data consistent, and make sure I can see what failed.

### Action

- log the exception with enough context, and return a safe response to the user. in production I don't expose the stack trace.
- wrap related database writes in a transaction, so a failure rolls back instead of saving half the data.
- put risky or slow work on Horizon. retry with backoff, and keep the failed job so I can see the exception and retry it after the fix.
- when calling Salesforce or BigQuery, set a timeout. if it fails, fail that job and retry it. don't block the user's request on that call.
- if Jenkins fails the build or the deploy, stop there and don't release it.

### Result

For example, the comment system sits behind the media websites. if the API or a background job fails, the website can still load, the error is logged, and I use the Laravel log and Horizon's failed jobs to find the cause and retry the job once it's fixed.
