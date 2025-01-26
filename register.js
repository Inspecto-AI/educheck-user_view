// Toggle facility details visibility
function toggleFacilityDetails(checkbox) {
    const facilityItem = checkbox.closest('.facility-item');
    const details = facilityItem.querySelector('.facility-details');
    const input = details.querySelector('input');

    if (checkbox.checked) {
        details.style.display = 'block';
        input.required = true;
        input.setAttribute('aria-required', 'true');
    } else {
        details.style.display = 'none';
        input.required = false;
        input.removeAttribute('aria-required');
        input.value = '';
    }
}

// Form validation
function validateForm(event) {
    event.preventDefault();

    // Remove existing error messages
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(msg => msg.remove());

    // Reset input styles
    document.querySelectorAll('input, select').forEach(input => {
        input.classList.remove('input-error');
    });

    let isValid = true;

    // Validate Institute Name
    const instituteName = document.getElementById('instituteName');
    if (instituteName.value.trim().length < 3) {
        showError(instituteName, 'Institute name must be at least 3 characters long');
        isValid = false;
    }

    // Validate Government ID
    const govtId = document.getElementById('govtId');
    if (!/^[A-Za-z0-9-]+$/.test(govtId.value)) {
        showError(govtId, 'Government ID should only contain alphanumeric characters and hyphens');
        isValid = false;
    }

    // Validate Email
    const email = document.getElementById('email');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        showError(email, 'Please enter a valid email address');
        isValid = false;
    }

    // Validate Phone Number
    const phone = document.getElementById('phone');
    if (!/^[0-9]{10}$/.test(phone.value)) {
        showError(phone, 'Please enter a valid 10-digit phone number');
        isValid = false;
    }

    // Validate Courses (at least one should be selected)
    const courses = document.querySelectorAll('input[name="courses"]:checked');
    if (courses.length === 0) {
        const coursesFieldset = document.querySelector('fieldset');
        showError(coursesFieldset, 'Please select at least one course');
        isValid = false;
    }

    // Validate Facility Details
    document.querySelectorAll('.facility-item').forEach(item => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        const details = item.querySelector('.facility-details');
        const input = details?.querySelector('input');

        if (checkbox.checked && input) {
            if (!input.value || input.value < 1) {
                showError(input, 'Please enter a valid number');
                isValid = false;
            }
        }
    });

    if (isValid) {
        submitRegistration();
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
        'Institute name must be at least 3 characters long': 'संस्थान का नाम कम से कम 3 अक्षर लंबा होना चाहिए',
        'Government ID should only contain alphanumeric characters and hyphens': 'सरकारी आईडी में केवल अक्षर, संख्याएं और हाइफ़न होने चाहिए',
        'Please enter a valid email address': 'कृपया एक वैध ईमेल पता दर्ज करें',
        'Please enter a valid 10-digit phone number': 'कृपया 10 अंकों का वैध फ़ोन नंबर दर्ज करें',
        'Please select at least one course': 'कृपया कम से कम एक पाठ्यक्रम का चयन करें',
        'Please enter a valid number': 'कृपया एक वैध संख्या दर्ज करें'
    };
    return errorMessages[englishMessage] || englishMessage;
}

// Submit registration
async function submitRegistration() {
    const formData = new FormData(document.getElementById('registerForm'));

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            window.location.href = '/registration-success';
        } else {
            showError(document.querySelector('.register-submit-btn'), data.message);
        }
    } catch (error) {
        showError(document.querySelector('.register-submit-btn'), 'An error occurred. Please try again.');
    }
} 