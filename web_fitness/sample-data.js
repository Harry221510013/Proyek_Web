// Sample Data Initializer
import { database } from './firebase-config.js';
import { ref, set, get } from 'firebase/database';
import { createGymClass } from './gym-classes.js';

// Sample Classes Data
const sampleClasses = [
    {
        name: "Morning Yoga",
        category: "yoga",
        date: "2024-01-15",
        time: "07:00",
        duration: 60,
        trainer: "Sarah Johnson",
        maxParticipants: 15,
        description: "Mulai hari Anda dengan yoga yang menenangkan. Cocok untuk semua level."
    },
    {
        name: "HIIT Cardio Blast",
        category: "cardio",
        date: "2024-01-15",
        time: "18:00",
        duration: 45,
        trainer: "Mike Chen",
        maxParticipants: 20,
        description: "Latihan kardio intensitas tinggi untuk membakar kalori maksimal."
    },
    {
        name: "Strength Training",
        category: "strength",
        date: "2024-01-16",
        time: "19:00",
        duration: 75,
        trainer: "David Rodriguez",
        maxParticipants: 12,
        description: "Bangun kekuatan dan massa otot dengan program latihan yang terstruktur."
    },
    {
        name: "Zumba Dance Fitness",
        category: "zumba",
        date: "2024-01-17",
        time: "18:30",
        duration: 60,
        trainer: "Maria Santos",
        maxParticipants: 25,
        description: "Bergerak mengikuti irama musik Latin yang energik dan menyenangkan."
    },
    {
        name: "Pilates Core",
        category: "pilates",
        date: "2024-01-18",
        time: "17:00",
        duration: 50,
        trainer: "Emma Wilson",
        maxParticipants: 18,
        description: "Perkuat otot inti Anda dengan gerakan pilates yang terkontrol."
    },
    {
        name: "CrossFit WOD",
        category: "strength",
        date: "2024-01-19",
        time: "06:00",
        duration: 60,
        trainer: "Jake Thompson",
        maxParticipants: 15,
        description: "Workout of the Day yang menantang untuk atlet dari semua level."
    },
    {
        name: "Spinning Class",
        category: "cardio",
        date: "2024-01-20",
        time: "08:00",
        duration: 45,
        trainer: "Lisa Park",
        maxParticipants: 20,
        description: "Bersepeda statis dengan musik yang memompa semangat."
    },
    {
        name: "Vinyasa Flow",
        category: "yoga",
        date: "2024-01-21",
        time: "09:00",
        duration: 75,
        trainer: "Amanda Lee",
        maxParticipants: 16,
        description: "Aliran yoga yang dinamis dengan sinkronisasi napas dan gerakan."
    }
];

// Initialize Sample Data
export async function initializeSampleData() {
    try {
        console.log('Initializing sample data...');
        
        // Check if classes already exist
        const classesRef = ref(database, 'classes');
        const classesSnapshot = await get(classesRef);
        
        if (!classesSnapshot.exists()) {
            console.log('Adding sample classes...');
            
            // Add sample classes
            for (const classData of sampleClasses) {
                const result = await createGymClass(classData);
                if (result.success) {
                    console.log(`Added class: ${classData.name}`);
                } else {
                    console.error(`Failed to add class ${classData.name}:`, result.error);
                }
            }
            
            console.log('Sample classes added successfully!');
        } else {
            console.log('Classes already exist, skipping sample data initialization.');
        }
        
        return { success: true };
    } catch (error) {
        console.error('Error initializing sample data:', error);
        return { success: false, error: error.message };
    }
}

// Create Admin User (call this function manually if needed)
export async function createAdminUser(userId) {
    try {
        const adminData = {
            uid: userId,
            email: 'admin@fitlife.com',
            fullName: 'Admin FitLife',
            role: 'admin',
            createdAt: new Date().toISOString(),
            phone: '+62812345678',
            age: 30,
            fitnessGoal: 'general-fitness'
        };
        
        await set(ref(database, 'users/' + userId), adminData);
        console.log('Admin user created successfully!');
        return { success: true };
    } catch (error) {
        console.error('Error creating admin user:', error);
        return { success: false, error: error.message };
    }
}

// Update existing user to admin
export async function makeUserAdmin(userId) {
    try {
        const userRef = ref(database, `users/${userId}`);
        const userSnapshot = await get(userRef);
        
        if (userSnapshot.exists()) {
            const userData = userSnapshot.val();
            userData.role = 'admin';
            userData.updatedAt = new Date().toISOString();
            
            await set(userRef, userData);
            console.log('User updated to admin successfully!');
            return { success: true };
        } else {
            return { success: false, error: 'User not found' };
        }
    } catch (error) {
        console.error('Error updating user to admin:', error);
        return { success: false, error: error.message };
    }
}

// Call this function to initialize sample data when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Uncomment the line below to initialize sample data
    // initializeSampleData();
}); 