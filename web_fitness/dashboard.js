// Dashboard JavaScript
// Global functions will be available from auth.js, gym-classes.js, and bookings.js

let currentUser = null;
let currentUserData = null;
let allClasses = [];
let userBookings = [];

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', async function() {
    // Check authentication state
    checkAuthState(async (user) => {
        if (user) {
            currentUser = user;
            currentUserData = await getCurrentUserData();
            await initializeDashboard();
        } else {
            // Redirect to login if not authenticated
            window.location.href = 'login.html';
        }
    });
});

// Initialize Dashboard Content
async function initializeDashboard() {
    showLoading(true);
    
    try {
        // Update user display name
        document.getElementById('userName').textContent = currentUser.displayName || currentUser.email;
        document.getElementById('userDisplayName').textContent = currentUser.displayName || 'User';
        
        // Check if user is admin and add admin panel button
        if (currentUserData && currentUserData.role === 'admin') {
            addAdminPanelButton();
        }
        
        // Load user profile data
        loadUserProfile();
        
        // Load classes
        await loadClasses();
        
        // Load user bookings
        await loadUserBookings();
        
        // Setup event listeners
        setupEventListeners();
        
        // Setup real-time listeners
        setupRealTimeListeners();
        
    } catch (error) {
        console.error('Error initializing dashboard:', error);
        showNotification('Terjadi kesalahan saat memuat dashboard', 'error');
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

// Display Classes
function displayClasses(classes) {
    const classesGrid = document.getElementById('classesGrid');
    
    if (classes.length === 0) {
        classesGrid.innerHTML = '<div class="no-data">Tidak ada kelas tersedia</div>';
        return;
    }
    
    classesGrid.innerHTML = classes.map(classData => `
        <div class="class-card" data-class-id="${classData.id}">
            <div class="class-header">
                <h3 class="class-name">${classData.name}</h3>
                <span class="class-category">${classData.category}</span>
            </div>
            <div class="class-details">
                <div class="class-info">
                    <div class="info-item">
                        <span class="info-label">Tanggal:</span>
                        <span class="info-value">${formatDate(classData.date)}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Waktu:</span>
                        <span class="info-value">${classData.time}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Trainer:</span>
                        <span class="info-value">${classData.trainer}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Peserta:</span>
                        <span class="info-value">${classData.currentParticipants}/${classData.maxParticipants}</span>
                    </div>
                </div>
                <div class="class-description">
                    <p>${classData.description || 'Tidak ada deskripsi'}</p>
                </div>
            </div>
            <div class="class-actions">
                <button class="view-btn" onclick="viewClassDetails('${classData.id}')">Detail</button>
                <button class="book-btn" onclick="bookClass('${classData.id}')" 
                        ${classData.currentParticipants >= classData.maxParticipants ? 'disabled' : ''}
                        ${isClassBooked(classData.id) ? 'disabled' : ''}>
                    ${isClassBooked(classData.id) ? 'Sudah Dibooking' : 
                      classData.currentParticipants >= classData.maxParticipants ? 'Penuh' : 'Book'}
                </button>
            </div>
        </div>
    `).join('');
}

// Load User Bookings
async function loadUserBookings() {
    try {
        const result = await getUserBookings(currentUser.uid);
        if (result.success) {
            userBookings = result.bookings;
            displayUserBookings(userBookings);
            updateBookingStats();
        } else {
            showNotification('Gagal memuat booking: ' + result.error, 'error');
        }
    } catch (error) {
        console.error('Error loading bookings:', error);
        showNotification('Terjadi kesalahan saat memuat booking', 'error');
    }
}

// Display User Bookings
function displayUserBookings(bookings) {
    const bookingsList = document.getElementById('bookingsList');
    
    if (bookings.length === 0) {
        bookingsList.innerHTML = '<div class="no-data">Anda belum memiliki booking</div>';
        return;
    }
    
    bookingsList.innerHTML = bookings.map(booking => `
        <div class="booking-card" data-booking-id="${booking.id}">
            <div class="booking-header">
                <h3 class="booking-class-name">${booking.className}</h3>
                <span class="booking-status status-${booking.status}">${getStatusText(booking.status)}</span>
            </div>
            <div class="booking-details">
                <div class="booking-info">
                    <div class="info-item">
                        <span class="info-label">Tanggal:</span>
                        <span class="info-value">${formatDate(booking.classDate)}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Waktu:</span>
                        <span class="info-value">${booking.classTime}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Trainer:</span>
                        <span class="info-value">${booking.trainer}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Booking:</span>
                        <span class="info-value">${formatDateTime(booking.bookingDate)}</span>
                    </div>
                </div>
                <div class="booking-actions">
                    <button class="cancel-btn" onclick="cancelUserBooking('${booking.classId}')"
                            ${booking.status === 'cancelled' ? 'disabled' : ''}>
                        ${booking.status === 'cancelled' ? 'Dibatalkan' : 'Batal'}
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Load User Profile
function loadUserProfile() {
    if (currentUserData) {
        document.getElementById('fullName').value = currentUserData.fullName || '';
        document.getElementById('email').value = currentUserData.email || '';
        document.getElementById('phone').value = currentUserData.phone || '';
        document.getElementById('age').value = currentUserData.age || '';
        document.getElementById('fitnessGoal').value = currentUserData.fitnessGoal || '';
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Filter controls
    document.getElementById('dateFilter').addEventListener('change', filterClasses);
    document.getElementById('categoryFilter').addEventListener('change', filterClasses);
    
    // Profile form
    document.getElementById('profileForm').addEventListener('submit', handleProfileUpdate);
    
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
    });
    
    // Listen to user bookings changes
    listenToUserBookings(currentUser.uid, (bookings) => {
        userBookings = bookings;
        displayUserBookings(bookings);
        updateBookingStats();
    });
}

// Filter Classes
function filterClasses() {
    const dateFilter = document.getElementById('dateFilter').value;
    const categoryFilter = document.getElementById('categoryFilter').value;
    
    let filteredClasses = allClasses;
    
    if (dateFilter) {
        filteredClasses = filteredClasses.filter(classData => classData.date === dateFilter);
    }
    
    if (categoryFilter) {
        filteredClasses = filteredClasses.filter(classData => classData.category === categoryFilter);
    }
    
    displayClasses(filteredClasses);
}

// Book Class
window.bookClass = async function(classId) {
    showLoading(true);
    
    try {
        const result = await createBooking(classId, currentUser.uid, {});
        if (result.success) {
            showNotification('Berhasil booking kelas!', 'success');
            await loadClasses(); // Refresh classes
            await loadUserBookings(); // Refresh bookings
        } else {
            showNotification('Gagal booking kelas: ' + result.error, 'error');
        }
    } catch (error) {
        console.error('Error booking class:', error);
        showNotification('Terjadi kesalahan saat booking kelas', 'error');
    } finally {
        showLoading(false);
    }
};

// Cancel Booking
window.cancelUserBooking = async function(classId) {
    if (!confirm('Apakah Anda yakin ingin membatalkan booking ini?')) {
        return;
    }
    
    showLoading(true);
    
    try {
        const result = await cancelBooking(classId, currentUser.uid);
        if (result.success) {
            showNotification('Booking berhasil dibatalkan', 'success');
            await loadClasses(); // Refresh classes
            await loadUserBookings(); // Refresh bookings
        } else {
            showNotification('Gagal membatalkan booking: ' + result.error, 'error');
        }
    } catch (error) {
        console.error('Error cancelling booking:', error);
        showNotification('Terjadi kesalahan saat membatalkan booking', 'error');
    } finally {
        showLoading(false);
    }
};

// View Class Details
window.viewClassDetails = async function(classId) {
    showLoading(true);
    
    try {
        const result = await getClassById(classId);
        if (result.success) {
            showClassModal(result.class);
        } else {
            showNotification('Gagal memuat detail kelas: ' + result.error, 'error');
        }
    } catch (error) {
        console.error('Error loading class details:', error);
        showNotification('Terjadi kesalahan saat memuat detail kelas', 'error');
    } finally {
        showLoading(false);
    }
};

// Show Class Modal
function showClassModal(classData) {
    const modal = document.getElementById('classModal');
    const classDetails = document.getElementById('classDetails');
    
    classDetails.innerHTML = `
        <div class="modal-class-details">
            <h2>${classData.name}</h2>
            <div class="class-info-grid">
                <div class="info-item">
                    <strong>Kategori:</strong> ${classData.category}
                </div>
                <div class="info-item">
                    <strong>Tanggal:</strong> ${formatDate(classData.date)}
                </div>
                <div class="info-item">
                    <strong>Waktu:</strong> ${classData.time}
                </div>
                <div class="info-item">
                    <strong>Durasi:</strong> ${classData.duration || '60 menit'}
                </div>
                <div class="info-item">
                    <strong>Trainer:</strong> ${classData.trainer}
                </div>
                <div class="info-item">
                    <strong>Peserta:</strong> ${classData.currentParticipants}/${classData.maxParticipants}
                </div>
            </div>
            <div class="class-description-full">
                <h3>Deskripsi</h3>
                <p>${classData.description || 'Tidak ada deskripsi tersedia'}</p>
            </div>
            <div class="modal-actions">
                <button class="book-btn" onclick="bookClass('${classData.id}'); closeModal();"
                        ${classData.currentParticipants >= classData.maxParticipants ? 'disabled' : ''}
                        ${isClassBooked(classData.id) ? 'disabled' : ''}>
                    ${isClassBooked(classData.id) ? 'Sudah Dibooking' : 
                      classData.currentParticipants >= classData.maxParticipants ? 'Penuh' : 'Book Sekarang'}
                </button>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Close Modal
window.closeModal = function() {
    document.getElementById('classModal').style.display = 'none';
};

// Handle Profile Update
async function handleProfileUpdate(e) {
    e.preventDefault();
    showLoading(true);
    
    try {
        const formData = new FormData(e.target);
        const updateData = {
            ...currentUserData,
            fullName: formData.get('fullName'),
            phone: formData.get('phone'),
            age: formData.get('age'),
            fitnessGoal: formData.get('fitnessGoal')
        };
        
        const result = await updateUserProfile(updateData);
        if (result.success) {
            currentUserData = updateData;
            showNotification('Profil berhasil diupdate!', 'success');
        } else {
            showNotification('Gagal update profil: ' + result.error, 'error');
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        showNotification('Terjadi kesalahan saat update profil', 'error');
    } finally {
        showLoading(false);
    }
}

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
function isClassBooked(classId) {
    return userBookings.some(booking => booking.classId === classId && booking.status !== 'cancelled');
}

function updateBookingStats() {
    const totalBookings = userBookings.length;
    const upcomingBookings = userBookings.filter(booking => {
        const classDate = new Date(booking.classDate);
        const today = new Date();
        return classDate >= today && booking.status === 'confirmed';
    }).length;
    
    document.getElementById('totalBookings').textContent = totalBookings;
    document.getElementById('upcomingBookings').textContent = upcomingBookings;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function getStatusText(status) {
    const statusMap = {
        'confirmed': 'Terkonfirmasi',
        'cancelled': 'Dibatalkan',
        'completed': 'Selesai'
    };
    return statusMap[status] || status;
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
    const modal = document.getElementById('classModal');
    if (event.target === modal) {
        closeModal();
    }
};



// Add Admin Panel Button to Navbar
function addAdminPanelButton() {
    const navMenu = document.querySelector('.nav-menu');
    const userMenu = document.querySelector('.user-menu');
    
    if (navMenu && userMenu) {
        // Check if admin panel button already exists
        const existingAdminBtn = navMenu.querySelector('.admin-panel-btn');
        
        if (existingAdminBtn) {
            return; // Button already exists
        }
        
        // Create admin panel button
        const adminPanelBtn = document.createElement('a');
        adminPanelBtn.href = 'admin-panel.html';
        adminPanelBtn.className = 'nav-link admin-panel-btn';
        adminPanelBtn.textContent = 'Admin Panel';
        
        // Insert before user menu
        navMenu.insertBefore(adminPanelBtn, userMenu);
    }
}