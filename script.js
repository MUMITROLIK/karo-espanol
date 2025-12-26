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

// Initialize settings UI (with safety checks)
if (themeToggleSwitch) themeToggleSwitch.checked = settings.theme === 'dark';
if (gyroToggleSwitch) gyroToggleSwitch.checked = settings.gyroscope;
if (animationsToggleSwitch) animationsToggleSwitch.checked = settings.animations;
if (particlesToggleSwitch) particlesToggleSwitch.checked = settings.particles;

// Apply initial theme
document.body.className = `${settings.theme}-theme`;

// Update gyro description for desktop
if (!isMobile) {
    const gyroDesc = document.getElementById('gyroDescription');
    if (gyroDesc) {
        gyroDesc.textContent = '⚠️ Доступно только на мобильных устройствах';
    }
}

// Open settings
if (settingsToggle) {
    settingsToggle.addEventListener('click', () => {
        if (settingsModal) {
            settingsModal.classList.remove('hidden');
        }
        if (isMobile && navigator.vibrate) {
            navigator.vibrate(10);
        }
    });
}

// Close settings
function closeSettings() {
    if (settingsModal) {
        settingsModal.classList.add('hidden');
    }
}

if (settingsClose) settingsClose.addEventListener('click', closeSettings);
if (settingsOverlay) settingsOverlay.addEventListener('click', closeSettings);

// Theme toggle
if (themeToggleSwitch) {
    themeToggleSwitch.addEventListener('change', (e) => {
        settings.theme = e.target.checked ? 'dark' : 'light';
        document.body.className = `${settings.theme}-theme`;
        saveSettings();
        
        if (isMobile && navigator.vibrate) {
            navigator.vibrate(10);
        }
    });
}

// Gyroscope toggle
if (gyroToggleSwitch) {
    gyroToggleSwitch.addEventListener('change', (e) => {
        settings.gyroscope = e.target.checked;
        saveSettings();
        
        if (!isMobile) {
            e.target.checked = false;
            settings.gyroscope = false;
            alert('⚠️ Гироскоп доступен только на мобильных устройствах');
        }
        
        if (isMobile && navigator.vibrate) {
            navigator.vibrate(10);
        }
    });
}

// Animations toggle
if (animationsToggleSwitch) {
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
}

// Particles toggle
if (particlesToggleSwitch) {
    particlesToggleSwitch.addEventListener('change', (e) => {
        settings.particles = e.target.checked;
        saveSettings();
        
        const particlesContainer = document.getElementById('particlesContainer');
        if (particlesContainer) {
            if (settings.particles) {
                particlesContainer.style.display = 'block';
            } else {
                particlesContainer.style.display = 'none';
            }
        }
        
        if (isMobile && navigator.vibrate) {
            navigator.vibrate(10);
        }
    });
}

// Apply initial settings
if (!settings.animations) {
    document.body.classList.add('no-animations');
}

if (!settings.particles) {
    const particlesContainer = document.getElementById('particlesContainer');
    if (particlesContainer) {
        particlesContainer.style.display = 'none';
    }
}

