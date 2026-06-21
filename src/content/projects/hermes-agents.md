---
title: "Hermes Agents — AI Test Automation"
client: "Kano Solution"
date: "May 2025 — Present"
category: "open-source"
type: "Test Automation · AI Agents"
description: "AI-powered automated testing framework that generates, executes, and reports end-to-end test scenarios for REST API systems. 95 test cases across 56 pages with dependency tracking, role-based testing, and financial integrity checks."
stack: ["Node.js", "AI Agents", "LLM-driven", "Swagger/OpenAPI", "Bruno", "Automation"]
icon: "🤖"
thumbClass: "thumb-shell"
image: ""
---

## 1. Project Identity

**Hermes Agents** is an AI-powered end-to-end test automation framework purpose-built for the Kano POS system — a 259-endpoint, 11-module Laravel backend. Instead of manually scripting tests, Hermes consumes the system's OpenAPI/Swagger spec to **autonomously discover, generate, execute, and validate** test scenarios across all modules.

Built with a multi-agent architecture: dedicated agents for planning, execution, validation, and reporting — each with role-specific knowledge of the POS domain.

## 2. Architecture

```
OpenAPI Spec (swagger.json)
       │
       ▼
┌──────────────────────────┐
│  Discovery Agent         │──► Maps all endpoints, params, schemas
└──────────┬───────────────┘
           ▼
┌──────────────────────────┐
│  Planner Agent           │──► Generates dependency-ordered test plan
│                          │    (respects prerequisites & data flow)
└──────────┬───────────────┘
           ▼
┌──────────────────────────┐
│  Execution Agent         │──► Runs tests sequentially per plan
│  ┌────────────────────┐  │    - Auto-creates prerequisite data
│  │ Role-based Runner  │  │    - Rotates roles (Admin, Kasir, dll)
│  │ Financial Checker  │  │    - Rejects invalid state transitions
│  └────────────────────┘  │
└──────────┬───────────────┘
           ▼
┌──────────────────────────┐
│  Reporter Agent          │──► Generates pass/fail matrix
│                          │    - Failure logs with request/response
│                          │    - Financial integrity verifications
└──────────────────────────┘
```

## 3. How It Works

### 3.1 Discovery Phase
The Discovery Agent parses the OpenAPI spec (`swagger.json`) and extracts:
- Each endpoint path, method, and expected status codes
- Request/response schemas (required fields, data types, constraints)
- Relationships between endpoints (e.g., `POST /api/lokasi` must precede `POST /api/gudang`)

From 259 endpoints across 44 controllers, the agent identifies **95 unique testable scenarios** and maps their dependencies into a directed acyclic graph (DAG).

### 3.2 Planning Phase
The Planner Agent produces a dependency-ordered execution plan:

```
Priority 0 (Critical — 43 tests)
├── Auth flows (login, token refresh, logout)
├── CRUD master data (location → warehouse → item → customer)
├── POS transaction lifecycle (create → settle → void)
├── Stock mutations (transfer → receive → adjust)
└── Financial closure (journal post → GL reconciliation)

Priority 1 (Important — 28 tests)
├── Purchase order lifecycle
├── Multi-role access boundaries
├── Discount & tax calculations
└── Inventory stock opname

Priority 2 (Enhancement — 11 tests)
├── Report generation & filtering
├── Approval workflow chains
└── Edge cases (negative quantities, past dates)
```

### 3.3 Execution Phase
The Execution Agent runs tests in strict dependency order:
- **Auto-provisioning**: Before testing "Create Stock Transfer", it creates the source location, destination warehouse, and item data first
- **Role rotation**: Each test scenario runs across **5 roles** (Admin, Kasir, Gudang, Finance, Manager) to verify permission boundaries
- **Financial assertions**: After every transaction, validates the balance sheet equation (Assets = Liabilities + Equity) — catching silent financial integrity bugs
- **Idempotency checks**: Certain endpoints are called twice to verify safe repeatability

### 3.4 Reporting Phase
Aggregates all execution results into a pass/fail matrix:

| Module | Total | Pass | Fail | Coverage |
|--------|-------|------|------|----------|
| Login & Auth | 5 | 5 | 0 | 3 pages |
| Master Data | 22 | 22 | 0 | 11 pages |
| Transactions | 24 | 23 | 1 | 10 pages |
| Inventory | 7 | 7 | 0 | 4 pages |
| Journal & Financial | 13 | 13 | 0 | 6 pages |
| Reports | 14 | 14 | 0 | 12 pages |
| System & Approval | 6 | 5 | 1 | 4 pages |
| End-to-End | 4 | 4 | 0 | All pages |
| **Total** | **95** | **93** | **2** | **56 pages** |

Each failure includes the full request payload, response body, and the specific assertion that failed — enabling rapid root-cause analysis.

## 4. Technical Highlights

- **LLM-agnostic**: Pluggable model backend — works with OpenRouter, 9Router, or local LLMs for environments without internet access
- **Dependency-aware execution**: A DAG scheduler ensures no test runs before its prerequisites are satisfied
- **Financial integrity validation**: Custom assertion engine verifies double-entry accounting rules automatically after each transaction
- **Bruno integration**: Auto-generates Bruno API collections alongside test execution for manual debugging
- **Minimal config**: Single YAML file specifies endpoints, roles, and authentication flow — everything else is auto-discovered

## 5. Business Impact

- **Zero manual test scripting**: 95 test cases generated from API spec alone
- **Role boundary gaps exposed**: Found 3 permissions issues where unauthorized roles could access restricted endpoints
- **Financial bugs caught early**: Identified 2 journal entry imbalances during execution
- **Regression safety net**: Full suite runs in ~15 minutes, enabling frequent regression cycles

