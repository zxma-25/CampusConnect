// Messages functionality for CampusConnect
let countdownInterval;

// Countdown to end of semester
function updateCountdown() {
    const endDate = new Date('December 20, 2024 23:59:59').getTime();
    const now = new Date().getTime();
    const distance = endDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

    const countdownElement = document.getElementById('countdown');
    if (countdownElement) {
        if (distance < 0) {
            countdownElement.innerHTML = 'Semester Ended!';
            // Stop the countdown when it reaches zero
            if (countdownInterval) {
                clearInterval(countdownInterval);
            }
        } else {
            countdownElement.innerHTML = `${days}d ${hours}h ${minutes}m`;
        }
    }
}

// Initialize messages functionality
function initMessages() {
    // Start countdown
    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 60000); // Update every minute
}

// Clean up when page is unloaded
function cleanupMessages() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initMessages();
});

// Clean up when page is unloaded
window.addEventListener('beforeunload', cleanupMessages); 