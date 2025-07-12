// Bookings Management
// Firebase references will be available globally after firebase-config.js loads

// Create New Booking
async function createBooking(classId, userId, bookingData) {
    try {
        const auth = window.firebaseAuth;
        const database = window.firebaseDatabase;
        
        if (!auth || !database) {
            throw new Error('Firebase not initialized');
        }
        
        const user = auth.currentUser;
        if (!user) {
            return { success: false, error: 'User not authenticated' };
        }

        // Check if class exists and has available slots
        const classSnapshot = await database.ref('classes/' + classId).once('value');
        
        if (!classSnapshot.exists()) {
            return { success: false, error: 'Class not found' };
        }
        
        const classData = classSnapshot.val();
        if (classData.currentParticipants >= classData.maxParticipants) {
            return { success: false, error: 'Class is full' };
        }

        // Check if user already booked this class
        const existingBookingSnapshot = await database.ref(`bookings/${user.uid}/${classId}`).once('value');
        
        if (existingBookingSnapshot.exists()) {
            return { success: false, error: 'You have already booked this class' };
        }

        // Create booking
        const newBooking = {
            id: classId,
            userId: user.uid,
            classId: classId,
            className: classData.name,
            classDate: classData.date,
            classTime: classData.time,
            trainer: classData.trainer,
            status: 'confirmed',
            bookingDate: new Date().toISOString(),
            ...bookingData
        };

        await database.ref(`bookings/${user.uid}/${classId}`).set(newBooking);

        // Update class participants
        await database.ref('classes/' + classId).update({
            currentParticipants: classData.currentParticipants + 1,
            [`participants/${user.uid}`]: {
                userId: user.uid,
                userName: user.displayName || user.email,
                bookingDate: new Date().toISOString()
            }
        });

        return { success: true, booking: newBooking };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Get User Bookings
async function getUserBookings(userId) {
    try {
        const database = window.firebaseDatabase;
        
        if (!database) {
            throw new Error('Firebase not initialized');
        }
        
        const snapshot = await database.ref(`bookings/${userId}`).once('value');
        
        if (snapshot.exists()) {
            const bookings = [];
            snapshot.forEach((childSnapshot) => {
                bookings.push(childSnapshot.val());
            });
            return { success: true, bookings: bookings };
        } else {
            return { success: true, bookings: [] };
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Get All Bookings (Admin)
async function getAllBookings() {
    try {
        const database = window.firebaseDatabase;
        
        if (!database) {
            throw new Error('Firebase not initialized');
        }
        
        const snapshot = await database.ref('bookings').once('value');
        
        if (snapshot.exists()) {
            const allBookings = [];
            snapshot.forEach((userSnapshot) => {
                userSnapshot.forEach((bookingSnapshot) => {
                    allBookings.push(bookingSnapshot.val());
                });
            });
            return { success: true, bookings: allBookings };
        } else {
            return { success: true, bookings: [] };
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Cancel Booking
async function cancelBooking(classId, userId) {
    try {
        const auth = window.firebaseAuth;
        const database = window.firebaseDatabase;
        
        if (!auth || !database) {
            throw new Error('Firebase not initialized');
        }
        
        const user = auth.currentUser;
        if (!user || (user.uid !== userId && !await isAdmin(user.uid))) {
            return { success: false, error: 'Unauthorized' };
        }

        // Get booking details
        const bookingSnapshot = await database.ref(`bookings/${userId}/${classId}`).once('value');
        
        if (!bookingSnapshot.exists()) {
            return { success: false, error: 'Booking not found' };
        }

        // Remove booking
        await database.ref(`bookings/${userId}/${classId}`).remove();

        // Update class participants
        const classSnapshot = await database.ref('classes/' + classId).once('value');
        
        if (classSnapshot.exists()) {
            const classData = classSnapshot.val();
            await database.ref('classes/' + classId).update({
                currentParticipants: Math.max(0, classData.currentParticipants - 1),
                [`participants/${userId}`]: null
            });
        }

        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Update Booking Status
async function updateBookingStatus(classId, userId, status) {
    try {
        const auth = window.firebaseAuth;
        const database = window.firebaseDatabase;
        
        if (!auth || !database) {
            throw new Error('Firebase not initialized');
        }
        
        const user = auth.currentUser;
        if (!user || !await isAdmin(user.uid)) {
            return { success: false, error: 'Unauthorized - Admin access required' };
        }

        await database.ref(`bookings/${userId}/${classId}`).update({
            status: status,
            updatedAt: new Date().toISOString()
        });

        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Get Bookings by Class
async function getBookingsByClass(classId) {
    try {
        const database = window.firebaseDatabase;
        
        if (!database) {
            throw new Error('Firebase not initialized');
        }
        
        const snapshot = await database.ref('bookings').once('value');
        
        if (snapshot.exists()) {
            const classBookings = [];
            snapshot.forEach((userSnapshot) => {
                userSnapshot.forEach((bookingSnapshot) => {
                    const booking = bookingSnapshot.val();
                    if (booking.classId === classId) {
                        classBookings.push(booking);
                    }
                });
            });
            return { success: true, bookings: classBookings };
        } else {
            return { success: true, bookings: [] };
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Get Bookings by Date Range
async function getBookingsByDateRange(startDate, endDate, userId = null) {
    try {
        const database = window.firebaseDatabase;
        
        if (!database) {
            throw new Error('Firebase not initialized');
        }
        
        const bookingsRef = userId ? `bookings/${userId}` : 'bookings';
        const snapshot = await database.ref(bookingsRef).once('value');
        
        if (snapshot.exists()) {
            const bookings = [];
            
            if (userId) {
                snapshot.forEach((childSnapshot) => {
                    const booking = childSnapshot.val();
                    if (booking.classDate >= startDate && booking.classDate <= endDate) {
                        bookings.push(booking);
                    }
                });
            } else {
                snapshot.forEach((userSnapshot) => {
                    userSnapshot.forEach((bookingSnapshot) => {
                        const booking = bookingSnapshot.val();
                        if (booking.classDate >= startDate && booking.classDate <= endDate) {
                            bookings.push(booking);
                        }
                    });
                });
            }
            
            return { success: true, bookings: bookings };
        } else {
            return { success: true, bookings: [] };
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Listen to User Bookings (Real-time)
function listenToUserBookings(userId, callback) {
    const database = window.firebaseDatabase;
    
    if (!database) {
        console.error('Firebase not initialized');
        return null;
    }
    
    return database.ref(`bookings/${userId}`).on('value', (snapshot) => {
        const bookings = [];
        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                bookings.push(childSnapshot.val());
            });
        }
        callback(bookings);
    });
}

// Helper function to check if user is admin
async function isAdmin(userId) {
    try {
        const database = window.firebaseDatabase;
        
        if (!database) {
            return false;
        }
        
        const snapshot = await database.ref(`users/${userId}`).once('value');
        if (snapshot.exists()) {
            const userData = snapshot.val();
            return userData.role === 'admin';
        }
        return false;
    } catch (error) {
        return false;
    }
}

// Make functions available globally
window.createBooking = createBooking;
window.getUserBookings = getUserBookings;
window.getAllBookings = getAllBookings;
window.cancelBooking = cancelBooking;
window.updateBookingStatus = updateBookingStatus;
window.getBookingsByClass = getBookingsByClass;
window.getBookingsByDateRange = getBookingsByDateRange;
window.listenToUserBookings = listenToUserBookings; 