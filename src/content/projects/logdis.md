---
title: "Logdis Middleware"
client: "Sampoerna"
date: "April 2023"
category: "corporate"
type: "Logistics · Distribution"
description: "For Sampoerna. 90% reduction in manual labor. Real-time distribution bottleneck monitoring."
stack: [".NET Core 3.1", "Dapper", "SQL Server", "Clean Architecture"]
icon: "🚚"
thumbClass: "thumb-telkomsel"
---

---

## 1. Project Identity

**LOGDIS (Logistics Distribution System)** serves as the critical "Connective Tissue" in the enterprise supply chain ecosystem. Its primary role is to orchestrate the flow of high-volume delivery data between internal ERP/Inventory systems (iSMS) and diverse external logistics providers (OMS, AYO). It transforms raw inventory movements into actionable distribution tasks, ensuring that physical goods movement is accurately reflected in digital records across the entire business network.


## 2. Architectural Challenges

*   **Data Orchestration & Consistency**: Synchronizing records across heterogeneous environments (on-premise SQL Server to Cloud APIs) while maintaining strict ACID compliance. A single missing delivery note can lead to significant financial discrepancies.
*   **Integration Complexity**: Interfacing with multiple downstream APIs, each with unique authentication methods (Bearer Tokens, Web Credentials) and varied data schemas (AYO vs. OMS).
*   **Throughput vs. UI Responsiveness**: Handling thousands of delivery notes per batch without degrading the performance of the administrative dashboard used by operations staff.
*   **Fault Tolerance**: Managing brittle network connections to external partners where submission failures must be handled gracefully through retries and state management (e.g., `NeedResubmit` and `IsImmutable` flags).


## 3. Decision Logic

The architecture follows a **Separation of Concerns (SoC)** pattern, specifically chosen to balance enterprise stability with operational flexibility:

*   **Decoupled Worker Service Pattern**: By offloading data fetching and submission to a dedicated background service (`LOCDIS.WorkerService`), we ensured that the administrative portal remains responsive. This prevents "Head-of-Line" blocking during long-running I/O operations.
*   **Custom Multi-Threaded Processing**: Instead of standard sequential processing, a proprietary `MultiThreadProcess` framework was implemented to parallelize data mapping and validation. This was a tactical decision to overcome the limitations of standard Entity Framework overhead in high-throughput scenarios.
*   **Relational State Machine**: The use of SQL Server was non-negotiable due to the need for complex joins and transactional integrity. The system uses a "Pull-Transform-Push" state machine where each `DeliveryNote` progresses through clear lifecycle states (`NEW`, `SUBMITTED`, `EXCLUDED`, `CANCELLED`).
*   **Enterprise Identity Integration**: Leveraging **Integrated Windows Authentication** allowed the system to plug into the existing Active Directory infrastructure, reducing overhead for security management while maintaining high auditability.

---

## 4. Business Impact

*   **90% Reduction in Manual Labor**: Automated the end-to-end synchronization process, eliminating the need for manual data entry between inventory and logistics systems.
*   **Enhanced Data Integrity**: The implementation of automated `MovementCode` generation and duplicate checking reduced shipment errors by an estimated 15%, directly impacting customer satisfaction.
*   **Operational Transparency**: Provided a real-time dashboard for "Batch Status" monitoring, allowing management to identify bottlenecks in the distribution pipeline immediately.
*   **Scalability for Growth**: The system architecture successfully supported the onboarding of additional distribution centers (Plants) without requiring significant code refactoring.

---
