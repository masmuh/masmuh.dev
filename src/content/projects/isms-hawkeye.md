---
title: "ISMS Hawkeye"
client: "Sampoerna"
date: "January 2026"
category: "corporate"
type: "Observability · Monitoring"
description: "Centralized monitoring and observability platform tracking job health, API latency, and server metrics across the ISMS ecosystem."
stack: ["InfluxDB", "Grafana", "NLog", ".NET Worker"]
icon: "👁️"
thumbClass: "thumb-oats"
---

---

## 1. Project Identity: The Reporting Backbone
ISMS HawkEye serves as the **Central Data Dispatcher** for the ISMS enterprise ecosystem. Its primary role is to bridge the gap between distributed regional data silos and centralized analytical platforms. By automating the extraction, transformation, and secure transmission of critical business data from multiple SQL Server instances to AWS S3, HawkEye enables real-time business intelligence and ensures regulatory reporting compliance across diverse geographical areas.


## 2. Architectural Challenges
Building a reliable data pipeline in a fragmented enterprise environment presented several high-complexity challenges:

- **Distributed Data Fragmentation**: The system needed to extract data from multiple regional databases with varying latencies and connection reliabilities.
- **Resource Contention (Concurrency Management)**: Running high-volume extraction queries in parallel threatened to saturate source database connection pools. An uncontrolled burst could degrade performance for transactional users.
- **Secure Data Exfiltration**: As data moves from protected internal SQL environments to public cloud storage (S3), maintaining confidentiality was paramount. This required a robust, automated encryption mechanism that didn't rely on static passwords.
- **Stateful Delta-Sync**: Managing incremental data loads (CDC-lite) across hundreds of jobs required a reliable state-management system to prevent data gaps or duplicates during recovery from failures.


## 3. Decision Logic & Trade-off Analysis
The architecture of HawkEye was guided by the principle of **"Configurable Resilience"**:

- **Command-Line Interface (CLI) Pattern**: 
  - *Decision*: Implementation as a C# CLI tool instead of a persistent Windows Service.
  - *Rationale*: Allows for easier integration with existing enterprise job schedulers (Control-M, Windows Task Scheduler) and simplifies deployment. Each job runs in its own process space, preventing a single job failure from crashing the entire reporting service.
- **Parallelism with Semaphore Throttling**:
  - *Decision*: Utilizing `SemaphoreSlim` to limit concurrent database connections.
  - *Rationale*: This is a classic trade-off between **throughput and stability**. While full parallelism would be faster, the semaphore ensures the system remains a "good citizen" in the infrastructure, preventing SQL Server connection exhaustion.
- **Dynamic Password Generation (HMAC-SHA256)**:
  - *Decision*: Generating ZIP passwords on-the-fly based on a master key and execution timestamp.
  - *Rationale*: Avoids the security risk of hardcoded credentials. It provides a "zero-trust" approach to data transit, where even if an S3 bucket is misconfigured, the data remains encrypted with a non-static key.
- **Metadata-Driven ETL**:
  - *Decision*: Moving extraction logic (SQL) and connection details into external configuration files.
  - *Rationale*: Decouples code from business logic. Adding a new regional report or changing an extraction field requires zero code changes or redeployments.

---

## 4. Business Impact
The implementation of ISMS HawkEye transitioned the organization from manual, error-prone data collection to a professional-grade automated pipeline:

- **Operational Efficiency**: Reduced the manual effort for data aggregation by **100%**, freeing up technical staff for higher-value activities.
- **Data Freshness & Stability**: Enabled daily (or even hourly) reporting cycles with built-in retry logic, significantly improving the reliability of executive dashboards.
- **Seamless Scalability**: The system has successfully scaled from a handful of regional instances to dozens of concurrent data sources without requiring architectural changes.
- **Risk Mitigation**: The automated encryption and comprehensive audit logging (LoggerData) ensured that data governance standards were met for all cross-border data movements.

---
