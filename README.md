# Personal Portfolio Website

Website portfolio profesional yang dibangun menggunakan **Astro**. Proyek ini menampilkan showcase proyek, pengalaman kerja, dan detail teknis dari berbagai sistem yang telah dikembangkan.

## 🚀 Struktur Direktori

Berikut adalah struktur folder dalam proyek ini:

```text
/
├── src/
│   ├── assets/             # Aset gambar dan media
│   ├── components/         # Komponen UI Astro yang dapat digunakan kembali
│   ├── content/            # Konten berbasis Markdown/MDX
│   │   ├── projects/       # Data proyek (Case Studies)
│   │   └── gallery/        # Data galeri
│   ├── layouts/            # Template layout halaman utama
│   ├── pages/              # Rute/Halaman website (index, portfolio, dll)
│   │   └── projects/       # Halaman dinamis untuk detail proyek
│   └── styles/             # File CSS/Styling
├── public/                 # Aset statis yang tidak diproses (favicon, dll)
├── update-metadata.cjs     # Script utilitas untuk memperbarui metadata proyek
├── cleanup-markdown.cjs    # Script untuk membersihkan file markdown
├── astro.config.mjs        # Konfigurasi utama Astro
└── package.json            # Daftar dependensi dan script NPM
```

## 🛠️ Teknologi yang Digunakan

- **Framework:** [Astro](https://astro.build/)
- **Content Management:** Markdown & Astro Content Collections
- **Styling:** Vanilla CSS / Custom Styles
- **Runtime:** Node.js

## 💻 Cara Menjalankan Proyek

Pastikan Anda sudah menginstal [Node.js](https://nodejs.org/).

1. **Instal Dependensi:**
   ```bash
   npm install
   ```

2. **Jalankan Development Server:**
   ```bash
   npm run dev
   ```
   Buka `http://localhost:4321` di browser Anda.

3. **Build untuk Produksi:**
   ```bash
   npm run build
   ```

## 📝 Catatan Tambahan

Proyek ini menyertakan beberapa script khusus (`.cjs`) untuk membantu otomatisasi pemeliharaan konten:
- `update-metadata.cjs`: Digunakan untuk sinkronisasi metadata dari file proyek.
- `cleanup-markdown.cjs`: Membantu merapikan format file markdown di folder content.

---
*Dibuat dengan ❤️ menggunakan Astro.*
