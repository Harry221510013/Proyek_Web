@echo off
echo ========================================
echo   🚀 AUTO INSTALL & DEPLOY - FitLife
echo ========================================
echo.

:: Check if Node.js is installed
echo 🔍 Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js tidak ditemukan!
    echo.
    echo 📥 Silakan install Node.js terlebih dahulu:
    echo 1. Buka: https://nodejs.org/
    echo 2. Download LTS version
    echo 3. Install dengan default settings
    echo 4. Restart command prompt
    echo 5. Jalankan script ini lagi
    echo.
    echo 🔗 Membuka website Node.js...
    start https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js terdeteksi
node --version
echo.

:: Check if Firebase CLI is installed
echo 🔍 Checking Firebase CLI...
firebase --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 📦 Installing Firebase CLI...
    echo Ini akan memakan waktu 1-2 menit...
    npm install -g firebase-tools
    if %errorlevel% neq 0 (
        echo ❌ Firebase CLI install gagal!
        echo Coba jalankan sebagai Administrator
        pause
        exit /b 1
    )
    echo ✅ Firebase CLI berhasil diinstall
) else (
    echo ✅ Firebase CLI sudah terinstall
)

firebase --version
echo.

:: Check if user is logged in
echo 🔐 Checking Firebase login...
firebase projects:list >nul 2>&1
if %errorlevel% neq 0 (
    echo 🔑 Please login to Firebase...
    echo Browser akan terbuka untuk login
    firebase login
    if %errorlevel% neq 0 (
        echo ❌ Login gagal!
        pause
        exit /b 1
    )
)

echo ✅ Firebase login OK
echo.

:: Check if firebase.json exists
if not exist "firebase.json" (
    echo 📝 Initializing Firebase project...
    echo.
    echo PILIHAN SETUP:
    echo - Use existing project: booking-gym-mo
    echo - Public directory: . (titik)
    echo - Single-page app: No
    echo - Overwrite index.html: No
    echo.
    firebase init hosting
    if %errorlevel% neq 0 (
        echo ❌ Firebase init gagal!
        pause
        exit /b 1
    )
)

echo ✅ Firebase project configured
echo.

:: Show current project
echo 📋 Current Firebase project:
firebase use
echo.

:: Show files to deploy
echo 🔍 Files yang akan di-deploy:
echo.
dir /b *.html *.js *.css 2>nul
echo.

:: Confirm deployment
set /p confirm="🚀 Deploy website ke Firebase Hosting? (y/n): "
if /i not "%confirm%"=="y" (
    echo ❌ Deployment dibatalkan
    pause
    exit /b 0
)

echo.
echo 🚀 Deploying website...
echo Mohon tunggu...
firebase deploy --only hosting

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo   🎉 DEPLOYMENT BERHASIL!
    echo ========================================
    echo.
    echo 🌐 Website Anda sudah LIVE di:
    echo   https://booking-gym-mo.web.app
    echo   https://booking-gym-mo.firebaseapp.com
    echo.
    echo 📱 Test website Anda:
    echo   1. Homepage: https://booking-gym-mo.web.app
    echo   2. Login: https://booking-gym-mo.web.app/login
    echo   3. Register: https://booking-gym-mo.web.app/signup
    echo   4. Admin Panel: https://booking-gym-mo.web.app/admin
    echo.
    echo 🔧 Langkah selanjutnya:
    echo   1. Buat admin user pertama
    echo   2. Tambah kelas gym
    echo   3. Test booking system
    echo.
    echo 🎯 Membuka website...
    start https://booking-gym-mo.web.app
) else (
    echo.
    echo ❌ Deployment gagal!
    echo Periksa error messages di atas
    echo.
    echo 🔧 Troubleshooting:
    echo - Pastikan internet connection stabil
    echo - Coba jalankan: firebase login
    echo - Coba jalankan: firebase use booking-gym-mo
)

echo.
pause 