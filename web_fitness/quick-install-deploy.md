# 🚀 Quick Install & Deploy - Website Gym Booking

## 1️⃣ INSTALL NODE.JS (5 MENIT)

### Download & Install:
1. **Buka:** https://nodejs.org/
2. **Download:** LTS version (Recommended)
3. **Install:** Jalankan file .msi yang didownload
4. **Next → Next → Install** (gunakan default settings)
5. **Restart Command Prompt** setelah install

### Verifikasi Install:
```bash
node --version
npm --version
```

## 2️⃣ INSTALL FIREBASE CLI (2 MENIT)

```bash
npm install -g firebase-tools
```

## 3️⃣ LOGIN KE FIREBASE (1 MENIT)

```bash
firebase login
```
- Browser akan terbuka
- Login dengan akun Google yang sama dengan Firebase Console
- Klik "Allow" untuk authorize

## 4️⃣ DEPLOY WEBSITE (1 MENIT)

### Opsi A: Gunakan Script Otomatis
```bash
# Double-click file deploy.bat
# atau jalankan di command prompt:
deploy.bat
```

### Opsi B: Manual Commands
```bash
# Initialize Firebase (hanya sekali)
firebase init hosting

# Pilihan saat setup:
# - Use existing project: booking-gym-mo
# - Public directory: . (titik)
# - Single-page app: No
# - Overwrite index.html: No

# Deploy website
firebase deploy --only hosting
```

## 5️⃣ WEBSITE LIVE! 🎉

Setelah deploy berhasil, website akan tersedia di:
- **https://booking-gym-mo.web.app**
- **https://booking-gym-mo.firebaseapp.com**

## 📋 CHECKLIST DEPLOY:

- [ ] Node.js terinstall
- [ ] Firebase CLI terinstall
- [ ] Login ke Firebase
- [ ] Initialize Firebase project
- [ ] Deploy website
- [ ] Test website live

## 🔧 JIKA ADA ERROR:

### Error: "firebase command not found"
```bash
# Restart command prompt dan coba lagi
npm install -g firebase-tools
```

### Error: "Permission denied"
```bash
# Jalankan sebagai Administrator
# Klik kanan Command Prompt → Run as Administrator
npm install -g firebase-tools
```

### Error: "Project not found"
```bash
# Pastikan project name benar
firebase use booking-gym-mo
```

## 🎯 TOTAL WAKTU: 9 MENIT

1. Install Node.js: 5 menit
2. Install Firebase CLI: 2 menit
3. Login Firebase: 1 menit
4. Deploy website: 1 menit

**Website gym booking Anda akan online dalam 9 menit!** 🚀

## 📱 SETELAH DEPLOY:

### Test Website:
1. **Homepage:** https://booking-gym-mo.web.app
2. **Login:** https://booking-gym-mo.web.app/login
3. **Register:** https://booking-gym-mo.web.app/signup
4. **Admin Panel:** https://booking-gym-mo.web.app/admin

### Buat Admin User:
1. Buka: https://booking-gym-mo.web.app/create-admin.html
2. Buat akun admin pertama
3. Login ke admin panel

### Tambah Kelas Gym:
1. Login sebagai admin
2. Buka admin panel
3. Tambah kelas gym baru
4. Set jadwal dan kapasitas

### Test User Flow:
1. Register sebagai user biasa
2. Login ke dashboard
3. Booking kelas yang tersedia
4. Lihat booking history

---

**Siap deploy? Ikuti langkah-langkah di atas!** 💪 