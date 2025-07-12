# 🚨 URGENT: Database Not Connected - Setup Firebase Database

## Status: Database belum dibuat di Firebase Console

### LANGKAH 1: Buka Firebase Console
1. **Buka browser** dan kunjungi: https://console.firebase.google.com/
2. **Login** dengan akun Google yang sama dengan project ini
3. **Pilih project**: `booking-gym-mo`

### LANGKAH 2: Buat Realtime Database
1. **Di sidebar kiri**, cari dan klik **"Realtime Database"**
2. **Klik tombol "Create Database"** (tombol biru besar)
3. **PENTING - Pilih lokasi database**:
   - Pilih **"Asia-Southeast1 (Singapore)"**
   - JANGAN pilih lokasi lain!
4. **Pilih Security Rules**:
   - Pilih **"Start in test mode"**
   - Klik **"Enable"**

### LANGKAH 3: Verifikasi Database URL
Setelah database dibuat, pastikan URL yang muncul adalah:
```
https://booking-gym-mo-default-rtdb.asia-southeast1.firebasedatabase.app/
```

### LANGKAH 4: Test Koneksi
1. **Buka file**: `test-database.html` di browser
2. **Tunggu 2-3 detik** untuk auto-test
3. **Klik "Test Database Connection"**
4. **Hasil yang diharapkan**: "Database connection established"

### LANGKAH 5: Jika masih "Database not connected"
1. **Refresh halaman** test-database.html
2. **Tunggu 2-3 menit** untuk propagasi database
3. **Coba lagi** test koneksi

### LANGKAH 6: Setup Database Rules (Opsional untuk testing)
1. **Di Firebase Console**, klik tab **"Rules"**
2. **Ganti rules** dengan:
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```
3. **Klik "Publish"**

⚠️ **CATATAN**: Rules di atas hanya untuk testing. Jangan gunakan di production!

### Troubleshooting

#### Jika database URL berbeda:
1. **Copy URL yang benar** dari Firebase Console
2. **Edit file** `firebase-config.js`
3. **Ganti baris** `databaseURL: "..."`
4. **Refresh browser**

#### Jika region database salah:
1. **Hapus database** yang sudah dibuat
2. **Buat ulang** dengan region Asia-Southeast1
3. **Test lagi**

#### Jika masih error:
1. **Screenshot** Firebase Console (bagian Realtime Database)
2. **Screenshot** browser console error
3. **Berikan info** untuk troubleshooting lanjutan

### Checklist Setup
- [ ] Login ke Firebase Console
- [ ] Pilih project booking-gym-mo
- [ ] Klik Realtime Database
- [ ] Klik Create Database
- [ ] Pilih Asia-Southeast1
- [ ] Pilih Start in test mode
- [ ] Klik Enable
- [ ] Verifikasi URL database
- [ ] Test dengan test-database.html
- [ ] Hasil: "Database connection established"

### Setelah Database Berhasil Dibuat
1. **Test website utama**: `index.html` → `login.html` → `dashboard.html`
2. **Coba registrasi** user baru
3. **Coba login** dan akses dashboard
4. **Verifikasi** booking system berfungsi

### Bantuan Tambahan
Jika masih ada masalah, berikan informasi:
- Screenshot Firebase Console
- Screenshot error di browser console
- Hasil test dari test-database.html 