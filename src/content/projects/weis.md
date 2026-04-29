---
title: "WEIS Engineering System"
client: "Shell"
date: "September 2016"
category: "corporate"
type: "Oil & Gas · Engineering"
description: "Specialized engineering platform for well construction planning and probabilistic risk assessment within the energy sector."
stack: ["MongoDB", "ASP.NET MVC", "Knockout.js", "SignalR"]
icon: "⛽"
thumbClass: "thumb-msglow"
---

---

## Portfolio: Senior Technical Architect

### 1. Project Identity
WEIS (Well Engineering Information System) is a mission-critical enterprise platform designed for **Shell’s Well Engineering division**. It serves as the primary backbone for managing the lifecycle of drilling and completion activities, business planning (Busplan), and performance improvement initiatives (PIP). The system acts as a strategic "Decision Support System" that bridges high-fidelity engineering data with financial forecasting, enabling global stakeholders to track operational efficiency and project benchmarks in real-time.


### 2. Architectural Challenges
*   **Highly Variable Data Domain**: Unlike standard CRUD applications, well engineering data is deeply nested and non-uniform. Each well has unique phases, maturity levels, and technical risk indices, making traditional relational schemas rigid and fragile.
*   **Legacy Data Harmonization**: The system required bi-directional synchronization with legacy Oracle-based enterprise systems and SAP ERP modules. Maintaining data integrity while mapping disparate data structures was a significant hurdle.
*   **Computational Intensity**: Generating complex engineering visualizations (e.g., Waterfall Charts, Probabilistic Time/Cost Estimations) requires processing massive datasets through multi-step algorithms (Learning Curve Factors, NPT, and TECOP performance modeling).
*   **Operational Continuity**: The platform needed to support long-running background tasks (Report generation, Batch uploads) without impacting the responsiveness of the real-time engineering dashboards.


### 3. Decision Logic (Trade-off Analysis)
*   **Persistence: Why MongoDB over SQL Server?**
    *   *Analysis*: Well engineering phases are dynamic; new attributes (e.g., specific risk indicators or environment-specific data) are added frequently.
    *   *Decision*: Chose **MongoDB** to leverage its schema-less nature. This allowed for rapid iteration of the domain model without the overhead of complex SQL migrations or polymorphic table structures. 
    *   *Trade-off*: Accepted the lack of multi-document ACID transactions (at the time) in favor of high write throughput and data structure flexibility.
*   **Frontend: ASP.NET MVC + Knockout.js**
    *   *Analysis*: The user base required a desktop-like experience for data-heavy grids and charts.
    *   *Decision*: Implemented a hybrid approach using **Knockout.js** for client-side MVVM bindings and **Kendo UI** for specialized widgets. This provided a responsive UI while maintaining the SEO and security benefits of server-side MVC.
*   **Communication: SignalR for Real-time Feedback**
    *   *Analysis*: Long-running calculations for "Business Plans" often exceeded HTTP timeout limits.
    *   *Decision*: Integrated **SignalR** to provide a persistent websocket connection, allowing the server to push progress updates and calculation results to the UI asynchronously.

---

### 4. Business Impact
*   **Reduced Planning Cycle**: Automated the generation of "Monthly Late Estimates" (MLE), reducing the time required for engineering leads to update project statuses from days to hours.
*   **Improved Forecast Accuracy**: The implementation of automated **Data Quality Checks (QC)** and cleansing algorithms significantly reduced manual entry errors, leading to more reliable financial forecasting.
*   **Centralized Engineering Intelligence**: Replaced thousands of disconnected spreadsheets with a single "Source of Truth," enabling global benchmarking across different operating units (OUs).
*   **Operational Scalability**: The system successfully scaled to manage hundreds of wells globally, supporting Shell’s expansion into more complex deep-water drilling environments.

---

#
