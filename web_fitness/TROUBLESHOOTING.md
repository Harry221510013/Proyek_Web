# 🔧 Troubleshooting Firebase API Key

## Masalah: API key not valid

Jika Anda mendapatkan error:
```
❌ Registration failed: {"error":{"code":400,"message":"API key not valid. Please pass a valid API key."}}
```

## Solusi:

### 1. Periksa Firebase Console
Pastikan Anda sudah mengaktifkan layanan yang diperlukan:

1. **Buka Firebase Console**: https://console.firebase.google.com/
2. **Pilih project**: `booking-gym-mo`
3. **Aktifkan Authentication**:
   - Klik "Authentication" di sidebar
   - Klik tab "Sign-in method"
   - Aktifkan "Email/Password"
   - Klik "Save"

4. **Aktifkan Realtime Database**:
   - Klik "Realtime Database" di sidebar
   - Klik "Create Database"
   - Pilih region: **Asia-Southeast1 (Singapore)**
   - Pilih "Start in test mode" (untuk development)

### 2. Periksa API Key Restrictions
1. **Buka Google Cloud Console**: https://console.cloud.google.com/
2. **Pilih project**: `booking-gym-mo`
3. **Klik "APIs & Services" > "Credentials"**
4. **Cari API key**: `AIzaSyDMD2jUich1QWj14h-nkaIR_F7dlQBOqCc`
5. **Klik API key untuk edit**
6. **Pastikan "Application restrictions" adalah "None"** (untuk testing)
7. **Pastikan "API restrictions" mencakup**:
   - Firebase Authentication API
   - Firebase Realtime Database API
   - Identity Toolkit API

### 3. Test Koneksi
1. **Buka file**: `test-connection.html`
2. **Jalankan di browser**
3. **Coba registrasi dengan email baru**

### 4. Periksa Browser Console
Buka Developer Tools (F12) dan lihat tab Console untuk error detail.

### 5. Alternatif: Generate API Key Baru
Jika masih bermasalah:
1. **Buka Firebase Console**
2. **Klik ⚙️ > Project Settings**
3. **Scroll ke "Your apps"**
4. **Klik "Add app" > Web**
5. **Daftarkan app baru**
6. **Copy konfigurasi baru**
7. **Update `firebase-config.js`**

## Konfigurasi Database Rules
Pastikan database rules mengizinkan read/write:

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null",
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid || root.child('users').child(auth.uid).child('role').val() === 'admin'",
        ".write": "$uid === auth.uid || root.child('users').child(auth.uid).child('role').val() === 'admin'"
      }
    }
  }
}
```

## Langkah Testing
1. **Test koneksi**: Buka `test-connection.html`
2. **Test registrasi**: Gunakan email unik
3. **Test login**: Gunakan email yang sudah terdaftar
4. **Periksa database**: Lihat data di Firebase Console

## Kontak
Jika masih bermasalah, periksa:
- Network connection
- Browser cache (try incognito mode)
- Firebase service status 