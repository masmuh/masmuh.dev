---
title: "ISMS EaseHub"
client: "Sampoerna"
date: "January 2026"
category: "corporate"
type: "Warehouse Management · WMS"
description: "Multi-tenant warehouse management platform facilitating real-time inventory tracking and complex 3PL integrations."
stack: [".NET 9", "WPF", "SQL Server", "SQLite"]
icon: "📦"
thumbClass: "thumb-academic"
---

---

## 1. Project Identity
EaseHub was developed as a mission-critical **Desktop Application** utility to streamline data operations and cryptographic standardization within a complex enterprise environment. Operating as a standalone Windows-based architect tool, the system serves as a centralized bridge between disparate RDBMS instances (SQL Server/SQLite) and business intelligence reporting, while simultaneously acting as the "Source of Truth" for cryptographic implementations (AES-256/SHA-256) used across the enterprise ecosystem.

## 2. Architectural Challenges
*   **High-Concurrency Multi-DB Extraction**: The primary challenge was executing intensive SQL queries across a non-deterministic number of database shards simultaneously. A traditional sequential approach was too slow, while naive multi-threading risked saturating the local machine's memory and the target DB servers' connection pools.
*   **Dynamic Schema Mapping**: The system needed to handle "Schema Drift" across different database versions. It required a mechanism to reconstruct data structures at runtime without the overhead of Entity Framework or hardcoded DTOs.
*   **Cryptographic Consistency**: Standardizing security protocols (HMAC and AES) across multiple internal tools required a robust, shared implementation that could be utilized by both technical and non-technical staff.

## 3. Decision Logic
*   **WPF-Based Desktop Architecture (.NET 9.0)**: 
    *   *Choice*: I selected a native **Windows Desktop (WPF)** framework over a web-based approach.
    *   *Rationale*: A desktop implementation provides low-latency direct access to local system resources, seamless integration with local Excel COM/IO operations, and a familiar environment for database administrators who require high-performance multi-threaded processing without the overhead of web-server intermediate layers.
*   **Producer-Consumer Pattern (System.Threading.Channels)**: 
    *   *Choice*: I implemented a bounded channel architecture to decouple DB I/O from Excel generation. 
    *   *Trade-off*: While more complex than a simple `Parallel.ForEach`, this pattern provides back-pressure management, ensuring that data fetching doesn't outpace the aggregator's ability to write to the Excel buffer, thus maintaining a flat memory profile on the desktop client.
*   **Semaphore-Based Concurrency Control**:
    *   *Choice*: Utilized `SemaphoreSlim` to enforce a strict Degree of Parallelism (Dop).
    *   *Rationale*: This allows the system to maximize throughput while staying within the "Safe Zone" of the enterprise network's bandwidth and the DB server's performance limits.
*   **Reflective Metadata Extraction**:
    *   *Choice*: Leveraged `CommandBehavior.SchemaOnly` for dynamic `DataTable` construction.
    *   *Rationale*: This avoids the performance hit of a full data load just to determine schema, allowing the system to remain "Schema-Agnostic."

## 4. Business Impact
*   **Automation ROI**: Transitioned the data reconciliation process from a manual, error-prone task taking ~4-6 hours to a fully automated process completed in under 15 minutes.
*   **Enterprise Stability**: The implementation of high-resilience retry logic (exponential backoff) resulted in a 99.8% success rate for long-running batch exports, even over unstable VPN/Wide-Area Network connections.
*   **Security Standardization**: Reduced "Cryptographic Fragmentation" by providing a single, verified tool for encryption and hashing, significantly lowering the risk of implementation errors in production environments.
