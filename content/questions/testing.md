---
title: How do you test your applications?
order: 9
label: How do you test?
---

## Question

How do you test your applications?

## Answer

### Action

- I will implement the unit and integration tests for the new features. make sure the code is working as expected.
- Ask the Cursor to do a quick end to end test to see if the new feature works as expected.
- the github action will run the tests and deploy the code to the staging environment.
- the staging environment will be used for the acceptance tests by the team.

### Result

for example, I used Laravel Passport for the authentication and authorization, and Laravel Sanctum for the API authentication. and I used Laravel policy for the authorization.
