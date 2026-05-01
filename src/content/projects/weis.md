---
title: "WEIS Engineering System"
client: "Shell"
date: "September 2016"
category: "corporate"
type: "Oil & Gas · Engineering"
description: "For Shell. Reduced well planning cycle from days - hours. Centralized global engineering intelligence across operating units."
stack: ["MongoDB", "ASP.NET MVC", "Knockout.js", "SignalR"]
icon: "⛽"
thumbClass: "thumb-msglow"
---

---

## Portfolio: Senior Architectural Case Study

### 1. Project Identity

**WEIS (Well Engineering Information System)** is a mission-critical enterprise platform designed for **Shell’s Well Engineering division**. It serves as the primary backbone for managing the lifecycle of drilling and completion activities, business planning (Busplan), and performance improvement initiatives (PIP). The system acts as a strategic "Decision Support System" that bridges high-fidelity engineering data with financial forecasting, enabling global stakeholders to track operational efficiency and project benchmarks in real-time.

### 2. Architectural Challenges

*   **Highly Variable Data Domain**: Unlike standard CRUD applications, well engineering data is deeply nested and non-uniform. Each well has unique phases, maturity levels, and technical risk indices, making traditional relational schemas rigid and fragile.
*   **Legacy Data Harmonization**: The system required bi-directional synchronization with legacy Oracle-based enterprise systems and SAP ERP modules. Maintaining data integrity while mapping disparate data structures was a significant hurdle.
*   **Computational Intensity**: Generating complex engineering visualizations (e.g., Waterfall Charts, Probabilistic Time/Cost Estimations) requires processing massive datasets through multi-step algorithms (Learning Curve Factors, NPT, and TECOP performance modeling).
*   **Operational Continuity**: The platform needed to support long-running background tasks (Report generation, Batch uploads) without impacting the responsiveness of the real-time engineering dashboards.

### 3. Decision Logic

*   **Persistence: MongoDB (NoSQL) over SQL Server**
    *   *Analysis*: Well engineering phases are dynamic; new attributes (e.g., specific risk indicators or environment-specific data) are added frequently.
    *   *Decision*: Selected **MongoDB** to leverage its schema-less nature. This allowed for rapid iteration of the domain model without the overhead of complex SQL migrations. 
    *   *Trade-off*: Sacrificed strict relational constraints and multi-document ACID transactions (at the time) for high write throughput and maximum data structure flexibility.
*   **Frontend Architecture: ASP.NET MVC + Knockout.js**
    *   *Analysis*: The user base required a desktop-like experience for data-heavy grids and complex charts.
    *   *Decision*: Implemented a hybrid approach using **Knockout.js** for client-side MVVM bindings. This provided a responsive UI while maintaining the security benefits of server-side MVC.
    *   *Trade-off*: Increased client-side complexity compared to pure server-side rendering, but successfully met the high interactivity requirements of engineering leads.
*   **Communication: SignalR for Real-time Feedback**
    *   *Analysis*: Long-running calculations for "Business Plans" often exceeded standard HTTP timeout limits.
    *   *Decision*: Integrated **SignalR** to provide a persistent websocket connection, allowing the server to push calculation progress and results to the UI asynchronously.
    *   *Trade-off*: Required additional server resource management for persistent connections, but eliminated "page timeout" frustrations for global users.

### 4. Business Impact

*   **Reduced Planning Cycle**: Automated the generation of "Monthly Late Estimates" (MLE), reducing the time required for engineering leads to update project statuses from days to hours.
*   **Improved Forecast Accuracy**: The implementation of automated **Data Quality Checks (QC)** and cleansing algorithms significantly reduced manual entry errors, leading to more reliable financial forecasting.
*   **Centralized Engineering Intelligence**: Replaced thousands of disconnected spreadsheets with a single "Source of Truth," enabling global benchmarking across different operating units (OUs).
*   **Operational Scalability**: The system successfully scaled to manage hundreds of wells globally, supporting Shell’s expansion into more complex deep-water drilling environments.
