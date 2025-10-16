# Project Next.js

Ini adalah proyek **Next.js** 15 yang menggunakan React 18+, dengan dukungan opsional **TypeScript** dan beberapa library frontend modern.  
README ini akan memandu Anda melalui instalasi, konfigurasi, dan perintah-perintah umum untuk menjalankan project.

---

## Prasyarat

Sebelum memulai, pastikan Anda sudah menginstal **Node.js** dan **npm**:

```bash
node -v
npm -v
```

### Clone Repository
```bash
git clone https://github.com/Akbaresa/sendpick-dashboard-test.git
```

### Masuk Kedalam Folder
```bash
cd sendpick-dashboard-test
```

### Masuk Kedalam Folder
```bash
npm install
```

### Buat .env dalam folder root ./sendpick-dashboard-test/.env
```bash
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api
NEXT_PUBLIC_STORAGE_URL=http://127.0.0.1:8000
```

### Jalankan Program
```bash
npm run dev
```

### Arsitektur Program
```bash
├─ public/ # File statis (gambar, ikon, font)
├─ src/
│ ├─ app/ # Halaman / routing Next.js
│ ├─ components/ # Komponen React yang dapat digunakan kembali
│ ├─ core/ # Service, helper, utilitas
│ │ ├─ config/ # Konfigurasi aplikasi
│ │ ├─ lib/ # Fungsi umum / helper
│ │ ├─ service/ # API service / fetcher
│ │ ├─ hooks/ # Custom React hooks
│ │ ├─ context/ # Context API / global state
│ │ └─ types/ # TypeScript type definitions
│ ├─ middleware.ts
├─ package.json
├─ tsconfig.json # Konfigurasi TypeScript (opsional)
```