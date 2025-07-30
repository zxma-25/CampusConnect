// Application State
const app = {
    currentUser: null,
    theme: localStorage.getItem('theme') || 'light',
    scheduleData: [
        { time: '09:00', course: 'Advanced Mathematics', room: 'Room 201', type: 'lecture' },
        { time: '11:00', course: 'Computer Science', room: 'Lab 103', type: 'lab' },
        { time: '14:00', course: 'Physics', room: 'Room 305', type: 'lecture' },
        { time: '16:00', course: 'Study Group', room: 'Library', type: 'study' }
    ]
};

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    setupEventListeners();
    
    // Clear redirecting flag on page load
    sessionStorage.removeItem('redirecting');
    
    // Add a small delay for GitHub Pages to prevent race conditions
    setTimeout(() => {
        checkAuthState();
        updateWelcomeMessage();
    }, 100);
    
    initializeAnimations();
    
    // Page-specific initialization
    if (document.getElementById('schedule-container')) {
        renderSchedule();
        startLiveUpdates();
    }
});

// Theme Management
function initializeTheme() {
    document.documentElement.setAttribute('data-theme', app.theme);
    updateThemeIcon();
}

function toggleTheme() {
    app.theme = app.theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', app.theme);
    localStorage.setItem('theme', app.theme);
    updateThemeIcon();
    showToast(`Switched to ${app.theme} mode`, 'success');
}

