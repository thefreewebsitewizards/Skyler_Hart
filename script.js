// DOM Elements
const hamburger = document.querySelector('.nav-hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const navLinks = document.querySelectorAll('.nav-link, .mobile-link');
const portfolioItems = document.querySelectorAll('.portfolio-item');
const photoItems = document.querySelectorAll('.photo-item');
const lightbox = document.getElementById('lightbox');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxMedia = document.querySelector('.lightbox-media');
const lightboxPrev = document.querySelector('.lightbox-prev');
const lightboxNext = document.querySelector('.lightbox-next');
const contactForm = document.querySelector('.contact-form');

// State
let currentLightboxIndex = 0;
let lightboxItems = [];
let isLightboxOpen = false;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeNavigation();
    initializePortfolio();
    initializePhotography();
    initializeLightbox();
    initializeContactForm();
    initializeScrollReveal();
    initializeSocialLinks();
    initializeFAQ();
    initializeCarousels();
});

// Image Carousel Functions
function initializeCarousels() {
    const carousels = document.querySelectorAll('.image-carousel');
    
    carousels.forEach(carousel => {
        const images = carousel.querySelectorAll('.carousel-image');
        let currentIndex = 0;
        
        // Ensure first image is visible immediately
        if (images.length > 0) {
            images[0].classList.add('active');
        }
        
        // Auto-cycle through images every 4 seconds
        const intervalId = setInterval(() => {
            if (images.length <= 1) return;
            
            // Remove active class from current image
            images[currentIndex].classList.remove('active');
            
            // Move to next image (loop back to 0 if at end)
            currentIndex = (currentIndex + 1) % images.length;
            
            // Add active class to new current image
            images[currentIndex].classList.add('active');
        }, 4000);
        
        // Store interval ID for potential cleanup
        carousel.setAttribute('data-interval-id', intervalId);
    });
}

// Initialize social media links
function initializeSocialLinks() {
    const instagramLink = document.querySelector('a[aria-label="Instagram"]');
    
    if (instagramLink) {
        instagramLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Try to open Instagram app first, fallback to web
            const instagramApp = 'instagram://user?username=skyhartstudios';
            const instagramWeb = 'https://www.instagram.com/skyhartstudios';
            
            // Create a temporary link to test if Instagram app is available
            const tempLink = document.createElement('a');
            tempLink.href = instagramApp;
            
            // Try to open the app
            window.location.href = instagramApp;
            
            // Fallback to web after a short delay if app doesn't open
            setTimeout(() => {
                window.open(instagramWeb, '_blank', 'noopener,noreferrer');
            }, 500);
        });
    }
}

// Initialize FAQ accordion
function initializeFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqId = this.getAttribute('data-faq');
            const answer = document.querySelector(`[data-answer="${faqId}"]`);
            const isActive = this.classList.contains('active');
            
            // Close all other FAQ items
            faqQuestions.forEach(q => {
                if (q !== this) {
                    q.classList.remove('active');
                    const otherId = q.getAttribute('data-faq');
                    const otherAnswer = document.querySelector(`[data-answer="${otherId}"]`);
                    if (otherAnswer) {
                        otherAnswer.classList.remove('active');
                    }
                }
            });
            
            // Toggle current FAQ item
            if (isActive) {
                this.classList.remove('active');
                answer.classList.remove('active');
            } else {
                this.classList.add('active');
                answer.classList.add('active');
            }
        });
        
        // Add keyboard accessibility
        question.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

// Navigation Functions
function initializeNavigation() {
    // Hamburger menu toggle
    hamburger.addEventListener('click', toggleMobileMenu);
    
    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.classList.contains('mobile-link')) {
                closeMobileMenu();
            }
            handleSmoothScroll(e, link.getAttribute('href'));
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
            closeMobileMenu();
        }
    });
}

function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : 'auto';
}

function closeMobileMenu() {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function handleSmoothScroll(e, href) {
    if (href.startsWith('#')) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 80; // Account for fixed header
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }
}

