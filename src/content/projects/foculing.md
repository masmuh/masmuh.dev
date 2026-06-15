---
title: "Foculing — Privacy-first Productivity Tracker"
client: "Personal"
date: "2024-07"
category: "personal"
type: "Desktop App · Go · Wails"
description: "Privacy-first productivity tracker with ~11MB RAM footprint. Built with Go and Wails — lightweight, offline-first, and fully self-contained."
stack: ["Go", "Wails", "SQLite", "Desktop App"]
icon: "⏱️"
thumbClass: "thumb-foculing"
image: ""
---

## 1. Project Identity

**Foculing** is a privacy-first desktop productivity tracker. Unlike cloud-based alternatives that send your data to third parties, Foculing runs entirely locally with an incredibly small ~11MB RAM footprint.

## 2. Key Differentiators

- **~11MB RAM**: Built with Go + Wails, not Electron — minimal resource consumption
- **100% offline**: No internet required, no data leaves your machine
- **Privacy-first**: All activity data stored locally in SQLite
- **Minimalist UI**: Distraction-free interface designed for focus

## 3. Tech Stack

| Component | Technology |
|-----------|-----------|
| Backend | Go |
| Frontend | Wails (native webview) |
| Storage | SQLite |
| Binary Size | ~11MB RAM at runtime |

## 4. Design Philosophy

Foculing embodies a "less is more" approach — most productivity tools consume hundreds of MBs of RAM for simple timer and tracking features. By leveraging Go's efficiency and Wails' lightweight native webview (vs Electron), Foculing delivers the same functionality at a fraction of the resource cost.
