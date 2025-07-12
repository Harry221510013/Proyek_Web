# 🚀 Deploy Website Gym Booking ke Firebase Hosting

## Prerequisites

### 1. Install Node.js
- Download dan install Node.js dari: https://nodejs.org/
- Versi minimum: Node.js 14 atau lebih baru

### 2. Install Firebase CLI
```bash
npm install -g firebase-tools
```

### 3. Login ke Firebase
```bash
firebase login
```

## Setup Firebase Hosting

### 1. Initialize Firebase Project
Di folder project (`web_fitness`), jalankan:

```bash
firebase init hosting
```

**Pilihan saat setup:**
- **Use an existing project**: Pilih `booking-gym-mo`
- **Public directory**: Ketik `.` (titik) untuk current directory
- **Configure as single-page app**: `No`
- **Set up automatic builds**: `No`
- **Overwrite index.html**: `No`

### 2. Konfigurasi Firebase Hosting
File `firebase.json` akan dibuat otomatis:

```json
{
  "hosting": {
    "public": ".",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### 3. File yang Akan Di-Deploy
Pastikan file-file ini ada di folder project:

**HTML Files:**
- `index.html` - Homepage
- `login.html` - Halaman login
- `signup.html` - Halaman registrasi
- `dashboard.html` - Dashboard user
- `admin-panel.html` - Panel admin

**JavaScript Files:**
- `firebase-config.js` - Konfigurasi Firebase
- `auth.js` - Authentication functions
- `gym-classes.js` - Gym classes management
- `bookings.js` - Booking system
- `dashboard.js` - Dashboard functions

**CSS Files:**
- `styles.css` - Styling website

**Testing Files (opsional):**
- `test-add-class.html`
- `create-admin.html`
- `fix-login.html`

## Deploy ke Firebase

### 1. Build & Deploy
```bash
firebase deploy --only hosting
```

### 2. Deploy dengan Preview (opsional)
```bash
firebase hosting:channel:deploy preview
```

## Konfigurasi Domain

### 1. Custom Domain (opsional)
Jika punya domain sendiri:
```bash
firebase hosting:sites:create your-domain
firebase target:apply hosting your-domain your-domain
firebase deploy --only hosting:your-domain
```

### 2. URL Default
Setelah deploy, website akan tersedia di:
```
https://booking-gym-mo.web.app
```
atau
```
https://booking-gym-mo.firebaseapp.com
```

## Security Rules untuk Production

### 1. Database Rules
Di Firebase Console → Realtime Database → Rules:

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

### 2. Authentication Settings
Di Firebase Console → Authentication → Settings:
- **Authorized domains**: Tambahkan domain hosting Anda
- **Email verification**: Aktifkan jika diperlukan

## Optimisasi untuk Production

### 1. Minify CSS/JS (opsional)
Install tools untuk minify:
```bash
npm install -g clean-css-cli uglify-js
```

Minify CSS:
```bash
cleancss -o styles.min.css styles.css
```

Minify JS:
```bash
uglifyjs auth.js gym-classes.js bookings.js -o scripts.min.js
```

### 2. Enable Compression
Tambahkan ke `firebase.json`:
```json
{
  "hosting": {
    "public": ".",
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

## Monitoring & Analytics

### 1. Google Analytics (opsional)
Tambahkan Google Analytics tracking code ke semua HTML files.

### 2. Firebase Performance Monitoring
Tambahkan ke HTML files:
```html
<script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-performance.js"></script>
```

## Commands Berguna

### Deploy Commands
```bash
# Deploy semua
firebase deploy

# Deploy hosting saja
firebase deploy --only hosting

# Deploy ke preview channel
firebase hosting:channel:deploy preview

# Lihat preview
firebase hosting:channel:open preview
```

### Management Commands
```bash
# Lihat project info
firebase projects:list

# Switch project
firebase use booking-gym-mo

# Lihat hosting sites
firebase hosting:sites:list

# Rollback deployment
firebase hosting:clone SOURCE_SITE_ID:SOURCE_CHANNEL_ID TARGET_SITE_ID:live
```

## Troubleshooting

### 1. Build Errors
- Pastikan semua file path benar
- Check console errors di browser
- Verifikasi Firebase config

### 2. Authentication Issues
- Pastikan domain hosting ditambahkan ke authorized domains
- Check Firebase Auth settings

### 3. Database Permission Errors
- Verifikasi database rules
- Check user authentication status

## Checklist Pre-Deploy

- [ ] Firebase project sudah dibuat
- [ ] Authentication enabled (Email/Password)
- [ ] Realtime Database created
- [ ] Database rules configured
- [ ] Admin user created
- [ ] Website tested locally
- [ ] All files ready for deployment

## Post-Deploy Testing

1. **Test Registration**: Buat akun baru
2. **Test Login**: Login dengan akun yang dibuat
3. **Test Admin**: Login sebagai admin, tambah kelas
4. **Test Booking**: User biasa booking kelas
5. **Test Responsive**: Check di mobile/tablet

## Estimated Costs

Firebase Hosting **GRATIS** untuk:
- 10 GB storage
- 360 MB/day transfer
- Custom domain support

Realtime Database **GRATIS** untuk:
- 1 GB storage
- 10 GB/month transfer

**Perfect untuk website gym booking!** 🎉

## Next Steps After Deploy

1. **Share URL** dengan users
2. **Create admin accounts** untuk gym staff
3. **Add gym classes** melalui admin panel
4. **Monitor usage** di Firebase Console
5. **Backup data** secara berkala

---

**Website gym booking Anda siap go live!** 🚀 