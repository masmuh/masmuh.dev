---
title: "CRA Lead Automation"
client: "Sampoerna"
date: "October 2020"
category: "corporate"
type: "Enterprise CRM · Lead Ops"
description: "For Sampoerna. Automated reconciliation from weeks - hours. Saved billions IDR in avoidable customs penalties."
stack: [".NET 5", "EF Core", "SQL Server", "SignalR"]
icon: "📈"
thumbClass: "thumb-jobhunter"
---

---

## Project Identity
The **CRA System** is a mission-critical enterprise middleware designed to bridge the gap between internal ERP (SAP) systems and external Customs (Customs EDI) / Logistics data. Its primary role is to ensure financial compliance and operational accuracy by automating the reconciliation of Export (PEB) and Import (PIB) declarations against internal financial and material movement records.


## Architectural Challenges
- **Multi-Source Data Synchronization**: Harmonizing disparate data formats from SAP proprietary tables (MB51, FBL1N), structured EDI files, and semi-structured Excel spreadsheets from freight forwarders.
- **Computational Reconciliation Complexity**: The system must perform multi-way matching (SAP vs. PEB vs. CK5 vs. Shipping Invoice) across millions of records while maintaining strict data integrity and audit trails.
- **Legacy System Interoperability**: Orchestrating processes within a .NET Framework environment to maintain compatibility with specific corporate infrastructure and legacy SAP connectors.
- **Predictive Risk Analysis**: Calculating "Potential Denda" (Customs Penalties) in real-time based on quantity and value variances before they are flagged by external authorities.


## Decision Logic (Trade-off Analysis)
- **Decoupled Batch Engine (Windows Service + Quartz.NET)**: 
    - *Decision*: Offloaded reconciliation logic from the web server to a dedicated background service.
    - *Rationale*: Reconciliation tasks are long-running and resource-intensive. Using a service-based approach prevents Web UI timeouts and ensures that scheduled syncs run reliably regardless of web traffic.
- **Entity Framework 6 Database-First Approach**:
    - *Decision*: Utilized EDMX templates for data modeling.
    - *Rationale*: Given the large, pre-existing database schema in a corporate environment, Database-First allowed for rapid modeling and strict adherence to established DBA standards while providing a strongly-typed POCO layer for the application.
- **Flat-Schema Persistence for Reconciliation Results**:
    - *Decision*: Persisting final reconciliation results in a denormalized "Wide-Table" format.
    - *Rationale*: While normalizing data is ideal for storage, reconciliation reporting (specifically for Power BI) requires high-speed read access across dozens of dimensions. The "Wide-Table" approach traded storage redundancy for massive gains in reporting performance.
- **Integrated Windows Authentication (SSO)**:
    - *Decision*: Leveraged NTLM/Kerberos via Active Directory.
    - *Rationale*: Minimized friction for corporate users and offloaded credential management to the IT infrastructure, reducing the attack surface for the application itself.

---

## Business Impact
- **Financial Risk Mitigation**: Identified and flagged variances early, potentially saving the company billions of IDR in avoidable customs penalties (Denda).
- **Operational Efficiency**: Automated a process that previously took teams of analysts weeks to perform manually via Excel, reducing the reconciliation cycle to a few hours.
- **Data-Driven Decision Making**: Provided management with a "Single Source of Truth" via Power BI dashboards, showing real-time compliance health across multiple legal entities.

---
