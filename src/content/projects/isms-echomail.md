---
title: "ISMS Echomail"
client: "Sampoerna"
date: "August 2025"
category: "corporate"
type: "Background Service · Notification Engine"
description: "High-performance background service for processing duplicate invoice legal numbers and handling multi-catalog system notifications using concurrent data aggregation."
stack: [".NET 9", "SQL Server", "SMTP", "EPPlus", "NLog"]
icon: "✉️"
thumbClass: "thumb-foculing"
---

---

## 1. Project Identity
iSMS EchoMail is a mission-critical enterprise utility designed to provide real-time data monitoring and automated notifications across a highly fragmented SQL Server ecosystem. Serving as the "nervous system" for the iSMS platform, it aggregates business-critical anomalies—such as duplicate legal numbers and operational bottlenecks—from hundreds of regional database catalogs and routes them to stakeholders via an intelligent notification layer.


## 2. Architectural Challenges

### The "Multi-Catalog" Bottleneck
The primary challenge was the distributed nature of the data. With business logic spread across hundreds of independent database catalogs, a sequential processing approach would have resulted in unacceptably high latency (hours vs. minutes).

### Data Velocity vs. Payload Constraints
Automated notifications often fluctuate between small alerts (few rows) and massive data dumps (thousands of rows). Implementing a "one-size-fits-all" email body approach would lead to truncated messages or mail server rejections.

### Reliability in Distributed Environments
Querying geographically or logically separated databases introduces high risks of "zombie" connections and intermittent timeouts that can stall a traditional sequential worker.


## 3. Decision Logic (Trade-off Analysis)

### Concurrent Data Aggregator (System.Threading.Channels)
*   **The Choice**: Implemented a Producer-Consumer pattern using `.NET Channels`.
*   **The Rationale**: Unlike `Task.WhenAll` which can overwhelm resources if not carefully throttled, `Channels` provide a robust mechanism for back-pressure and controlled concurrency (MaxDOP: 10). 
*   **Trade-off**: Slightly higher initial implementation complexity compared to standard LINQ-to-SQL, but yields significantly better memory management and throughput stability.

### Dynamic Schema Mapping (DataTable)
*   **The Choice**: Utilizing `DataTable` and `SchemaHelper` instead of fixed POCO entities.
*   **The Rationale**: In an environment where the monitoring requirements evolve weekly, hardcoding entities is an anti-pattern. This approach allows the system to execute *any* SQL query and map the results dynamically.
*   **Trade-off**: Loss of compile-time type safety, which was mitigated through rigorous runtime metadata validation and the `SchemaHelper` abstraction.

### Hybrid Notification Strategy
*   **The Choice**: Automated switching between Inline HTML and Excel Attachments (via EPPlus).
*   **The Rationale**: This ensures a premium user experience. Stakeholders get immediate visibility for minor issues while receiving a structured, filterable Excel file for large-scale data reconciliations.

---

## 4. Business Impact

### Drastic Reduction in Audit Latency
Transitioning from manual or sequential auditing to high-concurrency parallel monitoring reduced the detection window for critical errors (like duplicate invoices) by over **85%**.

### Enterprise Scalability
The architecture is catalog-agnostic. Adding a new region or database requires zero code changes—only a new entry in a connection string file, allowing the system to scale horizontally with the business growth.

### Operational Stability
By implementing the `QueryWithRetry` logic, the system transformed from a "brittle" worker into a resilient engine that self-heals during transient network failures, reducing "false alarm" failures for the IT operations team.

---
