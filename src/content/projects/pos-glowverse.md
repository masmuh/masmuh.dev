---
title: "POS-Glowverse: Distributed Point-of-Sale Ecosystem"
client: "MS Glow (J99 Corp)"
date: "February 2024"
category: "consulting"
type: "POS System · Multi-tenant Inventory · Distributed Payments"
description: "For MS Glow. 1-2M daily transactions. ~80% reduction in manual stock checks. Zero failures at peak load."
stack: [".NET 6", "Golang", "MongoDB", "Xendit", "Docker", "Kubernetes"]
icon: "🛒"
thumbClass: "thumb-posglowverse"
---

### 1. Project Identity
**POS-Glowverse** is the mission-critical transactional engine powering the MS Glow retail ecosystem. It serves as a unified Point-of-Sale (POS) platform that enables sellers to manage offline transactions, inventory, and finances while maintaining deep integration with the central MS Glow digital infrastructure. The system acts as the bridge between physical storefronts and the broader digital supply chain, ensuring that every sale, discount, and stock movement is synchronized across the enterprise in real-time.

### 2. Architectural Challenges
*   **Cross-Database Inventory Synchronization**: A primary complexity was maintaining real-time stock consistency between the POS system and the central "Seller Shop" platform. A sale in a physical outlet must immediately reflect in the online inventory to prevent overselling, despite these systems residing in different databases and network segments.
*   **Complex Nested Discount Engine**: The system required a highly flexible promotion engine capable of handling overlapping logic: product-specific discounts, quantity-based (tiered) pricing, total-bill threshold discounts, and "mixed-bundle" promotions. Calculating these with high precision during a high-speed checkout was a significant logic challenge.
*   **Hybrid Language Orchestration**: To leverage the strengths of different ecosystems, the architecture integrates a **.NET 6** core (handling complex business logic and financial calculations) with a **Golang** service (optimized for high-concurrency payment gateway webhooks and external API integrations via Xendit).
*   **Multi-Tenant Transactional Integrity**: The system manages multiple sellers simultaneously, each with their own inventory rules, pricing tiers, and payment configurations, requiring a robust dynamic connection routing mechanism at the application layer.

### 3. Decision Logic (Trade-off Analysis)
*   **Architecture: Service-Oriented Hybrid (.NET & Go)**
    *   *Analysis*: .NET excels at complex domain modeling and enterprise logic, while Go is superior for lightweight, high-concurrency network tasks and external API handlers.
    *   *Decision*: Architected the core transactional and calculation logic in **.NET 6**, while offloading payment gateway integrations and webhook processing to a dedicated **Go** service.
    *   *Trade-off*: Increased deployment complexity by managing two runtimes, but achieved maximum reliability for financial logic and peak performance for external communications.
*   **Database: Multi-Context MongoDB Orchestration**
    *   *Analysis*: POS data (Products, Orders, Discounts) is semi-structured and frequently evolves. Furthermore, cross-platform sync required querying and updating distinct MongoDB clusters (POS vs. Shop).
    *   *Decision*: Utilized **MongoDB** with a custom repository pattern that supports dynamic context switching and "cross-context" writes to ensure inventory moves in lock-step with sales.
    *   *Trade-off*: Managing eventual consistency required careful transaction-like handling at the application layer, as cross-cluster MongoDB transactions were avoided for performance reasons.
*   **Inventory Strategy: Real-time Synchronous Reservation**
    *   *Analysis*: For a high-demand retail brand, asynchronous stock sync could lead to race conditions.
    *   *Decision*: Implemented a direct synchronous update to the Seller Shop database during the POS order calculation phase.
    *   *Trade-off*: Slightly higher latency during the checkout calculation, but guaranteed stock accuracy which is business-critical for high-velocity physical retail.

### 4. Business Impact
*   **Operational Efficiency**: Automated the entire sales-to-inventory pipeline, reducing manual stock checks by ~80% and eliminating human error in complex discount applications.
*   **Unified Financial Visibility**: Through automated background workers and reconciliation logic, the business gained real-time visibility into cash flow and receivables across all participating retail outlets.
*   **Scalability**: The modular architecture allowed for the rapid onboarding of new sellers and outlets, supporting the brand's aggressive physical expansion without requiring infrastructure overhauls.