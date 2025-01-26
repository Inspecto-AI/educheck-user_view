function changeLanguage() {
    const select = document.getElementById('language-select');
    document.documentElement.lang = select.value;

    // Save language preference
    localStorage.setItem('preferred-language', select.value);
}

// Set initial language
document.addEventListener('DOMContentLoaded', () => {
    const savedLanguage = localStorage.getItem('preferred-language') || 'en';
    document.getElementById('language-select').value = savedLanguage;
    document.documentElement.lang = savedLanguage;
});

// Add smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Enhanced slider with fade effect
function initSlider() {
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
    let isAnimating = false;

    function showSlide(index) {
        if (isAnimating) return;
        isAnimating = true;

        slides.forEach(slide => {
            slide.style.opacity = 0;
            slide.style.zIndex = 0;
        });

        slides[index].style.zIndex = 1;
        slides[index].style.opacity = 1;

        setTimeout(() => {
            isAnimating = false;
        }, 500);
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    // Add touch support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    document.querySelector('.slider').addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });

    document.querySelector('.slider').addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchStartX - touchEndX > 50) {
            nextSlide();
        } else if (touchEndX - touchStartX > 50) {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        }
    });

    setInterval(nextSlide, 5000);
}

// Initialize slider when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    initSlider();
}); 