// Animation Functions
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.manifesto-title, .manifesto-description, .portfolio-item, .photo-item, .services-title, .service-item, .faq-title, .faq-item');
    animatedElements.forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });
}

function initializeScrollReveal() {
    // Add staggered animation delays
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach((item, index) => {
        item.style.animationDelay = `${0.2 + (index * 0.1)}s`;
    });
}

// Portfolio Functions
function initializePortfolio() {
    portfolioItems.forEach((item, index) => {
        const video = item.querySelector('.portfolio-video');
        
        // Video hover effects (only if video exists)
        if (video) {
            item.addEventListener('mouseenter', () => {
                video.play().catch(e => console.log('Video play failed:', e));
            });
            
            item.addEventListener('mouseleave', () => {
                video.pause();
                video.currentTime = 0;
            });
        }
        
        // Click to open in lightbox
        item.addEventListener('click', () => {
            openLightbox(index, 'portfolio');
        });
    });
}

// Photography Functions
function initializePhotography() {
    photoItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            openLightbox(index, 'photography');
        });
    });
}

// Lightbox Functions
function initializeLightbox() {
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', showPrevious);
    lightboxNext.addEventListener('click', showNext);
    
    // Close on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (isLightboxOpen) {
            switch(e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    showPrevious();
                    break;
                case 'ArrowRight':
                    showNext();
                    break;
            }
        }
    });
}

function openLightbox(index, type) {
    currentLightboxIndex = index;
    isLightboxOpen = true;
    
    if (type === 'portfolio') {
        lightboxItems = Array.from(portfolioItems);
        displayPortfolioItem(index);
    } else if (type === 'photography') {
        lightboxItems = Array.from(photoItems);
        displayPhotoItem(index);
    }
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
    isLightboxOpen = false;
    
    // Stop any playing videos
    const video = lightboxMedia.querySelector('video');
    if (video) {
        video.pause();
    }
    
    // Clear media content
    setTimeout(() => {
        lightboxMedia.innerHTML = '';
    }, 300);
}

function showPrevious() {
    currentLightboxIndex = (currentLightboxIndex - 1 + lightboxItems.length) % lightboxItems.length;
    updateLightboxContent();
}

function showNext() {
    currentLightboxIndex = (currentLightboxIndex + 1) % lightboxItems.length;
    updateLightboxContent();
}

function updateLightboxContent() {
    const currentItem = lightboxItems[currentLightboxIndex];
    
    if (currentItem.classList.contains('portfolio-item')) {
        displayPortfolioItem(currentLightboxIndex);
    } else if (currentItem.classList.contains('photo-item')) {
        displayPhotoItem(currentLightboxIndex);
    }
}

function displayPortfolioItem(index) {
    const item = portfolioItems[index];
    const video = item.querySelector('.portfolio-video');
    const placeholder = item.querySelector('.portfolio-placeholder');
    const title = item.dataset.title;
    const client = item.dataset.client;
    
    if (video && video.querySelector('source')) {
        lightboxMedia.innerHTML = `
            <video controls autoplay muted>
                <source src="${video.querySelector('source').src}" type="video/mp4">
            </video>
            <div class="lightbox-info">
                <h3>${title}</h3>
                <p>${client}</p>
            </div>
        `;
    } else {
        lightboxMedia.innerHTML = `
            <div class="lightbox-placeholder" style="width: 80vw; height: 60vh; background: linear-gradient(135deg, #1a1a1a, #333); display: flex; flex-direction: column; align-items: center; justify-content: center; color: #fff; font-size: 1.5rem; text-align: center;">
                <h3 style="margin-bottom: 1rem; font-size: 2rem;">${title}</h3>
                <p style="opacity: 0.8; font-size: 1.2rem;">${client}</p>
                <p style="margin-top: 2rem; opacity: 0.6; font-size: 1rem;">Video content would be displayed here</p>
            </div>
        `;
    }
}

function displayPhotoItem(index) {
    const item = photoItems[index];
    const img = item.querySelector('img');
    
    lightboxMedia.innerHTML = `
        <img src="${img.src}" alt="${img.alt}">
    `;
}

