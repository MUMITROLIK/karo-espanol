// ================================
// DEVICE DETECTION
// ================================
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;

// ================================
// SETTINGS MANAGEMENT
// ================================
const settings = {
    theme: localStorage.getItem('theme') || 'light',
    gyroscope: localStorage.getItem('gyroscope') !== 'false',
    animations: localStorage.getItem('animations') !== 'false',
    particles: localStorage.getItem('particles') !== 'false',
    sound: false
};

function saveSettings() {
    localStorage.setItem('theme', settings.theme);
    localStorage.setItem('gyroscope', settings.gyroscope);
    localStorage.setItem('animations', settings.animations);
    localStorage.setItem('particles', settings.particles);
}

// ================================
// SETTINGS MODAL
// ================================
const settingsToggle = document.getElementById('settingsToggle');
const settingsModal = document.getElementById('settingsModal');
const settingsClose = document.getElementById('settingsClose');
const settingsOverlay = document.querySelector('.settings-overlay');

// Toggle switches
const themeToggleSwitch = document.getElementById('themeToggleSwitch');
const gyroToggleSwitch = document.getElementById('gyroToggleSwitch');
const animationsToggleSwitch = document.getElementById('animationsToggleSwitch');
const particlesToggleSwitch = document.getElementById('particlesToggleSwitch');

// Initialize settings UI
themeToggleSwitch.checked = settings.theme === 'dark';
gyroToggleSwitch.checked = settings.gyroscope;
animationsToggleSwitch.checked = settings.animations;
particlesToggleSwitch.checked = settings.particles;

// Apply initial theme
document.body.className = `${settings.theme}-theme`;

// Update gyro description for desktop
if (!isMobile) {
    document.getElementById('gyroDescription').textContent = '⚠️ Доступно только на мобильных устройствах';
}

// Open settings
settingsToggle.addEventListener('click', () => {
    settingsModal.classList.remove('hidden');
    if (isMobile && navigator.vibrate) {
        navigator.vibrate(10);
    }
});

// Close settings
function closeSettings() {
    settingsModal.classList.add('hidden');
}

settingsClose.addEventListener('click', closeSettings);
settingsOverlay.addEventListener('click', closeSettings);

// Theme toggle
themeToggleSwitch.addEventListener('change', (e) => {
    settings.theme = e.target.checked ? 'dark' : 'light';
    document.body.className = `${settings.theme}-theme`;
    saveSettings();
    
    if (isMobile && navigator.vibrate) {
        navigator.vibrate(10);
    }
});

// Gyroscope toggle
gyroToggleSwitch.addEventListener('change', (e) => {
    settings.gyroscope = e.target.checked;
    saveSettings();
    
    if (!isMobile) {
        // Show message on desktop
        e.target.checked = false;
        settings.gyroscope = false;
        alert('⚠️ Гироскоп доступен только на мобильных устройствах');
    }
    
    if (isMobile && navigator.vibrate) {
        navigator.vibrate(10);
    }
});

// Animations toggle
animationsToggleSwitch.addEventListener('change', (e) => {
    settings.animations = e.target.checked;
    saveSettings();
    
    if (!settings.animations) {
        document.body.classList.add('no-animations');
    } else {
        document.body.classList.remove('no-animations');
    }
    
    if (isMobile && navigator.vibrate) {
        navigator.vibrate(10);
    }
});

// Particles toggle
particlesToggleSwitch.addEventListener('change', (e) => {
    settings.particles = e.target.checked;
    saveSettings();
    
    const particlesContainer = document.getElementById('particlesContainer');
    if (settings.particles) {
        particlesContainer.style.display = 'block';
    } else {
        particlesContainer.style.display = 'none';
    }
    
    if (isMobile && navigator.vibrate) {
        navigator.vibrate(10);
    }
});

// Apply initial settings
if (!settings.animations) {
    document.body.classList.add('no-animations');
}

if (!settings.particles) {
    document.getElementById('particlesContainer').style.display = 'none';
}

