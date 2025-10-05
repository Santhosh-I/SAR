// Rabbit Hole Adventures JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeRabbitAnimation();
    initializeHoleNavigation();
    initializeFormHandling();
    initializeMobileMenu();
});

// Navigation functionality
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname;
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
}

// Rabbit animation controls
function initializeRabbitAnimation() {
    const rabbit = document.getElementById('rabbit');
    const startButton = document.querySelector('.cta-button');
    
    if (rabbit) {
        // Add random animation variations
        rabbit.addEventListener('animationiteration', function() {
            // Add slight random delays to make it more organic
            const delay = Math.random() * 0.5;
            rabbit.style.animationDelay = delay + 's';
        });
    }
    
    if (startButton) {
        startButton.addEventListener('click', startRabbitAnimation);
    }
}

function startRabbitAnimation() {
    const rabbit = document.getElementById('rabbit');
    const holes = document.querySelectorAll('.hole');
    
    if (rabbit) {
        // Add special animation class
        rabbit.classList.add('super-hop');
        
        // Remove class after animation
        setTimeout(() => {
            rabbit.classList.remove('super-hop');
        }, 3000);
        
        // Make holes glow in sequence
        holes.forEach((hole, index) => {
            setTimeout(() => {
                hole.classList.add('active-glow');
                setTimeout(() => {
                    hole.classList.remove('active-glow');
                }, 1000);
            }, index * 500);
        });
    }
    
    // Show success message
    showNotification('The rabbit is on an adventure!', 'success');
}

// Hole navigation functionality
function initializeHoleNavigation() {
    const holes = document.querySelectorAll('.hole');
    
    holes.forEach(hole => {
        hole.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            if (page) {
                // Add click animation
                this.classList.add('hole-clicked');
                
                // Navigate after animation
                setTimeout(() => {
                    window.location.href = `/${page}`;
                }, 500);
            }
        });
        
        // Add hover sound effect simulation
        hole.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) translateY(-5px)';
        });
        
        hole.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) translateY(0)';
        });
    });
}

// Form handling
function initializeFormHandling() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const submitBtn = form.querySelector('button[type="submit"]');
            
            if (submitBtn) {
                submitBtn.innerHTML = '<span class="loading"></span> Sending...';
                submitBtn.disabled = true;
            }
            
            // Re-enable after delay (for demo purposes)
            setTimeout(() => {
                if (submitBtn) {
                    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
                    submitBtn.disabled = false;
                }
            }, 2000);
        });
    });
}

// Mobile menu functionality
function initializeMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// Utility functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `flash-message ${type}`;
    notification.textContent = message;
    
    const container = document.querySelector('.flash-messages') || createFlashContainer();
    container.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function createFlashContainer() {
    const container = document.createElement('div');
    container.className = 'flash-messages';
    document.body.appendChild(container);
    return container;
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// API interaction example
async function fetchRabbitStatus() {
    try {
        const response = await fetch('/api/rabbit-position');
        const data = await response.json();
        console.log('Rabbit status:', data);
    } catch (error) {
        console.error('Error fetching rabbit status:', error);
    }
}

// Service worker registration (for offline functionality)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
            console.log('ServiceWorker registration successful');
        }).catch(function(err) {
            console.log('ServiceWorker registration failed');
        });
    });
}

// Add CSS animation classes dynamically
const style = document.createElement('style');
style.textContent = `
    .super-hop {
        animation: superHop 3s ease-in-out !important;
    }
    
    @keyframes superHop {
        0% { transform: translateY(-50%) scale(1); }
        25% { transform: translateY(-100%) scale(1.2) rotate(360deg); }
        50% { transform: translateY(-50%) scale(1); }
        75% { transform: translateY(-80%) scale(1.1) rotate(-180deg); }
        100% { transform: translateY(-50%) scale(1); }
    }
    
    .active-glow {
        filter: drop-shadow(0 0 30px rgba(243, 156, 18, 1)) !important;
        animation: pulseGlow 1s ease-in-out !important;
    }
    
    @keyframes pulseGlow {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }
    
    .hole-clicked {
        animation: holeClick 0.5s ease-in-out;
    }
    
    @keyframes holeClick {
        0% { transform: scale(1); }
        50% { transform: scale(0.9); filter: brightness(0.5); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);


// Enhanced cosmic portal effects
function enhanceCosmicPortals() {
    const holes = document.querySelectorAll('.hole-inner');
    
    holes.forEach((hole, index) => {
        // Add cosmic particles
        for (let i = 0; i < 10; i++) {
            const particle = document.createElement('div');
            particle.className = 'cosmic-particle';
            particle.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: rgba(147, 51, 234, 0.8);
                border-radius: 50%;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                animation: particleFloat ${3 + Math.random() * 4}s infinite ease-in-out;
                animation-delay: ${Math.random() * 2}s;
            `;
            hole.appendChild(particle);
        }
    });
}

// Add particle animation CSS
const cosmicStyle = document.createElement('style');
cosmicStyle.textContent = `
    @keyframes particleFloat {
        0%, 100% { 
            transform: translateY(0) scale(0.5);
            opacity: 0; 
        }
        50% { 
            transform: translateY(-20px) scale(1);
            opacity: 1; 
        }
    }
    
    .cosmic-particle {
        pointer-events: none;
    }
`;
document.head.appendChild(cosmicStyle);

// Initialize on page load
document.addEventListener('DOMContentLoaded', enhanceCosmicPortals);
