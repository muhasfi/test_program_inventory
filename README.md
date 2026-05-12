### 🔧 Backend (Laravel API)

# 1. Install dependencies

composer install

# 2. Salin file environment

cp .env.example .env

# 3. Generate app key

php artisan key:generate

# 4. Sesuaikan konfigurasi database di .env

DB_DATABASE=
DB_USERNAME=root
DB_PASSWORD=

# 5. Install Sanctum

php artisan install:api

# 6. Jalankan migration + seeder

php artisan migrate --seed

# 7. Jalankan server

php artisan serve

# API berjalan di: http://localhost:8000

### 🌐 Frontend (Angular)

# 1. Install dependencies

npm install

# 2. Jalankan development server

ng serve

# App berjalan di: http://localhost:4200

## 🔑 Akun Default

| Field    | Value           |
| -------- | --------------- |
| Email    | admin@gmail.com |
| Password | password        |
