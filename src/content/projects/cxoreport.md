---
title: "CXO Report: Enterprise KPI Orchestration"
client: "Kano Solution (Project Bagong)"
date: "February 2026"
category: "corporate"
type: "Data Engineering · Backend Architecture"
description: "For Bagong. Near-real-time C-level KPI dashboards. 5-min data refresh for critical metrics."
stack: ["Go 1.23", "MongoDB", "ETL", "Cron"]
icon: "📊"
thumbClass: "thumb-oats"
---

### 1. Project Identity

**CXO Staging** is the core *Data Intelligence* engine within the "Project Bagong" ecosystem. This system serves as an automation bridge that aggregates transaction data from various operational tenants (fragmented data) into a centralized *Staging Layer*. Its role is crucial: transforming millions of rows of raw data into KPI (Key Performance Indicators) metrics ready to be consumed by executives through a Scorecard Dashboard.

### 2. Architectural Challenges

*   **Multi-Tenant Data Ingestion**: The system must be able to crawl multiple tenant databases (`xibar-dev-tenant_*`) with dynamic schemas while maintaining the integrity of the final results.
*   **Complex Aggregation at Scale**: Calculating multi-dimensional KPIs (Profit Center, Cost Center, Site, Asset) from millions of rows of financial transactions without overloading operational databases.
*   **Data Consistency & Idempotency**: In a parallel background job system, the biggest challenge is preventing data duplication during retries or overlapping execution schedules.
*   **Dynamic Business Logic**: The business need to change aggregation formulas (Mappings) at any time without requiring application code re-deployment.

### 3. Decision Logic

*   **Go 1.23 & MongoDB Aggregation Engine**
    *   **Why**: Chosen to shift heavy computation load from the *Application Layer* to the *Database Layer*.
    *   **Trade-off**: Although Database CPU usage increased, we managed to cut *Network I/O* by up to 80% and minimize application memory usage because data just "flows" (streaming) without needing to be fully loaded into RAM.
*   **Deterministic ID (MD5 Composite Hashing)**
    *   **Why**: Each record in the staging results is given a unique ID based on a hash of the combination `MappingCode + TransDate + GroupingID`.
    *   **Trade-off**: Results in a slight *write-penalty* because each process becomes an *Upsert* operation. However, this guarantees 100% **idempotency**—data will never be duplicated even if the process is rerun multiple times for the same period.
*   **Two-Stage Transformation (Flattening)**
    *   **Why**: Separates *Raw Staging* (initial aggregation) from *InitialData* (ready-to-serve data for the Dashboard).
    *   **Trade-off**: Adds complexity to the ETL workflow, but provides very fast *Read Performance* on the UI side because the dashboard no longer needs to perform complex joins or calculations when accessed.

### 4. Business Impact

*   **Automated Executive Insights**: Cut report cycle time from manual weekly processes to near-real-time automation (every 5 minutes for critical data).
*   **Management by Exception**: The system automatically calculates *Ratios*, *Forecasts*, and *Balance Scores* that produce color indicators (Green/Yellow/Red), allowing management to focus only on departments whose performance is below target.
*   **Operational Stability**: Separation of the staging database ensures heavy report queries do not interfere with customer transaction performance in the main database.
