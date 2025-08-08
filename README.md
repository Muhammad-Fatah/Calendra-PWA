 Calendra – Aplikasi Jadwal Kuliah Berbasis Progressive Web App (PWA)

**Calendra** adalah aplikasi web progresif yang membantu mahasiswa mengelola jadwal kuliah, tugas, dan tenggat waktu (deadline) dalam satu platform yang modern, ringan, dan responsif. Dapat digunakan secara **offline**, **diinstal seperti aplikasi mobile**, dan mendukung semua perangkat.
live demo : https://calendra-pwa.web.app/
---

 Fitur Unggulan

- 📆 **Manajemen Jadwal Kuliah**  
  Tambahkan, lihat, dan edit jadwal kuliah harian dengan tampilan yang rapi dan bersih.

- 📝 **Manajemen Tugas dan Deadline**  
  Catat tugas-tugas dan deadline penting. Tugas yang hampir jatuh tempo akan ditampilkan lebih menonjol secara visual.

- 📱 **PWA – Installable App**  
  Aplikasi ini bisa dipasang di layar utama perangkat (Android, iOS, Desktop) tanpa install dari Play Store.

- 🌐 **Offline Mode**  
  Dengan bantuan **Service Worker**, aplikasi tetap dapat berjalan saat tidak ada koneksi internet.

- 📊 **Kalender Dinamis**  
  Kalender bulanan yang interaktif dan menampilkan tanggal sekarang secara otomatis.

- 💻 **Desain Modern dan Responsif**  
  Menggunakan Bootstrap 5, aplikasi ini tampak konsisten dan rapi di semua ukuran layar.

---

 Teknologi yang Digunakan

- **HTML5, CSS3, JavaScript (Vanilla)**
- **Bootstrap 5** + Bootstrap Icons
- **LocalStorage** – penyimpanan data lokal pengguna
- **Service Worker** – untuk cache & offline support
- **Web App Manifest** – untuk PWA dan icon
- **Responsive Layout** – optimal untuk mobile dan desktop

---

 Cara Menjalankan Aplikasi

1. Clone Repository
    ```bash
    git clone https://github.com/username/calendra.git
    cd calendra
2. Buka di Browser
    Cukup buka index.html dengan browser modern (Chrome/Edge/Firefox).
    Atau gunakan ekstensi Live Server jika menggunakan VS Code.
3. Install sebagai Aplikasi
    Di browser Chrome, klik ikon install di address bar (desktop) atau "Tambahkan ke layar utama" (Android).

---

Struktur Proyek

calendra/
├── index.html            # Halaman dashboard utama
├── schedule.html         # Halaman manajemen jadwal kuliah
├── tasks.html            # Halaman manajemen tugas
├── manifest.json         # Konfigurasi PWA
├── service-worker.js     # Cache dan offline handler
├── icons/
│   └── icon-192x192.png  # Ikon aplikasi
├── js/
│   ├── home.js
│   ├── schedule.js
│   └── tasks.js
└── README.md

---

Tentang Pengembang
Nama: Muhamad Fatah Hidayatul Husna
Fokus: Web Development
Email: mfatah.husna@gmail.com

---

Lisensi
Proyek ini dilisensikan di bawah MIT License.
Silakan digunakan dan dimodifikasi untuk keperluan pembelajaran, tugas akhir, atau pengembangan pribadi.
