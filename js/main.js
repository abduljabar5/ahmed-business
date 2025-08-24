// TalentPro Main JavaScript - Vanilla JS Implementation

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons
    lucide.createIcons();
    
    // Initialize all features
    initNavigation();
    initScrollAnimations();
    initContactForm();
    initNewsletterForm();
    initServices();
    initReducedMotion();
    
    console.log('TalentPro site initialized successfully');
});

// Navigation functionality
function initNavigation() {
    const nav = document.getElementById('navigation');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Handle scroll behavior for navigation
    let isScrolled = false;
    const isHomePage = window.location.pathname === '/' || window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/');
    
    function updateNavigation() {
        const scrollY = window.scrollY;
        const shouldBeScrolled = scrollY > 50;
        
        if (shouldBeScrolled !== isScrolled) {
            isScrolled = shouldBeScrolled;
            
            if (nav) {
                if (isScrolled || !isHomePage) {
                    nav.className = 'fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-background/95 backdrop-blur-md shadow-lg py-2';
                    // Update nav link colors for scrolled state
                    navLinks.forEach(link => {
                        if (link.classList.contains('active')) {
                            // Active links should be accent color when scrolled
                            link.className = link.className.replace('text-white', 'text-accent');
                        } else {
                            // Non-active links should be foreground color when scrolled
                            link.className = link.className.replace('text-white', 'text-foreground');
                        }
                    });
                    // Update logo text color
                    const logoText = nav.querySelector('.text-xl');
                    if (logoText) {
                        logoText.className = logoText.className.replace('text-white', 'text-foreground');
                    }
                    // Update mobile menu button color
                    if (mobileMenuButton) {
                        mobileMenuButton.className = mobileMenuButton.className.replace('text-white', 'text-foreground');
                    }
                } else if (isHomePage) {
                    nav.className = 'fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-transparent py-4';
                    // Revert nav link colors for transparent state
                    navLinks.forEach(link => {
                        if (link.classList.contains('active')) {
                            // Active links should be white when not scrolled on homepage
                            link.className = link.className.replace('text-accent', 'text-white');
                        } else {
                            // Non-active links should be white when not scrolled on homepage
                            link.className = link.className.replace('text-foreground', 'text-white');
                        }
                    });
                    // Revert logo text color
                    const logoText = nav.querySelector('.text-xl');
                    if (logoText) {
                        logoText.className = logoText.className.replace('text-foreground', 'text-white');
                    }
                    // Revert mobile menu button color
                    if (mobileMenuButton) {
                        mobileMenuButton.className = mobileMenuButton.className.replace('text-foreground', 'text-white');
                    }
                }
            }
        }
    }
    
    // Initial navigation state
    updateNavigation();
    
    // Ensure correct initial state for homepage on page load
    if (isHomePage) {
        setTimeout(() => {
            updateNavigation();
        }, 100);
    }
    
    // Listen to scroll events with throttling for better performance
    let ticking = false;
    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateNavigation();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', onScroll);
    
    // Mobile menu toggle
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            const isHidden = mobileMenu.classList.contains('hidden');
            
            if (isHidden) {
                mobileMenu.classList.remove('hidden');
                // Change icon to X
                mobileMenuButton.innerHTML = '<i data-lucide="x" class="w-6 h-6"></i>';
            } else {
                mobileMenu.classList.add('hidden');
                // Change icon back to menu
                mobileMenuButton.innerHTML = '<i data-lucide="menu" class="w-6 h-6"></i>';
            }
            
            // Re-initialize lucide icons
            lucide.createIcons();
        });
        
        // Close mobile menu when clicking on links
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
                mobileMenuButton.innerHTML = '<i data-lucide="menu" class="w-6 h-6"></i>';
                lucide.createIcons();
            });
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = nav ? nav.offsetHeight : 0;
                const targetPosition = target.offsetTop - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll animations for elements coming into view
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    // Intersection Observer for fade-in animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate in
    const animateElements = document.querySelectorAll('.stat-item, .card-hover, .timeline-container > div');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
    
    // Hero content animation on page load
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        setTimeout(() => {
            heroContent.classList.remove('opacity-0', 'translate-y-10');
            heroContent.classList.add('transition-all', 'duration-1000');
        }, 300);
    }
}