// ================================
// FLOATING PARTICLES
// ================================
function createParticles() {
    const particlesContainer = document.getElementById('particlesContainer');
    const particleCount = isMobile ? 10 : 20; // Less particles on mobile
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 4 + 2;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const duration = Math.random() * 20 + 15;
        const delay = Math.random() * 5;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${x}%`;
        particle.style.top = `${y}%`;
        particle.style.setProperty('--duration', `${duration}s`);
        particle.style.setProperty('--delay', `${delay}s`);
        
        particlesContainer.appendChild(particle);
    }
}

createParticles();

// ================================
// PARALLAX EFFECT
// ================================
const mainContainer = document.getElementById('mainContainer');
const header = document.querySelector('.header');
const mainContent = document.querySelector('.main-content');
let mouseX = 0;
let mouseY = 0;

if (!isMobile) {
    // Mouse parallax for desktop
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 20;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 20;
        
        header.style.transform = `translate(${mouseX * 0.5}px, ${mouseY * 0.5}px)`;
        mainContent.style.transform = `translate(${mouseX * 0.3}px, ${mouseY * 0.3}px)`;
    });
} else {
    // Gyroscope parallax for mobile
    if (window.DeviceOrientationEvent) {
        let tiltX = 0;
        let tiltY = 0;
        
        window.addEventListener('deviceorientation', (e) => {
            // Check if gyroscope is enabled in settings
            if (!settings.gyroscope) return;
            
            // Get device tilt
            const beta = e.beta || 0;
            const gamma = e.gamma || 0;
            
            // Normalize and limit range
            tiltX = Math.max(-15, Math.min(15, gamma)) * 0.5;
            tiltY = Math.max(-15, Math.min(15, beta - 45)) * 0.5;
            
            // Apply smooth parallax
            requestAnimationFrame(() => {
                if (header) {
                    header.style.transform = `translate(${tiltX}px, ${tiltY}px)`;
                    header.style.transition = 'transform 0.3s ease-out';
                }
                if (mainContent) {
                    mainContent.style.transform = `translate(${tiltX * 0.6}px, ${tiltY * 0.6}px)`;
                    mainContent.style.transition = 'transform 0.3s ease-out';
                }
            });
        });
        
        // Request permission for iOS 13+
        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
            document.addEventListener('click', function requestPermission() {
                DeviceOrientationEvent.requestPermission()
                    .then(permissionState => {
                        if (permissionState === 'granted') {
                            console.log('Gyroscope permission granted');
                        }
                    })
                    .catch(console.error);
                document.removeEventListener('click', requestPermission);
            }, { once: true });
        }
    }
}

// ================================
// LESSON CARDS - 3D EFFECT & TOUCH
// ================================
const lessonCards = document.querySelectorAll('.lesson-card');

lessonCards.forEach(card => {
    const color = card.getAttribute('data-color');
    let isHovered = false;
    let touchStartY = 0;
    
    // Dynamic color styling
    card.style.borderColor = `${color}40`;
    const startBtn = card.querySelector('.start-btn');
    startBtn.style.background = `linear-gradient(135deg, ${color}, ${color}DD)`;
    startBtn.style.boxShadow = `0 8px 24px ${color}40`;
    
    const progressFill = card.querySelector('.progress-fill');
    progressFill.style.background = `linear-gradient(90deg, ${color}, var(--glow))`;
    
    if (!isMobile) {
        // Desktop hover effects
        card.addEventListener('mouseenter', () => {
            isHovered = true;
            card.style.borderColor = `${color}60`;
            card.style.boxShadow = `0 30px 80px ${color}50, 0 0 80px ${color}30, inset 0 0 60px ${color}10`;
            startBtn.style.boxShadow = `0 12px 32px ${color}60`;
        });
        
        card.addEventListener('mouseleave', () => {
            isHovered = false;
            card.style.borderColor = 'transparent';
            card.style.boxShadow = '';
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
            startBtn.style.boxShadow = `0 8px 24px ${color}40`;
        });
        
        // 3D tilt effect
        card.addEventListener('mousemove', (e) => {
            if (!isHovered) return;
            
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-12px) scale(1.03)`;
        });
    } else {
        // Mobile touch effects
        card.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
            card.style.transform = 'scale(0.97)';
            card.style.transition = 'transform 0.1s ease';
            card.style.borderColor = `${color}60`;
            card.style.boxShadow = `0 20px 60px ${color}50, 0 0 60px ${color}30`;
            
            // Haptic feedback
            if (navigator.vibrate) {
                navigator.vibrate(5);
            }
        });
        
        card.addEventListener('touchend', (e) => {
            card.style.transform = 'scale(1)';
            card.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            setTimeout(() => {
                card.style.borderColor = 'transparent';
                card.style.boxShadow = '';
            }, 300);
        });
        
        card.addEventListener('touchcancel', () => {
            card.style.transform = 'scale(1)';
            card.style.borderColor = 'transparent';
            card.style.boxShadow = '';
        });
    }
    
    // Click handler
    startBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const lessonId = card.getAttribute('data-lesson');
        startLesson(lessonId, card);
        
        // Haptic feedback
        if (isMobile && navigator.vibrate) {
            navigator.vibrate(10);
        }
    });
});

