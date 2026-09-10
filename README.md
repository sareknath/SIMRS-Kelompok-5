# Klinika — RME Sederhana

Aplikasi Rekam Medis Elektronik untuk klinik/rumah sakit kecil, dengan fitur
**Nurse Station** dan **Doctor Queue** yang saling terhubung: begitu perawat
menandai pasien siap diperiksa, pasien otomatis muncul di antrian dokter.

## Status Proyek

✅ **Tahap 1 (selesai): UI/UX frontend dengan data dummy** — semua halaman
sudah bisa dijalankan dan dilihat, datanya masih statis/dummy di dalam kode
(belum tersambung ke database).

⏳ **Tahap 2 (belum dikerjakan): Backend & integrasi database MySQL** —
struktur folder backend sudah disiapkan (`backend/app/`), tapi endpoint API,
model database, dan autentikasi sungguhan belum diimplementasikan.

⏳ **Tahap 3 (belum dikerjakan): WebSocket realtime** — supaya update status
Nurse Station ↔ Doctor Queue benar-benar realtime lintas device (saat ini
masih simulasi di satu aplikasi yang sama menggunakan React state).

## Struktur Folder

```
simrs/
├── backend/           # FastAPI + SQLAlchemy (skeleton, belum ada endpoint RME)
│   ├── app/
│   │   ├── api/
│   │   ├── core/       # config.py, database.py
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── main.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/          # React + Vite + TypeScript + TailwindCSS
│   └── src/
│       ├── pages/       # Login, Dashboard, NurseStation, DoctorQueue, dll
│       ├── components/  # AppShell, StatusBadge, QueueToast, dll
│       ├── context/     # AuthContext, ClinicContext (state dummy)
│       ├── types/
│       └── data/        # dummy.ts — data contoh pasien & kunjungan
└── docker-compose.yml # backend + frontend + mysql + phpmyadmin
```

## Menjalankan Secara Lokal (tanpa Docker)

### Frontend saja (cukup untuk review UI/UX sekarang)

```bash
cd frontend
npm install
npm run dev
```

Buka `http://localhost:5173`. Di halaman login, klik salah satu kartu nama
staff untuk masuk sebagai role tersebut (admin, dokter, perawat, atau
apoteker) — ini mode demo, belum ada validasi password sungguhan.

### Backend (opsional, baru berupa skeleton)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

Cek `http://localhost:8000/health` — kalau muncul `{"status": "ok"}` berarti
backend sudah jalan (masih tanpa endpoint RME sungguhan).

## Menjalankan dengan Docker

```bash
docker compose up --build
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`
- phpMyAdmin: `http://localhost:8080` (login: user `simrs_user`, password
  `simrs_pass`, sesuai `docker-compose.yml`)

## Alur Pemakaian (dengan data dummy saat ini)

1. **Login** sebagai Perawat → buka **Nurse Station**
2. Pilih pasien dari antrian, isi tanda vital & catatan, klik **"Tandai Siap
   Diperiksa Dokter"**
3. **Login** sebagai Dokter (di tab/browser lain, atau logout dulu) → buka
   **Antrian Saya** — pasien tadi akan muncul otomatis di sana
4. Klik **"Mulai Periksa"** → isi anamnesis, diagnosis, tindakan → simpan
   atau buat resep
5. **Login** sebagai Apoteker → buka **Resep** untuk lihat resep yang perlu
   diserahkan

## Catatan untuk Tahap Selanjutnya

- Ganti isi `frontend/src/data/dummy.ts` dan `ClinicContext.tsx` dengan
  pemanggilan API asli ke backend setelah backend & database siap.
- Tambahkan model SQLAlchemy di `backend/app/models/` sesuai
  `frontend/src/types/index.ts` (Patient, Visit, VitalSign, dll) — struktur
  tipe di frontend sudah dirancang mengikuti kebutuhan data yang sama.
- Enkripsi kolom NIK dan nomor telepon sebelum disimpan ke MySQL.
- WebSocket ditambahkan di backend untuk broadcast event "pasien siap
  diperiksa" ke semua client dokter yang terhubung.
