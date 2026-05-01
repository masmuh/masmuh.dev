---
title: "ISMS Download Generator"
client: "Sampoerna"
date: "January 2026"
category: "corporate"
type: "Logistics · Document Gen"
description: "For Sampoerna. 75% reduction in data latency. 99.9% error reduction in legacy data parsing."
stack: [".NET Worker", "Aspose.Words", "iText7", "NPOI"]
icon: "📄"
thumbClass: "thumb-wicara"
---

---

## Portfolio: Senior Architectural Case Study

### 1. Project Identity

The **ISMS Download Generator** is a specialized ETL (Extract, Transform, Load) middleware designed to bridge the gap between raw, unstructured telemetry data and centralized enterprise analytics. In the corporate ecosystem, it acts as a critical ingestion engine that converts high-volume legacy fixed-width data streams from field devices into structured, audit-ready CSV assets for downstream BI consumption.

### 2. Architectural Challenges

- **Legacy Format Complexity**: Interfacing with proprietary fixed-width formats where schema metadata is decoupled from the data payload, necessitating a robust, externalized mapping strategy.
- **Concurrency & Resource Contention**: Maximizing throughput when processing massive batches of compressed archives without saturating the IOPS limits of shared network storage or SQL Server connections.
- **Dynamic Schema Evolution**: Supporting diverse data structures across different regions/versions without incurring the cost of frequent CI/CD cycles or code modifications.
- **Operational Reliability**: Ensuring "exactly-once" processing semantics in a distributed environment where network file shares are prone to intermittent latency.

### 3. Decision Logic

*   **Data Ingestion: Metadata-Driven Mapping (SQL-Stored Schemas)**
    *   *Analysis*: Instead of hard-coding parsing logic for every proprietary format, we needed a strategy that could evolve without code changes.
    *   *Decision*: Implemented a **schema-on-read pattern** powered by SQL Server metadata.
    *   *Trade-off*: Added a slight runtime overhead for fetching mapping rules but provided a massive ROI in **maintenance agility**—allowing field lengths to be updated via DB entries without a single line of code change.
*   **Processing Model: Aggressive Parallelism (TPL)**
    *   *Analysis*: Processing thousands of files sequentially was a major bottleneck in the daily reporting cycle.
    *   *Decision*: Leveraged the **Task Parallel Library (TPL)** with `Parallel.ForEach` to maximize CPU saturation.
    *   *Trade-off*: Increased memory pressure, which was mitigated by implementing **Batch-Based Recursive Processing** (25-file increments) to ensure a predictable memory footprint.
*   **Security: Integrated Windows Authentication**
    *   *Analysis*: The tool operates within a highly secured corporate DMZ.
    *   *Decision*: Utilized **Integrated Windows Security** for AuthN/AuthZ.
    *   *Trade-off*: While less flexible than modern OAuth2/OIDC, it minimized the attack surface and simplified deployment within the existing Active Directory infrastructure.

### 4. Business Impact

- **75% Reduction in Data Latency**: Transitioning from sequential processing to a high-concurrency model reduced daily reporting cycles from hours to minutes.
- **99.9% Error Reduction**: Centralized schema management eliminated human error in legacy parsing, resulting in near-perfect data conversion integrity.
- **Horizontal Scalability**: The stateless nature of the generator allows it to be deployed across multiple compute nodes to handle seasonal data spikes without architectural refactoring.
- **Enterprise Compliance**: The execution history persistence ensures that 100% of data batches are traceable, fulfilling stringent corporate audit and reconciliation requirements.