function startLesson(lessonId, card) {
    // Add click animation
    card.style.transform = 'scale(0.95)';
    card.style.transition = 'transform 0.2s ease';
    
    setTimeout(() => {
        localStorage.setItem('currentLesson', lessonId);
        
        // Check if lessons.html exists
        const lessonsPageExists = document.querySelector('[href="lessons.html"]');
        
        if (lessonsPageExists) {
            window.location.href = 'lessons.html';
        } else {
            alert(`Урок ${lessonId} скоро будет доступен! 🚀\n\nПока что мы работаем над контентом...`);
            card.style.transform = 'scale(1)';
        }
    }, 200);
}

// ================================
// PROGRESS LOADING (DEMO)
// ================================
function loadProgress() {
    const savedProgress = JSON.parse(localStorage.getItem('lessonProgress') || '{}');
    
    Object.keys(savedProgress).forEach(lessonId => {
        const card = document.querySelector(`[data-lesson="${lessonId}"]`);
        if (!card) return;
        
        const progress = savedProgress[lessonId];
        const progressFill = card.querySelector('.progress-fill');
        const progressText = card.querySelector('.progress-text');
        
        const percentage = (progress.completed / progress.total) * 100;
        progressFill.style.width = `${percentage}%`;
        progressText.textContent = `${progress.completed}/${progress.total}`;
    });
}

loadProgress();

// ================================
// WINDOW RESIZE HANDLER
// ================================
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Recreate particles on resize
        const particlesContainer = document.getElementById('particlesContainer');
        particlesContainer.innerHTML = '';
        createParticles();
    }, 250);
});

// ================================
// SCROLL REVEAL ANIMATION
// ================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply to modules and cards
document.querySelectorAll('.module').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(60px)';
    el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
    observer.observe(el);
});

// ================================
// PULL TO REFRESH (Mobile)
// ================================
if (isMobile) {
    let touchstartY = 0;
    let touchendY = 0;
    
    mainContainer.addEventListener('touchstart', (e) => {
        touchstartY = e.changedTouches[0].screenY;
    }, { passive: true });
    
    mainContainer.addEventListener('touchend', (e) => {
        touchendY = e.changedTouches[0].screenY;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeDistance = touchendY - touchstartY;
        
        // Pull down to refresh
        if (swipeDistance > 150 && mainContainer.scrollTop === 0) {
            if (navigator.vibrate) {
                navigator.vibrate(15);
            }
            // Optional: add refresh animation
            console.log('Pull to refresh triggered');
        }
    }
}

// ================================
// PERFORMANCE OPTIMIZATION
// ================================
// Reduce animations when battery is low (if API available)
if ('getBattery' in navigator) {
    navigator.getBattery().then((battery) => {
        if (battery.level < 0.2) {
            document.body.classList.add('low-power-mode');
            console.log('Low power mode activated');
        }
    });
}

// ================================
// EXPORTS
// ================================
window.startLesson = startLesson;
window.settings = settings;

console.log(`🎮 Karo Español loaded | Device: ${isMobile ? 'Mobile' : 'Desktop'} | Theme: ${settings.theme}`);