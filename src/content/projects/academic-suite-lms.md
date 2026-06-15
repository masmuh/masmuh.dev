---
title: "Academic Suite LMS — Anti-cheat Exam Platform"
client: "Personal"
date: "2024-10"
category: "open-source"
type: "Web App · Go · PostgreSQL"
description: "High-performance exam platform with server-side anti-cheating state machine. Built with Go, Fiber, and PostgreSQL — designed for academic integrity."
stack: ["Go", "Fiber", "PostgreSQL", "Docker", "Server-side State Machine"]
icon: "📝"
thumbClass: "thumb-academic"
image: ""
---

## 1. Project Identity

**Academic Suite LMS** is a high-performance online examination platform with a focus on academic integrity. Its core innovation is a server-side anti-cheating state machine that tracks and validates every student action in real-time.

## 2. Anti-cheating Architecture

- **Server-side state machine**: All question navigation, answer submission, and tab-switching events are validated server-side — client cannot manipulate state
- **Session integrity**: Token-based session binding with device fingerprinting
- **Randomized delivery**: Per-student question ordering and option shuffling
- **Proctoring signals**: Configurable flagging for suspicious behavior patterns

## 3. Key Metrics

- **Sub-second response**: Average API latency < 50ms under load
- **Concurrent capacity**: Designed for 1000+ simultaneous exam sessions
- **Zero page reloads**: SPA-like experience with server-side state

## 4. Tech Stack

| Component | Technology |
|-----------|-----------|
| Backend | Go + Fiber |
| Database | PostgreSQL |
| Container | Docker |
| Frontend | Server-side templates + HTMX |

## 5. Business Impact

- Exam integrity maintained without invasive proctoring (no camera/mic required)
- Students can use any device — anti-cheat logic lives entirely on the server
- Configurable strictness levels: from open-book to lockdown mode
