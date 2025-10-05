// Main JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Meta-Verse SAR Visualization loaded');
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add loading animation
    const loadingElements = document.querySelectorAll('.loading');
    loadingElements.forEach(el => {
        setTimeout(() => {
            el.classList.remove('loading');
        }, 1000);
    });
});
