// Gym Classes Management - Firebase v8 Compatible
// All functions will be available globally

// Create New Class
async function createGymClass(classData) {
    try {
        const database = window.firebaseDatabase;
        
        if (!database) {
            throw new Error('Firebase not initialized');
        }
        
        const classRef = database.ref('classes').push();
        const newClass = {
            id: classRef.key,
            ...classData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            participants: {},
            maxParticipants: classData.maxParticipants || 20,
            currentParticipants: 0
        };
        
        await classRef.set(newClass);
        return { success: true, classId: classRef.key, class: newClass };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Get All Classes
async function getAllClasses() {
    try {
        const database = window.firebaseDatabase;
        
        if (!database) {
            throw new Error('Firebase not initialized');
        }
        
        const snapshot = await database.ref('classes').once('value');
        
        if (snapshot.exists()) {
            const classes = [];
            snapshot.forEach((childSnapshot) => {
                classes.push(childSnapshot.val());
            });
            return { success: true, classes: classes };
        } else {
            return { success: true, classes: [] };
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Get Class by ID
async function getClassById(classId) {
    try {
        const database = window.firebaseDatabase;
        
        if (!database) {
            throw new Error('Firebase not initialized');
        }
        
        const snapshot = await database.ref('classes/' + classId).once('value');
        
        if (snapshot.exists()) {
            return { success: true, class: snapshot.val() };
        } else {
            return { success: false, error: 'Class not found' };
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Update Class
async function updateGymClass(classId, updateData) {
    try {
        const database = window.firebaseDatabase;
        
        if (!database) {
            throw new Error('Firebase not initialized');
        }
        
        const updatedData = {
            ...updateData,
            updatedAt: new Date().toISOString()
        };
        
        await database.ref('classes/' + classId).update(updatedData);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Delete Class
async function deleteGymClass(classId) {
    try {
        const database = window.firebaseDatabase;
        
        if (!database) {
            throw new Error('Firebase not initialized');
        }
        
        await database.ref('classes/' + classId).remove();
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Get Classes by Date
async function getClassesByDate(date) {
    try {
        const database = window.firebaseDatabase;
        
        if (!database) {
            throw new Error('Firebase not initialized');
        }
        
        const snapshot = await database.ref('classes').orderByChild('date').equalTo(date).once('value');
        
        if (snapshot.exists()) {
            const classes = [];
            snapshot.forEach((childSnapshot) => {
                classes.push(childSnapshot.val());
            });
            return { success: true, classes: classes };
        } else {
            return { success: true, classes: [] };
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Listen to Classes Changes (Real-time)
function listenToClasses(callback) {
    const database = window.firebaseDatabase;
    
    if (!database) {
        console.error('Firebase not initialized');
        return null;
    }
    
    const classesRef = database.ref('classes');
    
    const listener = classesRef.on('value', (snapshot) => {
        const classes = [];
        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                classes.push(childSnapshot.val());
            });
        }
        callback(classes);
    });
    
    return listener;
}

// Stop listening to Classes Changes
function stopListeningToClasses(listener) {
    const database = window.firebaseDatabase;
    if (database && listener) {
        database.ref('classes').off('value', listener);
    }
}

// Make functions available globally
window.createGymClass = createGymClass;
window.getAllClasses = getAllClasses;
window.getClassById = getClassById;
window.updateGymClass = updateGymClass;
window.deleteGymClass = deleteGymClass;
window.getClassesByDate = getClassesByDate;
window.listenToClasses = listenToClasses;
window.stopListeningToClasses = stopListeningToClasses; 