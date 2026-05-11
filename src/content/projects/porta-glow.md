---
title: "Porta-Glow: Unified Customer Engagement Portal"
client: "MS Glow (J99 Corp)"
date: "December 2022"
category: "consulting"
type: "Customer Portal · Identity Management · Distributed Systems"
description: "For MS Glow. Google OAuth boosted registration conversions. ~60% junk traffic reduction via intelligent rate limiting."
stack: [".NET 6", "MongoDB", "Google OAuth", "AspNetCoreRateLimit", "AutoMapper"]
icon: "✨"
thumbClass: "thumb-portaglow"
image: "/gallery/porta-glow.webp"
---

### 1. Project Identity

**Porta-Glow** is the primary digital gateway for the MS Glow customer ecosystem. Designed as a high-performance customer portal, its core mission is to bridge the gap between physical product consumers and digital brand engagement. The system manages the entire lifecycle of customer identity—from registration and authentication to secure profile management—acting as the secure entry point for all consumer-facing digital services within the MS Glow umbrella.

### 2. Architectural Challenges

*   **Massive-Scale Authentication Abuse**: Being a high-profile brand, the portal was a frequent target for credential stuffing and brute-force attacks. The challenge was implementing robust protection without degrading the user experience for legitimate customers.
*   **Schema-Fluid Customer Profiles**: Customer data requirements evolved rapidly (loyalty points, skincare preferences, clinic history). A traditional rigid schema threatened to slow down feature delivery and cause downtime during migrations.
*   **Third-Party Identity Integration**: Providing a seamless, one-click onboarding experience via **Google OAuth** while maintaining a consistent internal identity state across multiple sub-systems (Website vs. Backpanel).
*   **High-Velocity Data Ingestion**: Handling spikes in registration and profile updates during nationwide marketing campaigns without saturating database connections or increasing latency.

### 3. Decision Logic

*   **Security: Application-Level Request Throttling (AspNetCoreRateLimit)**
    *   *Analysis*: Infrastructure-level WAFs were often too blunt or expensive for early-stage fine-grained endpoint control.
    *   *Decision*: Integrated **AspNetCoreRateLimit** directly into the .NET pipeline with specific rules (e.g., 2 requests/10s for auth endpoints).
    *   *Trade-off*: Added slight CPU overhead to the application layer, but gained surgical precision in blocking bot patterns while allowing high-frequency legitimate API usage elsewhere.
*   **Database: Document-Store (MongoDB) for Identity Persistence**
    *   *Analysis*: Customer attributes were highly variable and nested (social profiles, addresses, device IDs).
    *   *Decision*: Selected **MongoDB** as the primary store for customer and application configurations.
    *   *Trade-off*: Lost native relational JOINs, which was mitigated by using **AutoMapper** and a modular DTO approach to assemble necessary views at the application layer.
*   **Pattern: Domain-Driven Modular Monolith**
    *   *Analysis*: Full microservices would have introduced unnecessary network latency and deployment complexity for a single portal team.
    *   *Decision*: Architected as a **Modular Monolith** with a clear separation between `core_domain` (entities), `core_application` (services), and specialized `endpoints` (Backpanel/Website).
    *   *Trade-off*: Deployment is still atomic, but the codebase is \"microservice-ready,\" allowing individual modules to be extracted into independent services if traffic scales beyond the monolith's capacity.
*   **Auth Strategy: Hybrid Identity Orchestration**
    *   *Analysis*: Needed to support both traditional email/password and modern social logins.
    *   *Decision*: Implemented a custom **ASP.NET Identity** provider backed by MongoDB, augmented with Google OAuth middleware and cookie-based persistence for the frontend.

### 4. Business Impact

*   **Frictionless Onboarding**: The integration of Google OAuth resulted in a significant uptick in registration conversion rates, lowering the barrier to entry for the digital loyalty program.
*   **Infrastructure Resilience**: The implementation of intelligent rate limiting reduced \"junk\" traffic by ~60%, ensuring that legitimate users experienced stable performance even during viral marketing events.
*   **Developer Velocity**: The Clean Architecture and modular design allowed the team to add new profile attributes and authentication methods without impacting the core stability of the system.
