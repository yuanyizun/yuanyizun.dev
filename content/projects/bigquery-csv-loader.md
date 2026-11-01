---
title: Historical CSV Data Loading into BigQuery
date: 2019-05-01
kind: Data
context: Momentum Media
summary: Python pipeline that validated and streamed historical CSV records into BigQuery.
---

Built a Python pipeline using the built-in csv module and Google Cloud BigQuery SDK to validate historical company data across hundreds of CSV files, transform records to match the target BigQuery table schema, and stream records into the data warehouse in batches.

Skipped invalid records and logged them to a file for review; enabled interrupted uploads to resume from the point of failure. Made consistent historical data available to the data team for analysis and to downstream AI workflows for decision support.
