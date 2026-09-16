// Cursor following effect
const cursor = document.querySelector('.cursor');
document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

// Typing effect for greeting
const greetingText = "Hey You Know What! You're the most adorable human i ever met! 💖";
const greetingElement = document.querySelector('.greeting');
let charIndex = 0;

function typeGreeting() {
    if (charIndex < greetingText.length) {
        greetingElement.textContent += greetingText.charAt(charIndex);
        charIndex++;
        setTimeout(typeGreeting, 100);
    }
}

// Create floating elements
const floatingElements = ['💖', '✨', '🌸', '💫', '💕'];
function createFloating() {
    const element = document.createElement('div');
    element.className = 'floating';
    element.textContent = floatingElements[Math.floor(Math.random() * floatingElements.length)];
    element.style.left = Math.random() * 100 + 'vw';
    element.style.top = Math.random() * 100 + 'vh';
    element.style.fontSize = (Math.random() * 20 + 20) + 'px';
    document.body.appendChild(element);

    gsap.to(element, {
        y: -500,
        x: Math.random() * 100 - 50,
        rotation: Math.random() * 360,
        duration: Math.random() * 5 + 5,
        opacity: 1,
        ease: "none",
        onComplete: () => element.remove()
    });
}

// Background cycling layers: create soft crossfading gradients
function setupBackgroundCycle() {
    if (document.querySelector('.bg-layers')) return; // already exists
    const gradients = [
        'linear-gradient(-45deg, #FFE6E6, #FFF1E6)', // Pastel sunrise
        'linear-gradient(-45deg, #E9D5FF, #DDEBFF)', // Lavender dream
        'linear-gradient(-45deg, #FFB6C1, #CFF7E1)', // Blush & teal
        'linear-gradient(-45deg, #E6FFF4, #D9F7FF)', // Mint candy
        'linear-gradient(-45deg, #0F1724, #1E293B)', // Midnight (dark)
        'linear-gradient(-45deg, #FFF4D6, #FFE1A8)'  // Warm gold
    ];

    const container = document.createElement('div');
    container.className = 'bg-layers';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.zIndex = '0';
    container.style.pointerEvents = 'none';
    document.body.insertBefore(container, document.body.firstChild);

    const layers = gradients.map((g, i) => {
        const d = document.createElement('div');
        d.className = 'bg-layer';
        d.style.position = 'absolute';
        d.style.inset = '0';
        d.style.background = g;
        d.style.opacity = i === 0 ? '1' : '0';
        d.style.transition = 'opacity 1.6s ease-in-out';
        d.style.filter = 'saturate(1)';
        container.appendChild(d);
        return d;
    });

    // GSAP timeline to crossfade layers
    try {
        const tl = gsap.timeline({ repeat: -1 });
        const hold = 4.0; // seconds to hold each color
        layers.forEach((layer, idx) => {
            tl.to(layer, { opacity: 1, duration: 1.2, ease: 'power2.inOut' })
              .to(layer, { opacity: 1, duration: hold })
              .to(layer, { opacity: 0, duration: 1.2, ease: 'power2.inOut' });
        });
    } catch (e) {
        // fallback: simple CSS keyframe fade not implemented; ignore
        console.warn('Background cycle failed:', e);
    }
}

// Initialize animations
window.addEventListener('load', () => {
    setupBackgroundCycle();

    // Title animation
    gsap.to('h1', {
        opacity: 1,
        duration: 1,
        y: 20,
        ease: "bounce.out"
    });

    // Button animation
    gsap.to('.cta-button', {
        opacity: 1,
        duration: 1,
        y: -20,
        ease: "back.out"
    });

    // Start typing effect
    typeGreeting();

    // Create floating elements periodically
    setInterval(createFloating, 1000);
});

