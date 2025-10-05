// Animation utilities
document.addEventListener('DOMContentLoaded', function() {
    // Initialize GSAP animations if available
    if (typeof gsap !== 'undefined') {
        // Hero text animation
        gsap.from('.hero-title', {
            duration: 1,
            y: 50,
            opacity: 0,
            ease: 'power2.out'
        });

        gsap.from('.hero-subtitle', {
            duration: 1,
            y: 30,
            opacity: 0,
            delay: 0.2,
            ease: 'power2.out'
        });

        gsap.from('.hero-description', {
            duration: 1,
            y: 30,
            opacity: 0,
            delay: 0.4,
            ease: 'power2.out'
        });

        gsap.from('.hero-buttons', {
            duration: 1,
            y: 30,
            opacity: 0,
            delay: 0.6,
            ease: 'power2.out'
        });

        // Feature cards animation
        gsap.from('.feature-card', {
            duration: 0.8,
            y: 50,
            opacity: 0,
            stagger: 0.2,
            scrollTrigger: {
                trigger: '.features-section',
                start: 'top 80%'
            }
        });
    }

    // Fallback animations without GSAP
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 100 + 200);
    });
});

// Scroll-triggered animations
window.addEventListener('scroll', function() {
    const cards = document.querySelectorAll('.feature-card');
    cards.forEach(card => {
        const cardTop = card.getBoundingClientRect().top;
        const cardVisible = 150;

        if (cardTop < window.innerHeight - cardVisible) {
            card.classList.add('fade-in-visible');
        }
    });
});
