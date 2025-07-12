// Authentication Functions
// Firebase references will be available globally after firebase-config.js loads

// Register User
async function registerUser(email, password, fullName) {
    try {
        const auth = window.firebaseAuth;
        const database = window.firebaseDatabase;
        
        if (!auth || !database) {
            throw new Error('Firebase not initialized');
        }
        
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Update profile with display name
        await user.updateProfile({
            displayName: fullName
        });
        
        // Save user data to database
        await database.ref('users/' + user.uid).set({
            uid: user.uid,
            email: email,
            fullName: fullName,
            role: 'user',
            createdAt: new Date().toISOString(),
            bookings: {}
        });
        
        return { success: true, user: user };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Login User
async function loginUser(email, password) {
    try {
        const auth = window.firebaseAuth;
        const database = window.firebaseDatabase;
        
        if (!auth || !database) {
            throw new Error('Firebase not initialized');
        }
        
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Get user data from database
        const snapshot = await database.ref('users/' + user.uid).once('value');
        const userData = snapshot.val();
        
        return { success: true, user: user, userData: userData };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Logout User
async function logoutUser() {
    try {
        const auth = window.firebaseAuth;
        
        if (!auth) {
            throw new Error('Firebase not initialized');
        }
        
        await auth.signOut();
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Check Authentication State
function checkAuthState(callback) {
    const auth = window.firebaseAuth;
    
    if (!auth) {
        console.error('Firebase not initialized');
        return;
    }
    
    return auth.onAuthStateChanged(callback);
}

// Get Current User Data
async function getCurrentUserData() {
    const auth = window.firebaseAuth;
    const database = window.firebaseDatabase;
    
    if (!auth || !database) {
        console.error('Firebase not initialized');
        return null;
    }
    
    const user = auth.currentUser;
    if (user) {
        const snapshot = await database.ref('users/' + user.uid).once('value');
        return snapshot.val();
    }
    return null;
}

// Update User Profile
async function updateUserProfile(userData) {
    const auth = window.firebaseAuth;
    const database = window.firebaseDatabase;
    
    if (!auth || !database) {
        return { success: false, error: 'Firebase not initialized' };
    }
    
    const user = auth.currentUser;
    if (user) {
        try {
            await database.ref('users/' + user.uid).set({
                ...userData,
                uid: user.uid,
                updatedAt: new Date().toISOString()
            });
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    return { success: false, error: 'User not authenticated' };
}

// Make functions available globally
window.registerUser = registerUser;
window.loginUser = loginUser;
window.logoutUser = logoutUser;
window.checkAuthState = checkAuthState;
window.getCurrentUserData = getCurrentUserData;
window.updateUserProfile = updateUserProfile; 