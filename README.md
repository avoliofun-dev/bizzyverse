# 🌐 BIZVERSE // Dunia Bisnis Virtual & Metaverse Korporat 3D

[![JavaScript](https://img.shields.io/badge/Language-JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Node.js](https://img.shields.io/badge/Runtime-Node.js-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Three.js](https://img.shields.io/badge/3D%20Engine-Three.js-000000?logo=three.js&logoColor=white)](https://threejs.org/)
[![Lisensi MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**BIZVERSE** adalah platform simulasi dunia bisnis virtual generasi masa depan berbasis **Framework JavaScript**, menggabungkan grafis 3D WebGL imersif, Pulau Pribadi dengan avatar bergerak bergaya Roblox, bursa efek saham Apex real-time, obrolan multiplayer sosial, pasar antar-pemain P2P, serta konsol moderasi dan administrasi lengkap.

---

## 🌟 Fitur Utama Platform

### 1. 🏙️ Metropolis 3D (Distrik Pusat Bisnis)
- Kota metropolis futuristik terapung dengan efek pencahayaan dinamis, jalan layang neon, dan armada drone otonom.
- 6 Sektor Bisnis Utama:
  - **Markas Besar Nexus (HQ)**: Pusat komando korporat dengan bonus pengganda total pendapatan +10% per tingkat.
  - **Menara Finansial Apex**: Menara kembar finansial dengan pita LED pasar saham yang membagikan dividen compound.
  - **Matriks AI Kuantum**: Piramida komputasi kuantum penghasil hak paten teknologi bernilai tinggi.
  - **Galleria Meta-Komersil**: Atrium ritel digital yang mengalirkan transaksi konsumen metaverse.
  - **Pusat Logistik Otonom**: Jaringan transportasi drone kargo dan pelabuhan peti kemas robotik.
  - **Megaplex Server Awan**: Klaster server berpendingin cairan sub-zero yang melayani komputasi Fortune 500.

### 2. 🏝️ Pulau Pribadi & Avatar Roblox 3D
- Lingkungan pulau tropis 3D di tengah samudra biru (*azure ocean*), pantai berpasir emas, dan pohon palem.
- **Avatar Humanoid Roblox 3D**:
  - Kontrol pergerakan menggunakan `[W] [A] [S] [D]`, `[Spasi]` untuk melompat, `[Shift]` untuk lari cepat.
  - Putar kamera 360 derajat dengan klik dan geser mouse.
  - Animasi pergerakan langkah dinamis (*walk & sprint cycles*), gravitasi melompat, dan pernapasan halus (*idle*).
  - *Nametag 3D* mengapung dan balon komik di atas kepala saat mengirim pesan obrolan.
- **6 Kavling Bisnis Strategis**: Bangun *Villa Kaca CEO*, *Rig Penambang Kuantum*, *Butik Mewah*, *Helipad Eksekutif VIP*, atau *Pabrik Robotika Mikro*.

### 3. 📈 Bursa Efek Apex (Simulasi Pasar Modal)
- 5 Aset Saham Virtual: `NRTX`, `HYPR`, `AETR`, `QNTM`, `SOLA`.
- Grafik harga tren interaktif dengan Chart.js, konsol transaksi beli/jual saham, dan *Warta Pasar Terkini* yang memengaruhi fluktuasi harga.

### 4. 🏢 Kantor Virtual (Simulasi Staf 2.5D)
- Lantai kantor animasi interaktif dengan avatar karyawan yang berjalan dan bekerja.
- Rekrutmen divisi: *Programmer Junior*, *Analis Kuantitatif*, *Ilmuwan Riset AI*, *Manajer Pertumbuhan*, dan *Wakil Presiden Eksekutif*.
- Fasilitas penunjang: *Bar Kopi Cold-Brew Kuantum*, *Pod Ergonomis Gravitasi Nol*, *Serat Optik Terabit*, dan *Taman Penthouse*.

### 5. 👔 Dewan Direksi AI (C-Suite) & Kontrak B2B
- Tiga penasihat eksekutif AI:
  - **Elena Vance** (Direktur Keuangan - CFO)
  - **Dr. Kenji Sato** (Direktur Teknologi - CTO)
  - **Maya Lin** (Direktur Pemasaran - CMO)
- Penanganan krisis dilema strategis (*Hostile Takeover*, *Anomali Kuantum*, *Serangan Siber*).
- Penandatanganan kontrak proyek korporat B2B bernilai tinggi.

### 6. 🌐 Obrolan & Jaringan Sosial (Multiplayer)
- Obrolan global langsung antar-CEO metaverse.
- Perintah emotikon avatar: `/dance` (menari), `/wave` (melambai), `/flex` (memamerkan kekayaan).
- Daftar pemain online dan fitur kunjungan antar-pulau pribadi.

### 7. 🛒 Pasar Antar-Pemain (P2P Exchange)
- Jual-beli kavling tanah, lisensi algoritma HFT, perangkat keras superkomputer, dan setelan pakaian mewah avatar.
- Formulir pasang iklan penjualan aset kustom oleh pemain.

### 8. 🗺️ Alur 4 Tahap Karir CEO
- **Tahap 1: Gabung** (Pendaftaran identitas & klaim modal awal).
- **Tahap 2: Mendirikan Bisnis** (Pondasi gedung & properti pulau).
- **Tahap 3: Membuka Jaringan** (Sosial, pasar pemain, kontrak B2B).
- **Tahap 4: Bersaing** (Papan Peringkat Dunia & aksi tantang takeover pasar).

### 9. 🛡️ Panel Admin & Moderasi (God Mode)
- Tindakan disiplin pemain: Peringatkan (*Warn*), Bisukan (*Mute*), Blokir (*Ban*).
- Intervensi likuiditas: Suntik kas +$100,000 / +$1,000,000, pengali 5x, picu *Bull Run* atau *Market Crash*.
- Siaran darurat teks berjalan (*Emergency Marquee Banner*) ke seluruh pemain.

---

## 📂 Struktur Direktori Proyek

```text
bizzyverse/
├── assets/                  # Aset gambar & ilustrasi visual
├── css/
│   └── styles.css           # Sistem desain CSS cyberpunk & glassmorphism
├── js/
│   ├── admin.js             # Konsol kontrol admin & moderasi
│   ├── app.js               # Koordinator aplikasi utama & navigasi
│   ├── audio.js             # Generator efek suara Web Audio API
│   ├── auth.js              # Manajemen akun & profil avatar
│   ├── avatar3d.js          # Pengontrol 3D avatar Roblox & animasi
│   ├── boardroom.js         # Dewan direksi C-Suite & kontrak B2B
│   ├── city3d.js            # Visualisator kota metropolis 3D (Three.js)
│   ├── engine.js            # Mesin simulasi ekonomi & arus kas
│   ├── island3d.js          # Dunia 3D pulau pribadi & kavling
│   ├── market.js            # Bursa efek saham Apex & grafik
│   ├── office.js            # Lantai kantor virtual 2.5D
│   ├── p2pmarket.js         # Pasar jual-beli antarpemain
│   └── stages.js            # Alur 4 tahap karir & papan peringkat
├── vendor/                  # Pustaka pendukung lokal (Three.js, Chart.js, dll.)
├── index.html               # Halaman utama aplikasi web
├── package.json             # Konfigurasi npm & dependensi JavaScript
├── local-server.js          # Server Node.js lokal untuk pengujian di komputer
├── .gitignore               # Berkas yang diabaikan oleh Git
└── README.md                # Dokumentasi lengkap proyek
```

---

## 🚀 Cara Menjalankan Proyek

### Prasyarat
- [Node.js](https://nodejs.org/) (Versi 16 atau yang lebih baru)

### Langkah Menjalankan
1. Clone repositori ini:
   ```bash
   git clone https://github.com/avoliofun-dev/bizzyverse.git
   cd bizzyverse
   ```

2. Jalankan server aplikasi:
   ```bash
   npm start
   ```

3. Buka peramban (browser) dan akses:
   ```text
   http://localhost:3000
   ```

---

## ⚡ Deployment Langsung ke Vercel

Proyek ini telah dilengkapi dengan konfigurasi `vercel.json` dan serverless API (`/api/status`, `/api/leaderboard`) sehingga siap di-deploy langsung ke Vercel tanpa konfigurasi rumit tambahan:

### Cara 1: Menggunakan Vercel Dashboard (Rekomendasi)
1. Buka [Vercel Dashboard](https://vercel.com/dashboard) dan klik tombol **"Add New..."** ➔ **"Project"**.
2. Hubungkan akun GitHub Anda dan pilih repositori:
   👉 `https://github.com/avoliofun-dev/bizzyverse`
3. Pada pengaturan proyek:
   - **Framework Preset**: Pilih `Other` (atau biarkan default, otomatis mengenali `vercel.json`).
   - **Root Directory**: `./`
   - **Build Command**: Kosongkan atau gunakan default (`npm run build`).
   - **Output Directory**: Kosongkan (otomatis melayani root berkas statis `index.html`).
4. Klik **Deploy**. Dalam 30 detik web akan aktif secara live dengan URL `https://bizzyverse.vercel.app` (atau nama domain pilihan Anda) dengan tampilan 100% identik seperti di lokal!

### Cara 2: Menggunakan Vercel CLI di Terminal
```bash
# 1. Pasang Vercel CLI (jika belum ada)
npm i -g vercel

# 2. Deploy proyek langsung
vercel --prod
```

---

## 📜 Lisensi

Proyek ini dilisensikan di bawah lisensi **MIT**. Bebas digunakan dan dikembangkan untuk tujuan komersial maupun edukatif.

