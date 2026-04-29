---
title: "COMMET (Community Metadata System)"
client: "Telkomsel"
date: "July 2014"
category: "corporate"
type: "Enterprise Middleware · CUG Management · Real-time Provisioning"
description: "A high-performance telco middleware designed to orchestrate Closed User Group (CUG) services, subscriber whitelisting, and multi-partner registration workflows."
stack: ["Oracle PL/SQL", "Oracle Database", "SOAP/XML", "USSD/SMS Gateway", "Enterprise Service Bus"]
icon: "🌐"
thumbClass: "thumb-commet"
---

---
 
### 1. Project Identity
**COMMET (Community Metadata System)** was architected as a mission-critical middleware engine for Telkomsel's "Community" business unit. The system's primary role was to orchestrate the lifecycle of **Closed User Groups (CUG)**—specialized tariff plans for corporate and community segments. It functioned as the bridge between customer-facing channels (USSD, SMS, Web) and backend fulfillment/charging systems, managing complex whitelisting rules and multi-partner integrations (e.g., BTPN registration programs).

### 2. Architectural Challenges
*   **Massive Throughput & Low Latency**: In a telco environment, provisioning requests (like joining a CUG or activating a premium offer) must be processed in near real-time (sub-second) to maintain USSD session integrity and user experience.
*   **Distributed System Orchestration**: The system had to reliably coordinate transactions across disparate platforms, including the Enterprise Service Bus (ESB), external partner APIs (SOAP/XML), and internal fulfillment systems (FA).
*   **Data Locality & High Volume**: Managing millions of whitelisted MSISDNs and their associated CUG metadata required an architecture that could handle massive data lookups without becoming a bottleneck.
*   **Complex Business State Machine**: Handling varied registration states (Registered, Pending, Change Requested, etc.) across different card types (Prepaid vs. Postpaid) necessitated a robust and flexible logic engine.

### 3. Decision Logic (Trade-off Analysis)
*   **Logic Implementation: Oracle PL/SQL (Inside the Database)**
    *   *Analysis*: The system was data-heavy. Moving millions of records to an application layer for processing would incur significant network I/O.
    *   *Decision*: Implemented core business logic and orchestration directly within **PL/SQL Packages**. 
    *   *Trade-off*: While this increased the load on the database CPU and made the logic harder to unit test in isolation, it achieved maximum performance through **Data Locality** and minimized inter-tier latency.
*   **Integration Protocol: SOAP/XML with UTL_HTTP**
    *   *Analysis*: Most telco backend systems and ESBs at the time utilized WSDL-based SOAP services.
    *   *Decision*: Leveraged `UTL_HTTP` and `XMLTYPE` for hitting external APIs.
    *   *Trade-off*: SOAP/XML is more verbose than JSON, increasing payload size, but it provided the strictly typed contracts required for enterprise-grade stability and auditing.
*   **Resiliency: Transactional Logging & Async Error Handling**
    *   *Analysis*: Failed provisioning can lead to financial disputes or subscriber churn.
    *   *Decision*: Integrated a comprehensive logging layer (`LOG_SOAP_SPR`, `LOG_SMS_ERROR`) within the same transaction scope as the business logic.
    *   *Trade-off*: Slightly increased transaction time, but ensured 100% auditability and simplified troubleshooting for the ops team.

### 4. Business Impact
*   **Real-time Revenue Enablement**: Automated the activation of "Premium Offers," allowing Telkomsel to launch time-sensitive marketing campaigns with zero manual intervention.
*   **Operational Efficiency**: The whitelisting engine automated the onboarding of thousands of corporate employees daily, reducing the workload on the backend support teams by an estimated 70%.
*   **Strategic Partner Integration**: Successfully enabled co-branding programs (e.g., BTPN) by providing a secure, high-speed API bridge for third-party registrations.
*   **System Stability**: Leveraged Oracle RAC (Real Application Clusters) to ensure 99.9% availability for mission-critical CUG provisioning workflows.
