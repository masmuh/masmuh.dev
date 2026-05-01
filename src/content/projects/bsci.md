---
title: "DRMS - SAP Middleware"
client: "Boston Scientific"
date: "June 2021"
category: "corporate"
type: "Middleware · ERP Integration"
description: "For Boston Scientific. Cut order-to-ERP from 24 hrs - 5 min. Reconciliation errors -90%. SAP load -60%."
stack: [".NET 5", "MongoDB", "Redis", "WCF/SOAP", "SAP ByD"]
icon: "⚙️"
thumbClass: "thumb-telkomsel"
---

---

## Project Identity
The **Distribution Relationship Management System (DRMS)** is a high-availability enterprise middleware engineered to integrate field-mobility applications with **SAP Business ByDesign (ByD)**. It acts as the orchestration layer that abstracts the complexities of SAP’s SOAP and OData protocols, providing a streamlined RESTful interface for real-time sales operations and automated back-office data synchronization with B2B gateways.


## Architectural Challenges

### 1. Protocol Abstraction (SOAP to REST)
The mobile ecosystem required lightweight JSON/REST interfaces, while SAP ByDesign relies on heavy SOAP (WCF) and OData v1 protocols. DRMS bridges this gap by providing a modern API layer that handles complex XML serialization and session management internally.

### 2. Synchronization of High-Volume Datasets
Processing thousands of Account Receivables, Invoices, and Pricelist records across multiple entities required a non-blocking architecture. Performing these operations synchronously would timeout client requests and throttle SAP services.

### 3. Integration Resilience
Integrating with downstream B2B Gateways via secure CSV file transfers meant the system had to handle network instability and file system permissions without losing transactional state.


## Decision Logic (Trade-off Analysis)

### 1. Multi-Tiered Data Persistence
*   **Redis (Master Data Cache)**: Implemented distributed caching for SAP OData results (Product Categories, Customer Master).
    *   *Rationale*: Avoids repetitive, expensive calls to SAP for static data, reducing latency from seconds to milliseconds.
*   **MongoDB (Audit & Transaction Logs)**: Utilized as the primary store for integration audit trails.
    *   *Rationale*: The schema-less nature allows capturing raw, unpredictable SAP SOAP error payloads and full CSV metadata for forensic troubleshooting without complex SQL migrations.

### 2. Decoupled Processing via Worker Services
*   **Mechanism**: A dedicated .NET Worker Service (Scheduler) utilizing **Cronos** for precise job execution.
    *   *Rationale*: By moving heavy synchronization logic (e.g., Account Receivables sync) to background workers, the main API remains responsive for real-time field agent requests.

### 3. Certificate-Based Security
*   **Mechanism**: Implementation of `Microsoft.AspNetCore.Authentication.Certificate`.
    *   *Rationale*: Ensured secure, mutual TLS authentication for server-to-server communication between the middleware and corporate infrastructure, meeting strict medical-device industry compliance standards.

---

## Business Impact

*   **Automation of Financial Cycles**: Automated the daily synchronization of Account Receivables and Invoices, eliminating manual data entry and reducing reconciliation errors by 90%.
*   **Improved Order Velocity**: Enabled real-time Sales Order submission via mobile, reducing the order-to-ERP cycle time from 24 hours to under 5 minutes.
*   **Infrastructure Optimization**: Redis caching reduced the load on SAP ByDesign by 60%, preventing system-wide slowdowns during peak synchronization windows.
*   **Integration Visibility**: The MongoDB-based audit engine provided 100% visibility into B2B Gateway upload statuses, allowing IT teams to proactively resolve failures before they impacted logistics.

---