function updateThemeIcon() {
    const icon = document.querySelector('#theme-toggle i');
    if (icon) {
        icon.className = app.theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
}

// Event Listeners
function setupEventListeners() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    const signinForm = document.getElementById('signin-form');
    if (signinForm) {
        signinForm.addEventListener('submit', handleSignIn);
    }
    
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            showToast('Search functionality coming soon!', 'info');
        }
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    // Add hover effects to stat cards
    document.querySelectorAll('.stat-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Authentication Functions
function loadUsers() {
    return fetch('users.txt')
        .then(response => {
            if (!response.ok) throw new Error('Could not load users file');
            return response.text();
        })
        .then(data => {
            return data.split('\n')
                .map(line => line.trim())
                .filter(line => line.length > 0)
                .map(line => {
                    const parts = line.split(',');
                    return { email: parts[0], password: parts[1] };
                });
        });
}

function authenticateUser(email, password) {
    return loadUsers()
        .then(users => {
            const user = users.find(u => u.email === email && u.password === password);
            return user ? { success: true, user: { email: user.email } } : { success: false };
        })
        .catch(error => {
            console.error('Authentication error:', error);
            return { success: false, error: 'Could not load user database' };
        });
}

async function handleSignIn(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const submitBtn = document.getElementById('signin-btn');
    const submitText = document.getElementById('signin-text');
    
    if (!email || !password) {
        showToast('Please enter both email and password', 'error');
        return;
    }

    // Show loading state
    submitBtn.disabled = true;
    submitText.innerHTML = '<span class="loading"></span> Signing in...';

    try {
        const result = await authenticateUser(email, password);
        
        if (result.success) {
            app.currentUser = result.user;
            sessionStorage.setItem('user', JSON.stringify(result.user));
            
            showToast('Welcome back! Login successful.', 'success');
            closeModal();
            updateUIForLoggedInUser(result.user);
            
            // Clear form
            document.getElementById('signin-form').reset();
        } else {
            showToast(result.error || 'Invalid email or password', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showToast('An error occurred during login', 'error');
    } finally {
        submitBtn.disabled = false;
        submitText.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In';
    }
}

function handleLogout() {
    sessionStorage.removeItem('user');
    app.currentUser = null;
    
    const logoutBtn = document.getElementById('logout-btn');
    const signinModal = document.getElementById('signin-modal');
    const welcomeTitle = document.getElementById('welcome-title');
    
    if (logoutBtn) logoutBtn.style.display = 'none';
    if (signinModal) signinModal.classList.add('active');
    if (welcomeTitle) welcomeTitle.textContent = 'Welcome to CampusConnect';
    
    showToast('You have been logged out', 'success');
    
    // Redirect to main page if on dashboard
    if (window.location.pathname.includes('dashboard')) {
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }
}

// Logout function for dashboard pages
function logout() {
    sessionStorage.removeItem('user');
    showToast('Logged out successfully', 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

function updateUIForLoggedInUser(user) {
    const username = user.email.split('@')[0];
    const welcomeTitle = document.getElementById('welcome-title');
    const logoutBtn = document.getElementById('logout-btn');
    
    if (welcomeTitle) {
        welcomeTitle.textContent = `Welcome back, ${username}!`;
    }
    if (logoutBtn) {
        logoutBtn.style.display = 'block';
    }
    
    // Animate the welcome change
    if (welcomeTitle) {
        welcomeTitle.style.animation = 'none';
        setTimeout(() => {
            welcomeTitle.style.animation = 'fadeInUp 0.8s ease';
        }, 10);
    }

    // Redirect to appropriate dashboard after 1 second
    setTimeout(() => {
        redirectToUserDashboard(user);
    }, 1000);
}

function getUserRole(email) {
    if (email.endsWith('@campus.admin')) return 'admin';
    if (email.endsWith('@campus.edu')) return 'teacher';
    if (email.endsWith('@campus.stu')) return 'student';
    return 'unknown';
}

function redirectToUserDashboard(user) {
    const role = getUserRole(user.email);
    if (role === 'admin') {
        window.location.href = 'hr-dashboard.html';
    } else if (role === 'teacher') {
        window.location.href = 'teacher-dashboard.html';
    } else if (role === 'student') {
        window.location.href = 'student-dashboard.html';
    } else if (role=== 'hr') {
        window.location.href = 'hr-dashboard.html';
    } else {
        window.location.href = 'index.html';
    }
}

function checkAuthState() {
    // Prevent multiple redirects
    if (sessionStorage.getItem('redirecting')) {
        return;
    }
    
    const storedUser = sessionStorage.getItem('user');
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';
    
    // Debug logging for GitHub Pages
    console.log('Current path:', currentPath);
    console.log('Current page:', currentPage);
    console.log('Stored user:', storedUser ? 'exists' : 'none');
    
    // Check if we're on the main login page
    if (currentPage === 'index.html' || currentPath === '/' || currentPath === '') {
        // For main page, redirect if already logged in
        if (storedUser) {
            try {
                app.currentUser = JSON.parse(storedUser);
                sessionStorage.setItem('redirecting', 'true');
                redirectToUserDashboard(app.currentUser);
            } catch (e) {
                console.error('Error parsing stored user:', e);
                sessionStorage.removeItem('user');
            }
        }
        return;
    }
    
    // For all other pages, check if user is logged in
    if (!storedUser) {
        console.log('No stored user, redirecting to login');
        sessionStorage.setItem('redirecting', 'true');
        window.location.href = 'index.html';
        return;
    }
    
    try {
        const user = JSON.parse(storedUser);
        const role = getUserRole(user.email);
        console.log('User role:', role);
        console.log('Current page:', currentPage);
        
        // Check role-based access for dashboard pages only
        if (currentPage === 'admin-dashboard.html' && role !== 'admin') {
            console.log('Non-admin trying to access admin dashboard, redirecting');
            sessionStorage.setItem('redirecting', 'true');
            redirectToUserDashboard(user);
            return;
        } else if (currentPage === 'teacher-dashboard.html' && role !== 'teacher') {
            console.log('Non-teacher trying to access teacher dashboard, redirecting');
            sessionStorage.setItem('redirecting', 'true');
            redirectToUserDashboard(user);
            return;
        } else if (currentPage === 'student-dashboard.html' && role !== 'student') {
            console.log('Non-student trying to access student dashboard, redirecting');
            sessionStorage.setItem('redirecting', 'true');
            redirectToUserDashboard(user);
         } else if (currentPage === 'hr-dashboard.html' && role !== 'HR') {
            console.log('Non-HR trying to access student dashboard, redirecting');
            sessionStorage.setItem('redirecting', 'true');
            redirectToUserDashboard(user);
            return;
        }
        
        // For all other pages, allow access based on role
        // Students can access: courses.html, grades.html, calendar.html, messages.html
        // Teachers can access: teacher-specific pages
        // Admins can access: admin-specific pages
        
        console.log('Access granted to:', currentPage);
        
    } catch (e) {
        console.error('Error in checkAuthState:', e);
        sessionStorage.removeItem('user');
        sessionStorage.setItem('redirecting', 'true');
        window.location.href = 'index.html';
    }
}

function updateWelcomeMessage() {
    const storedUser = sessionStorage.getItem('user');
    const welcomeTitle = document.getElementById('welcome-title');
    if (storedUser && welcomeTitle) {
        try {
            const user = JSON.parse(storedUser);
            const username = user.email.split('@')[0];
            const role = getUserRole(user.email);
            if (window.location.pathname.includes('admin-dashboard')) {
                welcomeTitle.textContent = `Welcome, Admin ${username}!`;
            } else if (window.location.pathname.includes('teacher-dashboard')) {
                welcomeTitle.textContent = `Welcome, Prof. ${username}!`;
            } else if (window.location.pathname.includes('student-dashboard')) {
                welcomeTitle.textContent = `Welcome, ${username}!`;
            } else if (window.location.pathname.includes('hr-dashboard')) {
                welcomeTitle.textContent = `Welcome, ${username}!`;
            }
        } catch (e) {
            // Keep default title
        }
    }
}

// UI Functions
function closeModal() {
    const modal = document.getElementById('signin-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Animation Functions
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-animate]').forEach(el => {
        observer.observe(el);
    });
}

// Schedule Rendering (for main page)
function renderSchedule() {
    const container = document.getElementById('schedule-container');
    if (!container) return;
    
    const scheduleHTML = app.scheduleData.map(item => `
        <div class="activity-item" style="animation: fadeInUp 0.6s ease; cursor: pointer;" onclick="showToast('Opening ${item.course} details...', 'info')">
            <div class="activity-icon" style="background: ${getScheduleColor(item.type)};">
                <i class="fas fa-${getScheduleIcon(item.type)}"></i>
            </div>
            <div style="flex: 1;">
                <div style="font-weight: 600; color: var(--text-color);">${item.course}</div>
                <div style="font-size: 0.875rem; color: var(--text-muted);">${item.time} • ${item.room}</div>
            </div>
            <div style="color: var(--text-muted); font-size: 0.875rem;">
                <i class="fas fa-chevron-right"></i>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = scheduleHTML || '<p style="color: var(--text-muted); text-align: center;">No upcoming classes today</p>';
}

function getScheduleColor(type) {
    const colors = {
        lecture: 'var(--primary-color)',
        lab: 'var(--secondary-color)',
        study: 'var(--warning-color)'
    };
    return colors[type] || 'var(--info-color)';
}

function getScheduleIcon(type) {
    const icons = {
        lecture: 'chalkboard-teacher',
        lab: 'flask',
        study: 'users'
    };
    return icons[type] || 'calendar';
}

// Live Updates (for main page)
function startLiveUpdates() {
    // Update stats periodically
    setInterval(() => {
        if (app.currentUser) {
            updateStats();
        }
    }, 30000); // Update every 30 seconds

    // Update time-based elements
    setInterval(() => {
        updateTimeBasedElements();
    }, 60000); // Update every minute
}

function updateStats() {
    // Simulate dynamic stat updates
    const coursesCount = document.getElementById('courses-count');
    const gpaValue = document.getElementById('gpa-value');
    const assignmentsCount = document.getElementById('assignments-count');
    const messagesCount = document.getElementById('messages-count');

    // Add subtle animation to updated values
    [coursesCount, gpaValue, assignmentsCount, messagesCount].forEach(el => {
        if (el) {
            el.style.transform = 'scale(1.1)';
            setTimeout(() => {
                el.style.transform = 'scale(1)';
            }, 200);
        }
    });
}

function updateTimeBasedElements() {
    // Update any time-sensitive content
    const now = new Date();
    const currentHour = now.getHours();
    
    // Update greeting based on time
    if (app.currentUser) {
        const username = app.currentUser.email.split('@')[0];
        let greeting = 'Welcome back';
        
        if (currentHour < 12) greeting = 'Good morning';
        else if (currentHour < 17) greeting = 'Good afternoon';
        else greeting = 'Good evening';
        
        const welcomeTitle = document.getElementById('welcome-title');
        if (welcomeTitle) {
            welcomeTitle.textContent = `${greeting}, ${username}!`;
        }
    }
}

// Utility Functions
function animateValue(element, start, end, duration = 1000) {
    const startTime = Date.now();
    const step = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = start + (end - start) * progress;
        
        element.textContent = Math.round(current);
        
        if (progress < 1) {
            requestAnimationFrame(step);
        }
    };
    step();
}

// Google Maps Integration
let campusMap = null;
let mapMarkers = [];
let infoWindows = [];

// Campus data
const campusData = {
    center: { lat: 40.7505, lng: -73.9934 }, // Sample coordinates (NYC area)
    buildings: [
        { 
            id: 'main-building', 
            name: 'Main Academic Building', 
            position: { lat: 40.7508, lng: -73.9930 },
            type: 'academic',
            rooms: ['Room 201', 'Room 105', 'Room 210', 'Room 305'],
            description: 'Primary academic building housing mathematics, computer science, and physics departments.'
        },
        { 
            id: 'science-lab', 
            name: 'Science Laboratory', 
            position: { lat: 40.7502, lng: -73.9940 },
            type: 'laboratory',
            rooms: ['Lab 103'],
            description: 'State-of-the-art laboratory facilities for physics, chemistry, and computer science.'
        },
        { 
            id: 'library', 
            name: 'Campus Library', 
            position: { lat: 40.7512, lng: -73.9925 },
            type: 'library',
            rooms: ['Study Rooms', 'Computer Lab'],
            description: 'Modern library with extensive digital resources and collaborative study spaces.'
        },
        { 
            id: 'admin-building', 
            name: 'Administration Building', 
            position: { lat: 40.7498, lng: -73.9945 },
            type: 'administration',
            rooms: ['Office 301', 'Office 302', 'Office 303'],
            description: 'Administrative offices including registrar, financial aid, and student services.'
        }
    ],
    emergencyPoints: [
        { 
            name: 'Campus Security', 
            position: { lat: 40.7505, lng: -73.9935 },
            phone: '(555) 123-4567',
            description: '24/7 campus security office'
        },
        { 
            name: 'Medical Center', 
            position: { lat: 40.7510, lng: -73.9920 },
            phone: '(555) 123-4568',
            description: 'Campus health and wellness center'
        }
    ],
    parkingAreas: [
        { 
            name: 'Student Parking A', 
            position: { lat: 40.7495, lng: -73.9950 },
            capacity: 150,
            type: 'student'
        },
        { 
            name: 'Faculty Parking', 
            position: { lat: 40.7515, lng: -73.9915 },
            capacity: 75,
            type: 'faculty'
        },
        { 
            name: 'Visitor Parking', 
            position: { lat: 40.7500, lng: -73.9955 },
            capacity: 50,
            type: 'visitor'
        }
    ]
};

// Initialize Google Maps
function initMap() {
    const mapOptions = {
        zoom: 16,
        center: campusData.center,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: getMapStyles(),
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: true
    };

    // Initialize maps for each dashboard
    if (document.getElementById('student-map')) {
        initStudentMap(mapOptions);
    }
    if (document.getElementById('teacher-map')) {
        initTeacherMap(mapOptions);
    }
    if (document.getElementById('admin-map')) {
        initAdminMap(mapOptions);
    }
}

// Student Map Initialization
function initStudentMap(mapOptions) {
    const studentMap = new google.maps.Map(document.getElementById('student-map'), mapOptions);
    
    // Add building markers
    campusData.buildings.forEach(building => {
        addBuildingMarker(studentMap, building, 'student');
    });
    
    // Add user location marker (simulated)
    addUserLocationMarker(studentMap, { lat: 40.7506, lng: -73.9932 }, 'Your Location');
    
    campusMap = studentMap;
}

// Teacher Map Initialization
function initTeacherMap(mapOptions) {
    const teacherMap = new google.maps.Map(document.getElementById('teacher-map'), mapOptions);
    
    // Add building markers with classroom focus
    campusData.buildings.forEach(building => {
        addBuildingMarker(teacherMap, building, 'teacher');
    });
    
    // Add faculty office marker
    addOfficeMarker(teacherMap, { lat: 40.7499, lng: -73.9944 }, 'Faculty Office 301');
    
    campusMap = teacherMap;
}

// Admin Map Initialization
function initAdminMap(mapOptions) {
    const adminMap = new google.maps.Map(document.getElementById('admin-map'), mapOptions);
    
    // Add all campus features
    campusData.buildings.forEach(building => {
        addBuildingMarker(adminMap, building, 'admin');
    });
    
    // Initially hidden - will be shown when buttons are clicked
    campusMap = adminMap;
}

// Map styling
function getMapStyles() {
    return [
        {
            "featureType": "all",
            "elementType": "geometry.fill",
            "stylers": [{"weight": "2.00"}]
        },
        {
            "featureType": "all",
            "elementType": "geometry.stroke",
            "stylers": [{"color": "#9c9c9c"}]
        },
        {
            "featureType": "all",
            "elementType": "labels.text",
            "stylers": [{"visibility": "on"}]
        },
        {
            "featureType": "landscape",
            "elementType": "all",
            "stylers": [{"color": "#f2f2f2"}]
        },
        {
            "featureType": "landscape",
            "elementType": "geometry.fill",
            "stylers": [{"color": "#ffffff"}]
        },
        {
            "featureType": "landscape.man_made",
            "elementType": "geometry.fill",
            "stylers": [{"color": "#ffffff"}]
        },
        {
            "featureType": "poi",
            "elementType": "all",
            "stylers": [{"visibility": "off"}]
        },
        {
            "featureType": "road",
            "elementType": "all",
            "stylers": [{"saturation": -100}, {"lightness": 45}]
        },
        {
            "featureType": "road",
            "elementType": "geometry.fill",
            "stylers": [{"color": "#eeeeee"}]
        },
        {
            "featureType": "road",
            "elementType": "labels.text.fill",
            "stylers": [{"color": "#7b7b7b"}]
        },
        {
            "featureType": "road",
            "elementType": "labels.text.stroke",
            "stylers": [{"color": "#ffffff"}]
        },
        {
            "featureType": "road.highway",
            "elementType": "all",
            "stylers": [{"visibility": "simplified"}]
        },
        {
            "featureType": "road.arterial",
            "elementType": "labels.icon",
            "stylers": [{"visibility": "off"}]
        },
        {
            "featureType": "transit",
            "elementType": "all",
            "stylers": [{"visibility": "off"}]
        },
        {
            "featureType": "water",
            "elementType": "all",
            "stylers": [{"color": "#46bcec"}, {"visibility": "on"}]
        },
        {
            "featureType": "water",
            "elementType": "geometry.fill",
            "stylers": [{"color": "#c8d7d4"}]
        },
        {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [{"color": "#070707"}]
        },
        {
            "featureType": "water",
            "elementType": "labels.text.stroke",
            "stylers": [{"color": "#ffffff"}]
        }
    ];
}

// Add building markers
function addBuildingMarker(map, building, userType) {
    const marker = new google.maps.Marker({
        position: building.position,
        map: map,
        title: building.name,
        icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="30" height="40" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 0C6.7 0 0 6.7 0 15s6.7 15 15 15 15-6.7 15-15S23.3 0 15 0zm0 25c-5.5 0-10-4.5-10-10s4.5-10 10-10 10 4.5 10 10-4.5 10-10 10z" fill="#6366f1"/>
                    <circle cx="15" cy="15" r="8" fill="white"/>
                    <text x="15" y="19" text-anchor="middle" font-family="Arial" font-size="10" font-weight="bold" fill="#6366f1">🏢</text>
                </svg>
            `),
            scaledSize: new google.maps.Size(30, 40),
            anchor: new google.maps.Point(15, 40)
        }
    });

    const infoWindow = new google.maps.InfoWindow({
        content: createBuildingInfoWindow(building, userType)
    });

    marker.addListener('click', () => {
        closeAllInfoWindows();
        infoWindow.open(map, marker);
    });

    mapMarkers.push(marker);
    infoWindows.push(infoWindow);
}

