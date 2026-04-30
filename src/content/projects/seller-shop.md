---
title: "MS Glow Seller Shop"
client: "MS Glow (J99 Corp)"
date: "January 2022"
category: "consulting"
type: "Polyglot Microservices · E-commerce · Cloud Native"
description: "A high-performance seller management ecosystem built with Go and .NET Core, orchestrating complex order flows, automated payments, and multi-warehouse logistics."
stack: ["Go", ".NET Core", "GKE", "MongoDB", "PostgreSQL", "Xendit", "GitLab CI"]
icon: "🛍️"
thumbClass: "thumb-msglow"
---

### 1. Project Identity
**MS Glow Seller Shop** was architected as a distributed backend ecosystem designed to manage large-scale seller operations for one of Indonesia’s largest skincare brands (J99 Corp). The system functions as a central orchestration hub that integrates inventory management (StockOpname), bulk order processing, automated payments through the Xendit gateway, and real-time logistics synchronization within a highly scalable microservices architecture.

### 2. Architectural Challenges
*   **Polyglot Microservices Integration**: Balancing the use of .NET Core for complex domain logic (Inventory & Core Domain) with Go for high-performance transactional services (Payment & Shipping) within a single Kubernetes cluster.
*   **High-Concurrency & Peak Loads**: The system had to handle extreme traffic surges during flash sales or national marketing campaigns, where thousands of transactions occurred simultaneously.
*   **Distributed Configuration Security**: Managing secrets and database credentials in a cloud-native environment without exposing sensitive data in plain-text configuration files.
*   **Data Consistency in Heterogeneous Persistence**: Maintaining synchronization between PostgreSQL for ACID-compliant transactional data and MongoDB for flexible application metadata and logging.

### 3. Decision Logic (Trade-off Analysis)
*   **Language Selection: Go for Transactional Path**
    *   *Analysis*: The Payment and Shipping services required high throughput with minimal latency.
    *   *Decision*: Leveraged **Go**. 
    *   *Trade-off*: Go offers superior memory efficiency and a lightweight concurrency model (Goroutines), although it requires more explicit error handling compared to C#.
*   **Language Selection: .NET Core for Core Application**
    *   *Analysis*: StockOpname and Domain Master Data logic involved highly complex business rules and required a modular code structure.
    *   *Decision*: Leveraged **ASP.NET Core**.
    *   *Trade-off*: Resulted in a slightly larger memory footprint compared to Go, but accelerated development through a mature dependency injection ecosystem and enterprise-grade libraries.
*   **Deployment: GKE with Kaniko Build**
    *   *Analysis*: Reliable orchestration and a secure CI/CD pipeline were non-negotiable.
    *   *Decision*: Deployed on **Google Kubernetes Engine (GKE)** using **Kaniko** for in-cluster image builds without requiring Docker socket access.
    *   *Trade-off*: Increased the complexity of YAML configurations and pipelines, but guaranteed security isolation and seamless horizontal scalability.
*   **Security: Layered Decryption Strategy**
    *   *Analysis*: Storing database credentials in environment variables posed a high risk if a container were compromised.
    *   *Decision*: Implemented a **Custom Cryptography Layer** at the application level. Credentials are programmatically decrypted at runtime before database connections are established.
    *   *Trade-off*: Added slight overhead during application startup but provided significant protection against configuration leaks.

### 4. Business Impact
*   **Extreme Scalability**: The GKE-based infrastructure allowed the system to auto-scale specific services (such as Payment) within seconds during transaction peaks, ensuring zero transaction failures due to overload.
*   **Operational Automation**: Full automation of the order lifecycle—from payment verification to courier requests—reduced manual intervention by the seller team by 60%, significantly accelerating fulfillment times.
*   **System Reliability**: The microservices architecture ensured that failures in third-party integrations (e.g., courier APIs) did not cause overall system failure (Fault-Domain Isolation).