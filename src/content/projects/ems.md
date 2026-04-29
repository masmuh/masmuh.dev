---
title: "EMS Enterprise Suite"
client: "Sampoerna"
date: "April 2021"
category: "corporate"
type: "Business Ops · ERP-Lite"
description: "Full-scale ERP-lite system managing business logic, procurement, and project tracking for enterprise-level operations."
stack: [".NET Core 3.1", "Dapper", "SQL Server", "Clean Architecture"]
icon: "🏢"
thumbClass: "thumb-msglow"
---

---

## 1. Project Identity
**Excise Management System (EMS)** is a mission-critical middleware solution designed to bridge the gap between global ERP systems (SAP) and local regulatory compliance for the tobacco industry. Its primary role is to digitize and automate the high-stakes lifecycle of excise tax documents—including CK5, PBCK, and LACK—ensuring that multi-billion dollar tax obligations are accurately calculated, approved, and reported to the Indonesian Directorate General of Customs and Excise (DJBC).


## 2. Architectural Challenges
- **Complex State Orchestration**: The system manages hundreds of thousands of documents, each requiring a non-linear approval path involving multiple stakeholders (User, POA, Controller, Government Officials). Implementing a robust, auditable state machine that supports temporal delegation was a primary challenge.
- **Heterogeneous Data Synchronization**: Integrating with SAP ERP via staging tables and asynchronous XML file exchange required a resilient integration layer capable of handling data drift and processing failures without impacting the primary UI.
- **Strict Regulatory Compliance**: The platform must guarantee absolute data integrity. Any discrepancy in excise calculations or unauthorized document printing carries significant legal and financial risk.
- **Legacy System Modernization (during development)**: The project involved migrating from manual, spreadsheet-based workflows to a structured enterprise solution while maintaining high availability for business operations.


## 3. Decision Logic (Trade-off Analysis)

### Layered Monolith vs. Microservices
**Decision**: Layered Monolith (`BLL`, `DAL`, `Website`, `Scheduler`).
**Rationale**: Given the tight coupling of regulatory entities (a change in CK5 often affects PBCK calculations), a modular monolith was chosen to minimize distributed transaction complexity. It allowed for rapid development and easier deployment within the client's internal infrastructure at the time.

### Quartz.NET Background Processing
**Decision**: Decoupling integration logic into a Windows Service.
**Rationale**: Processing large XML batches from SAP is resource-intensive. By moving this to `Sampoerna.EMS.Scheduler`, we ensured the `Sampoerna.EMS.Website` remained responsive for end-users, achieving a clear separation of concerns between OLTP and ETL tasks.

### Dependency Injection (SimpleInjector)
**Decision**: Implementing DI across all layers.
**Rationale**: To manage the complexity of over 100+ BLL modules, DI was implemented to promote loose coupling and testability. SimpleInjector was selected for its performance and strict validation rules, which catch configuration errors at startup.

---

## 4. Business Impact
- **90% Reduction in Manual Form Generation**: Automated the generation of complex PDF/Excel forms (CK/PBCK), eliminating human error in tax document preparation.
- **Enhanced Audit Compliance**: Reduced the time for internal and external audits from weeks to days by providing a centralized `WORKFLOW_HISTORY` and `CHANGES_HISTORY`.
- **Real-time Quota Visibility**: Enabled the business to monitor excise balances and quotas in real-time, preventing production delays caused by exhausted excise permits.
- **Infrastructure Stability**: The decoupled integration architecture allowed EMS to continue functioning even during SAP maintenance windows.

---