// ================================
// FLOATING PARTICLES
// ================================
function createParticles() {
    const particlesContainer = document.getElementById('particlesContainer');
    if (!particlesContainer) return;
    
    const particleCount = isMobile ? 10 : 20;
    
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
        
        if (header) {
            header.style.transform = `translate(${mouseX * 0.5}px, ${mouseY * 0.5}px)`;
        }
        if (mainContent) {
            mainContent.style.transform = `translate(${mouseX * 0.3}px, ${mouseY * 0.3}px)`;
        }
    });
} else {
    // Gyroscope parallax for mobile
    if (window.DeviceOrientationEvent) {
        let tiltX = 0;
        let tiltY = 0;
        
        window.addEventListener('deviceorientation', (e) => {
            if (!settings.gyroscope) return;
            
            const beta = e.beta || 0;
            const gamma = e.gamma || 0;
            
            tiltX = Math.max(-15, Math.min(15, gamma)) * 0.5;
            tiltY = Math.max(-15, Math.min(15, beta - 45)) * 0.5;
            
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
// SLIDING PANELS SYSTEM
// ================================
const panelsContainer = document.getElementById('panelsContainer');
const panelsTrack = document.getElementById('panelsTrack');
const panelCards = document.querySelectorAll('.panel-card');
const slidePrev = document.getElementById('slidePrev');
const slideNext = document.getElementById('slideNext');
const panelsDots = document.getElementById('panelsDots');

let currentPanel = 0;
const totalPanels = panelCards.length;

// Initialize panels
function initPanels() {
    if (!panelsTrack || panelCards.length === 0) return;
    
    // Set dynamic colors for each panel
    panelCards.forEach((panel, index) => {
        const color = panel.getAttribute('data-color');
        const panelIcon = panel.querySelector('.panel-icon');
        const panelGlow = panel.querySelector('.panel-glow');
        const panelButton = panel.querySelector('.panel-button');
        const circleProgress = panel.querySelector('.circle-progress');
        
        if (panelIcon) panelIcon.style.background = `linear-gradient(135deg, ${color}, ${color}DD)`;
        if (panelGlow) panelGlow.style.color = color;
        if (panelButton) panelButton.style.background = `linear-gradient(135deg, ${color}, ${color}DD)`;
        if (circleProgress) circleProgress.style.stroke = color;
        
        // Click handler
        panel.addEventListener('click', () => {
            goToPanel(index);
        });
        
        // Button click
        const button = panel.querySelector('.panel-button');
        if (button) {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const panelNumber = panel.getAttribute('data-panel');
                
                if (isMobile && navigator.vibrate) {
                    navigator.vibrate(10);
                }
                
                startLesson(panelNumber, panel);
            });
        }
    });
    
    // Create dots
    createDots();
    
    // Set initial active panel
    updatePanels();
}

// Create dots navigation
function createDots() {
    if (!panelsDots) return;
    
    panelsDots.innerHTML = '';
    
    for (let i = 0; i < totalPanels; i++) {
        const dot = document.createElement('div');
        dot.className = 'dot';
        if (i === currentPanel) dot.classList.add('active');
        
        dot.addEventListener('click', () => {
            goToPanel(i);
        });
        
        panelsDots.appendChild(dot);
    }
}

// Go to specific panel
function goToPanel(index) {
    if (index < 0 || index >= totalPanels) return;
    
    currentPanel = index;
    updatePanels();
    
    if (isMobile && navigator.vibrate) {
        navigator.vibrate(5);
    }
}

// Update panels position and state
function updatePanels() {
    if (!panelsTrack || panelCards.length === 0) return;
    
    // Calculate offset
    const panelWidth = panelCards[0].offsetWidth;
    const gap = 32;
    const offset = -(currentPanel * (panelWidth + gap));
    
    panelsTrack.style.transform = `translateX(${offset}px)`;
    
    // Update active states
    panelCards.forEach((panel, index) => {
        if (index === currentPanel) {
            panel.classList.add('active');
        } else {
            panel.classList.remove('active');
        }
    });
    
    // Update dots
    if (panelsDots) {
        const dots = panelsDots.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            if (index === currentPanel) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // Update navigation buttons
    if (slidePrev) slidePrev.disabled = currentPanel === 0;
    if (slideNext) slideNext.disabled = currentPanel === totalPanels - 1;
}

// Navigation buttons
if (slidePrev) {
    slidePrev.addEventListener('click', () => {
        if (currentPanel > 0) {
            goToPanel(currentPanel - 1);
        }
    });
}

if (slideNext) {
    slideNext.addEventListener('click', () => {
        if (currentPanel < totalPanels - 1) {
            goToPanel(currentPanel + 1);
        }
    });
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        if (currentPanel > 0) goToPanel(currentPanel - 1);
    } else if (e.key === 'ArrowRight') {
        if (currentPanel < totalPanels - 1) goToPanel(currentPanel + 1);
    }
});

// Touch/Swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

if (panelsContainer) {
    panelsContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    panelsContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
}

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            if (currentPanel < totalPanels - 1) {
                goToPanel(currentPanel + 1);
            }
        } else {
            if (currentPanel > 0) {
                goToPanel(currentPanel - 1);
            }
        }
    }
}