// Add user location marker
function addUserLocationMarker(map, position, title) {
    const marker = new google.maps.Marker({
        position: position,
        map: map,
        title: title,
        icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="10" cy="10" r="8" fill="#10b981" stroke="white" stroke-width="2"/>
                    <circle cx="10" cy="10" r="3" fill="white"/>
                </svg>
            `),
            scaledSize: new google.maps.Size(20, 20),
            anchor: new google.maps.Point(10, 10)
        }
    });

    mapMarkers.push(marker);
}

// Add office marker
function addOfficeMarker(map, position, title) {
    const marker = new google.maps.Marker({
        position: position,
        map: map,
        title: title,
        icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="30" height="40" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 0C6.7 0 0 6.7 0 15s6.7 15 15 15 15-6.7 15-15S23.3 0 15 0zm0 25c-5.5 0-10-4.5-10-10s4.5-10 10-10 10 4.5 10 10-4.5 10-10 10z" fill="#f59e0b"/>
                    <circle cx="15" cy="15" r="8" fill="white"/>
                    <text x="15" y="19" text-anchor="middle" font-family="Arial" font-size="10" font-weight="bold" fill="#f59e0b">🚪</text>
                </svg>
            `),
            scaledSize: new google.maps.Size(30, 40),
            anchor: new google.maps.Point(15, 40)
        }
    });

    const infoWindow = new google.maps.InfoWindow({
        content: `
            <div class="map-info-window">
                <div class="map-info-title">${title}</div>
                <div class="map-info-content">Faculty office hours: Mon-Fri 9:00-17:00</div>
                <div class="map-info-actions">
                    <button class="map-info-btn" onclick="getDirectionsToOffice()">Get Directions</button>
                </div>
            </div>
        `
    });

    marker.addListener('click', () => {
        closeAllInfoWindows();
        infoWindow.open(map, marker);
    });

    mapMarkers.push(marker);
    infoWindows.push(infoWindow);
}

