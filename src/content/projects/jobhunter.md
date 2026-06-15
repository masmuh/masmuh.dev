---
title: "JobHunter — Autonomous AI Pipeline"
client: "Personal"
date: "2025-05"
category: "personal"
type: "AI Pipeline · Playwright · LLM"
description: "Fully autonomous AI pipeline: ATS scraping → LLM match scoring → CV generation. Zero manual intervention from job discovery to application."
stack: ["Node.js", "OpenRouter", "Playwright", "SQLite", "AI Agents"]
icon: "🎯"
thumbClass: "thumb-jobhunter"
image: ""
---

## 1. Project Identity

**JobHunter** is a fully autonomous AI pipeline that discovers job listings from ATS platforms, scores them against a candidate profile using LLM reasoning, and generates tailored CVs — all with zero manual intervention.

## 2. Architecture

- **ATS Scraper**: Playwright-based headless browser automation for job board extraction
- **LLM Match Scorer**: OpenRouter-powered multi-model scoring against candidate skills and experience
- **CV Generator**: Dynamic LaTeX/Markdown CV generation tailored to each job description
- **SQLite Store**: Persistence for job listings, scores, and generation history

## 3. Key Features

- **Zero-touch pipeline**: Scheduled runs discover, score, and prepare applications
- **Multi-model LLM rotation**: Uses different models for different stages (scoring vs generation)
- **Smart deduplication**: Avoids re-processing already-seen listings
- **Export-ready output**: Generates print-ready CV files

## 4. Tech Stack

| Component | Technology |
|-----------|-----------|
| Runtime | Node.js |
| Browser Automation | Playwright |
| LLM API | OpenRouter (multi-model) |
| Storage | SQLite |
| Scheduling | Built-in cron
