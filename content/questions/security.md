---
title: How do you handle the security?
order: 7
label: How do you handle security?
---

## Question

How do you handle the security?

## Answer

when build the application, I always consider the confidentiality and integrity of the data.

### Action

- use Session & Cookie or Token-Based Authentication
- use policy/gate and limit API endpoints based on user roles and permissions.
- use encryption for sensitive data like passwords.
- use middleware to do origin check, csrf protection, rate limiting.

### Result

When I build the comment system, I used fortify for backend authentication, and sanctum for REST API authentication. and use middleware to origin check, csrf protection,rate limiting and Role based access control, use Eloquent ORM to protect the data integrity.