// Create building info window content
function createBuildingInfoWindow(building, userType) {
    let actionButtons = '';
    
    if (userType === 'student') {
        actionButtons = `
            <button class="map-info-btn" onclick="getDirectionsTo('${building.id}')">Get Directions</button>
            <button class="map-info-btn secondary" onclick="showBuildingSchedule('${building.id}')">View Schedule</button>
        `;
    } else if (userType === 'teacher') {
        actionButtons = `
            <button class="map-info-btn" onclick="getDirectionsTo('${building.id}')">Get Directions</button>
            <button class="map-info-btn secondary" onclick="showClassroomDetails('${building.id}')">Classroom Info</button>
        `;
    } else if (userType === 'admin') {
        actionButtons = `
            <button class="map-info-btn" onclick="showBuildingStats('${building.id}')">Building Stats</button>
            <button class="map-info-btn secondary" onclick="manageBuildingAccess('${building.id}')">Manage Access</button>
        `;
    }

    return `
        <div class="map-info-window">
            <div class="map-info-title">${building.name}</div>
            <div class="map-info-content">
                ${building.description}
                <br><br>
                <strong>Available Rooms:</strong> ${building.rooms.join(', ')}
            </div>
            <div class="map-info-actions">
                ${actionButtons}
            </div>
        </div>
    `;
}

