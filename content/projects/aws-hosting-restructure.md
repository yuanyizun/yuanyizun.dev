---
title: AWS Hosting Restructure
date: 2023-01-01
period: 2022–2026
kind: Infrastructure
context: Momentum Media
role: Independent delivery
stack:
  - AWS
  - Varnish
  - EC2
  - RDS
stages:
  - Four hosting groups
  - Varnish
  - EC2 web
  - RDS
summary: Restructured AWS hosting for about 150–200 applications into four groups with separate layers.
---

## Challenge

About 150–200 brand, event, and internal applications shared hosting in a way that made incidents harder to contain.

## Approach

Independently restructured AWS hosting into four groups with smaller instances and separate Varnish, EC2 web, and RDS layers.

## Outcome

Database incidents subsequently remained confined to the affected group, simplifying troubleshooting and improving site stability.
