---
title: "e-Promat: Enterprise Material Logistics"
client: "Sanofi"
date: "October 2014"
category: "corporate"
type: "Supply Chain · Inventory Management · Workflow Engine"
description: "For Sanofi. ~40% reduction in approval turnaround time. Closed-loop audit trail for promotional materials."
stack: ["VB.NET", "ASP.NET Web Forms", "SQL Server", "SSRS", "JavaScript"]
icon: "📦"
thumbClass: "thumb-blue"
---

### 1. Project Identity

**e-Promat** is a specialized Enterprise Resource Planning (ERP) extension built for Sanofi to manage the lifecycle of Promotional Materials (Promat). In the pharmaceutical industry, promotional materials (brochures, samples, medical kits) are subject to strict regulatory and budgetary controls. The system centralizes the procurement (PO), distribution, regional branch inventory, and the certified destruction of expired materials, ensuring a closed-loop audit trail for every item.

### 2. Architectural Challenges

- **Distributed Inventory Reconciliation**: Synchronizing inventory levels between the central warehouse (Jakarta) and numerous regional branches. The system had to handle complex scenarios like "Goods in Transit" and "Branch Returns" without real-time distributed locking.
- **Dynamic Approval Orchestration**: Implementing a complex, multi-layered approval matrix (Creator → PM → MM → MedM) that varied based on the Cost Center and material type. The workflow engine needed to be flexible enough to handle delegations and multi-step escalations.
- **Legacy State Management**: Built on ASP.NET Web Forms, the application faced challenges in maintaining complex UI states (e.g., multi-step PO creation) across postbacks. This required a strategy using temporary SQL-based staging tables to prevent data loss during long-running sessions.
- **Atomic Inventory Updates**: Every approval or destruction action required atomic updates to `AvailableQty` and `BookedQty` across multiple tables. Preventing race conditions and ensuring consistency in a high-concurrency environment was a critical concern.

### 3. Decision Logic

- **Framework: ASP.NET Web Forms (VB.NET)**
    - *Analysis*: The corporate environment was heavily standardized on the Microsoft stack, and rapid development of data-entry-heavy forms was the priority.
    - *Decision*: Leveraged **Web Forms** server-side controls for fast integration with Windows Authentication (Active Directory) and SQL Server.
    - *Trade-off*: Accepted the high abstraction of ViewState and server-side lifecycle complexity in exchange for seamless enterprise integration and rapid UI prototyping.
- **Pattern: Staging Table Orchestration**
    - *Analysis*: Complex requests (e.g., Destruction Requests) involved many items and multiple potential approvers before finalization.
    - *Decision*: Implemented a "Temporary-to-Permanent" persistence pattern using `Temp_Promat` and `Temp_Approval` tables.
    - *Trade-off*: Increased database storage overhead but ensured that the "Draft" state was persistent, auditable, and not tied to volatile session memory.
- **Reporting: SQL Server Reporting Services (SSRS)**
    - *Analysis*: Business users required high-fidelity, printable vouchers and inventory reports.
    - *Decision*: Decoupled the reporting logic from the application using **SSRS** via URL access.
    - *Trade-off*: While this introduced a dependency on a separate reporting server, it allowed for much easier layout modifications without redeploying the main application.

### 4. Business Impact

- **Regulatory Compliance**: Provided a "Certified Destruction" workflow, ensuring that expired promotional materials were accounted for and destroyed according to pharmaceutical industry standards.
- **Reduced Inventory Leakage**: The automated "Available vs. Booked" logic prevented over-requesting and ensured that branch inventory was transparent to the central office.
- **Process Standardization**: Replaced fragmented email/paper-based workflows with a single source of truth, reducing the approval turnaround time by approximately 40%.
- **Financial Transparency**: Linked every material request to a specific Cost Center, providing the finance team with accurate data for departmental budget allocation.