// Map interaction functions
function showClassroomLocation(roomName) {
    if (!campusMap) {
        showToast('Map not loaded yet. Please wait a moment.', 'warning');
        return;
    }

    const building = campusData.buildings.find(b => b.rooms.includes(roomName));
    if (building) {
        campusMap.setCenter(building.position);
        campusMap.setZoom(18);
        
        // Find and trigger the marker
        const marker = mapMarkers.find(m => m.getTitle() === building.name);
        if (marker) {
            google.maps.event.trigger(marker, 'click');
        }
        
        showToast(`Showing location of ${roomName}`, 'success');
    } else {
        showToast(`Room ${roomName} not found on map`, 'error');
    }
}

function showAllBuildings() {
    if (!campusMap) {
        showToast('Map not loaded yet. Please wait a moment.', 'warning');
        return;
    }
    
    // Clear existing markers
    clearMapMarkers();
    
    // Add all buildings
    campusData.buildings.forEach(building => {
        addBuildingMarker(campusMap, building, 'admin');
    });
    
    // Fit map to show all buildings
    const bounds = new google.maps.LatLngBounds();
    campusData.buildings.forEach(building => {
        bounds.extend(building.position);
    });
    campusMap.fitBounds(bounds);
    
    showToast('Showing all campus buildings', 'success');
}

