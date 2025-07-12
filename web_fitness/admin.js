// Admin Panel JavaScript
import { checkAuthState, logoutUser, getCurrentUserData } from './auth.js';
import { 
    getAllClasses, 
    createGymClass, 
    updateGymClass, 
    deleteGymClass, 
    listenToClasses 
} from './gym-classes.js';
import { 
    getAllBookings, 
    updateBookingStatus, 
    cancelBooking 
} from './bookings.js';
import { database } from './firebase-config.js';
import { ref, get, onValue, update } from 'firebase/database';

let currentUser = null;
let currentUserData = null;
let allClasses = [];
let allBookings = [];
let allUsers = [];
let editingClassId = null;

// Initialize Admin Panel
document.addEventListener('DOMContentLoaded', async function() {
    // Check authentication state
    checkAuthState(async (user) => {
        if (user) {
            currentUser = user;
            currentUserData = await getCurrentUserData();
            
            // Check if user is admin
            if (currentUserData && currentUserData.role === 'admin') {
                await initializeAdminPanel();
            } else {
                alert('Akses ditolak. Anda bukan admin.');
                window.location.href = 'dashboard.html';
            }
        } else {
            // Redirect to login if not authenticated
            window.location.href = 'login.html';
        }
    });
});

// Initialize Admin Panel Content
async function initializeAdminPanel() {
    showLoading(true);
    
    try {
        // Update admin display name
        document.getElementById('adminName').textContent = currentUser.displayName || 'Admin';
        
        // Load all data
        await loadClasses();
        await loadBookings();
        await loadUsers();
        
        // Update stats
        updateStats();
        
        // Setup event listeners
        setupEventListeners();
        
        // Setup real-time listeners
        setupRealTimeListeners();
        
    } catch (error) {
        console.error('Error initializing admin panel:', error);
        showNotification('Terjadi kesalahan saat memuat panel admin', 'error');
    } finally {
        showLoading(false);
    }
}

// Load Classes
async function loadClasses() {
    try {
        const result = await getAllClasses();
        if (result.success) {
            allClasses = result.classes;
            displayClasses(allClasses);
        } else {
            showNotification('Gagal memuat kelas: ' + result.error, 'error');
        }
    } catch (error) {
        console.error('Error loading classes:', error);
        showNotification('Terjadi kesalahan saat memuat kelas', 'error');
    }
}

// Load Bookings
async function loadBookings() {
    try {
        const result = await getAllBookings();
        if (result.success) {
            allBookings = result.bookings;
            displayBookings(allBookings);
        } else {
            showNotification('Gagal memuat booking: ' + result.error, 'error');
        }
    } catch (error) {
        console.error('Error loading bookings:', error);
        showNotification('Terjadi kesalahan saat memuat booking', 'error');
    }
}

// Load Users
async function loadUsers() {
    try {
        const usersRef = ref(database, 'users');
        const snapshot = await get(usersRef);
        
        if (snapshot.exists()) {
            allUsers = [];
            snapshot.forEach((childSnapshot) => {
                allUsers.push(childSnapshot.val());
            });
            displayUsers(allUsers);
        }
    } catch (error) {
        console.error('Error loading users:', error);
        showNotification('Terjadi kesalahan saat memuat users', 'error');
    }
}

// Display Classes
function displayClasses(classes) {
    const tbody = document.getElementById('classesTableBody');
    
    if (classes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="no-data">Tidak ada kelas</td></tr>';
        return;
    }
    
    tbody.innerHTML = classes.map(classData => `
        <tr>
            <td>${classData.name}</td>
            <td>${classData.category}</td>
            <td>${formatDate(classData.date)}</td>
            <td>${classData.time}</td>
            <td>${classData.trainer}</td>
            <td>${classData.currentParticipants}/${classData.maxParticipants}</td>
            <td>
                <span class="status ${getClassStatus(classData)}">
                    ${getClassStatusText(classData)}
                </span>
            </td>
            <td>
                <button class="edit-btn" onclick="editClass('${classData.id}')">Edit</button>
                <button class="delete-btn" onclick="deleteClass('${classData.id}')">Hapus</button>
            </td>
        </tr>
    `).join('');
}

// Display Bookings
function displayBookings(bookings) {
    const tbody = document.getElementById('bookingsTableBody');
    
    if (bookings.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="no-data">Tidak ada booking</td></tr>';
        return;
    }
    
    tbody.innerHTML = bookings.map(booking => `
        <tr>
            <td>${getUserName(booking.userId)}</td>
            <td>${booking.className}</td>
            <td>${formatDate(booking.classDate)}</td>
            <td>${booking.classTime}</td>
            <td>${formatDateTime(booking.bookingDate)}</td>
            <td>
                <span class="status status-${booking.status}">
                    ${getStatusText(booking.status)}
                </span>
            </td>
            <td>
                <select class="status-select" onchange="updateBookingStatusAdmin('${booking.classId}', '${booking.userId}', this.value)">
                    <option value="confirmed" ${booking.status === 'confirmed' ? 'selected' : ''}>Terkonfirmasi</option>
                    <option value="cancelled" ${booking.status === 'cancelled' ? 'selected' : ''}>Dibatalkan</option>
                    <option value="completed" ${booking.status === 'completed' ? 'selected' : ''}>Selesai</option>
                </select>
            </td>
        </tr>
    `).join('');
}

