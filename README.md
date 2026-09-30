# 🍢 CirengKuy Frontend
Website dapat diakses pada [cirengkuy.netlify.app](https://cirengkuy.netlify.app).

Antarmuka web untuk sistem pemesanan **CirengKuy**. Dibangun dengan React dan Vite, terhubung ke [CirengKuy Backend](https://github.com/fahmin002/cirengkuy-backend) melalui REST API dan Socket.IO untuk pembaruan real-time.

## ✨ Fitur

- 🛍️ Tampilan katalog dan pemesanan produk
- 🔐 Autentikasi pengguna (terhubung ke API backend)
- ⚡ Update real-time dengan Socket.IO
- 📊 Visualisasi data dan statistik dengan grafik (Recharts)
- 🔔 Notifikasi toast yang ringan (Sonner)
- 📱 Desain responsif dengan Tailwind CSS

> Desain antarmuka bisa dilihat di file [`design-cirengkuy.png`](./design-cirengkuy.png).

## 🧰 Tech Stack

| Kategori | Teknologi |
| --- | --- |
| Library UI | React 19 |
| Build tool | Vite |
| Styling | Tailwind CSS 4 |
| Routing | React Router 7 |
| HTTP client | Axios |
| Real-time | Socket.IO Client |
| Grafik | Recharts |
| Ikon | React Icons |
| Notifikasi | Sonner |
| Linter | ESLint |

## 📁 Struktur Project

```
cirengkuy-frontend/
├── public/               # Aset statis
├── src/                  # Source code aplikasi (pages, components, dll.)
├── design-cirengkuy.png  # Referensi desain UI
├── index.html            # Entry HTML
├── vite.config.js        # Konfigurasi Vite
├── eslint.config.js      # Konfigurasi ESLint
└── package.json
```

## ✅ Prasyarat

- [Node.js](https://nodejs.org/) v20 atau lebih baru
- Backend CirengKuy yang sudah berjalan → [cirengkuy-backend](https://github.com/fahmin002/cirengkuy-backend)

## 🚀 Instalasi

1. **Clone repository**

   ```bash
   git clone https://github.com/fahmin002/cirengkuy-frontend.git
   cd cirengkuy-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Siapkan environment variable**

   Buat file `.env` di root project:

   ```env
   API_BASE_URL="http://localhost:5000/api"
   ```

4. **Jalankan development server**

   ```bash
   npm run dev
   ```

   Aplikasi akan berjalan di `http://localhost:5173` (port default Vite).

## ⚙️ Konfigurasi

| Variabel | Deskripsi | Contoh |
| --- | --- | --- |
| `API_BASE_URL` | Base URL API backend | `http://localhost:5000/api` |

Kalau ingin diakses dari perangkat lain di jaringan yang sama (misalnya HP), ganti `localhost` dengan IP lokal komputermu, contoh `http://192.168.1.5:5000/api`.

> 💡 **Catatan Vite:** secara default Vite hanya mengekspos variabel yang berawalan `VITE_` ke kode frontend. Pastikan `API_BASE_URL` dibaca lewat `define` di `vite.config.js`, atau ganti namanya menjadi `VITE_API_BASE_URL`.

> ⚠️ Jangan commit file `.env` ke repository.

## 📜 Scripts

| Perintah | Fungsi |
| --- | --- |
| `npm run dev` | Menjalankan development server dengan HMR |
| `npm run build` | Build aplikasi untuk production (hasil di folder `dist/`) |
| `npm run preview` | Preview hasil build secara lokal |
| `npm run lint` | Mengecek kode dengan ESLint |

## 🌐 Deployment

Hasil `npm run build` adalah file statis di folder `dist/` yang bisa di-deploy ke layanan hosting statis seperti Vercel, Netlify, atau Cloudflare Pages. Jangan lupa:

- Set environment variable API di platform hosting
- Pastikan `FRONTEND_URL` di backend diarahkan ke domain frontend agar CORS berjalan

## 🔗 Repository Terkait

- **Backend:** [fahmin002/cirengkuy-backend](https://github.com/fahmin002/cirengkuy-backend)

## 🤝 Kontribusi

1. Fork repository ini
2. Buat branch fitur (`git checkout -b fitur/nama-fitur`)
3. Commit perubahan (`git commit -m "feat: tambah fitur X"`)
4. Push ke branch (`git push origin fitur/nama-fitur`)
5. Buat Pull Request

## 👤 Author

**fahmin002** — [github.com/fahmin002](https://github.com/fahmin002)
