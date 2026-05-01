---
title: "Alpha Incentive System"
client: "Sanofi"
date: "September 2014"
category: "corporate"
type: "Financial Automation · Incentive Engine"
description: "For Sanofi. Reduced monthly incentive processing from days - hours. Automated hundreds of incentive variations."
stack: ["C#", "ASP.NET Web Forms", "SQL Server", "Stored Procedures"]
icon: "💰"
thumbClass: "thumb-green"
---

### 1. Project Identity
The **Alpha Incentive System (AIS)** is a specialized financial orchestration platform built for Sanofi to manage and calculate sales incentives. In the pharmaceutical industry, incentive structures are notoriously complex, involving multi-layered targets across different product lines (Pharma, Pasteur) and personnel levels (Medical Representatives to Area Managers). AIS serves as the central engine that ingests raw sales data and transforms it into actionable commission reports, ensuring financial accuracy and transparency.

### 2. Architectural Challenges
- **High-Volume Data Ingestion**: The system required the capability to ingest and validate massive Excel-based datasets (Sales and Budget) containing thousands of records. Processing these uploads without UI timeouts necessitated careful database connection management and optimized batch processing.
- **Multi-Dimensional Business Rules**: Calculating incentives wasn't a simple percentage. It involved complex schemas: Monthly vs. Quarterly vs. Yearly payouts, Qualitative vs. Quantitative metrics, and varying weights (Bobot) across different sales lines.
- **Logic Monolithism**: The core business logic resided in a massive, centralized `DbControlInsentif` class and numerous Stored Procedures. While performant, this created a high degree of coupling and made the system difficult to unit test.
- **Data Integrity & Rollbacks**: Given the financial nature of the data, the system needed robust rollback mechanisms. If an Excel upload failed halfway, the state had to be reverted precisely to prevent duplicate or missing transactions.

### 3. Decision Logic (Trade-off Analysis)
- **Framework: ASP.NET Web Forms (C#)**
    - *Analysis*: The primary users were internal finance and sales operations teams who needed a functional, data-grid-heavy interface.
    - *Decision*: Chose **ASP.NET Web Forms** for rapid development of administrative dashboards and its mature ecosystem of server-side data controls.
    - *Trade-off*: Accepted the stateful nature of ViewState in exchange for faster implementation of complex UI interactions like multi-step calculation wizards.
- **Pattern: Database-Centric Processing (Stored Procedures)**
    - *Analysis*: Performance was critical when processing thousands of rows for complex aggregations.
    - *Decision*: Offloaded heavy calculation logic to **SQL Server Stored Procedures** (`proc_ExcelSalesToInstfSalesSummary`, etc.).
    - *Trade-off*: While this improved execution speed by minimizing data transfer between the application and database, it made the logic harder to version-control and maintain compared to code-based domain logic.
- **Custom Data Access Layer**:
    - *Analysis*: Standardizing database interactions across the application was necessary to manage long-running queries.
    - *Decision*: Implemented a custom DAL with adjustable `CommandTimeout` (setting `TimeOutDB = 0` for heavy processes).
    - *Trade-off*: Manual mapping of DataSets required more boilerplate code but allowed for the extreme fine-tuning needed for large-scale data migrations.

### 4. Business Impact
- **Elimination of Human Error**: Automated the calculation of hundreds of incentive variations that were previously managed via fragile, manual spreadsheets.
- **Operational Speed**: Reduced the monthly incentive processing cycle from several days to a few hours, allowing the finance team to finalize payouts much faster.
- **Auditability**: Provided a clear historical record of targets, sales performance, and calculation schemas, which is essential for corporate compliance and dispute resolution with the sales force.