// Display Users
function displayUsers(users) {
    const tbody = document.getElementById('usersTableBody');
    
    if (users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="no-data">Tidak ada user</td></tr>';
        return;
    }
    
    tbody.innerHTML = users.map(user => `
        <tr>
            <td>${user.fullName || 'N/A'}</td>
            <td>${user.email}</td>
            <td>
                <select class="role-select" onchange="updateUserRole('${user.uid}', this.value)">
                    <option value="user" ${user.role === 'user' ? 'selected' : ''}>User</option>
                    <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
                </select>
            </td>
            <td>${getUserBookingCount(user.uid)}</td>
            <td>${formatDate(user.createdAt)}</td>
            <td>
                <button class="view-btn" onclick="viewUserDetails('${user.uid}')">Detail</button>
            </td>
        </tr>
    `).join('');
}

// Setup Event Listeners
function setupEventListeners() {
    // Class form
    document.getElementById('classForm').addEventListener('submit', handleClassSubmit);
    
    // Filter controls
    document.getElementById('bookingStatusFilter').addEventListener('change', filterBookings);
    document.getElementById('bookingDateFilter').addEventListener('change', filterBookings);
    
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only prevent default for internal anchor links (starting with #)
            if (href.startsWith('#')) {
                e.preventDefault();
                document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
            }
            // For external links (like admin-panel.html), let them navigate normally
        });
    });
}

// Setup Real-time Listeners
function setupRealTimeListeners() {
    // Listen to classes changes
    listenToClasses((classes) => {
        allClasses = classes;
        displayClasses(classes);
        updateStats();
    });
    
    // Listen to bookings changes
    const bookingsRef = ref(database, 'bookings');
    onValue(bookingsRef, (snapshot) => {
        const bookings = [];
        if (snapshot.exists()) {
            snapshot.forEach((userSnapshot) => {
                userSnapshot.forEach((bookingSnapshot) => {
                    bookings.push(bookingSnapshot.val());
                });
            });
        }
        allBookings = bookings;
        displayBookings(bookings);
        updateStats();
    });
    
    // Listen to users changes
    const usersRef = ref(database, 'users');
    onValue(usersRef, (snapshot) => {
        const users = [];
        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                users.push(childSnapshot.val());
            });
        }
        allUsers = users;
        displayUsers(users);
        updateStats();
    });
}

// Show Add Class Modal
window.showAddClassModal = function() {
    editingClassId = null;
    document.getElementById('classModalTitle').textContent = 'Tambah Kelas';
    document.getElementById('classForm').reset();
    document.getElementById('classModal').style.display = 'block';
};

// Edit Class
window.editClass = function(classId) {
    const classData = allClasses.find(c => c.id === classId);
    if (!classData) return;
    
    editingClassId = classId;
    document.getElementById('classModalTitle').textContent = 'Edit Kelas';
    
    // Fill form with class data
    document.getElementById('className').value = classData.name;
    document.getElementById('classCategory').value = classData.category;
    document.getElementById('classDate').value = classData.date;
    document.getElementById('classTime').value = classData.time;
    document.getElementById('classDuration').value = classData.duration || 60;
    document.getElementById('classTrainer').value = classData.trainer;
    document.getElementById('classMaxParticipants').value = classData.maxParticipants;
    document.getElementById('classDescription').value = classData.description || '';
    
    document.getElementById('classModal').style.display = 'block';
};

// Delete Class
window.deleteClass = async function(classId) {
    if (!confirm('Apakah Anda yakin ingin menghapus kelas ini?')) {
        return;
    }
    
    showLoading(true);
    
    try {
        const result = await deleteGymClass(classId);
        if (result.success) {
            showNotification('Kelas berhasil dihapus', 'success');
            await loadClasses();
        } else {
            showNotification('Gagal menghapus kelas: ' + result.error, 'error');
        }
    } catch (error) {
        console.error('Error deleting class:', error);
        showNotification('Terjadi kesalahan saat menghapus kelas', 'error');
    } finally {
        showLoading(false);
    }
};

// Handle Class Form Submit
async function handleClassSubmit(e) {
    e.preventDefault();
    showLoading(true);
    
    try {
        const formData = new FormData(e.target);
        const classData = {
            name: formData.get('name'),
            category: formData.get('category'),
            date: formData.get('date'),
            time: formData.get('time'),
            duration: parseInt(formData.get('duration')),
            trainer: formData.get('trainer'),
            maxParticipants: parseInt(formData.get('maxParticipants')),
            description: formData.get('description')
        };
        
        let result;
        if (editingClassId) {
            result = await updateGymClass(editingClassId, classData);
        } else {
            result = await createGymClass(classData);
        }
        
        if (result.success) {
            showNotification(editingClassId ? 'Kelas berhasil diupdate' : 'Kelas berhasil ditambahkan', 'success');
            closeModal('classModal');
            await loadClasses();
        } else {
            showNotification('Gagal menyimpan kelas: ' + result.error, 'error');
        }
    } catch (error) {
        console.error('Error saving class:', error);
        showNotification('Terjadi kesalahan saat menyimpan kelas', 'error');
    } finally {
        showLoading(false);
    }
}

