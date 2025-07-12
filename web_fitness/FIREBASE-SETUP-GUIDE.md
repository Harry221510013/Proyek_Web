# 🔥 Panduan Setup Firebase - Mengatasi Error API Key

## Error Yang Terjadi
```
POST https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyDMD2jUich1QWj14h-nkaIR_F7dlQBOqCc 400 (Bad Request)
```

## Langkah-Langkah Penyelesaian

### 1. Buka Firebase Console
1. Kunjungi: https://console.firebase.google.com/
2. Pilih project: **booking-gym-mo**
3. Jika belum ada project, buat project baru

### 2. Aktifkan Firebase Authentication
1. **Klik "Authentication" di sidebar kiri**
2. **Klik "Get Started" jika belum diaktifkan**
3. **Klik tab "Sign-in method"**
4. **Aktifkan "Email/Password"**:
   - Klik pada "Email/Password"
   - Toggle "Enable" menjadi ON
   - Klik "Save"

### 3. Buat/Periksa Realtime Database
1. **Klik "Realtime Database" di sidebar kiri**
2. **Klik "Create Database"**
3. **Pilih region: "Asia-Southeast1 (Singapore)"**
4. **Pilih "Start in test mode"** (untuk development)
5. **Klik "Enable"**

### 4. Konfigurasi Database Rules
Pastikan rules database seperti ini:
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

### 5. Periksa Web App Configuration
1. **Klik ⚙️ (Settings) > Project Settings**
2. **Scroll ke "Your apps"**
3. **Jika belum ada Web App, klik "Add app" > Web**
4. **Masukkan nickname: "Gym Booking Web"**
5. **Centang "Also set up Firebase Hosting"**
6. **Klik "Register app"**
7. **Copy konfigurasi Firebase**

### 6. Periksa API Key di Google Cloud Console
1. **Buka**: https://console.cloud.google.com/
2. **Pilih project**: booking-gym-mo
3. **Klik "APIs & Services" > "Credentials"**
4. **Cari API key**: AIzaSyDMD2jUich1QWj14h-nkaIR_F7dlQBOqCc
5. **Klik API key untuk edit**
6. **Pastikan konfigurasi berikut**:

#### Application restrictions:
- **Set ke "None"** (untuk testing)
- Atau **"HTTP referrers"** dan tambahkan:
  - `http://localhost:*`
  - `https://yourdomain.com/*`

#### API restrictions:
- **Pastikan "Don't restrict key"** ATAU
- **Restrict key** dan pilih APIs berikut:
  - Identity Toolkit API
  - Firebase Authentication API
  - Firebase Realtime Database API

### 7. Enable Required APIs
1. **Di Google Cloud Console**
2. **Klik "APIs & Services" > "Library"**
3. **Cari dan enable APIs berikut**:
   - **Identity Toolkit API**
   - **Firebase Authentication API**
   - **Firebase Realtime Database API**

### 8. Test Konfigurasi
1. **Buka file**: `test-connection.html`
2. **Jalankan di browser**
3. **Buka Developer Tools (F12)**
4. **Coba registrasi dengan email baru**
5. **Periksa Console untuk error**

### 9. Troubleshooting Tambahan

#### Jika masih error 400:
1. **Tunggu 5-10 menit** setelah mengaktifkan services
2. **Clear browser cache** atau gunakan incognito mode
3. **Periksa Network tab** di Developer Tools untuk detail error

#### Jika error "Project not found":
1. **Pastikan Project ID benar**: `booking-gym-mo`
2. **Pastikan API key dari project yang sama**

#### Jika error "Service not enabled":
1. **Kembali ke Firebase Console**
2. **Pastikan Authentication sudah enabled**
3. **Pastikan Database sudah created**

### 10. Konfigurasi Firebase yang Benar
Pastikan file `firebase-config.js` berisi:
```javascript
const firebaseConfig = {
    apiKey: "AIzaSyDMD2jUich1QWj14h-nkaIR_F7dlQBOqCc",
    authDomain: "booking-gym-mo.firebaseapp.com",
    databaseURL: "https://booking-gym-mo-default-rtdb.asia-southeast1.firebasedatabase.app/",
    projectId: "booking-gym-mo",
    storageBucket: "booking-gym-mo.firebasestorage.app",
    messagingSenderId: "977848860115",
    appId: "1:977848860115:web:b6ee470443876ff904326"
};
```

## Checklist Verifikasi
- [ ] Firebase Authentication enabled
- [ ] Email/Password sign-in method enabled
- [ ] Realtime Database created di region Asia-Southeast1
- [ ] Database rules configured
- [ ] Web app registered di Firebase
- [ ] API key tidak restricted atau configured correctly
- [ ] Required APIs enabled di Google Cloud Console
- [ ] Test connection berhasil

## Bantuan Tambahan
Jika masih mengalami masalah:
1. Screenshot error message lengkap
2. Periksa Network tab di Developer Tools
3. Pastikan tidak ada typo di API key
4. Coba dengan browser berbeda atau incognito mode

## Kontak Support
- Firebase Support: https://firebase.google.com/support/
- Google Cloud Support: https://cloud.google.com/support/ 