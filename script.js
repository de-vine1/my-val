// === Variables ===
const pages = document.querySelectorAll('.page');
let currentPageIndex = 0;
const totalPages = pages.length;

// === Navigation Logic ===
window.turnPage = function (direction) {
    if (direction === 'next') {
        if (currentPageIndex < totalPages - 1) {
            currentPageIndex++;
            updatePageClasses();
        }
    } else if (direction === 'prev') {
        if (currentPageIndex > 0) {
            currentPageIndex--;
            updatePageClasses();
        }
    }
};

function updatePageClasses() {
    pages.forEach((page, index) => {
        page.classList.remove('active', 'flipped', 'upcoming');
        page.style.zIndex = totalPages - index;

        if (index === currentPageIndex) {
            page.classList.add('active');
        } else if (index < currentPageIndex) {
            page.classList.add('flipped');
        } else {
            page.classList.add('upcoming');
        }
    });

    // No button resets when page changes
    resetNoButton();
}

// === "No" Button Evasion Logic ===
const noBtn = document.getElementById('no-btn');
if (noBtn) {
    // Only move on click as requested
    noBtn.addEventListener('click', moveButton);
}

function moveButton(e) {
    if (e.type === 'click') {
        e.preventDefault();
    }

    const btn = document.getElementById('no-btn');
    if (!btn) return;

    if (btn.parentNode !== document.body) {
        document.body.appendChild(btn);
    }

    // Use viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const btnRect = btn.getBoundingClientRect();
    const padding = 20;

    // Calculate safe boundaries based on viewport size
    let maxX = viewportWidth - btnRect.width - padding;
    let maxY = viewportHeight - btnRect.height - padding;

    // Safety check: if viewport is too small, just keep it at padding
    maxX = Math.max(padding, maxX);
    maxY = Math.max(padding, maxY);

    // Random position within viewport
    const newX = Math.random() * (maxX - padding) + padding;
    const newY = Math.random() * (maxY - padding) + padding;

    // Apply fixed positioning
    btn.style.position = 'fixed';
    btn.style.left = `${newX}px`;
    btn.style.top = `${newY}px`;
    btn.style.zIndex = '9999';

    // Changing text
    const texts = ["Are you sure?", "Really?", "Think again!", "Missclick?", "Try the other one!"];
    const randomText = texts[Math.floor(Math.random() * texts.length)];
    const textSpan = btn.querySelector('span:first-child');
    if (textSpan) textSpan.textContent = randomText;
}

function resetNoButton() {
    const btn = document.getElementById('no-btn');
    const container = document.getElementById('button-container');

    if (btn) {
        if (container && btn.parentNode === document.body) {
            container.appendChild(btn);
        }

        // Reset styles
        btn.style.position = '';
        btn.style.left = '';
        btn.style.top = '';
        btn.style.zIndex = '';
        btn.style.transform = '';
        const textSpan = btn.querySelector('span:first-child');
        if (textSpan) textSpan.textContent = "No";
    }
}

// === "Yes" Button Logic (Confetti) ===
const yesBtn = document.getElementById('yes-btn');
if (yesBtn) {
    yesBtn.addEventListener('click', () => {
        triggerConfetti();
        showSuccessMessage();
    });
}

