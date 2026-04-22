/**
 * Bank Operations Copilot - Slide Controller
 * Keyboard navigation, touch support, fullscreen
 */

(function() {
    'use strict';

    // State
    let currentSlide = 1;
    const totalSlides = 11;
    let isAnimating = false;

    // DOM Elements
    const slides = document.querySelectorAll('.slide');
    const currentEl = document.getElementById('current');
    const totalEl = document.getElementById('total');
    const progressFill = document.getElementById('progressFill');

    // Initialize
    function init() {
        totalEl.textContent = totalSlides;
        updateSlide();
        bindEvents();
    }

    // Update slide display
    function updateSlide() {
        slides.forEach((slide, index) => {
            slide.classList.remove('active', 'prev');
            
            if (index + 1 === currentSlide) {
                slide.classList.add('active');
            } else if (index + 1 < currentSlide) {
                slide.classList.add('prev');
            }
        });

        currentEl.textContent = currentSlide;
        progressFill.style.width = `${(currentSlide / totalSlides) * 100}%`;
    }

    // Go to next slide
    function nextSlide() {
        if (currentSlide < totalSlides && !isAnimating) {
            isAnimating = true;
            currentSlide++;
            updateSlide();
            setTimeout(() => { isAnimating = false; }, 600);
        }
    }

    // Go to previous slide
    function prevSlide() {
        if (currentSlide > 1 && !isAnimating) {
            isAnimating = true;
            currentSlide--;
            updateSlide();
            setTimeout(() => { isAnimating = false; }, 600);
        }
    }

    // Go to specific slide
    function goToSlide(n) {
        if (n >= 1 && n <= totalSlides && n !== currentSlide && !isAnimating) {
            isAnimating = true;
            currentSlide = n;
            updateSlide();
            setTimeout(() => { isAnimating = false; }, 600);
        }
    }

    // Toggle fullscreen
    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log('Fullscreen error:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }

    // Bind events
    function bindEvents() {
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowRight':
                case 'ArrowDown':
                case ' ':
                case 'PageDown':
                    e.preventDefault();
                    nextSlide();
                    break;
                case 'ArrowLeft':
                case 'ArrowUp':
                case 'PageUp':
                    e.preventDefault();
                    prevSlide();
                    break;
                case 'Home':
                    e.preventDefault();
                    goToSlide(1);
                    break;
                case 'End':
                    e.preventDefault();
                    goToSlide(totalSlides);
                    break;
                case 'f':
                case 'F':
                    if (!e.ctrlKey && !e.metaKey && !e.altKey) {
                        toggleFullscreen();
                    }
                    break;
                case 'Escape':
                    if (document.fullscreenElement) {
                        document.exitFullscreen();
                    }
                    break;
            }
        });

        // Touch / Swipe support
        let touchStartX = 0;
        let touchStartY = 0;
        let touchEndX = 0;
        let touchEndY = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
            const minSwipeDistance = 50;

            // Horizontal swipe
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
                if (deltaX > 0) {
                    prevSlide();
                } else {
                    nextSlide();
                }
            }
        }

        // Mouse wheel navigation
        let wheelTimeout;
        document.addEventListener('wheel', (e) => {
            clearTimeout(wheelTimeout);
            wheelTimeout = setTimeout(() => {
                if (e.deltaY > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }, 50);
        }, { passive: true });

        // Click on slide area (optional navigation)
        slides.forEach(slide => {
            slide.addEventListener('click', (e) => {
                // Only navigate if clicking on empty area, not on interactive elements
                if (e.target === slide || e.target.classList.contains('slide-bg') || e.target.classList.contains('overlay')) {
                    const rect = slide.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    if (clickX > rect.width * 0.7) {
                        nextSlide();
                    } else if (clickX < rect.width * 0.3) {
                        prevSlide();
                    }
                }
            });
        });
    }

    // Expose global functions for onclick handlers
    window.nextSlide = nextSlide;
    window.prevSlide = prevSlide;
    window.goToSlide = goToSlide;

    // Auto-init
    init();

})();
