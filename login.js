// Password visibility toggle
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('toggleIcon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.src = 'images/eye-off.svg';
        toggleIcon.alt = 'Hide password';
    } else {
        passwordInput.type = 'password';
        toggleIcon.src = 'images/eye.svg';
        toggleIcon.alt = 'Show password';
    }
}

// Form validation
function validateForm(event) {
    event.preventDefault();

    // Remove any existing error messages
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(msg => msg.remove());

    // Reset input styles
    document.querySelectorAll('input').forEach(input => {
        input.classList.remove('input-error');
    });

    let isValid = true;

    // Validate Institute Code
    const instituteCode = document.getElementById('instituteCode');
    if (!/^[A-Za-z0-9]+$/.test(instituteCode.value)) {
        showError(instituteCode, 'Institute code should only contain alphanumeric characters');
        isValid = false;
    }

    // Validate Password
    const password = document.getElementById('password');
    if (password.value.length < 6) {
        showError(password, 'Password must be at least 6 characters long');
        isValid = false;
    }

    // Validate reCAPTCHA
    const recaptchaResponse = grecaptcha.getResponse();
    if (!recaptchaResponse) {
        const recaptchaContainer = document.querySelector('.g-recaptcha');
        showError(recaptchaContainer, 'Please complete the CAPTCHA');
        isValid = false;
    }

    if (isValid) {
        // Submit the form
        submitLogin();
    }

    return false;
}

// Show error message
function showError(element, message) {
    element.classList.add('input-error');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <span class="en">${message}</span>
        <span class="hi">${getHindiErrorMessage(message)}</span>
    `;
    element.parentNode.appendChild(errorDiv);
}

// Hindi error messages
function getHindiErrorMessage(englishMessage) {
    const errorMessages = {
        'Institute code should only contain alphanumeric characters': 'संस्थान कोड में केवल अक्षर और संख्याएं होनी चाहिए',
        'Password must be at least 6 characters long': 'पासवर्ड कम से कम 6 अक्षर लंबा होना चाहिए',
        'Please complete the CAPTCHA': 'कृपया कैप्चा पूरा करें'
    };
    return errorMessages[englishMessage] || englishMessage;
}

// Submit login
async function submitLogin() {
    const formData = new FormData(document.getElementById('loginForm'));

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            window.location.href = '/dashboard';
        } else {
            showError(document.querySelector('.login-submit-btn'), data.message);
        }
    } catch (error) {
        showError(document.querySelector('.login-submit-btn'), 'An error occurred. Please try again.');
    }
} 