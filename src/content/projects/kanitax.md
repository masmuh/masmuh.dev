---
title: "KaniTax Automation"
client: "Tri Hasta Perkasa"
date: "December 2022"
category: "corporate"
type: "Financial · Compliance"
description: "For Tri Hasta Perkasa. 90% reduction in manual tax entry. Real-time tax status visibility. Audit-ready logs."
stack: [".NET Core 3.1", "EF Core", "E-Faktur API", "SQL Server"]
icon: "📑"
thumbClass: "thumb-sampoerna"
---

---

## 1. Project Identity
**Kanitax** is an enterprise middleware system that serves as an automation bridge between **SAP Business ByDesign** ERP and the Indonesian taxation system (**E-Faktur**). Its primary role is to transform raw financial transaction data from SAP into valid tax invoice documents, ensuring regulatory compliance without redundant manual intervention.


## 2. Architectural Challenges
When designing Kanitax, three primary architectural challenges had to be addressed:
- **Data Synchronicity & Consistency**: Ensuring that data between SAP (Source of Truth) and Kanitax remains synchronized despite SAP OData API rate-limiting constraints and network latency.
- **Complex Document State Machine**: Managing the invoice lifecycle from *In Preparation* -> *Reserved* (serial number allocation) -> *Posted* (final validation) -> *Exported* (E-Faktur ready) with strict data integrity.
- **Scalability of Data Processing**: Handling high transaction volumes at the end of tax periods, which requires massive calculation and CSV export processes without degrading API responsiveness.


## 3. Decision Logic
Technology selection was based on a trade-off analysis to achieve a balance between development speed and system stability:
- **MongoDB vs. SQL Server**: MongoDB was chosen for its schema flexibility (Schema-on-Read). Invoice data from SAP often contains dynamic attributes (involved parties, custom items). MongoDB allows for the storage of complex JSON documents without rigid schema migrations and provides higher write throughput for batch synchronization operations.
- **.NET 6 Web API**: Selected for its mature integration ecosystem with OData and superior Kestrel performance. As an enterprise system, the reliability of type-safety at the Application Layer is crucial to avoid runtime errors in tax calculations.
- **JWT-Based Stateless Auth**: To ensure future horizontal scalability, the system uses stateless authentication. This minimizes server memory load compared to session-based authentication.

---

## 4. Business Impact
The implementation of Kanitax provided a direct impact on the company's operational efficiency:
- **90% Reduction in Manual Entry**: Automated synchronization from SAP eliminated the need for data re-entry into the E-Faktur application, minimizing human error.
- **Operational Stability**: The system is capable of handling thousands of invoice lines within minutes, providing real-time visibility into the company's taxation status.
- **Audit Ready**: By storing audit logs and execution history (`ExecuteHistory`), the company maintains a solid digital trail for both internal and external audit requirements.

---
