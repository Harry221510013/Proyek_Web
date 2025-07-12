# FitLife - Website Booking Gym dengan Firebase

Website booking gym yang fully functional dengan Firebase Realtime Database dan Authentication.

## Fitur Utama

### 🔐 Authentication
- Registrasi user baru
- Login/logout
- Manajemen profil user
- Role-based access (User & Admin)

### 📅 Manajemen Kelas
- **Create**: Tambah kelas baru (Admin)
- **Read**: Lihat semua kelas tersedia
- **Update**: Edit informasi kelas (Admin)
- **Delete**: Hapus kelas (Admin)

### 🎯 Sistem Booking
- **Create**: Book kelas gym
- **Read**: Lihat booking history
- **Update**: Update status booking (Admin)
- **Delete**: Cancel booking

### 👥 Manajemen User (Admin)
- Lihat semua user
- Update role user
- Statistik booking

## Setup Firebase

### 1. Buat Firebase Project
1. Buka [Firebase Console](https://console.firebase.google.com/)
2. Klik "Add project"
3. Masukkan nama project (contoh: "fitlife-gym")
4. Ikuti wizard setup

### 2. Setup Authentication
1. Di Firebase Console, pilih "Authentication"
2. Klik "Get started"
3. Pilih tab "Sign-in method"
4. Enable "Email/Password"

### 3. Setup Realtime Database
1. Di Firebase Console, pilih "Realtime Database"
2. Klik "Create Database"
3. Pilih lokasi (contoh: Singapore)
4. Pilih "Start in test mode" (untuk development)

### 4. Setup Web App
1. Di Firebase Console, klik ikon web (</>) di Project Overview
2. Masukkan nama app (contoh: "fitlife-web")
3. Copy konfigurasi Firebase

### 5. Update Konfigurasi
1. Buka file `firebase-config.js`
2. Ganti konfigurasi dengan yang Anda dapatkan dari Firebase:

```javascript
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-project-id.firebaseapp.com",
    databaseURL: "https://your-project-id-default-rtdb.firebaseio.com/",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
};
```

### 6. Setup Database Rules (Opsional)
Untuk keamanan production, update rules di Realtime Database:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid || root.child('users').child(auth.uid).child('role').val() === 'admin'",
        ".write": "$uid === auth.uid || root.child('users').child(auth.uid).child('role').val() === 'admin'"
      }
    },
    "classes": {
      ".read": "auth != null",
      ".write": "root.child('users').child(auth.uid).child('role').val() === 'admin'"
    },
    "bookings": {
      "$uid": {
        ".read": "$uid === auth.uid || root.child('users').child(auth.uid).child('role').val() === 'admin'",
        ".write": "$uid === auth.uid || root.child('users').child(auth.uid).child('role').val() === 'admin'"
      }
    }
  }
}
```

## Cara Menggunakan

### 1. Registrasi User Pertama
1. Buka `signup.html`
2. Daftar dengan email dan password
3. User pertama akan memiliki role "user"

### 2. Membuat Admin
Ada beberapa cara untuk membuat admin:

**Cara 1: Melalui Console Browser**
```javascript
// Buka browser console di halaman dashboard
import { makeUserAdmin } from './sample-data.js';
makeUserAdmin('USER_ID_DISINI');
```

**Cara 2: Manual di Firebase Console**
1. Buka Firebase Console > Realtime Database
2. Cari user di `/users/USER_ID`
3. Edit field `role` menjadi `"admin"`

### 3. Inisialisasi Data Sample
Untuk menambahkan kelas sample:
1. Buka file `sample-data.js`
2. Uncomment baris `initializeSampleData();`
3. Refresh halaman dashboard

### 4. Akses Admin Panel
1. Login sebagai admin
2. Buka `admin.html`
3. Kelola kelas, booking, dan user

## Struktur File

```
web_fitness/
├── index.html              # Halaman utama
├── login.html              # Halaman login
├── signup.html             # Halaman registrasi
├── dashboard.html          # Dashboard user
├── admin.html              # Panel admin
├── styles.css              # Stylesheet
├── firebase-config.js      # Konfigurasi Firebase
├── auth.js                 # Fungsi authentication
├── gym-classes.js          # CRUD kelas gym
├── bookings.js             # CRUD booking
├── dashboard.js            # Logic dashboard
├── admin.js                # Logic admin panel
├── sample-data.js          # Data sample
└── README-Firebase-Setup.md # Panduan setup
```

## Fitur CRUD Detail

### Kelas Gym
- ✅ **Create**: Admin dapat menambah kelas baru
- ✅ **Read**: Semua user dapat melihat kelas
- ✅ **Update**: Admin dapat edit kelas
- ✅ **Delete**: Admin dapat hapus kelas

### Booking
- ✅ **Create**: User dapat book kelas
- ✅ **Read**: User dapat lihat booking history
- ✅ **Update**: Admin dapat update status booking
- ✅ **Delete**: User dapat cancel booking

### User Management
- ✅ **Create**: Registrasi user baru
- ✅ **Read**: Admin dapat lihat semua user
- ✅ **Update**: User dapat update profil, Admin dapat update role
- ✅ **Delete**: (Tidak diimplementasi untuk keamanan)

## Real-time Features

- 📡 **Live Updates**: Perubahan data langsung terlihat tanpa refresh
- 🔄 **Auto Sync**: Data tersinkronisasi di semua device
- ⚡ **Instant Notifications**: Notifikasi real-time untuk booking

## Keamanan

- 🔐 **Authentication Required**: Semua fitur memerlukan login
- 👮 **Role-based Access**: Admin dan User memiliki akses berbeda
- 🛡️ **Data Validation**: Validasi input di frontend dan backend
- 🔒 **Secure Rules**: Database rules untuk proteksi data

## Troubleshooting

### Error "Firebase not defined"
- Pastikan Firebase SDK sudah di-load
- Cek konfigurasi di `firebase-config.js`

### Error "Permission denied"
- Pastikan user sudah login
- Cek role user untuk akses admin

### Data tidak muncul
- Cek koneksi internet
- Pastikan Firebase project aktif
- Cek console browser untuk error

## Development Tips

1. **Testing**: Gunakan Firebase Emulator untuk development
2. **Debugging**: Buka browser console untuk melihat log
3. **Performance**: Gunakan pagination untuk data besar
4. **Security**: Selalu validasi input user

## Support

Jika ada pertanyaan atau masalah:
1. Cek browser console untuk error
2. Pastikan Firebase konfigurasi benar
3. Cek Firebase Console untuk status project

---

**Selamat menggunakan FitLife! 💪🏋️‍♂️** 