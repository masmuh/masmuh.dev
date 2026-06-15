---
title: "Kano POS — Multi-tenant Point of Sale"
client: "Kano Solution"
date: "June 2025"
category: "corporate"
type: "POS · Backend · Multi-tenant"
description: "Full-featured multi-tenant Point of Sale system: PostgreSQL schema-per-tenant, modular monolith, auto-journal engine, dynamic approval workflows, PPN Coretax 2025 compliance, and 259 auto-documented API endpoints."
stack: ["Laravel 13", "PHP", "PostgreSQL", "Modular Monolith", "Event-driven Architecture", "Swagger/OpenAPI", "Bruno"]
icon: "🏪"
thumbClass: "thumb-shell"
image: ""
---

## 1. Project Identity

**Kano POS** is a full-featured, multi-tenant Point of Sale system designed to serve multiple companies from a single installation with strong data isolation. Built with Laravel 13 and PostgreSQL, the system employs a modular monolith architecture with event-driven cross-module communication.

As the sole architect, the objective was to build a production-grade financial system handling inventory, sales, purchases, accounting, and tax compliance — all within a scalable multi-tenant architecture.

## 2. Key Metrics

- **425 PHP files** across 11 modules
- **42 database migrations** — full PostgreSQL schema
- **44 REST API controllers** — 259 auto-documented endpoints
- **67 service classes** — business logic layer
- **50 unit tests** — covering critical paths
- **95 end-to-end test scenarios** via Hermes Agents automation

## 3. Architecture Decisions

- **PostgreSQL Schema-per-Tenant**: Strong data isolation for financial systems. Each tenant gets an isolated schema with shared `public` schema for platform-level data.
- **Modular Monolith**: 11 bounded contexts (Auth, Tenant, Master, Sales, Purchase, Inventory, Accounting, Approval, Report, Media, Shared) with event-driven cross-module communication.
- **Auto-journal Engine**: Every transaction automatically posts double-entry journal entries to the General Ledger — ensuring financial integrity.
- **Pessimistic Locking** (`SELECT ... FOR UPDATE`): Prevents stock race conditions in concurrent POS transactions.
- **AVCO (Weighted Average)**: Standard Indonesian cost method for inventory valuation.
- **PPN Coretax 2025 Compliance**: Proper handling of 12% rate with DPP Nilai Lain (11/12 factor).
- **Dynamic Approval Engine**: Configurable multi-level approval with sequential, parallel, and any-of modes.
- **Snapshot-based Stock Opname**: No operational freeze — reconcile via delta reconciliation.
- **Price Resolver**: Priority-based pricing: promo > customer group > location > qty tier > default.

## 4. Development Workflow

- Swagger/OpenAPI annotations in Laravel controllers
- Auto-generated Bruno + Postman API collections via custom PowerShell script
- Event-driven sync/async separation for data integrity within DB transactions
- Template schema for rapid tenant onboarding (< 5 seconds provisioning)
- Hermes Agents AI automation for 95 end-to-end test scenarios

## 5. Business Impact

- **Multi-tenant readiness**: Production-ready for deployment to dozens of tenants
- **Financial-grade accounting**: Double-entry auto-journal ensures audit compliance
- **PPN compliance**: Proper Indonesian tax handling reduces legal risk for tenants
- **Developer productivity**: Auto-generated API docs eliminate documentation overhead