// Hover effects
       // Hover effects
       document.querySelectorAll('.cta-button').forEach(button => {
        button.addEventListener('mouseenter', () => {
            gsap.to(button, {
                scale: 1.1,
                duration: 0.3
            });
        });

        button.addEventListener('mouseleave', () => {
            gsap.to(button, {
                scale: 1,
                duration: 0.3
            });
        });

        // Smooth page transition on click
        button.addEventListener('click', (event) => {
                // pop-out animation for button
            try {
                const tl = gsap.timeline();
                tl.to(button, { scale: 1.18, duration: 0.12, ease: 'power1.out' })
                  .to(button, { scale: 1, duration: 0.18, ease: 'bounce.out' });

                // small confetti burst at pop start
                try { if (typeof confetti === 'function') confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } }); } catch (e) {}

                // after pop animation completes, perform circular reveal transition
                tl.eventCallback('onComplete', () => {
                    try {
                        const cx = event.clientX || window.innerWidth/2;
                        const cy = event.clientY || window.innerHeight/2;
                        const grad = (document.querySelector('.bg-layer') && document.querySelector('.bg-layer').style.background) || 'linear-gradient(135deg, #FFD8B5 0%, #FF9CC0 50%, #FF3CA6 100%)';

                        // pre-create or reuse a single scaled circle element (transform-based)
                        let circle = document.querySelector('.reveal-circle');
                        if (!circle) {
                            circle = document.createElement('div');
                            circle.className = 'reveal-circle';
                            document.body.appendChild(circle);
                        }
                        // set gradient and position
                        circle.style.background = grad;
                        circle.style.left = cx + 'px';
                        circle.style.top = cy + 'px';

                        // compute radius to farthest corner and set size
                        const w = window.innerWidth, h = window.innerHeight;
                        const dx = Math.max(cx, w - cx);
                        const dy = Math.max(cy, h - cy);
                        const maxRadius = Math.hypot(dx, dy);
                        const size = Math.ceil(maxRadius * 2);
                        circle.style.width = size + 'px';
                        circle.style.height = size + 'px';

                        // store values for destination page
                        sessionStorage.setItem('pageTransition', 'circle');
                        sessionStorage.setItem('circleX', cx);
                        sessionStorage.setItem('circleY', cy);
                        sessionStorage.setItem('circleGrad', grad);
                        sessionStorage.setItem('circleSize', size);

                        // animate scale via transform (GPU)
                        gsap.set(circle, { scale: 0, xPercent: -50, yPercent: -50, force3D: true });
                        gsap.to(circle, { scale: 1, duration: 0.9, ease: 'power3.inOut', force3D: true, onComplete: () => { window.location.href = 'cause.html'; }});
                    } catch (e) {
                        try { sessionStorage.setItem('pageTransition', 'to-cause'); } catch (ex) {}
                        gsap.to('body', {
                            opacity: 0,
                            duration: 1,
                            onComplete: () => { window.location.href = 'cause.html'; }
                        });
                    }
                });
            } catch (e) {
                // fallback: direct transition
                try { if (typeof confetti === 'function') confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } }); } catch (er) {}
                gsap.to('body', {
                    opacity: 0,
                    duration: 1,
                    onComplete: () => { window.location.href = 'cause.html'; }
                });
            }
        });
    });

// Background music: play and persist playback position across pages
function setupIndexBackgroundMusic() {
    const indexMusic = document.getElementById('index-music');
    if (!indexMusic) return;

    const persistState = () => {
        try {
            localStorage.setItem('bgSongTime', indexMusic.currentTime.toString());
            localStorage.setItem('bgSongPlaying', (!indexMusic.paused).toString());
        } catch (e) { /* ignore */ }
    };

    const startMusic = async () => {
        try {
            indexMusic.muted = false;
            indexMusic.volume = 0.10;
            await indexMusic.play();
            localStorage.setItem('bgSongPlaying', 'true');
            sessionStorage.setItem('musicUnlocked', 'true');
            const overlay = document.querySelector('.start-screen');
            if (overlay) overlay.remove();
        } catch (e) {
            localStorage.setItem('bgSongPlaying', 'false');
        }
    };

    const setupStartOverlay = () => {
        if (sessionStorage.getItem('musicUnlocked') === 'true') return;
        if (document.querySelector('.start-screen')) return;

        const overlay = document.createElement('div');
        overlay.className = 'start-screen';
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'start-button';
        button.textContent = 'You Ready?';
        button.addEventListener('click', () => {
            sessionStorage.setItem('musicUnlocked', 'true');
            startMusic();
        });
        overlay.appendChild(button);
        document.body.appendChild(overlay);
    };

    try { indexMusic.volume = 0.10; } catch (e) { console.warn('Could not set volume:', e); }

    const savedTime = parseFloat(localStorage.getItem('bgSongTime') || '0');
    if (!isNaN(savedTime) && savedTime > 0) {
        try { indexMusic.currentTime = Math.min(savedTime, indexMusic.duration || savedTime); } catch (e) { /* ignore */ }
    }

    indexMusic.addEventListener('loadedmetadata', () => {
        try { indexMusic.currentTime = Math.min(savedTime, indexMusic.duration || savedTime); } catch (e) { /* ignore */ }
    });

    if (sessionStorage.getItem('musicUnlocked') === 'true') {
        indexMusic.addEventListener('canplaythrough', startMusic, { once: true });
    } else {
        setupStartOverlay();
    }

    const saver = setInterval(persistState, 1000);
    window.addEventListener('beforeunload', () => {
        persistState();
        clearInterval(saver);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setupIndexBackgroundMusic();
    setupBackgroundCycle();
});