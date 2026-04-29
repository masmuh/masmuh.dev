---
title: "ISMS NextGen"
client: "Kano Solution"
date: "January 2026"
category: "corporate"
type: "Logistics Core · Distributed"
description: "Next-generation core engine for the ISMS logistics suite, architected for high scalability and complex distributed job processing."
stack: [".NET Core 3.1", "SQL Server", "Clean Architecture"]
icon: "🚀"
thumbClass: "thumb-shell"
---

---

## 1. Project Identity
**System Role**: The iSMS AYO NextGen middleware serves as the critical data bridge within a multi-national FMCG (Fast-Moving Consumer Goods) ecosystem. It orchestrates the transformation and synchronization of legacy field sales data (iSMS) into a modern cloud-native distribution platform (AYO NextGen). 

As a Senior Architect, the objective was to build a resilient, high-throughput pipeline capable of processing massive fixed-width datasets into structured CSV formats, ensuring 100% data fidelity across distributed nodes while maintaining strict security compliance.

## 2. Architectural Challenges
*   **Legacy Interoperability**: Integrating with legacy SQL-based export utilities (`QTAv2.exe`) and batch scripts while transitioning to a managed C# distributed service.
*   **Data Volume & Format Complexity**: Handling enterprise-scale fixed-width datasets with complex, varying schemas. The system required a dynamic schema mapper to transform raw byte-ranges into business-readable CSVs.
*   **Distributed Resource Management**: Running multiple instances of the service across various server nodes without causing CPU exhaustion or database deadlocks.
*   **Security Compliance**: Protecting PMI-standard S3 access tokens and sensitive zip passwords in a local filesystem environment.

## 3. Decision Logic
*   **Decoupled Broker (AWS S3)**: Chosen as the primary integration pattern. By using S3 as a landing zone rather than direct peer-to-peer transfers, the system achieved high availability and decoupled the legacy sources from the modern destination.
*   **Adaptive Concurrency Control**: Implemented `SemaphoreSlim` combined with real-time CPU performance monitoring. This allowed the system to maximize throughput during low-load periods while automatically scaling back (or killing) processes during resource contention to ensure host stability.
*   **Metadata-Driven Transformation**: Instead of hard-coding transformation logic, I implemented a `FileSchema` mapping table in SQL Server. This allowed business analysts to update data formats without requiring code deployment, significantly reducing maintenance overhead.
*   **Layered Security (AES-256 + HMAC-SHA256)**: Selected for protecting sensitive configuration files. AES-256 provided strong encryption for data-at-rest, while HMAC-SHA256 ensured integrity during token verification.

## 4. Business Impact
*   **Operational Stability**: The implementation of automated "Auto-Kill" and resource-aware processing reduced manual server interventions by 90%.
*   **Processing Efficiency**: Multi-threaded transformation logic reduced the data sync window from hours to minutes, enabling near real-time visibility into sales activities.
*   **Scalability**: The distributed nature of the service allowed for horizontal scaling; adding new territories or markets simply required deploying a new node with a specific `JobName` configuration.
*   **Improved Auditability**: Comprehensive logging in `CoreJobLog` and `MasterFilesHistory` provided a full audit trail for every single file from extraction to cloud upload.
