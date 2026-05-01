---
title: "ANR Enterprise Bridge"
client: "Bank Mandiri"
date: "August 2023"
category: "corporate"
type: "Financial Middleware · Bank Mandiri"
description: "For Bank Mandiri. ~90% manual ops reduction. 100% bank-compliant batch file generation. Full audit trail."
stack: [".NET 9", "LiteDB", "SAP OData", "Windows Service"]
icon: "🌉"
thumbClass: "thumb-shell"
---

---

## 1. Project Identity: The Financial Middleware Nexus
The **ANR (Advanced Network Routing/Reporting) System** serves as the critical middleware backbone connecting **SAP Business ByDesign** (Cloud ERP) with **Bank Mandiri’s** corporate banking infrastructure. It acts as an automated "Financial Bridge" that orchestrates the entire payment lifecycle—from extracting payment advice in SAP to generating bank-compliant batch files and reconciling transaction status via automated bank callbacks.

In the business ecosystem, ANR transforms a high-risk, manual banking operations workflow into a resilient, automated, and auditable pipeline.


## 2. Architectural Challenges: Bridging Worlds
*   **Protocol Heterogeneity:** Integrating modern, stateless REST/OData APIs (SAP) with legacy-style, stateful financial protocols (FTP/SFTP) and fixed-width file formats.
*   **State Integrity & Persistence:** Implementing a reliable "checkpoint" system to ensure no payment is double-processed or lost during network interruptions between the ERP and the Bank.
*   **Security Compliance:** Protecting sensitive financial credentials and PII (Personally Identifiable Information) in a distributed environment without the luxury of a full-scale Enterprise Vault in the initial phase.
*   **Service Reliability:** Designing a long-running background engine that maintains high availability as a Windows Service, handling complex scheduling and error recovery autonomously.

---

## 3. Decision Logic: Trade-off & Pattern Analysis
*   **Choice: LiteDB (Embedded NoSQL)**
    *   *Why:* I opted for LiteDB over SQL Server to minimize infrastructure footprint. Since the system acts as a bridge, it only needs to store "transient state" and audit logs. LiteDB provides the ACID compliance required for financial transactions without the maintenance overhead of a database server.
*   **Choice: .NET Worker Service (.NET 9.0)**
    *   *Why:* Leveraging the latest .NET long-term support features for high-performance job processing. The choice of a Worker Service allows for deep integration with Windows Service control managers while maintaining a modern, dependency-injection-heavy codebase.
*   **Choice: Shared Domain Library (`service.csproj`)**
    *   *Why:* To enforce DRY (Don't Repeat Yourself) principles. By centralizing OData clients, FTP handlers, and AES encryption logic into a shared core, we ensured consistent behavior between the automated Worker and the manual Approval Web UI.
*   **Choice: Custom AES-128 Credential Encryption**
    *   *Why:* While cloud-native vaults are preferred, for this specific on-premise deployment, a custom `CryptographyHelper` provided a "Good Enough" security layer to prevent clear-text credential leakage in configuration files.

---

## 4. Business Impact: Beyond Automation
*   **Operational Efficiency:** Reduced manual file handling time by **~90%**, allowing the finance team to focus on anomaly detection rather than data entry.
*   **Elimination of Human Error:** Automated fixed-width file generation ensures 100% compliance with bank specifications, drastically reducing rejected batch transfers.
*   **Audit-Ready Transparency:** Every API call, file transfer, and status change is captured in LiteDB and NLog, providing a comprehensive audit trail for financial compliance.
*   **Proactive Resilience:** Automated SMTP alerting ensures that connectivity issues are identified and resolved before they impact the daily payment window.

---