function showEmergencyLocations() {
    if (!campusMap) {
        showToast('Map not loaded yet. Please wait a moment.', 'warning');
        return;
    }
    
    // Clear existing markers
    clearMapMarkers();
    
    // Add emergency points
    campusData.emergencyPoints.forEach(point => {
        const marker = new google.maps.Marker({
            position: point.position,
            map: campusMap,
            title: point.name,
            icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                    <svg width="30" height="40" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 0C6.7 0 0 6.7 0 15s6.7 15 15 15 15-6.7 15-15S23.3 0 15 0zm0 25c-5.5 0-10-4.5-10-10s4.5-10 10-10 10 4.5 10 10-4.5 10-10 10z" fill="#ef4444"/>
                        <circle cx="15" cy="15" r="8" fill="white"/>
                        <text x="15" y="19" text-anchor="middle" font-family="Arial" font-size="8" font-weight="bold" fill="#ef4444">🚨</text>
                    </svg>
                `),
                scaledSize: new google.maps.Size(30, 40),
                anchor: new google.maps.Point(15, 40)
            }
        });

        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div class="map-info-window">
                    <div class="map-info-title">${point.name}</div>
                    <div class="map-info-content">
                        ${point.description}<br>
                        <strong>Emergency Phone:</strong> ${point.phone}
                    </div>
                    <div class="map-info-actions">
                        <button class="map-info-btn" onclick="callEmergency('${point.phone}')">Call Now</button>
                    </div>
                </div>
            `
        });

        marker.addListener('click', () => {
            closeAllInfoWindows();
            infoWindow.open(campusMap, marker);
        });

        mapMarkers.push(marker);
        infoWindows.push(infoWindow);
    });
    
    showToast('Showing emergency locations', 'info');
}

