---
title: "EMS Enterprise Suite"
client: "Sampoerna"
date: "April 2021"
category: "corporate"
type: "Business Ops · ERP-Lite"
description: "For Sampoerna. 90% reduction in manual tax document generation. 24/7 document accessibility during SAP maintenance."
stack: [".NET Core 3.1", "Dapper", "SQL Server", "Clean Architecture"]
icon: "🏢"
thumbClass: "thumb-msglow"
---

---

## Portfolio: Senior Architectural Case Study

### 1. Project Identity
**Excise Management System (EMS)** is a mission-critical middleware solution designed to bridge the gap between global ERP systems (SAP) and local regulatory compliance for the tobacco industry. Its primary role is to digitize and automate the high-stakes lifecycle of excise tax documents—including CK5, PBCK, and LACK—ensuring that multi-billion dollar tax obligations are accurately calculated, approved, and reported to the Indonesian Directorate General of Customs and Excise (DJBC).

### 2. Architectural Challenges
- **Complex State Orchestration**: The system manages hundreds of thousands of documents, each requiring a non-linear approval path involving multiple stakeholders (User, POA, Controller, Government Officials). Implementing a robust, auditable state machine that supports temporal delegation was a primary challenge.
- **Heterogeneous Data Synchronization**: Integrating with SAP ERP via staging tables and asynchronous XML file exchange required a resilient integration layer capable of handling data drift and processing failures without impacting the primary UI.
- **Strict Regulatory Compliance**: The platform must guarantee absolute data integrity. Any discrepancy in excise calculations or unauthorized document printing carries significant legal and financial risk.
- **Legacy System Modernization**: Migrating from manual, spreadsheet-based workflows to a structured enterprise solution while maintaining high availability for continuous business operations.

### 3. Decision Logic (Trade-off Analysis)
*   **Architecture: Layered Monolith over Microservices**
    *   *Analysis*: Regulatory entities (CK5, PBCK) are tightly coupled; changes in one often trigger complex recalculations in others.
    *   *Decision*: Selected a **Layered Monolith** architecture (`BLL`, `DAL`, `Website`, `Scheduler`).
    *   *Trade-off*: Accepted slower independent scaling of components in exchange for simplified distributed transaction management and faster initial development speed.
*   **Background Processing: Quartz.NET Decoupling**
    *   *Analysis*: Large XML batch processing from SAP is resource-intensive and can degrade UI responsiveness.
    *   *Decision*: Decoupled integration logic into a standalone **Windows Service** powered by **Quartz.NET**.
    *   *Trade-off*: Increased deployment complexity (multiple services to manage) but guaranteed a responsive experience for end-users by isolating ETL tasks from OLTP tasks.
*   **IoC Container: SimpleInjector for Strict Validation**
    *   *Analysis*: Managing 100+ BLL modules requires robust Dependency Injection to maintain testability.
    *   *Decision*: Implemented **SimpleInjector** across all layers.
    *   *Trade-off*: SimpleInjector has stricter validation rules than the default .NET container, requiring more careful configuration, but it prevents "silent" injection failures at runtime.

### 4. Business Impact
- **90% Reduction in Manual Form Generation**: Automated the generation of complex PDF/Excel forms (CK/PBCK), eliminating human error in tax document preparation.
- **Enhanced Audit Compliance**: Reduced the time for internal and external audits from weeks to days by providing a centralized and immutable audit trail of all document lifecycle events.
- **Real-time Quota Visibility**: Enabled the business to monitor excise balances and quotas in real-time, preventing production delays caused by exhausted excise permits.
- **Infrastructure Stability**: The decoupled integration architecture allowed EMS to continue functioning even during SAP maintenance windows, ensuring 24/7 document accessibility.

### 5. Senior Retrospective (Modernization Analysis)
*   **If Architected Today (2026)**:
    *   **Framework**: Upgrade to **.NET 10** to leverage the latest performance optimizations and native AOT (Ahead-of-Time) compilation for the scheduler service.
    *   **Integration Strategy**: Replace file-based XML exchange with an **Event-Driven Architecture** using **RabbitMQ** or **Azure Service Bus**. This would provide better decoupling and real-time synchronization between SAP and EMS.
    *   **Architecture**: I would move towards a **Modular Monolith** with clearly defined "Bounded Contexts" to prepare for eventual microservices, specifically isolating the "Calculation Engine" from the "Workflow Engine."
    *   **Observability**: Integrate **OpenTelemetry** for distributed tracing across the scheduler and web layers, allowing for better pinpointing of performance bottlenecks in complex multi-step approvals.