// Contact Form Functions
function initializeContactForm() {
    contactForm.addEventListener('submit', handleFormSubmit);
    
    
    // Add focus effects to form inputs
    const formInputs = contactForm.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
    });
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const submitBtn = contactForm.querySelector('.submit-btn');
    
    // Show loading state
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual form handling)
    setTimeout(() => {
        submitBtn.textContent = 'Message Sent!';
        contactForm.reset();
        
        setTimeout(() => {
            submitBtn.textContent = 'Send Message';
            submitBtn.disabled = false;
        }, 2000);
    }, 1500);
}

// Utility Functions
function debounce(func, wait) {
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

// Performance Optimizations
function initializeLazyLoading() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('loading');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            img.classList.add('loading');
            imageObserver.observe(img);
        });
    }
}

// Scroll Effects
window.addEventListener('scroll', debounce(() => {
    const scrolled = window.pageYOffset;
    const nav = document.querySelector('.nav-header');
    
    // Add/remove nav background based on scroll
    if (scrolled > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
}, 10));



// Error Handling
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
});

// Preload Critical Resources
function preloadCriticalResources() {
    const criticalImages = [
        // Add paths to critical images here
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// Initialize lazy loading and preloading
document.addEventListener('DOMContentLoaded', () => {
    initializeLazyLoading();
    preloadCriticalResources();
});

// Smooth scroll polyfill for older browsers
if (!('scrollBehavior' in document.documentElement.style)) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/gh/iamdustan/smoothscroll@master/src/smoothscroll.js';
    document.head.appendChild(script);
}

// Touch/Swipe Support for Mobile
let touchStartX = 0;
let touchEndX = 0;

function handleSwipe() {
    if (isLightboxOpen) {
        if (touchEndX < touchStartX - 50) {
            showNext();
        }
        if (touchEndX > touchStartX + 50) {
            showPrevious();
        }
    }
}

document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

// Accessibility Improvements
function initializeAccessibility() {
    // Add ARIA labels
    const hamburgerBtn = document.querySelector('.nav-hamburger');
    if (hamburgerBtn) {
        hamburgerBtn.setAttribute('aria-label', 'Toggle navigation menu');
        hamburgerBtn.setAttribute('role', 'button');
    }
    
    // Add focus management for lightbox
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    
    function trapFocus(element) {
        const focusableContent = element.querySelectorAll(focusableElements);
        const firstFocusableElement = focusableContent[0];
        const lastFocusableElement = focusableContent[focusableContent.length - 1];
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusableElement) {
                        lastFocusableElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusableElement) {
                        firstFocusableElement.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }
    
    // Apply focus trap when lightbox opens
    const originalOpenLightbox = openLightbox;
    openLightbox = function(...args) {
        originalOpenLightbox.apply(this, args);
        trapFocus(lightbox);
    };
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', initializeAccessibility);

// Console Art (Easter Egg)
console.log(`
%c
 ███████╗██╗  ██╗██╗   ██╗██╗     ███████╗██████╗     ██╗  ██╗ █████╗ ██████╗ ████████╗
 ██╔════╝██║ ██╔╝╚██╗ ██╔╝██║     ██╔════╝██╔══██╗    ██║  ██║██╔══██╗██╔══██╗╚══██╔══╝
 ███████╗█████╔╝  ╚████╔╝ ██║     █████╗  ██████╔╝    ███████║███████║██████╔╝   ██║   
 ╚════██║██╔═██╗   ╚██╔╝  ██║     ██╔══╝  ██╔══██╗    ██╔══██║██╔══██║██╔══██╗   ██║   
 ███████║██║  ██╗   ██║   ███████╗███████╗██║  ██║    ██║  ██║██║  ██║██║  ██║   ██║   
 ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚══════╝╚═╝  ╚═╝    ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   

%cCinematic Videography Portfolio
%cBuilt with passion for visual storytelling
`,
'color: #FFFFFF; font-weight: bold;',
'color: #F8F8F8; font-size: 16px; font-weight: bold;',
'color: #CCCCCC; font-size: 12px;'
);

// All functions are now globally available