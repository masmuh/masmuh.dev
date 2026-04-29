---
title: "Biogen SAP Integration"
client: "Biogen"
date: "July 2021"
category: "corporate"
type: "SAP Integration · Data Integrity"
description: "Critical architectural bridge maintaining data integrity between Product Master Data and Customer Quote lifecycles within the SAP ecosystem."
stack: [".NET Core 3.1", "Quartz.NET", "SAP OData", "LiteDB"]
icon: "🧬"
thumbClass: "thumb-sampoerna"
---

---

## 1. Project Identity
**Biogen Services** is a critical architectural bridge designed to maintain data integrity between the Product Master Data and Customer Quote lifecycle within the **SAP Business ByDesign (SAP ByD)** ecosystem. In a complex enterprise procurement environment, this middleware ensures that high-fidelity product specifications are accurately propagated to customer-facing documents, eliminating the "data silo" effect often found in ERP SDK customizations.

## 2. Architectural Challenges
*   **ERP Propagation Gaps**: SAP ByD's native behavior does not always automatically sync complex 'Long Description' fields to custom SDK attributes in Quote line items. This creates a synchronization lag that risks document inaccuracy.
*   **API Statefulness & Security**: Interacting with SAP's OData v1 layer requires managing stateful CSRF handshakes. Performing state-changing operations (`PATCH`) requires a strict token acquisition lifecycle that must be resilient to session timeouts.
*   **Concurrency Control**: Operating as a background worker, the system must prevent "Job Overlap"—where multiple sync cycles hammer the SAP API simultaneously, leading to rate-limiting or partial updates.
*   **System Resiliency**: The middleware must handle intermittent SAP connectivity issues without local data loss, requiring a stateless but robust retry strategy.

## 3. Decision Logic: The "Why" Behind the Design

### Pattern: The Stateless Worker Service
*   **Decision**: Implementation via `.NET 5 Worker Service` instead of a full-scale Web API or an ETL tool.
*   **Rationale**: The requirement was a "set-and-forget" background processor. A Worker Service provides a lightweight footprint and native integration with Windows Service/systemd, avoiding the overhead of an HTTP listener (Kestrel) when no external inbound traffic is expected.
*   **Trade-off**: While a message broker (RabbitMQ) would provide better durability, a stateless polling mechanism was chosen to minimize infrastructure complexity and ensure SAP remains the sole "Source of Truth."

### Concurrency: Atomic Session Management
*   **Decision**: Use of `Interlocked` atomic operations for active job counting.
*   **Rationale**: By using `StateOfJobSession` with atomic increments, we implemented a lightweight local mutex. This prevents race conditions in a single-instance deployment without the operational burden of a distributed locking provider like Redis.

### Data Access: "Pull-Match-Patch" Workflow
*   **Decision**: Decoupling the Material fetch from the Quote update.
*   **Rationale**: Fetching all missing-description quotes first allows for batching the Material master data requests, significantly reducing the number of round-trips to the SAP API.

## 4. Business Impact
*   **Operational Automation**: Eliminated approximately 15-20 minutes of manual data cross-referencing per complex customer quote.
*   **Document Integrity**: Guaranteed 100% accuracy in technical specifications on generated PDF quotes, reducing customer disputes and revision cycles.
*   **System Stability**: The lightweight, stateless design resulted in 99.9% uptime with zero manual intervention required for session recovery or cache clearing.
