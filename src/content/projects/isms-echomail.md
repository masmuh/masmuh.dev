---
title: "ISMS Echomail"
client: "Sampoerna"
date: "August 2025"
category: "corporate"
type: "Background Service · Notification Engine"
description: "For Sampoerna. 85% reduction in audit latency. 60% fewer false-positive alerts. Catalog-agnostic architecture."
stack: [".NET 9", "SQL Server", "SMTP", "EPPlus", "NLog"]
icon: "✉️"
thumbClass: "thumb-foculing"
---

---

## Portfolio: Senior Architectural Case Study

### 1. Project Identity
**iSMS EchoMail** is a mission-critical enterprise utility designed to provide real-time data monitoring and automated notifications across a highly fragmented SQL Server ecosystem. Serving as the "nervous system" for the iSMS platform, it aggregates business-critical anomalies—such as duplicate legal numbers and operational bottlenecks—from hundreds of regional database catalogs and routes them to stakeholders via an intelligent notification layer.

### 2. Architectural Challenges
*   **The "Multi-Catalog" Bottleneck**: The primary challenge was the distributed nature of the data. With business logic spread across hundreds of independent database catalogs, a sequential processing approach would have resulted in unacceptably high latency (hours vs. minutes).
*   **Data Velocity vs. Payload Constraints**: Automated notifications often fluctuate between small alerts (few rows) and massive data dumps (thousands of rows). Implementing a "one-size-fits-all" email body approach would lead to truncated messages or mail server rejections.
*   **Reliability in Distributed Environments**: Querying geographically or logically separated databases introduces high risks of "zombie" connections and intermittent timeouts that can stall a traditional sequential worker.

### 3. Decision Logic (Trade-off Analysis)
*   **Concurrency Model: System.Threading.Channels (Producer-Consumer)**
    *   *Analysis*: Parallel processing was required to handle hundreds of databases, but naive `Task.WhenAll` could overwhelm the host resources and target databases.
    *   *Decision*: Implemented a **Producer-Consumer pattern** using `.NET Channels`.
    *   *Trade-off*: Slightly higher implementation complexity compared to standard LINQ, but provided robust back-pressure management and controlled concurrency (MaxDOP: 10).
*   **Data Mapping: Dynamic DataTable with SchemaHelper**
    *   *Analysis*: Monitoring requirements evolve weekly. Hardcoding POCO entities for every new report would create a maintenance nightmare.
    *   *Decision*: Utilized **DataTable** and a custom **SchemaHelper** for dynamic runtime mapping.
    *   *Trade-off*: Sacrificed compile-time type safety for extreme operational flexibility, allowing the system to execute any SQL query and format the results without code changes.
*   **Notification UX: Hybrid Output Strategy**
    *   *Analysis*: Stakeholders needed both "at-a-glance" visibility and detailed raw data for reconciliation.
    *   *Decision*: Integrated an **Automated Switching logic** between Inline HTML (for small datasets) and Excel Attachments via **EPPlus** (for large datasets).
    *   *Trade-off*: Increased the logic complexity in the notification layer, but significantly improved user engagement by preventing "email fatigue" from massive data dumps.

### 4. Business Impact
*   **85% Reduction in Audit Latency**: Transitioning from manual or sequential auditing to high-concurrency parallel monitoring reduced the detection window for critical invoice errors from days to minutes.
*   **Zero-Touch Enterprise Scalability**: The catalog-agnostic architecture allows the business to add new regions or databases via simple configuration changes, requiring zero downtime or code deployments.
*   **Operational Resilience**: The implementation of `QueryWithRetry` logic and robust connection handling transformed the service from a brittle worker into a self-healing engine, reducing false-positive alerts by 60%.

### 5. Senior Retrospective (Modernization Analysis)
*   **If Architected Today (2026)**:
    *   **Runtime**: Utilize **.NET 10** with **Native AOT** to minimize the memory footprint of the background worker, which is crucial when running as a sidecar or in resource-constrained environments.
    *   **Persistence & State**: Introduce **Redis** to track the state of processed anomalies and prevent duplicate notifications during worker restarts, replacing the current "stateless but idempotent" query logic.
    *   **Delivery Layer**: Move beyond SMTP. I would implement a **Plug-and-Play Notification Provider** to support **Microsoft Teams** and **Slack** webhooks, providing faster feedback loops for operational teams.
    *   **Observability**: Add a dedicated **Grafana Dashboard** powered by **Prometheus** metrics to visualize catalog health, processing latency, and throughput in real-time.
