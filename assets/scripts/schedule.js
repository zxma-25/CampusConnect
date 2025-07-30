// Calendar functionality for CampusConnect
let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

// Calendar data
const calendarData = {
  topics: [
        { day: 'Monday', time: '09:00-10:30', topic: 'Bi-weekly HR meeting', room: 'Room 201', facilitator: ' Mr. Manzini' },
        { day: 'Monday', time: '14:00-15:30', topic: 'Brainstorm Meeting', room: 'Room 305',  facilitator: 'Ms. le Roux'},
        { day: 'Monday', time: '16:00-17:30', topic: 'Disciplinary Meetings', room: 'Hall',  facilitator: ' Mrs. Smith' },
        { day: 'Tuesday', time: '11:00-12:30', topic: 'Team Meeting', room: 'Room 105',  facilitator: 'Mr. Eddie', },
        { day: 'Wednesday', time: '09:00-10:30', topic: 'Bi-weekly HR meeting', room: 'Room 201',  facilitator: ' Mr. Manzini' },
        { day: 'Wednesday', time: '14:00-15:30', topic: 'Brainstorm Meeting', room: 'Room 305',  facilitator: 'Ms. le Roux' },
        { day: 'Wednesday', time: '16:00-17:30', topic: 'Team Meeting', room: 'Lab 103',  facilitator: ' Mrs. Smith'},
        { day: 'Thursday', time: '11:00-12:30', topic: 'Performance Evaluations', room: 'Room 105',  facilitator: 'Mr. Eddie' },
        { day: 'Friday', time: '09:00-10:30', topic: 'Brainstorm Meeting', room: 'Room 201',  facilitator: ' Mr. Manzini' },
        { day: 'Friday', time: '16:00-17:30', topic: 'Exit Interviews', room: 'Lab 103',  facilitator: ' Mrs. Smith' }
    ],
    holidays: [
        { date: '2024-12-25', title: 'Christmas Day', type: 'holiday' },
        { date: '2024-12-31', title: 'New Year\'s Eve', type: 'holiday' },
        { date: '2025-01-01', title: 'New Year\'s Day', type: 'holiday' },
        { date: '2025-01-15', title: 'Spring Semester Begins', type: 'academic' }
    ],
    meetings: [
        { date: '2024-12-15', title: 'ER Meeting', topic: 'Discussing the the state of ER in the office', },
        { date: '2024-12-18', title: 'Employee Evaluation', topic: 'Bi-annual employee evaluations',  },
        { date: '2024-12-20', title: 'Peer Reviews', topic: 'Emplyees evaluate each other in teams of 2',  }
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
    calendarData.meetings.forEach(meeting => {
        if (meeting.date === dateString) {
            events.push({
                title: meeting.title,
                type: 'meeting',
                details: meeting.topic
            });
        }
    });
    
    // Check courses (recurring weekly)
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = dayNames[date.getDay()];
    
    calendarData.topics.forEach(course => {
        if (course.day === dayName) {
            events.push({
                title: topic.topic,
                type: 'topic',
                details: `${topic.time} - ${topic.room}`
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