---
title: "Teman Telkomsel"
client: "Telkomsel"
date: "June 2014"
category: "corporate"
type: "SMS Gateway · Community Management · Enterprise Messaging"
description: "A high-volume Web-to-SMS gateway and community management platform designed for massive broadcast delivery and real-time engagement tracking."
stack: ["PHP", "CodeIgniter", "Oracle 11g", "OCI8", "AES-256", "Flexigrid"]
icon: "📱"
thumbClass: "thumb-teman-tsel"
---

---
 

### 1. Project Identity
**Teman Telkomsel** (Web-to-SMS Messenger) was engineered as a mission-critical communication hub for Telkomsel’s vast ecosystem of communities. The system's primary role was to bridge the gap between web-based administration and mobile-based engagement, allowing community managers to orchestrate large-scale SMS broadcasts, manage complex member hierarchies, and monitor delivery success in real-time. It served as a high-reliability gateway capable of handling millions of transactional messages.

### 2. Architectural Challenges
*   **High-Volume Transactional Integrity**: Managing bulk SMS broadcasts required a database architecture that could handle high-concurrency writes for delivery logs without degrading system performance or causing table locks.
*   **Complex Scheduling Logic**: The system needed to support multi-interval scheduling (Daily, Weekly, Monthly, and One-off) for different community segments, necessitating a robust background job engine that could handle overlapping delivery windows.
*   **PII Data Security**: Handling MSISDNs (Mobile Station International Subscriber Directory Numbers) required implementing rigorous encryption standards at the application layer to ensure compliance with enterprise security policies.
*   **Distributed Community RBAC**: Designing a granular Role-Based Access Control (RBAC) system where community leaders could manage their own "silos" of members and groups while adhering to global corporate messaging limits and policies.

### 3. Decision Logic (Trade-off Analysis)
*   **Database: Oracle 11g with OCI8 Driver**
    *   *Analysis*: The project demanded enterprise-grade reliability and ACID compliance for massive message logging.
    *   *Decision*: Selected **Oracle**. Its robust indexing and advanced connection pooling (via OCI8) provided the necessary stability for high-throughput messaging.
    *   *Trade-off*: Higher infrastructure cost and complexity compared to MySQL, but ensured 99.9% data integrity for audit trails.
*   **Security: Application-Layer AES-256 Encryption**
    *   *Analysis*: Sensitive subscriber data needed to be protected against unauthorized access, even at the database level.
    *   *Decision*: Implemented a custom **AES-256/CBC** encryption wrapper using the PHP mcrypt library for MSISDN storage.
    *   *Trade-off*: Introduced a slight computational overhead during data retrieval, which was mitigated by optimized caching of decrypted session data.
*   **Architecture: HMVC (Hierarchical Model-View-Controller)**
    *   *Analysis*: The system's features (Broadcast, Group Mgmt, API) needed to be modular for independent maintenance.
    *   *Decision*: Utilized **CodeIgniter with HMVC modules**. This allowed for a clean separation of concerns and facilitated rapid feature iteration.
    *   *Trade-off*: Slightly steeper learning curve for developers used to standard MVC, but significantly improved long-term maintainability.
*   **UI: Server-Side Flexigrid Integration**
    *   *Analysis*: Admin users needed to browse through hundreds of thousands of logs and members.
    *   *Decision*: Integrated **Flexigrid** with custom server-side pagination and filtering.
    *   *Trade-off*: Limited the UI to a more traditional "grid" feel, but provided unmatched performance for data-heavy administrative tasks.

### 4. Business Impact
*   **Broadcast Automation**: Reduced the time-to-market for community announcements from hours of manual processing to minutes of automated scheduling.
*   **Enhanced Engagement Metrics**: Provided leadership with actionable insights through real-time "Sent vs Delivered" dashboards, enabling data-driven communication strategies.
*   **Operational Security**: Centralized user management and identity-level encryption significantly reduced the risk of data leakage within the community management workflow.
*   **System Stability**: The move to a modular Oracle-backed architecture eliminated the frequent crashes and data corruption issues prevalent in the legacy ad-hoc messaging tools.

---