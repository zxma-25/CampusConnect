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
    checkAuthState();
    initializeAnimations();
    
    // Page-specific initialization
    if (document.getElementById('schedule-container')) {
        renderSchedule();
        startLiveUpdates();
    }
    
    // Update welcome message for dashboard pages
    if (window.location.pathname.includes('dashboard')) {
        updateWelcomeMessage();
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

function redirectToUserDashboard(user) {
    if (user.email.includes('admin')) {
        window.location.href = 'admin-dashboard.html';
    } else if (user.email.includes('teacher')) {
        window.location.href = 'teacher-dashboard.html';
    } else {
        window.location.href = 'student-dashboard.html';
    }
}

function checkAuthState() {
    const storedUser = sessionStorage.getItem('user');
    
    // For dashboard pages, redirect if not logged in
    if (window.location.pathname.includes('dashboard')) {
        if (!storedUser) {
            window.location.href = 'index.html';
            return;
        }
        
        try {
            const user = JSON.parse(storedUser);
            
            // Role-based access control
            if (window.location.pathname.includes('admin-dashboard') && !user.email.includes('admin')) {
                redirectToUserDashboard(user);
            } else if (window.location.pathname.includes('teacher-dashboard') && !user.email.includes('teacher')) {
                redirectToUserDashboard(user);
            } else if (window.location.pathname.includes('student-dashboard') && 
                       !user.email.includes('student') && !user.email.includes('lesedi')) {
                redirectToUserDashboard(user);
            }
        } catch (e) {
            sessionStorage.removeItem('user');
            window.location.href = 'index.html';
        }
    } else {
        // For main page, redirect if already logged in
        if (storedUser) {
            try {
                app.currentUser = JSON.parse(storedUser);
                redirectToUserDashboard(app.currentUser);
            } catch (e) {
                sessionStorage.removeItem('user');
            }
        }
    }
}

function updateWelcomeMessage() {
    const storedUser = sessionStorage.getItem('user');
    const welcomeTitle = document.getElementById('welcome-title');
    
    if (storedUser && welcomeTitle) {
        try {
            const user = JSON.parse(storedUser);
            const username = user.email.split('@')[0];
            
            if (window.location.pathname.includes('admin-dashboard')) {
                welcomeTitle.textContent = `Welcome, Admin ${username}!`;
            } else if (window.location.pathname.includes('teacher-dashboard')) {
                welcomeTitle.textContent = `Welcome, Prof. ${username}!`;
            } else if (window.location.pathname.includes('student-dashboard')) {
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

// Keyboard shortcuts info
console.log('🚀 CampusConnect Keyboard Shortcuts:');
console.log('Ctrl+K: Quick search');
console.log('Escape: Close modals');
console.log('Enjoy your modern campus experience!');