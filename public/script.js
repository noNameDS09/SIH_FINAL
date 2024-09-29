document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const toggleToSignup = document.getElementById('toggleToSignup');
    const toggleToLogin = document.getElementById('toggleToLogin');

    const emailError = document.getElementById('emailError');
    const signupError = document.getElementById('signupError');
    const loginError = document.getElementById('loginError');

    toggleToSignup.onclick = () => {
        loginForm.style.display = "none";
        signupForm.style.display = "block";
        clearErrors();
    };

    toggleToLogin.onclick = () => {
        signupForm.style.display = "none";
        loginForm.style.display = "block";
        clearErrors();
    };

    function clearErrors() {
        emailError.style.display = "none";
        signupError.style.display = "none";
        loginError.style.display = "none";
    }

    // Handle Signup
    signupBtn.onclick = async (e) => {
        e.preventDefault();
        clearErrors();

        const email = document.getElementById('emailSignup').value;
        const username = document.getElementById('usernameSignup').value;
        const password = document.getElementById('passwordSignup').value;

        // Email Validation
        if (!email.includes('@')) {
            emailError.textContent = 'Invalid email. Please include "@" in your email address.';
            emailError.style.display = "block";
            return;
        }

        const response = await fetch('http://localhost:3001/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, username, password }),
        });

        if (response.ok) {
            window.location.href = "http://localhost:3001/Future_prediction.html"; 
        } else {
            const errorMessage = await response.text();
            if (errorMessage.includes('   User with this email or username already exists.')) {
                emailError.textContent = errorMessage;
                emailError.style.display = "block";
            } else {
                signupError.textContent = errorMessage; 
                signupError.style.display = "block";
            }
        }
    };

    // Handle Login
    loginBtn.onclick = async (e) => {
        e.preventDefault();
        clearErrors();

        const username = document.getElementById('usernameLogin').value;
        const password = document.getElementById('passwordLogin').value;

        const response = await fetch('http://localhost:3001/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            window.location.href = "/Future_prediction.html";
        } else {
            const errorMessage = await response.text();
            loginError.textContent = errorMessage;
            loginError.style.display = "block";
        }
    };
});
