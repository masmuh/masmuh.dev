---
title: "WicaraAI / Oats AI — Offline Transcription"
client: "Personal"
date: "2025-03"
category: "open-source"
type: "Desktop App · Whisper.cpp · MAUI"
description: "Open-source cross-platform offline transcription tools powered by Whisper.cpp. Fully on-device — no cloud dependency, no data leaves your machine."
stack: ["C#/.NET MAUI", "Rust/Tauri v2", "Whisper.cpp", "On-device Inference"]
icon: "🎙️"
thumbClass: "thumb-wicara"
image: ""
---

## 1. Project Identity

**WicaraAI** and its Rust sibling **Oats AI** are open-source cross-platform desktop applications for offline speech-to-text transcription. Powered by Whisper.cpp, they run entirely on-device with no cloud dependency.

## 2. Versions

| Variant | Technology | Platform |
|---------|-----------|----------|
| WicaraAI | C# / .NET MAUI | Windows, macOS, Android, iOS |
| Oats AI | Rust / Tauri v2 | Windows, macOS, Linux |

## 3. Key Features

- **100% offline**: Whisper.cpp on-device inference, zero network calls
- **Multi-language**: Supports Indonesian, English, and 90+ languages
- **Batch processing**: Drag-and-drop multiple audio/video files
- **Export formats**: SRT, VTT, TXT, Markdown
- **Privacy-first**: All processing stays on the user's machine

## 4. Architecture

Both variants share the same core philosophy — wrap Whisper.cpp in a native desktop UI:

- **WicaraAI** (.NET MAUI): Shared C# business logic across mobile and desktop surfaces
- **Oats AI** (Rust/Tauri v2): Lightweight (~10MB binary), cross-platform with system-level performance

## 5. Open Source

Both projects are open-source and available on GitHub. Designed as learning resources for developers interested in on-device ML and cross-platform desktop development.
