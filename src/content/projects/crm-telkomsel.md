---
title: "CRM Telkomsel (Internal Portal)"
client: "Telkomsel"
date: "August 2013"
category: "corporate"
type: "Enterprise Portal · Employee Engagement · Survey System"
description: "For Telkomsel. Transformed paper-based surveys to real-time digital - 85% faster data aggregation. Centralized corporate announcements."
stack: ["ASP.NET 3.5", "C#", "SQL Server", "ADO.NET", "Windows Auth", "jQuery"]
icon: "📊"
thumbClass: "thumb-crm-tsel"
---

---
 

### 1. Project Identity

**CRM Telkomsel** (Employee Engagement Portal) was architected as the primary internal communication bridge between Telkomsel’s leadership and its thousands of employees. The system functioned as a dual-purpose platform: a **Corporate CMS** for disseminating high-priority "Highlights" and an **Enterprise Survey Engine** for collecting real-time employee feedback (Voice of Employee). Its role was critical in ensuring corporate alignment and data-driven HR decision-making.

### 2. Architectural Challenges

*   **Concurrency Risks in Legacy Data Access**: The system's survey module initially relied on non-atomic ID retrieval (`SELECT TOP 1`), which posed a significant risk of data collision during high-concurrency periods (e.g., nationwide mandatory surveys).
*   **Monolithic Tight Coupling**: Built on the ASP.NET 3.5 Web Forms paradigm, the application suffered from tight coupling between the UI logic (Code-Behind) and Data Access (ADO.NET), making automated testing and modular updates highly complex.
*   **Database Resource Management**: Inefficient connection handling—opening and closing SQL connections multiple times within a single transaction—created performance bottlenecks that threatened system stability during peak load.
*   **Intranet-Bound Authentication**: The reliance on Windows Authentication, while secure for internal use, limited the system's accessibility for mobile-first employees or remote fieldwork scenarios.

### 3. Decision Logic

*   **Framework: ASP.NET 3.5 (Web Forms)**
    *   *Analysis*: The project required rapid delivery within a strictly Windows-centric corporate environment.
    *   *Decision*: Selected **ASP.NET Web Forms**. It provided the fastest path to integration with Active Directory and corporate IIS servers.
    *   *Trade-off*: Accepted the overhead of ViewState and the lack of modern client-side routing in exchange for rapid deployment and familiar maintenance for the internal IT team.
*   **Data Access: ADO.NET with direct SQLClient**
    *   *Analysis*: Performance was paramount for the data-heavy "Highlights" feed.
    *   *Decision*: Used **direct SQL queries** via `SqlDataAdapter`. This bypassed the immaturity and overhead of early ORMs like Entity Framework 3.5.
    *   *Trade-off*: Increased the risk of SQL injection (mitigated via parameterized queries) and made the codebase more verbose, but ensured sub-second query performance.
*   **UI/UX: jQuery-based Rich Interactivity**
    *   *Analysis*: Leadership demanded a "premium" feel that didn't look like a standard legacy intranet.
    *   *Decision*: Integrated **PrettyPhoto** for media modals and customized **Metronic-style Admin Templates**.
    *   *Trade-off*: Increased the initial page load size due to multiple jQuery plugins, but successfully delivered the requested "WOW" factor to corporate stakeholders.

### 4. Business Impact

*   **Digitization of Employee Sentiment**: Transformed the slow, paper-based or spreadsheet-based survey methods into a real-time digital engine, reducing data aggregation time by 85%.
*   **Enhanced Corporate Alignment**: Centralized the "Highlight" feed ensured that mission-critical announcements reached every employee simultaneously, eliminating communication silos.
*   **Operational Transparency**: Provided HR and Leadership with an auditable trail of employee engagement, enabling more accurate annual reporting and organizational health checks.
*   **Resource Optimization**: Automated the survey distribution and results calculation, allowing the Corporate Communication team to focus on strategy rather than data entry.