function showParkingAreas() {
    if (!campusMap) {
        showToast('Map not loaded yet. Please wait a moment.', 'warning');
        return;
    }
    
    // Clear existing markers
    clearMapMarkers();
    
    // Add parking areas
    campusData.parkingAreas.forEach(area => {
        const marker = new google.maps.Marker({
            position: area.position,
            map: campusMap,
            title: area.name,
            icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                    <svg width="30" height="40" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 0C6.7 0 0 6.7 0 15s6.7 15 15 15 15-6.7 15-15S23.3 0 15 0zm0 25c-5.5 0-10-4.5-10-10s4.5-10 10-10 10 4.5 10 10-4.5 10-10 10z" fill="#f59e0b"/>
                        <circle cx="15" cy="15" r="8" fill="white"/>
                        <text x="15" y="19" text-anchor="middle" font-family="Arial" font-size="10" font-weight="bold" fill="#f59e0b">P</text>
                    </svg>
                `),
                scaledSize: new google.maps.Size(30, 40),
                anchor: new google.maps.Point(15, 40)
            }
        });

        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div class="map-info-window">
                    <div class="map-info-title">${area.name}</div>
                    <div class="map-info-content">
                        Type: ${area.type.charAt(0).toUpperCase() + area.type.slice(1)} parking<br>
                        Capacity: ${area.capacity} spaces<br>
                        <strong>Estimated availability:</strong> ${Math.floor(Math.random() * 30) + 10} spaces
                    </div>
                    <div class="map-info-actions">
                        <button class="map-info-btn" onclick="getDirectionsTo('${area.name}')">Get Directions</button>
                    </div>
                </div>
            `
        });

        marker.addListener('click', () => {
            closeAllInfoWindows();
            infoWindow.open(campusMap, marker);
        });

        mapMarkers.push(marker);
        infoWindows.push(infoWindow);
    });
    
    showToast('Showing parking areas', 'success');
}

function showCampusStats() {
    showToast('Campus Statistics: 4 Buildings, 2 Emergency Points, 3 Parking Areas', 'info');
}

// Utility functions
function closeAllInfoWindows() {
    infoWindows.forEach(infoWindow => {
        infoWindow.close();
    });
}

function clearMapMarkers() {
    mapMarkers.forEach(marker => {
        marker.setMap(null);
    });
    mapMarkers = [];
    infoWindows = [];
}

function getDirectionsTo(locationId) {
    showToast(`Getting directions to ${locationId}...`, 'info');
    // In a real implementation, this would integrate with Google Directions API
}

function getDirectionsToOffice() {
    showToast('Getting directions to faculty office...', 'info');
}

function showBuildingSchedule(buildingId) {
    showToast(`Loading schedule for ${buildingId}...`, 'info');
}

function showClassroomDetails(buildingId) {
    showToast(`Loading classroom details for ${buildingId}...`, 'info');
}

function showBuildingStats(buildingId) {
    showToast(`Loading building statistics for ${buildingId}...`, 'info');
}

function manageBuildingAccess(buildingId) {
    showToast(`Opening access management for ${buildingId}...`, 'info');
}

function callEmergency(phone) {
    showToast(`Emergency contact: ${phone}`, 'warning');
    // In a real implementation, this could open the phone app
}

// Initialize maps when Google Maps API is loaded
window.initMap = initMap;

// Keyboard shortcuts info
console.log('🚀 CampusConnect Keyboard Shortcuts:');
console.log('Ctrl+K: Quick search');
console.log('Escape: Close modals');
console.log('🗺️ Google Maps integration added to all dashboards!');
console.log('Enjoy your modern campus experience!');