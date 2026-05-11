---
title: "e-Registration System"
client: "Sanofi"
date: "October 2014"
category: "corporate"
type: "Regulatory Compliance · Automation"
description: "For Sanofi. Eliminated manual spreadsheet tracking. Zero product registration expirations missed."
stack: ["VB.NET", "ASP.NET Web Forms", "SQL Server", "LDAP"]
icon: "📋"
thumbClass: "thumb-blue"
image: "/gallery/eregis.webp"
---

### 1. Project Identity

The **e-Registration System (e-Regis)** is a mission-critical compliance engine designed for Sanofi's regulatory affairs department. Its primary function is to manage the lifecycle of pharmaceutical product registrations (Pharma and Pasteur divisions). By centralizing product master data—including TradeMarks, Registration Numbers, and Expiration Dates—the system serves as the "Single Source of Truth" to prevent operational disruptions caused by expired legal permits.

### 2. Architectural Challenges

- **Time-Sensitive Automation**: The core requirement was a robust "Reminder Engine" capable of triggering notifications at precise intervals (12, 9, 6, 3, 1 month, and the expiration date). This required a reliable scheduling mechanism that wouldn't fail under varying server loads.
- **Enterprise Identity Integration**: Operating within a global pharmaceutical environment necessitated seamless integration with corporate identity providers. Managing user roles and permissions while synchronizing with **LDAP (Active Directory)** was essential for security and ease of use.
- **Data Categorization Complexity**: Products were split across different divisions (Pharma vs. Pasteur) with different reporting requirements and notification recipients, requiring a flexible data model and business logic layer.
- **Legacy Interoperability**: The system needed to interface with SAP-related data points (SAP codes, Material Master) to ensure consistency with the broader corporate ERP ecosystem.

### 3. Decision Logic

- **Framework: ASP.NET Web Forms (VB.NET)**
    - *Analysis*: The project required rapid development of a data-heavy CRUD interface for internal staff.
    - *Decision*: Leveraged **ASP.NET Web Forms** for its high-productivity server-side controls and state management (ViewState).
    - *Trade-off*: Accepted the "heavier" page payload of Web Forms in exchange for faster development cycles and a consistent UI for internal administrative tasks.
- **Data Access: ADO.NET with SQL Server**
    - *Analysis*: The application required high reliability and ACID compliance for sensitive legal data.
    - *Decision*: Implemented a dedicated **Data Access Layer (DAL.vb)** using standard SQL connections and readers.
    - *Trade-off*: Manual SQL management required more boilerplate code compared to emerging ORMs at the time, but provided absolute control over query performance and schema mapping.
- **Authentication: LDAP/Active Directory**
    - *Analysis*: Managing local credentials for hundreds of employees was inefficient and insecure.
    - *Decision*: Integrated **LDAPAuth.vb** for centralized SSO.
    - *Trade-off*: Introduced a dependency on the corporate network infrastructure, but significantly enhanced security and reduced administrative overhead for user management.

### 4. Business Impact

- **Regulatory Risk Mitigation**: Eliminated the high-risk "manual spreadsheet" approach, ensuring that no pharmaceutical product registration expired unnoticed, thereby avoiding potential legal penalties and product recalls.
- **Operational Efficiency**: Automated the reminder workflow, saving hundreds of manual hours previously spent on tracking expiration dates across different departments.
- **Process Transparency**: Provided leadership with a comprehensive "Registration History" and "Reminder Report," enabling better resource planning for upcoming renewals.
