# FANB Backend API

Backend API untuk aplikasi FANB (Focus Arrange Notify Balance) - Aplikasi manajemen tugas dan produktivitas.

## Teknologi yang Digunakan

- Node.js
- Express.js
- MongoDB (dengan Mongoose)
- JWT Authentication
- Winston (logging)

## Struktur Proyek

```
backend/
├── src/
│   ├── config/         # Konfigurasi aplikasi
│   ├── controllers/    # Controller untuk menangani request
│   ├── middlewares/    # Middleware Express
│   ├── models/         # Model Mongoose
│   ├── routes/         # Definisi route API
│   ├── services/       # Business logic
│   ├── utils/          # Utility functions
│   ├── validation/     # Skema validasi
│   └── server.js       # Entry point aplikasi
├── logs/               # Log aplikasi
├── uploads/            # File upload
├── .env                # Environment variables
├── .gitignore
├── package.json
└── README.md
```

## Setup dan Instalasi

1. Clone repository
2. Install dependencies:
   ```
   npm install
   ```
3. Buat file `.env` berdasarkan `.env.example`
4. Jalankan server:
   ```
   npm run dev
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register user baru
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Mendapatkan data user yang login
- `POST /api/auth/refresh` - Refresh token

### Tasks

- `GET /api/tasks` - Mendapatkan semua tugas
- `GET /api/tasks/:id` - Mendapatkan detail tugas
- `POST /api/tasks` - Membuat tugas baru
- `PUT /api/tasks/:id` - Mengupdate tugas
- `DELETE /api/tasks/:id` - Menghapus tugas
- `GET /api/tasks/stats` - Mendapatkan statistik tugas

## Scripts

- `npm start` - Menjalankan server di mode production
- `npm run dev` - Menjalankan server dengan nodemon (development)
- `npm test` - Menjalankan test
- `npm run lint` - Menjalankan linting
- `npm run db:seed` - Mengisi database dengan data dummy 