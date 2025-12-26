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
// ISLAND HOPPING SYSTEM
// ================================
const islandWrappers = document.querySelectorAll('.island-wrapper');

// Initialize islands
function initIslands() {
    if (islandWrappers.length === 0) return;

    islandWrappers.forEach((wrapper, index) => {
        const island = wrapper.querySelector('.island-card');
        const islandNumber = wrapper.getAttribute('data-island');
        const color = wrapper.getAttribute('data-color');

        // Apply dynamic colors
        const islandIcon = wrapper.querySelector('.island-icon');
        const islandGlow = wrapper.querySelector('.island-glow');
        const islandButton = wrapper.querySelector('.island-button');
        const ringFill = wrapper.querySelector('.ring-fill');

        if (islandIcon) {
            islandIcon.style.background = `linear-gradient(135deg, ${color}, ${color}DD)`;
        }
        if (islandGlow) {
            islandGlow.style.color = color;
        }
        if (islandButton) {
            islandButton.style.background = `linear-gradient(135deg, ${color}, ${color}DD)`;
        }
        if (ringFill) {
            ringFill.style.stroke = color;
        }

        // Desktop: Hover effects
        if (!isMobile) {
            wrapper.addEventListener('mouseenter', () => {
                if (island) {
                    island.style.borderColor = color;
                    island.style.boxShadow = `0 30px 80px ${color}50, 0 0 60px ${color}30`;
                }
            });

            wrapper.addEventListener('mouseleave', () => {
                if (island) {
                    island.style.borderColor = 'transparent';
                    island.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.2)';
                }
            });
        } else {
            // Mobile: Touch effects
            wrapper.addEventListener('touchstart', () => {
                if (island) {
                    island.style.borderColor = color;
                    island.style.transform = 'scale(0.97)';
                    island.style.boxShadow = `0 30px 80px ${color}50`;
                }

                if (navigator.vibrate) {
                    navigator.vibrate(5);
                }
            });

            wrapper.addEventListener('touchend', () => {
                if (island) {
                    setTimeout(() => {
                        island.style.borderColor = 'transparent';
                        island.style.transform = 'scale(1)';
                        island.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.2)';
                    }, 300);
                }
            });
        }

        // Button click handler
        const button = wrapper.querySelector('.island-button');
        if (button) {
            button.addEventListener('click', (e) => {
                e.stopPropagation();

                if (navigator.vibrate && isMobile) {
                    navigator.vibrate(10);
                }

                toggleIsland(button);
            });
        }

        // Card click handler
        if (island) {
            island.addEventListener('click', () => {
                if (navigator.vibrate && isMobile) {
                    navigator.vibrate(5);
                }

                // Scroll to island smoothly
                wrapper.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            });
        }
    });
}

// Update island progress
function updateIslandProgress(islandNumber, percentage) {
    const wrapper = document.querySelector(`[data-island="${islandNumber}"]`);
    if (!wrapper) return;

    const ringFill = wrapper.querySelector('.ring-fill');
    const progressPercent = wrapper.querySelector('.progress-percent');

    if (ringFill) {
        ringFill.style.setProperty('--progress', percentage);
    }

    if (progressPercent) {
        progressPercent.textContent = `${percentage}%`;
    }

    // Mark as completed if 100%
    if (percentage === 100) {
        wrapper.classList.add('completed');
    }
}

// Scroll reveal animation
const islandObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
        }
    });
}, {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
});

islandWrappers.forEach(wrapper => {
    wrapper.style.animationPlayState = 'paused';
    islandObserver.observe(wrapper);
});

// Parallax effect for islands on scroll (subtle)
if (!isMobile) {
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;

                islandWrappers.forEach((wrapper, index) => {
                    const speed = (index % 2 === 0) ? 0.3 : -0.3;
                    const yPos = scrolled * speed;
                    wrapper.style.transform = `translateY(${yPos}px)`;
                });

                ticking = false;
            });

            ticking = true;
        }
    });
}

// ================================
// TOGGLE ISLAND (раскрытие пути)
// ================================
function toggleIsland(button) {
    const islandWrapper = button.closest('.island-wrapper');
    const isExpanded = islandWrapper.classList.contains('expanded');
    
    // Закрыть все другие острова
    document.querySelectorAll('.island-wrapper').forEach(wrapper => {
        wrapper.classList.remove('expanded');
        const btn = wrapper.querySelector('.island-button');
        if (btn) btn.textContent = 'Начать';
    });
    
    // Переключить текущий остров
    if (!isExpanded) {
        islandWrapper.classList.add('expanded');
        button.textContent = 'Закрыть';
        
        // Плавный скролл к пути
        setTimeout(() => {
            const lessonsPath = islandWrapper.querySelector('.lessons-path');
            if (lessonsPath) {
                lessonsPath.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }, 300);
    }
    
    if (navigator.vibrate) {
        navigator.vibrate(10);
    }
}

// Клик на урок
document.addEventListener('click', (e) => {
    const lessonCircle = e.target.closest('.lesson-circle');
    if (!lessonCircle || lessonCircle.classList.contains('locked')) return;
    
    const lessonId = lessonCircle.getAttribute('data-lesson');
    
    if (lessonCircle.classList.contains('story')) {
        alert('История скоро будет доступна! 📖');
    } else if (lessonCircle.classList.contains('chest')) {
        alert('Сундучок скоро будет доступен! 🎁');
    } else if (lessonId) {
        startLesson(lessonId);
    }
});

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
        const wrapper = document.querySelector(`[data-island="${lessonId}"]`);
        if (!wrapper) return;

        const progress = savedProgress[lessonId];
        const percentage = Math.round((progress.completed / progress.total) * 100);
        
        updateIslandProgress(lessonId, percentage);
    });
}

// ================================
// WINDOW RESIZE HANDLER
// ================================
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        const particlesContainer = document.getElementById('particlesContainer');
        if (particlesContainer) {
            particlesContainer.innerHTML = '';
            createParticles();
        }
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
initIslands();
loadProgress();

// ================================
// EXPORTS
// ================================
window.startLesson = startLesson;
window.settings = settings;

console.log(`🎮 Karo Español loaded | Device: ${isMobile ? 'Mobile' : 'Desktop'} | Theme: ${settings.theme}`);