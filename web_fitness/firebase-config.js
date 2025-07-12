// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDMD2jUich1QWj14h-nkaIR_F7dlQBOqCc",
    authDomain: "booking-gym-mo.firebaseapp.com",
    databaseURL: "https://booking-gym-mo-default-rtdb.asia-southeast1.firebasedatabase.app/",
    projectId: "booking-gym-mo",
    storageBucket: "booking-gym-mo.firebasestorage.app",
    messagingSenderId: "977848860115",
    appId: "1:977848860115:web:b6ee470443876ff904326",
    measurementId: "G-G8JJ7KPVCF"
};

// Initialize Firebase (will be available globally after Firebase SDK loads)
let app, auth, database;

// Initialize Firebase when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (typeof firebase !== 'undefined') {
        // Initialize Firebase
        app = firebase.initializeApp(firebaseConfig);
        auth = firebase.auth();
        database = firebase.database();
        
        // Make available globally
        window.firebaseApp = app;
        window.firebaseAuth = auth;
        window.firebaseDatabase = database;
        
        console.log('Firebase initialized successfully');
    } else {
        console.error('Firebase SDK not loaded');
    }
});

// Export for compatibility (will be undefined until Firebase loads)
window.getFirebaseAuth = () => window.firebaseAuth;
window.getFirebaseDatabase = () => window.firebaseDatabase;
window.getFirebaseApp = () => window.firebaseApp; 