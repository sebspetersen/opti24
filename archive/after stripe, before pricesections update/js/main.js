// Handle image loading errors
document.querySelectorAll('img').forEach(img => {
    img.onerror = function() {
        console.error('Error loading image:', img.src);
        if (img.closest('.logo-icon') || img.closest('.nav-content')) {
            img.style.display = 'none';
        }
    };
});

// Loading screen
window.addEventListener('load', () => {
    setTimeout(() => {
        document.querySelector('.loader').classList.add('fade-out');
    }, 1500);
});

// Navigation scroll effect
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Initialize buy button
document.querySelector('.buy-button').addEventListener('click', () => {
    // Add your Stripe integration here
    console.log('Processing purchase');
});