// Professional Website JavaScript - Bayush Injera
document.addEventListener('DOMContentLoaded', function() {
    
    // ======================
    // Mobile Navigation Toggle
    // ======================
    const mobileToggle = document.createElement('button');
    mobileToggle.classList.add('mobile-toggle');
    mobileToggle.innerHTML = '☰';
    mobileToggle.setAttribute('aria-label', 'Toggle navigation');
    
    const header = document.querySelector('header');
    const nav = document.querySelector('nav');
    
    if (header && nav) {
        header.insertBefore(mobileToggle, nav);
        
        mobileToggle.addEventListener('click', function() {
            nav.classList.toggle('nav-open');
            this.classList.toggle('active');
            this.innerHTML = this.classList.contains('active') ? '✕' : '☰';
        });
    }

    // ======================
    // Smooth Scrolling for Navigation
    // ======================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ======================
    // Video Modal Functionality
    // ======================
    const videoTriggers = document.querySelectorAll('.video-trigger');
    
    videoTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            const videoSrc = this.dataset.video;
            if (videoSrc) {
                openVideoModal(videoSrc);
            }
        });
    });

    function openVideoModal(videoSrc) {
        const modal = document.createElement('div');
        modal.classList.add('video-modal');
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal" aria-label="Close video">&times;</span>
                <video controls autoplay>
                    <source src="${videoSrc}" type="video/mp4">
                    Your browser does not support HTML5 video.
                </video>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal functionality
        const closeBtn = modal.querySelector('.close-modal');
        
        function closeModal() {
            document.body.removeChild(modal);
        }
        
        closeBtn.addEventListener('click', closeModal);
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        // Handle video end
        const video = modal.querySelector('video');
        video.addEventListener('ended', () => {
            closeBtn.focus();
        });
        
        // ESC key to close
        document.addEventListener('keydown', function escHandler(e) {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escHandler);
            }
        });
    }

    // ======================
    // Enhanced Form Validation
    // ======================
    const contactForm = document.querySelector('form');
    if (contactForm) {
        contactForm.setAttribute('id', 'contact-form');
        
        const emailInput = document.getElementById('email');
        const phoneInput = document.getElementById('phone');
        const nameInput = document.getElementById('name');
        const messageInput = document.getElementById('message');
        
        // Real-time validation
        if (emailInput) {
            emailInput.addEventListener('input', function() {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (this.value && !emailRegex.test(this.value)) {
                    this.setCustomValidity('Please enter a valid email address.');
                    this.classList.add('invalid');
                } else {
                    this.setCustomValidity('');
                    this.classList.remove('invalid');
                }
            });
        }
        
        if (phoneInput) {
            phoneInput.addEventListener('input', function() {
                const phoneRegex = /^[\+]?[0-9\s\-\(\)]+$/;
                if (this.value && !phoneRegex.test(this.value)) {
                    this.setCustomValidity('Please enter a valid phone number.');
                    this.classList.add('invalid');
                } else {
                    this.setCustomValidity('');
                    this.classList.remove('invalid');
                }
            });
        }
        
        // Form submission with loading state
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            const requiredFields = [nameInput, emailInput, messageInput].filter(field => field);
            
            // Validate required fields
            requiredFields.forEach(input => {
                if (!input.value.trim()) {
                    input.classList.add('invalid');
                    isValid = false;
                } else {
                    input.classList.remove('invalid');
                }
            });
            
            if (!isValid) {
                showMessage('Please fill in all required fields.', 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner"></span> Sending...';
            
            // Simulate form submission (replace with actual AJAX call)
            setTimeout(() => {
                submitBtn.innerHTML = '✓ Message Sent!';
                submitBtn.classList.add('success');
                this.reset();
                showMessage('Thank you! Your message has been sent successfully.', 'success');
                
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('success');
                }, 3000);
            }, 1500);
        });
    }

    // ======================
    // Message Display Function
    // ======================
    function showMessage(text, type) {
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        const message = document.createElement('div');
        message.classList.add('form-message', type);
        message.textContent = text;
        
        const form = document.querySelector('form');
        if (form) {
            form.insertBefore(message, form.firstChild);
            
            setTimeout(() => {
                message.remove();
            }, 5000);
        }
    }

    // ======================
    // Lazy Loading for Images
    // ======================
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }

    // ======================
    // Header Scroll Effect
    // ======================
    let lastScrollTop = 0;
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show header on scroll
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });

    // ======================
    // Animation on Scroll
    // ======================
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.about-card, .team-member, .service-item').forEach(el => {
        el.classList.add('animate-on-scroll');
        animationObserver.observe(el);
    });

    // ======================
    // Current Year in Footer
    // ======================
    const yearElements = document.querySelectorAll('.current-year');
    yearElements.forEach(el => {
        el.textContent = new Date().getFullYear();
    });

    // ======================
    // Accessibility Improvements
    // ======================
    
    // Focus management for modals
    let lastFocusedElement;
    
    function trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }

    // ======================
    // Performance Optimizations
    // ======================
    
    // Throttle scroll events
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

    // Apply throttling to scroll events
    window.addEventListener('scroll', throttle(function() {
        // Additional scroll-based functionality can be added here
    }, 100));

    console.log('Bayush Injera website loaded successfully!');
});

// ======================
// Utility Functions
// ======================

// Add loading spinner styles dynamically
const spinnerStyles = `
    .spinner {
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255,255,255,.3);
        border-radius: 50%;
        border-top-color: #fff;
        animation: spin 1s ease-in-out infinite;
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = spinnerStyles;
document.head.appendChild(styleSheet);