function triggerConfetti() {
    if (typeof confetti === 'function') {
        var duration = 3000;
        var animationEnd = Date.now() + duration;
        var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

        var randomInRange = function (min, max) {
            return Math.random() * (max - min) + min;
        }

        var interval = setInterval(function () {
            var timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            var particleCount = 50 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);
    }
}

function showSuccessMessage() {
    turnPage('next');
}

// Carousel Logic
let currentReasonSlide = 0;
const totalReasonSlides = 3;

function updateCarousel() {
    const track = document.getElementById('reasons-track');
    const btnText = document.getElementById('next-reason-text');

    // Slide the track
    if (track) {
        track.style.transform = `translateX(-${currentReasonSlide * 100}%)`;
    }

    // Toggle opacity for slides
    const slides = document.querySelectorAll('.carousel-slide');
    slides.forEach((slide, index) => {
        if (index === currentReasonSlide) {
            slide.classList.remove('opacity-0');
            slide.classList.add('opacity-100');
        } else {
            slide.classList.remove('opacity-100');
            slide.classList.add('opacity-0');
        }
    });

    // Update Button Text
    if (btnText) {
        if (currentReasonSlide === totalReasonSlides - 1) {
            btnText.textContent = "Make It Official";
        } else {
            btnText.textContent = "Next Reason";
        }
    }
}

window.nextReason = function () {
    if (currentReasonSlide < totalReasonSlides - 1) {
        currentReasonSlide++;
        updateCarousel();
    } else {
        turnPage('next');
    }
};

window.prevReason = function () {
    if (currentReasonSlide > 0) {
        currentReasonSlide--;
        updateCarousel();
    } else {
        turnPage('prev');
    }
};

// Keyboard Handling
document.addEventListener('keydown', (e) => {
    const activePage = pages[currentPageIndex];
    if (e.key === 'ArrowRight') {
        if (activePage && activePage.id === 'page-3') {
            window.nextReason();
        } else {
            turnPage('next');
        }
    } else if (e.key === 'ArrowLeft') {
        if (activePage && activePage.id === 'page-3') {
            window.prevReason();
        } else {
            turnPage('prev');
        }
    }
});

// === Background Animations ===
function initFloatingBackground() {
    const pages = document.querySelectorAll('.page');
    const icons = ['favorite', 'card_giftcard', 'local_florist', 'volunteer_activism', 'star', 'auto_awesome'];
    const colors = ['text-red-400', 'text-pink-400', 'text-rose-400', 'text-red-500', 'text-pink-500'];

    pages.forEach(page => {
        const container = document.createElement('div');
        container.className = 'absolute inset-0 overflow-hidden pointer-events-none z-0';

        // Multiple icons
        const iconCount = 50;

        for (let i = 0; i < iconCount; i++) {
            const icon = document.createElement('span');
            icon.className = `material-symbols-outlined floating-icon opacity-0 absolute ${colors[Math.floor(Math.random() * colors.length)]}`;
            icon.textContent = icons[Math.floor(Math.random() * icons.length)];
            icon.style.fontVariationSettings = "'FILL' 1";

            // Randomize Position
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            icon.style.left = `${left}%`;
            icon.style.top = `${top}%`;

            // Randomize Size 
            const size = 1 + Math.random() * 1.5; // 1rem to 2.5rem
            icon.style.fontSize = `${size}rem`;

            // Randomize Animation Custom Properties
            const duration = 15 + Math.random() * 20; // 15-35s slow float
            const delay = Math.random() * -20;

            icon.style.animation = `float-fade-random ${duration}s ease-in-out infinite`;
            icon.style.animationDelay = `${delay}s`;

            // CSS Variables for random drift
            icon.style.setProperty('--tx', `${(Math.random() - 0.5) * 100}px`);
            icon.style.setProperty('--ty', `${(Math.random() - 0.5) * 100}px`);
            icon.style.setProperty('--rot', `${(Math.random() - 0.5) * 45}deg`);

            icon.style.setProperty('--tx2', `${(Math.random() - 0.5) * 100}px`);
            icon.style.setProperty('--ty2', `${(Math.random() - 0.5) * 100}px`);
            icon.style.setProperty('--rot2', `${(Math.random() - 0.5) * 45}deg`);

            // Random opacity variation - increased for visibility!
            icon.style.setProperty('--max-opacity', `${0.4 + Math.random() * 0.4}`);
            icon.style.setProperty('--mid-opacity', `${0.2 + Math.random() * 0.2}`);

            container.appendChild(icon);
        }

        page.prepend(container);
    });
}

// Initialize on load
window.addEventListener('load', () => {
    // Ensure initial classes are set first
    updatePageClasses();
    initFloatingBackground();

    // Hide preloader after a short delay for smoothness
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.classList.add('hidden');
        }
    }, 500);

    // === Background Music Logic ===
    const music = document.getElementById('bg-music');
    if (music) {
        music.volume = 0.5; // Set reasonable volume
        // Try to play immediately
        music.play().catch(error => {
            console.log("Autoplay blocked. Waiting for interaction.");
            // Fallback: Play on first click/interaction
            document.addEventListener('click', () => {
                music.play();
            }, { once: true });
        });
    }
});