// Contact form functionality
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const successModal = document.getElementById('success-modal');
    
    if (!contactForm) return;
    
    // Form validation
    function validateForm() {
        let isValid = true;
        const formData = new FormData(contactForm);
        
        // Clear previous errors
        document.querySelectorAll('.form-error').forEach(error => {
            error.classList.add('hidden');
        });
        
        document.querySelectorAll('input, textarea').forEach(field => {
            field.classList.remove('border-destructive');
        });
        
        // Validate required fields
        const requiredFields = contactForm.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                showFieldError(field, `${field.name} is required`);
                isValid = false;
            }
        });
        
        // Email validation
        const emailField = document.getElementById('email');
        if (emailField && emailField.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailField.value)) {
                showFieldError(emailField, 'Please enter a valid email address');
                isValid = false;
            }
        }
        
        return isValid;
    }
    
    function showFieldError(field, message) {
        field.classList.add('border-destructive');
        const errorElement = field.parentElement.querySelector('.form-error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.remove('hidden');
        }
    }
    
    // Clear errors when user starts typing
    contactForm.addEventListener('input', function(e) {
        const field = e.target;
        if (field.tagName === 'INPUT' || field.tagName === 'TEXTAREA') {
            field.classList.remove('border-destructive');
            const errorElement = field.parentElement.querySelector('.form-error');
            if (errorElement) {
                errorElement.classList.add('hidden');
            }
        }
    });
    
    // Form submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        // Disable submit button and show loading state
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <div class="w-5 h-5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin"></div>
                <span>Sending...</span>
            `;
        }
        
        // Simulate form submission (replace with actual form submission logic)
        setTimeout(() => {
            // Reset form
            contactForm.reset();
            
            // Reset submit button
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = `
                    <i data-lucide="send" class="w-5 h-5"></i>
                    <span>Send Message</span>
                `;
                lucide.createIcons();
            }
            
            // Show success modal
            if (successModal) {
                successModal.classList.remove('hidden');
            }
        }, 2000);
    });
}

// Success modal close functionality
function closeSuccessModal() {
    const successModal = document.getElementById('success-modal');
    if (successModal) {
        successModal.classList.add('hidden');
    }
}
window.closeSuccessModal = closeSuccessModal;

// Newsletter form functionality
function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletter-form');
    
    if (!newsletterForm) return;
    
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = this.querySelector('input[type="email"]').value;
        const submitBtn = this.querySelector('button[type="submit"]');
        
        if (!email) {
            alert('Please enter your email address');
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return;
        }
        
        // Disable button temporarily
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Subscribing...';
        submitBtn.disabled = true;
        
        // Simulate subscription (replace with actual newsletter subscription logic)
        setTimeout(() => {
            alert('Thank you for subscribing! You will receive our latest updates.');
            this.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
}

// Services page functionality
function initServices() {
    const services = [
        {
            icon: 'users',
            title: 'Executive Search',
            subtitle: 'Lorem Ipsum Leadership',
            description: 'Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
        },
        {
            icon: 'target',
            title: 'Professional Recruiting',
            subtitle: 'Lorem Ipsum Talent',
            description: 'Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum sed ut perspiciatis unde omnis iste natus error.'
        },
        {
            icon: 'award',
            title: 'Interim Solutions',
            subtitle: 'Lorem Ipsum Bridge',
            description: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.'
        },
        {
            icon: 'briefcase',
            title: 'Talent Advisory',
            subtitle: 'Lorem Ipsum Strategy',
            description: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet consectetur adipisci velit sed quia non numquam eius modi tempora incidunt.'
        }
    ];
    
    let activeServiceIndex = 0;
    
    window.setActiveService = function(index) {
        if (index < 0 || index >= services.length) return;
        
        activeServiceIndex = index;
        const service = services[index];
        
        // Update service details
        const iconElement = document.getElementById('service-detail-icon');
        const titleElement = document.getElementById('service-detail-title');
        const subtitleElement = document.getElementById('service-detail-subtitle');
        const descriptionElement = document.getElementById('service-detail-description');
        
        if (iconElement) {
            iconElement.setAttribute('data-lucide', service.icon);
        }
        if (titleElement) {
            titleElement.textContent = service.title;
        }
        if (subtitleElement) {
            subtitleElement.textContent = service.subtitle;
        }
        if (descriptionElement) {
            descriptionElement.textContent = service.description;
        }
        
        // Update tab button states
        const tabButtons = document.querySelectorAll('.service-tab-btn');
        tabButtons.forEach((btn, btnIndex) => {
            if (btnIndex === index) {
                btn.className = 'service-tab-btn px-6 py-3 rounded-lg font-medium transition-all duration-300 bg-accent text-accent-foreground';
            } else {
                btn.className = 'service-tab-btn px-6 py-3 rounded-lg font-medium transition-all duration-300 bg-muted text-muted-foreground hover:bg-accent/10 hover:text-accent';
            }
        });
        
        // Re-initialize lucide icons
        lucide.createIcons();
    };
}

// Reduced motion support
function initReducedMotion() {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        // Disable animations by adding CSS
        const style = document.createElement('style');
        style.textContent = `
            *,
            *::before,
            *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
                scroll-behavior: auto !important;
            }
            
            .animate-float,
            .animate-bounce,
            .animate-pulse,
            .animate-spin {
                animation: none !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// Utility functions
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// Handle page visibility changes to pause animations when not visible
document.addEventListener('visibilitychange', function() {
    const animatedElements = document.querySelectorAll('.animate-float, .animate-pulse-slow');
    
    if (document.hidden) {
        animatedElements.forEach(el => {
            el.style.animationPlayState = 'paused';
        });
    } else {
        animatedElements.forEach(el => {
            el.style.animationPlayState = 'running';
        });
    }
});

// Error handling for the entire application
window.addEventListener('error', function(e) {
    console.error('TalentPro site error:', e.error);
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('TalentPro unhandled promise rejection:', e.reason);
});

// Accessibility improvements
document.addEventListener('keydown', function(e) {
    // Escape key to close modals
    if (e.key === 'Escape') {
        const successModal = document.getElementById('success-modal');
        if (successModal && !successModal.classList.contains('hidden')) {
            closeSuccessModal();
        }
    }
    
    // Enter key to submit forms when focus is on submit button
    if (e.key === 'Enter' && e.target.type === 'submit') {
        e.target.click();
    }
});

// Add focus visible support for better keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
});

console.log('TalentPro main.js loaded successfully');