// Update Booking Status (Admin)
window.updateBookingStatusAdmin = async function(classId, userId, newStatus) {
    showLoading(true);
    
    try {
        const result = await updateBookingStatus(classId, userId, newStatus);
        if (result.success) {
            showNotification('Status booking berhasil diupdate', 'success');
        } else {
            showNotification('Gagal update status booking: ' + result.error, 'error');
        }
    } catch (error) {
        console.error('Error updating booking status:', error);
        showNotification('Terjadi kesalahan saat update status booking', 'error');
    } finally {
        showLoading(false);
    }
};

// Update User Role
window.updateUserRole = async function(userId, newRole) {
    showLoading(true);
    
    try {
        const userRef = ref(database, `users/${userId}`);
        await update(userRef, { role: newRole });
        showNotification('Role user berhasil diupdate', 'success');
    } catch (error) {
        console.error('Error updating user role:', error);
        showNotification('Terjadi kesalahan saat update role user', 'error');
    } finally {
        showLoading(false);
    }
};

// View User Details
window.viewUserDetails = function(userId) {
    const user = allUsers.find(u => u.uid === userId);
    if (!user) return;
    
    const userBookings = allBookings.filter(b => b.userId === userId);
    
    alert(`Detail User:
Nama: ${user.fullName || 'N/A'}
Email: ${user.email}
Role: ${user.role}
Total Booking: ${userBookings.length}
Bergabung: ${formatDate(user.createdAt)}
Telepon: ${user.phone || 'N/A'}
Umur: ${user.age || 'N/A'}
Tujuan Fitness: ${user.fitnessGoal || 'N/A'}`);
};

// Filter Bookings
function filterBookings() {
    const statusFilter = document.getElementById('bookingStatusFilter').value;
    const dateFilter = document.getElementById('bookingDateFilter').value;
    
    let filteredBookings = allBookings;
    
    if (statusFilter) {
        filteredBookings = filteredBookings.filter(booking => booking.status === statusFilter);
    }
    
    if (dateFilter) {
        filteredBookings = filteredBookings.filter(booking => booking.classDate === dateFilter);
    }
    
    displayBookings(filteredBookings);
}

// Update Stats
function updateStats() {
    document.getElementById('totalClasses').textContent = allClasses.length;
    document.getElementById('totalBookings').textContent = allBookings.length;
    document.getElementById('totalUsers').textContent = allUsers.length;
    
    const today = new Date().toISOString().split('T')[0];
    const todayBookings = allBookings.filter(booking => 
        booking.classDate === today && booking.status === 'confirmed'
    ).length;
    document.getElementById('todayBookings').textContent = todayBookings;
}

// Close Modal
window.closeModal = function(modalId) {
    document.getElementById(modalId).style.display = 'none';
};

// Handle Logout
window.handleLogout = async function() {
    if (confirm('Apakah Anda yakin ingin logout?')) {
        showLoading(true);
        
        try {
            const result = await logoutUser();
            if (result.success) {
                window.location.href = 'index.html';
            } else {
                showNotification('Gagal logout: ' + result.error, 'error');
            }
        } catch (error) {
            console.error('Error logging out:', error);
            showNotification('Terjadi kesalahan saat logout', 'error');
        } finally {
            showLoading(false);
        }
    }
};

// Helper Functions
function getUserName(userId) {
    const user = allUsers.find(u => u.uid === userId);
    return user ? (user.fullName || user.email) : 'Unknown';
}

function getUserBookingCount(userId) {
    return allBookings.filter(booking => booking.userId === userId).length;
}

function getClassStatus(classData) {
    const classDate = new Date(classData.date);
    const today = new Date();
    
    if (classDate < today) {
        return 'completed';
    } else if (classData.currentParticipants >= classData.maxParticipants) {
        return 'full';
    } else {
        return 'available';
    }
}

function getClassStatusText(classData) {
    const status = getClassStatus(classData);
    const statusMap = {
        'available': 'Tersedia',
        'full': 'Penuh',
        'completed': 'Selesai'
    };
    return statusMap[status] || status;
}

function getStatusText(status) {
    const statusMap = {
        'confirmed': 'Terkonfirmasi',
        'cancelled': 'Dibatalkan',
        'completed': 'Selesai'
    };
    return statusMap[status] || status;
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatDateTime(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function showLoading(show) {
    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.style.display = show ? 'flex' : 'none';
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const classModal = document.getElementById('classModal');
    if (event.target === classModal) {
        closeModal('classModal');
    }
}; 