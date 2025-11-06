// DOM Elements
const loginModal = document.getElementById('loginModal');
const loginForm = document.getElementById('loginForm');
const loginBtn = document.getElementById('loginBtn');
const switchToRegister = document.getElementById('switchToRegister');
const userSection = document.getElementById('userSection');
const closeBtn = document.querySelector('.close');

let isLoginMode = true;

// Event Listeners
loginBtn.addEventListener('click', () => {
    loginModal.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
    loginModal.style.display = 'none';
});

switchToRegister.addEventListener('click', (e) => {
    e.preventDefault();
    isLoginMode = !isLoginMode;
    updateFormUI();
});

// Update form UI based on mode
function updateFormUI() {
    const submitBtn = loginForm.querySelector('button[type="submit"]');
    const switchText = loginForm.querySelector('.switch-form');
    
    if (isLoginMode) {
        submitBtn.textContent = 'Login';
        switchText.innerHTML = 'Don\'t have an account? <a href="#" id="switchToRegister">Register</a>';
    } else {
        submitBtn.textContent = 'Register';
        switchText.innerHTML = 'Already have an account? <a href="#" id="switchToRegister">Login</a>';
    }
}

// Handle form submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        if (isLoginMode) {
            await auth.signInWithEmailAndPassword(email, password);
        } else {
            await auth.createUserWithEmailAndPassword(email, password);
        }
        loginModal.style.display = 'none';
        loginForm.reset();
    } catch (error) {
        alert(error.message);
    }
});

// Auth state observer
auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        userSection.innerHTML = `
            <span class="user-email">${user.email}</span>
            <button id="logoutBtn" class="btn">Logout</button>
        `;
        
        // Add logout functionality
        document.getElementById('logoutBtn').addEventListener('click', () => {
            auth.signOut();
        });
    } else {
        // User is signed out
        userSection.innerHTML = `
            <button id="loginBtn" class="btn">Login</button>
        `;
        
        // Reattach login button listener
        document.getElementById('loginBtn').addEventListener('click', () => {
            loginModal.style.display = 'block';
        });
    }
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        loginModal.style.display = 'none';
    }
});
