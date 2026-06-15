---
title: "Hermes Agents — AI Test Automation"
client: "Kano Solution"
date: "June 2025"
category: "open-source"
type: "Test Automation · AI Agents"
description: "AI-powered automated testing suite generating and executing 95 end-to-end test scenarios across 56 application pages with dependency tracking, role-based testing, priority matrix, and detailed execution reports."
stack: ["AI Agents", "Node.js", "Swagger/OpenAPI", "Bruno", "Automation Framework"]
icon: "🤖"
thumbClass: "thumb-shell"
image: ""
---

## 1. Project Identity

**Hermes Agents** is an AI-powered automated testing framework that generates, executes, and reports on end-to-end test scenarios for REST API systems. It consumes OpenAPI/Swagger specifications to automatically discover all endpoints and generate comprehensive test cases.

## 2. Test Coverage

- **95 test cases** across all system modules
- **56 application pages** (100% page coverage)
- **Role-based testing**: Admin, Kasir, Gudang, Finance, Manager
- **Priority matrix**: P0 (Critical — 43 tests), P1 (Important — 28 tests), P2 (Enhancement — 11 tests)
- **4 End-to-End flows**: Full cycle, Retur & Reversal, Transfer + Opname, Multi-Location

## 3. Test Modules Covered

| Module | Tests | Pages |
|--------|-------|-------|
| Login & Authentication | 5 | 3 |
| Master Data (Lokasi, Gudang, Barang, etc.) | 22 | 11 |
| Transactions (POS, Purchase, Transfer, etc.) | 24 | 10 |
| Inventory & Stock Opname | 7 | 4 |
| Journal & Financial (GL, Receivables, Payables) | 13 | 6 |
| Reports (Operational, Financial, Tax) | 14 | 12 |
| System & Approval | 6 | 4 |
| End-to-End Scenarios | 4 | All |

## 4. Key Features

- **Dependency tracking**: Test execution respects prerequisites (e.g., Create Location before Create Warehouse)
- **Smart data validation**: Asserts correct state changes across the entire system (stok, jurnal, GL)
- **Financial integrity checks**: Verifies balance sheet equation (Assets = Liabilities + Equity) after transactions
- **Multi-role testing**: Same test scenario executed across different roles to verify permission boundaries
- **Execution report**: Automatic pass/fail matrix with detailed failure logs
