@echo off
echo ========================================
echo   🚀 Firebase Deploy Script - FitLife
echo ========================================
echo.

:: Check if Firebase CLI is installed
firebase --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Firebase CLI not installed!
    echo Please run: npm install -g firebase-tools
    pause
    exit /b 1
)

echo ✅ Firebase CLI detected
echo.

:: Check if user is logged in
firebase projects:list >nul 2>&1
if %errorlevel% neq 0 (
    echo 🔐 Please login to Firebase first...
    firebase login
    if %errorlevel% neq 0 (
        echo ❌ Login failed!
        pause
        exit /b 1
    )
)

echo ✅ Firebase authentication OK
echo.

:: Check if firebase.json exists
if not exist "firebase.json" (
    echo 📝 Initializing Firebase Hosting...
    firebase init hosting
    if %errorlevel% neq 0 (
        echo ❌ Firebase init failed!
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
echo 🔍 Files to be deployed:
dir /b *.html *.js *.css

echo.
set /p confirm="Deploy to Firebase Hosting? (y/n): "
if /i not "%confirm%"=="y" (
    echo ❌ Deployment cancelled
    pause
    exit /b 0
)

echo.
echo 🚀 Deploying to Firebase Hosting...
firebase deploy --only hosting

if %errorlevel% equ 0 (
    echo.
    echo ✅ Deployment successful!
    echo.
    echo 🌐 Your website is live at:
    echo https://booking-gym-mo.web.app
    echo https://booking-gym-mo.firebaseapp.com
    echo.
    echo 📱 Test your website:
    echo 1. Registration & Login
    echo 2. Admin panel (admin-panel.html)
    echo 3. User dashboard
    echo 4. Booking system
    echo.
) else (
    echo ❌ Deployment failed!
    echo Check the error messages above
)

echo.
pause 