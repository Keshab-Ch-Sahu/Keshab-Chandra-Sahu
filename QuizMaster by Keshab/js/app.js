// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('.icon');
let isDarkMode = localStorage.getItem('theme') === 'dark';

// Initialize theme
function updateTheme(dark) {
    document.body.classList.toggle('dark-mode', dark);
    themeIcon.textContent = dark ? '🌙' : '☀️';
    localStorage.setItem('theme', dark ? 'dark' : 'light');
}

// Set initial theme
updateTheme(isDarkMode);

// Theme toggle handler
themeToggle.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    updateTheme(isDarkMode);
    
    // Add rotation animation
    themeIcon.style.transform = 'rotate(360deg)';
    setTimeout(() => {
        themeIcon.style.transform = 'rotate(0)';
    }, 500);
});

// Handle offline/online status
window.addEventListener('online', () => {
    document.body.classList.remove('offline');
});

window.addEventListener('offline', () => {
    document.body.classList.add('offline');
    alert('You are offline. Quiz will continue with cached questions.');
});

// Initialize IndexedDB
const initIndexedDB = () => {
    const request = indexedDB.open('QuizDB', 1);
    
    request.onerror = () => {
        console.error('IndexedDB error:', request.error);
    };
    
    request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('questions')) {
            db.createObjectStore('questions');
        }
    };
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initIndexedDB();
});
