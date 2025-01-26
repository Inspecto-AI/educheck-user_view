// Form steps handling
let currentStep = 1;
const totalSteps = 3;

// Show active form and hide others
function showStep(step) {
    document.querySelectorAll('.step-form').forEach(form => {
        form.classList.remove('active');
    });
    document.getElementById(getFormId(step)).classList.add('active');
}

function getFormId(step) {
    switch(step) {
        case 1: return 'verificationForm';
        case 2: return 'otpForm';
        case 3: return 'resetForm';
        default: return 'verificationForm';
    }
}

// OTP Timer
let timeLeft = 120; // 2 minutes
let timerId = null;

function startTimer() {
    timeLeft = 120;
    if (timerId) clearInterval(timerId);
    
    timerId = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        document.getElementById('timer').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (timeLeft === 0) {
            clearInterval(timerId);
            // Enable resend OTP button
        } else {
            timeLeft--;
        }
    }, 1000);
}

// OTP Input Handling
document.querySelectorAll('.otp-input').forEach((input, index) => {
    input.addEventListener('keyup', (e) => {
        if (e.key !== 'Backspace' && input.value) {
            const next = input.nextElementSibling;
            if (next) next.focus();
        }
    });
    
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !input.value) {
            const prev = input.previousElementSibling;
            if (prev) prev.focus();
        }
    });
});

// Password Toggle
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(`${inputId}Toggle`);
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.src = 'images/eye-off.svg';
        icon.alt = 'Hide password';
    } else {
        input.type = 'password';
        icon.src = 'images/eye.svg';
        icon.alt = 'Show password';
    }
}

// Form Submissions
document.getElementById('verificationForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    // Validate and send OTP
    try {
        // API call to send OTP
        currentStep = 2;
        showStep(currentStep);
        startTimer();
    } catch (error) {
        showError('Failed to send OTP. Please try again.');
    }
});

document.getElementById('otpForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    // Validate OTP
    try {
        // API call to verify OTP
        currentStep = 3;
        showStep(currentStep);
    } catch (error) {
        showError('Invalid OTP. Please try again.');
    }
});

document.getElementById('resetForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    // Validate passwords
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (newPassword !== confirmPassword) {
        showError('Passwords do not match');
        return;
    }
    
    try {
        // API call to reset password
        window.location.href = '/login.html?reset=success';
    } catch (error) {
        showError('Failed to reset password. Please try again.');
    }
});

// Error Handling
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <span class="en">${message}</span>
        <span class="hi">${getHindiErrorMessage(message)}</span>
    `;
    
    const activeForm = document.querySelector('.step-form.active');
    const existingError = activeForm.querySelector('.error-message');
    if (existingError) existingError.remove();
    
    activeForm.appendChild(errorDiv);
}

// Hindi error messages
function getHindiErrorMessage(englishMessage) {
    const errorMessages = {
        'Passwords do not match': 'पासवर्ड मेल नहीं खाते',
        'Failed to send OTP. Please try again.': 'OTP भेजने में विफल। कृपया पुनः प्रयास करें।',
        'Invalid OTP. Please try again.': 'अमान्य OTP। कृपया पुनः प्रयास करें।',
        'Failed to reset password. Please try again.': 'पासवर्ड रीसेट करने में विफल। कृपया पुनः प्रयास करें।'
    };
    return errorMessages[englishMessage] || englishMessage;
} 