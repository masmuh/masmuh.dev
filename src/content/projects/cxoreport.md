---
title: "CXOStaging Backend"
client: "Bagong"
date: "February 2026"
category: "corporate"
type: "Financial Reporting · ETL"
description: "High-performance data staging and ETL pipeline designed to ingest complex financial data for the CXO Software reporting suite."
stack: ["Go", "MongoDB", "NATS", "ETL"]
icon: "📉"
thumbClass: "thumb-oats"
---

---

## Portfolio: Senior Architectural Case Study

### 1. Project Identity
The **CXO Staging System** serves as the critical "Data Intelligence Layer" within the corporate executive ecosystem. Its primary role is to bridge the gap between high-volume operational transactional data (Financials, Operations, HR) and strategic decision-making tools (Executive Dashboards & Scorecards). By providing a high-performance, decoupled staging environment, the system transforms raw business events into aggregated, actionable KPIs without impacting the performance of core transactional systems.

### 2. Architectural Challenges
- **Dynamic ETL Complexity**: The business required the ability to define and modify complex KPI calculations (e.g., Financial Ratios, Departmental Efficiency) without software redeployment. This necessitated a metadata-driven ETL engine capable of interpreting dynamic mappings at runtime.
- **Data Integrity & Idempotency**: In a distributed environment where jobs may be retried or run concurrently, ensuring data consistency is paramount. Preventing duplicate records in the staging area while allowing for partial re-runs of historical data was a significant hurdle.
- **Performance at Scale**: Aggregating millions of records across heterogeneous collections requires significant compute power. The architecture needed to balance the load between the application logic and the database engine to maintain sub-second response times for dashboard queries.

### 3. Decision Logic (Trade-off Analysis)
*   **Engine Strategy: Go & MongoDB Aggregation**
    *   *Analysis*: Processing millions of records in-app (Go) would incur massive network I/O and memory overhead.
    *   *Decision*: Offloaded calculation logic to **MongoDB’s native Aggregation Framework**.
    *   *Trade-off*: Traded a slight increase in Database CPU usage for a massive reduction in network I/O and application memory footprint, resulting in significantly higher overall system throughput.
*   **Consistency: Deterministic Hashing for Idempotency**
    *   *Analysis*: Parallel workers often process overlapping data windows, risking duplicate entries.
    *   *Decision*: Implemented a **deterministic MD5-based `_id` generation strategy** (Hash of MappingCode + TransDate + GroupingID).
    *   *Trade-off*: Every record becomes an *upsert* rather than a simple insert. This adds a slight write-penalty but guarantees 100% data consistency without the need for expensive distributed locks.
*   **Orchestration: NATS-based Validation**
    *   *Analysis*: Coupling security logic with data processing logic makes maintenance difficult as corporate IDPs change.
    *   *Decision*: Decoupled AuthN/AuthZ using **NATS RPC**.
    *   *Trade-off*: Introduced a network hop for validation requests, but achieved a "security-agnostic" processing layer that can be easily migrated or integrated with different corporate providers.

### 4. Business Impact
- **Real-time Executive Insights**: Reduced "Data-to-Dashboard" latency from a 24-hour manual batch process to a near-real-time automated stream, enabling leadership to respond to anomalies within the same business day.
- **System Resilience**: By isolating heavy aggregation tasks in a dedicated Staging DB, core customer-facing transactional systems remained stable regardless of the reporting load.
- **Operational Scalability**: The decoupled architecture (API vs. Worker) allowed the organization to scale background processing independently during peak financial closing periods without affecting API responsiveness.

### 5. Senior Retrospective (Modernization Analysis)
*   **If Architected Today (2026)**:
    *   **Architecture**: I would implement a **Data Lakehouse** approach using **Apache Iceberg** or **Delta Lake**. This would provide better support for ACID transactions on large-scale data while maintaining the flexibility of a schema-less engine.
    *   **Data Streaming**: Replace polling-based ETL with **Change Data Capture (CDC)** using **Debezium**. This would allow for true real-time data ingestion directly from source database transaction logs.
    *   **Compute**: Migrate the Go workers to **Kubernetes with KEDA (Kubernetes Event-driven Autoscaling)**. This would allow the system to scale down to zero during idle periods and burst instantly when NATS message volume spikes.
    *   **Orchestration**: Utilize **Temporal.io** for the ETL workflow management to ensure reliable, long-running state machine execution with built-in retry and visibility features.
