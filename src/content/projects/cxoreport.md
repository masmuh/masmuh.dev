---
title: "CXO Report: Enterprise KPI Orchestration"
client: "Kano Solution (Project Bagong)"
date: "February 2026"
category: "corporate"
type: "Data Engineering · Backend Architecture"
description: "For Bagong. Near-real-time C-level KPI dashboards. 5-min data refresh for critical metrics."
stack: ["Go 1.23", "MongoDB", "ETL", "Cron"]
icon: "📊"
thumbClass: "thumb-oats"
---

### Project Identity
**CXO Staging** adalah engine *Data Intelligence* inti dalam ekosistem "Project Bagong". Sistem ini berfungsi sebagai jembatan otomatisasi yang mengagregasi data transaksi dari berbagai tenant operasional (fragmented data) ke dalam satu *Staging Layer* yang terpusat. Perannya sangat krusial: mentransformasi jutaan baris data mentah menjadi metrik KPI (Key Performance Indicators) yang siap dikonsumsi oleh jajaran eksekutif melalui Dashboard Scorecard.

### Architectural Challenges
*   **Multi-Tenant Data Ingestion**: Sistem harus mampu melakukan *crawl* ke berbagai database tenant (`xibar-dev-tenant_*`) dengan skema yang dinamis namun tetap menjaga integritas hasil akhir.
*   **Complex Aggregation at Scale**: Menghitung KPI multi-dimensi (Profit Center, Cost Center, Site, Asset) dari jutaan baris transaksi keuangan tanpa membebani database operasional.
*   **Data Consistency & Idempotency**: Dalam sistem *background job* yang berjalan paralel, tantangan terbesarnya adalah mencegah duplikasi data saat terjadi *retry* atau eksekusi jadwal yang tumpang tindih.
*   **Dynamic Business Logic**: Kebutuhan bisnis untuk merubah formula agregasi (Mappings) sewaktu-waktu tanpa harus melakukan *re-deployment* kode aplikasi.

### Decision Logic (Trade-off Analysis)
*   **Go 1.23 & MongoDB Aggregation Engine**
    *   **Mengapa**: Dipilih untuk menggeser beban komputasi berat dari *Application Layer* ke *Database Layer*.
    *   **Trade-off**: Meskipun penggunaan CPU Database meningkat, kami berhasil memangkas *Network I/O* hingga 80% dan meminimalisir penggunaan memori pada aplikasi karena data hanya "mengalir" (*streaming*) tanpa perlu dimuat sepenuhnya ke RAM.
*   **Deterministic ID (MD5 Composite Hashing)**
    *   **Mengapa**: Setiap record di hasil staging diberi ID unik berbasis hash dari kombinasi `MappingCode + TransDate + GroupingID`.
    *   **Trade-off**: Mengakibatkan sedikit *write-penalty* karena setiap proses menjadi operasi *Upsert*. Namun, ini menjamin **idempotency** 100%—data tidak akan pernah duplikat meskipun proses dijalankan ulang berkali-kali pada periode yang sama.
*   **Two-Stage Transformation (Flattening)**
    *   **Mengapa**: Memisahkan *Raw Staging* (agregasi awal) dengan *InitialData* (data siap saji untuk Dashboard).
    *   **Trade-off**: Menambah kompleksitas alur kerja ETL, namun memberikan *Read Performance* yang sangat cepat pada sisi UI karena dashboard tidak perlu lagi melakukan join atau kalkulasi rumit saat diakses.

### Business Impact
*   **Automated Executive Insights**: Memangkas waktu siklus pelaporan dari proses manual mingguan menjadi otomatisasi *near-real-time* (per 5 menit untuk data kritikal).
*   **Management by Exception**: Sistem secara otomatis menghitung *Ratio*, *Forecast*, dan *Balance Score* yang menghasilkan indikator warna (Green/Yellow/Red), memungkinkan manajemen fokus hanya pada departemen yang performanya di bawah target.
*   **Operational Stability**: Pemisahan database staging memastikan kueri laporan yang berat tidak mengganggu performa transaksi pelanggan di database utama.

### Senior Retrospective: Modernization Analysis
Jika membangun sistem ini hari ini dengan stack **.NET 10**, **Go**, atau **Kubernetes**, beberapa modernisasi strategis yang akan saya terapkan:

1.  **Workflow Orchestration (Temporal/Airflow)**: Daripada menggunakan internal cron di dalam Go, saya akan bermigrasi ke **Temporal.io**. Ini akan memberikan *visibility* penuh terhadap *state* dari setiap job ETL, mekanisme *retry* yang lebih cerdas, dan pelacakan *long-running tasks* yang jauh lebih reliabel.
2.  **Event-Driven Ingestion (NATS JetStream)**: Untuk mengurangi beban *polling* ke database sumber, penggunaan CDC (*Change Data Capture*) yang dipasangkan dengan **NATS JetStream** akan memungkinkan sistem memproses data secara *reactive* sesaat setelah transaksi terjadi.
3.  **Observability (OpenTelemetry)**: Implementasi *Distributed Tracing* sangat penting untuk melacak "Data Lineage"—mengetahui dari mana asal satu angka KPI tertentu jika terjadi diskrepansi data antara dashboard dan database operasional.
4.  **Cloud-Native Scaling (K8s Jobs)**: Memanfaatkan **Kubernetes CronJobs** untuk memisahkan setiap jenis pemrosesan mapping ke dalam *container* terpisah. Ini memungkinkan penskalaan horizontal yang lebih agresif hanya pada job yang memiliki volume data besar (misalnya `LEDGER_JOURNAL`) tanpa mengganggu job ringan lainnya.