// Mouse wheel support (optional)
if (!isMobile && panelsContainer) {
    let wheelTimeout;
    panelsContainer.addEventListener('wheel', (e) => {
        clearTimeout(wheelTimeout);
        
        wheelTimeout = setTimeout(() => {
            if (e.deltaY > 0) {
                if (currentPanel < totalPanels - 1) {
                    goToPanel(currentPanel + 1);
                }
            } else if (e.deltaY < 0) {
                if (currentPanel > 0) {
                    goToPanel(currentPanel - 1);
                }
            }
        }, 50);
    }, { passive: true });
}

// ================================
// LESSON STARTER
// ================================
function startLesson(lessonId, card) {
    if (card) {
        card.style.transform = 'scale(0.95)';
        card.style.transition = 'transform 0.2s ease';
    }
    
    setTimeout(() => {
        localStorage.setItem('currentLesson', lessonId);
        alert(`Урок ${lessonId} скоро будет доступен! 🚀\n\nПока что мы работаем над контентом...`);
        
        if (card) {
            card.style.transform = '';
        }
    }, 200);
}

// ================================
// PROGRESS LOADING (DEMO)
// ================================
function loadProgress() {
    const savedProgress = JSON.parse(localStorage.getItem('lessonProgress') || '{}');
    
    Object.keys(savedProgress).forEach(lessonId => {
        const panel = document.querySelector(`[data-panel="${lessonId}"]`);
        if (!panel) return;
        
        const progress = savedProgress[lessonId];
        const progressNumber = panel.querySelector('.progress-number');
        const progressLabel = panel.querySelector('.progress-label');
        const circleProgress = panel.querySelector('.circle-progress');
        
        const percentage = Math.round((progress.completed / progress.total) * 100);
        
        if (progressNumber) progressNumber.textContent = `${percentage}%`;
        if (progressLabel) progressLabel.textContent = `${progress.completed}/${progress.total} уроков`;
        if (circleProgress) {
            circleProgress.style.strokeDasharray = `${percentage}, 100`;
        }
    });
}

// ================================
// WINDOW RESIZE HANDLER
// ================================
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Recreate particles on resize
        const particlesContainer = document.getElementById('particlesContainer');
        if (particlesContainer) {
            particlesContainer.innerHTML = '';
            createParticles();
        }
        
        // Update panels
        updatePanels();
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

document.querySelectorAll('.module').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(60px)';
    el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
    observer.observe(el);
});

// ================================
// PULL TO REFRESH (Mobile)
// ================================
if (isMobile && mainContainer) {
    let touchstartY = 0;
    let touchendY = 0;
    
    mainContainer.addEventListener('touchstart', (e) => {
        touchstartY = e.changedTouches[0].screenY;
    }, { passive: true });
    
    mainContainer.addEventListener('touchend', (e) => {
        touchendY = e.changedTouches[0].screenY;
        handlePullRefresh();
    }, { passive: true });
    
    function handlePullRefresh() {
        const swipeDistance = touchendY - touchstartY;
        
        if (swipeDistance > 150 && mainContainer.scrollTop === 0) {
            if (navigator.vibrate) {
                navigator.vibrate(15);
            }
            console.log('Pull to refresh triggered');
        }
    }
}

// ================================
// PERFORMANCE OPTIMIZATION
// ================================
if ('getBattery' in navigator) {
    navigator.getBattery().then((battery) => {
        if (battery.level < 0.2) {
            document.body.classList.add('low-power-mode');
            console.log('Low power mode activated');
        }
    });
}

// ================================
// INITIALIZE
// ================================
initPanels();
loadProgress();

// ================================
// EXPORTS
// ================================
window.startLesson = startLesson;
window.settings = settings;

console.log(`🎮 Karo Español loaded | Device: ${isMobile ? 'Mobile' : 'Desktop'} | Theme: ${settings.theme}`);