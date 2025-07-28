// Calendar functionality for CampusConnect
let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

// Calendar data
const calendarData = {
    courses: [
        { day: 'Monday', time: '09:00-10:30', course: 'Advanced Mathematics', room: 'Room 201', instructor: 'Prof. Johnson', type: 'lecture' },
        { day: 'Monday', time: '14:00-15:30', course: 'English Literature', room: 'Room 305', instructor: 'Prof. Williams', type: 'lecture' },
        { day: 'Monday', time: '16:00-17:30', course: 'Physics Fundamentals', room: 'Lab 103', instructor: 'Dr. Brown', type: 'lab' },
        { day: 'Tuesday', time: '11:00-12:30', course: 'Statistics & Probability', room: 'Room 105', instructor: 'Dr. Smith', type: 'lecture' },
        { day: 'Wednesday', time: '09:00-10:30', course: 'Advanced Mathematics', room: 'Room 201', instructor: 'Prof. Johnson', type: 'lecture' },
        { day: 'Wednesday', time: '14:00-15:30', course: 'English Literature', room: 'Room 305', instructor: 'Prof. Williams', type: 'lecture' },
        { day: 'Wednesday', time: '16:00-17:30', course: 'Physics Fundamentals', room: 'Lab 103', instructor: 'Dr. Brown', type: 'lab' },
        { day: 'Thursday', time: '11:00-12:30', course: 'Statistics & Probability', room: 'Room 105', instructor: 'Dr. Smith', type: 'lecture' },
        { day: 'Friday', time: '09:00-10:30', course: 'Advanced Mathematics', room: 'Room 201', instructor: 'Prof. Johnson', type: 'lecture' },
        { day: 'Friday', time: '16:00-17:30', course: 'Physics Fundamentals', room: 'Lab 103', instructor: 'Dr. Brown', type: 'lab' }
    ],
    holidays: [
        { date: '2024-12-25', title: 'Christmas Day', type: 'holiday' },
        { date: '2024-12-31', title: 'New Year\'s Eve', type: 'holiday' },
        { date: '2025-01-01', title: 'New Year\'s Day', type: 'holiday' },
        { date: '2025-01-15', title: 'Spring Semester Begins', type: 'academic' }
    ],
    assignments: [
        { date: '2024-12-15', title: 'Math Assignment #3', course: 'MATH101', type: 'assignment' },
        { date: '2024-12-18', title: 'English Final Essay', course: 'ENG101', type: 'assignment' },
        { date: '2024-12-20', title: 'Physics Lab Report', course: 'PHY101', type: 'assignment' }
    ]
};

function renderCalendar() {
    const grid = document.getElementById('calendar-grid');
    const monthDisplay = document.getElementById('current-month');
    
    if (!grid || !monthDisplay) return;
    
    // Update month display
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
    monthDisplay.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    
    // Clear grid
    grid.innerHTML = '';
    
    // Get first day of month and number of days
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    // Generate calendar days
    for (let i = 0; i < 42; i++) {
        const dayDate = new Date(startDate);
        dayDate.setDate(startDate.getDate() + i);
        
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        
        // Check if it's current month
        if (dayDate.getMonth() !== currentMonth) {
            dayElement.classList.add('other-month');
        }
        
        // Check if it's today
        const today = new Date();
        if (dayDate.toDateString() === today.toDateString()) {
            dayElement.classList.add('today');
        }
        
        // Add day number
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = dayDate.getDate();
        dayElement.appendChild(dayNumber);
        
        // Add events for this day
        const events = getEventsForDate(dayDate);
        events.forEach(event => {
            const eventElement = document.createElement('div');
            eventElement.className = `calendar-event ${event.type}`;
            eventElement.textContent = event.title;
            eventElement.title = `${event.title} - ${event.details || ''}`;
            dayElement.appendChild(eventElement);
        });
        
        grid.appendChild(dayElement);
    }
}

function getEventsForDate(date) {
    const events = [];
    const dateString = date.toISOString().split('T')[0];
    
    // Check holidays
    calendarData.holidays.forEach(holiday => {
        if (holiday.date === dateString) {
            events.push({
                title: holiday.title,
                type: holiday.type,
                details: 'Holiday'
            });
        }
    });
    
    // Check assignments
    calendarData.assignments.forEach(assignment => {
        if (assignment.date === dateString) {
            events.push({
                title: assignment.title,
                type: 'assignment',
                details: assignment.course
            });
        }
    });
    
    // Check courses (recurring weekly)
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = dayNames[date.getDay()];
    
    calendarData.courses.forEach(course => {
        if (course.day === dayName) {
            events.push({
                title: course.course,
                type: 'course',
                details: `${course.time} - ${course.room}`
            });
        }
    });
    
    return events;
}

function previousMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
}

function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
}

function today() {
    currentDate = new Date();
    currentMonth = currentDate.getMonth();
    currentYear = currentDate.getFullYear();
    renderCalendar();
}

// Initialize calendar when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    renderCalendar();
    
    // Set today's date in quick add form
    const today = new Date().toISOString().split('T')[0];
    const eventDateInput = document.getElementById('event-date');
    if (eventDateInput) {
        eventDateInput.value = today;
    }
});

// Make functions globally available
window.previousMonth = previousMonth;
window.nextMonth = nextMonth;
window.today = today; 