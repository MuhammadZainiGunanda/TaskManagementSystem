# Task Management System API

## Description
TaskManagementSystem adalah RESTful API yang memungkinkan pengguna untuk mengelola tugas dan profil mereka dengan efisien dan aman. API ini menyediakan fungsionalitas lengkap untuk manajemen pengguna dan tugas, termasuk pendaftaran, autentikasi, pengelolaan profil, dan berbagai operasi terkait tugas. Setiap endpoint didokumentasikan dengan baik dalam format OpenAPI.

## Key Features

### User Management API
- **Register:** Daftarkan pengguna baru.
- **Login:** Autentikasi pengguna dan dapatkan token JWT.
- **Get Profile:** Ambil informasi profil pengguna.
- **Update Profile:** Perbarui detail profil pengguna.
- **Change Password:** Ubah kata sandi pengguna.

### Task Management API
- **Create Taks:** Buat tugas baru.
- **Get All Tasks:** Ambil semua tugas pengguna.
- **Get Task By ID:** Ambil detail tugas berdasarkan ID.
- **Update Task:** Perbarui detail tugas.
- **Delete Tasks:** Hapus tugas berdasarkan ID.
- **Filter Tasks:** Filter tugas berdasarkan status tertentu.
- **Sorting Tasks:** Urutkan tugas berdasarkan kriteria tertentu.
- **Assign Tasks:** Tugaskan tugas kepada pengguna dengan ID tertentu.



## Development requirements
Jika developer ingin menjalankan dan merevisi source code perlu dilakukan langkah-langkah berikut:

### Technical Requirements
    - Languages: TypeScript
    - Frameworks: Express, Prisma, Zod, Jest, JSONwebtoken, Cookieparser, Bcrypt

### Running the Application

    git clone https://github.com/MuhammadZainiGunanda/TaskManagementSystem.git

### Set Up

     - `npm install` untuk menginstal dependensi back-end.

     - `npx prisma migrate dev` untuk melakukan migrasi basis data dengan Prisma.

     - `npx prisma generate`untuk genereate kode Prisma.

     - `npm run build` untuk membangun proyek.
     
     - `npm run start` untuk memulai server.