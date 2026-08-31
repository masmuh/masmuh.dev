---
title: "Hermes Agents — AI Test Automation"
client: "Kano Solution"
date: "2026"
category: "open-source"
type: "Test Automation · AI Agents"
description: "AI-powered QA automation pipeline integrated with GitLab: every issue labeled Done is tested end-to-end (UI + API 1:1) with screenshot evidence, then auto-closed on pass or reopened with a bug report on failure. 39 standardized test-case documents; 6+ backend & UI bugs caught before release."
stack: ["Node.js", "AI Agents", "LLM-driven", "GitLab API", "Playwright", "Automation"]
icon: "🤖"
thumbClass: "thumb-shell"
image: ""
---

## 1. Project Identity

**Hermes Agents** is an AI-powered QA automation pipeline purpose-built for the Kano POS system — a 259-endpoint, 11-module Laravel backend with a Next.js frontend. Instead of manual, per-issue regression testing, Hermes operates a scheduled pipeline that automatically **tests, comments, completes, and reopens** GitLab issues based on real UI + API evidence.

## 2. Architecture — Three Automated Pipelines

```
GitLab Issues (project 565)
        │
        ▼
┌─ UI/UX Tester (hourly) ────────────────────────────────┐
│ Picks first OPEN issue labeled "Done"                  │
│ → logs into dev UI → runs multi-scenario tests         │
│ → cross-checks UI data 1:1 against API JSON            │
│ → captures & uploads screenshots to GitLab             │
│ → verdict: PASS / UI bug / backend issue / no data     │
└────────────────────────────────────────────────────────┘
        │
        ├─ PASS ────────────► CLOSE issue + appreciation comment @developer
        ├─ UI/UX bug ───────► REOPEN + label + detailed comment + screenshot @assignee
        ├─ Backend/API error► REOPEN + "Backend Issue" label + comment @backend
        ├─ No data (0 rec) ─► NOT closed → "Backend Issue" + seed-data request
        └─ Questions ────────► Comment Reply Bot answers / escalates

┌─ Comment Reply Bot (hourly) ───────────────────────────┐
│ Monitors issue comments, replies to questions using    │
│ verified API responses, skips noise (anti-spam rules)  │
└────────────────────────────────────────────────────────┘

┌─ Sync & Test Case Generator (hourly) ──────────────────┐
│ Keeps status tables (Done / In Progress / Open) in     │
│ the Master Control issue in sync with GitLab state     │
└────────────────────────────────────────────────────────┘
```

## 3. How It Works

### 3.1 Test → Comment → Complete → Reopen Loop

- **Test**: every issue marked `Done` is picked up within an hour. The agent logs into the dev environment, navigates the feature page, and cross-checks every displayed value against the raw API JSON response (1:1 verification).
- **Comment**: results are posted back to the issue — verdict, API endpoint + status code, response body, and screenshot evidence uploaded via the GitLab uploads API. Developers are @mentioned so they are notified immediately.
- **Complete (close)**: an issue is closed only when 100% of scenarios pass with real data present.
- **Reopen**: on a UI bug the issue is reopened with a detailed report and the `Done` label removed; on a backend error it is reopened with the `Backend Issue` label and escalated to the backend owner.

### 3.2 Evidence-Based Reporting

- Screenshots captured during testing are uploaded and embedded directly in the GitLab comment.
- Every decision leaves a full audit trail: comments, screenshots, label changes, and state changes.

### 3.3 Anti-Spam Comment Handling

The reply bot never replies to itself, skips system notes, skips already-answered questions, and skips informational messages — only genuinely unanswered questions get a reply (max 3 per run).

## 4. Test Case Documentation

- **39 standardized test-case documents** — one per application page — in a fixed 8-column QA table format: Step, Desc, Iteration, Expected, Actual, Result, Evidence, Defect ID.
- Split into **UI/UX** and **API** test cases per page.
- Stored in the backend repo (`docs/test-case/`) and registered as GitLab issues (#42–#80) with a Master Control issue (#89) tracking status.

## 5. Bugs Caught (Real Findings)

| Area | Finding |
|------|---------|
| Reports (3 issues) | Export Excel returned **HTTP 405** — frontend & spec sent `POST`, backend only accepted `GET` |
| Receivables spec | Documented endpoint returned **404**; the real endpoint was verified via OpenAPI + live calls |
| Stock API | `GET /stock` was forced to `per_page=100` — pagination loop required |
| POS item click | Toast "Stok kosong" despite available stock — client-side stock map out of sync with API |
| Journal list | "Lihat Detail" button unbound — API returned 200 OK, UI handler missing |
| Empty data | Several modules had 0 records — flagged as backend issues with seed-data requests |

## 6. Business Impact

- **From manual to hourly automated**: regression testing that previously ran per-issue by hand now runs automatically every hour.
- **Bug feedback loop: days → real-time** — verdict + screenshot + @mention land on the right developer's desk within minutes.
- **6+ backend & UI bugs** caught and documented before release.
- **Empirical API verification** — multiple spec errors (404 endpoints, wrong HTTP methods) discovered by testing reality instead of trusting documentation.
- **Full audit trail** — every test decision is permanently recorded in GitLab.
