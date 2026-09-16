 // Reasons database
 const reasons = [
    { 
        text: "You’re such a kind and wonderful person, and I feel lucky to share such a good bond with you. 💖", 
        emoji: "🌟",
        gif: "gif1.gif"
    },
    { 
        text: "May your day be filled with love, laughter, and endless joy. 🌸 ", 
        emoji: "💗",
        gif: "gif2.gif"
    },
    { 
        text: "Wishing you success, happiness, and everything your heart desires. ✨ ", 
        emoji: "💕",
        gif: "gif1.gif"
    },
    { 
        text: "Stay the amazing girl you are—always spreading positivity around. Have the happiest year ahead! 🥳 ", 
        emoji: "🌟",
        gif: "gif2.gif"
    }
];

// State management
let currentReasonIndex = 0;
const reasonsContainer = document.getElementById('reasons-container');
const shuffleButton = document.querySelector('.shuffle-button');
const reasonCounter = document.querySelector('.reason-counter');
let isTransitioning = false;

// Create reason card with gif
function createReasonCard(reason) {
    const card = document.createElement('div');
    card.className = 'reason-card';
    
    const text = document.createElement('div');
    text.className = 'reason-text';
    text.innerHTML = `${reason.emoji} ${reason.text}`;
    
    const gifOverlay = document.createElement('div');
    gifOverlay.className = 'gif-overlay';
    gifOverlay.innerHTML = `<img src="${reason.gif}" alt="Friendship Memory">`;
    
    card.appendChild(text);
    card.appendChild(gifOverlay);
    
    gsap.from(card, {
        opacity: 0,
        y: 50,
        duration: 0.5,
        ease: "back.out"
    });

    return card;
}

// Display new reason
function displayNewReason() {
    if (isTransitioning) return;
    isTransitioning = true;

    if (currentReasonIndex < reasons.length) {
        const card = createReasonCard(reasons[currentReasonIndex]);
        reasonsContainer.appendChild(card);
        
        // Update counter
        reasonCounter.textContent = `Reason ${currentReasonIndex + 1} of ${reasons.length}`;
        
        currentReasonIndex++;

        // Check if we should transform the button
        if (currentReasonIndex === reasons.length) {
            gsap.to(shuffleButton, {
                scale: 1.1,
                duration: 0.5,
                ease: "elastic.out",
                onComplete: () => {
                    // bigger celebratory confetti when final reason appears
                    try { if (typeof confetti === 'function') confetti({ particleCount: 200, spread: 140, origin: { y: 0.6 } }); } catch (e) {}

                    shuffleButton.textContent = "Enter Our Storylane 💫";
                    shuffleButton.classList.add('story-mode');
                    shuffleButton.addEventListener('click', () => {
                        gsap.to('body', {
                            opacity: 0,
                            duration: 1,
                            onComplete: () => {
                                window.location.href = 'last.html'; // Replace with the actual URL of the next page
                            }
                        });
                    });
                }
            });
        }

        // Create floating elements
        createFloatingElement();
        
        setTimeout(() => {
            isTransitioning = false;
        }, 500);
    } else {
        // Handle navigation to new page or section
        window.location.href = "#storylane";
        // Or trigger your next page functionality
    }
}

// Initialize button click
shuffleButton.addEventListener('click', () => {
    // pop-out animation for shuffle button
    try {
        const tl = gsap.timeline();
        tl.to(shuffleButton, { scale: 1.18, duration: 0.12, ease: 'power1.out' })
          .to(shuffleButton, { scale: 1, duration: 0.18, ease: 'bounce.out' });

        // small confetti burst at pop start
        try { if (typeof confetti === 'function') confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } }); } catch (e) {}

        // call displayNewReason after animation completes
        tl.eventCallback('onComplete', () => displayNewReason());
    } catch (e) {
        // fallback
        try { if (typeof confetti === 'function') confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } }); } catch (err) {}
        displayNewReason();
    }
});

// Floating elements function (same as before)
function createFloatingElement() {
    const elements = ['🌸', '✨', '💖', '🦋', '⭐'];
    const element = document.createElement('div');
    element.className = 'floating';
    element.textContent = elements[Math.floor(Math.random() * elements.length)];
    element.style.left = Math.random() * window.innerWidth + 'px';
    element.style.top = Math.random() * window.innerHeight + 'px';
    element.style.fontSize = (Math.random() * 20 + 10) + 'px';
    document.body.appendChild(element);

    gsap.to(element, {
        y: -500,
        duration: Math.random() * 10 + 10,
        opacity: 0,
        onComplete: () => element.remove()
    });
}

// Custom cursor (same as before)
const cursor = document.querySelector('.custom-cursor');
document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, {
        x: e.clientX - 15,
        y: e.clientY - 15,
        duration: 0.2
    });
});

// Create initial floating elements
const floatingInterval = setInterval(createFloatingElement, 2000);

// Background cycling layers: create soft crossfading gradients (same palettes as index)
function setupBackgroundCycleCause() {
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

    try {
        const tl = gsap.timeline({ repeat: -1 });
        const hold = 4.0;
        layers.forEach((layer) => {
            tl.to(layer, { opacity: 1, duration: 1.2, ease: 'power2.inOut' })
              .to(layer, { opacity: 1, duration: hold })
              .to(layer, { opacity: 0, duration: 1.2, ease: 'power2.inOut' });
        });
    } catch (e) {
        console.warn('Background cycle failed (cause):', e);
    }
}

// Background music: recreate (hidden) audio and resume from saved position
function setupCauseBackgroundMusic() {
    // don't create if running in same-page embed
    try {
        const existing = document.getElementById('index-music');
        if (existing) {
            // initialize shared audio element instead of creating a new one
            try {
                existing.preload = 'auto';
                existing.loop = true;
                try { existing.volume = 0.10; } catch(e) {}
            } catch(e) {}

            const savedTime = parseFloat(localStorage.getItem('bgSongTime') || '0');
            const shouldPlay = localStorage.getItem('bgSongPlaying') === 'true';
            if (!isNaN(savedTime) && savedTime > 0) {
                existing.addEventListener('loadedmetadata', () => {
                    try { existing.currentTime = Math.min(savedTime, existing.duration || savedTime); } catch (e) { /* ignore */ }
                });
            }
            existing.addEventListener('canplaythrough', () => {
                try { if (shouldPlay) existing.play().catch(()=>{}); } catch(e){}
            });

            // regularly save currentTime and playing state
            const saver = setInterval(() => {
                try {
                    localStorage.setItem('bgSongTime', existing.currentTime.toString());
                    localStorage.setItem('bgSongPlaying', (!existing.paused).toString());
                } catch (e) {}
            }, 1000);

            window.indexMusic = existing; // expose
            return;
        }
    } catch (e) {}

    const audio = document.createElement('audio');
    audio.id = 'bg-music-dynamic';
    audio.src = './assets/happy-birthday-song.mp3';
    audio.preload = 'auto';
    audio.loop = true;
    audio.style.display = 'none';
    document.body.appendChild(audio);

    try { audio.volume = 0.10; } catch (e) { console.warn('Could not set cause audio volume:', e); }

    // restore saved time and playing state
    const savedTime = parseFloat(localStorage.getItem('bgSongTime') || '0');
    const shouldPlay = localStorage.getItem('bgSongPlaying') === 'true';
    if (!isNaN(savedTime) && savedTime > 0) {
        // try set currentTime after metadata loads
        audio.addEventListener('loadedmetadata', () => {
            try { audio.currentTime = Math.min(savedTime, audio.duration || savedTime); } catch (e) { /* ignore */ }
        });
    }

    const playAttempt = () => {
        const p = audio.play();
        if (p !== undefined) {
            p.catch((e) => {
                console.warn('Autoplay prevented on cause:', e);
            });
        }
    };

    if (shouldPlay) playAttempt();

    // keep saving position regularly so navigation back/forward stays in sync
    const saver = setInterval(() => {
        try {
            localStorage.setItem('bgSongTime', audio.currentTime.toString());
            localStorage.setItem('bgSongPlaying', (!audio.paused).toString());
        } catch (e) {}
    }, 1000);

    // cleanup on unload
    window.addEventListener('beforeunload', () => {
        try {
            localStorage.setItem('bgSongTime', audio.currentTime.toString());
            localStorage.setItem('bgSongPlaying', (!audio.paused).toString());
        } catch (e) {}
        clearInterval(saver);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setupCauseBackgroundMusic();
    setupBackgroundCycleCause();

// build polaroid collage if present — place items into non-overlapping cells so each is ~80% visible
try {
    const collage = document.getElementById('collage');
    if (collage) {
        const list = (collage.dataset.images || '').split(',').map(s=>s.trim()).filter(Boolean);
        const n = list.length;
        const w = collage.clientWidth;
        const h = collage.clientHeight;
        let z = 2;

        // compute grid to place items without heavy overlap
        const cols = Math.ceil(Math.sqrt(n));
        const rows = Math.ceil(n / cols);
        const pad = 20;
        const cellW = (w - pad*2) / cols;
        const cellH = (h - pad*2) / rows;

        // desired polaroid size (leave spacing so at least ~80% visible)
        const baseWidth = Math.min(220, cellW * 0.85);
        const baseHeight = baseWidth * 0.8 + 38; // include caption/footer area

        let idx = 0;
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (idx >= n) break;
                const src = list[idx];
                const el = document.createElement('div');
                el.className = 'polaroid';
                el.style.width = baseWidth + 'px';

                // center in cell with slight random offset
                const cellX = pad + c * cellW;
                const cellY = pad + r * cellH;
                const centerX = cellX + cellW/2;
                const centerY = cellY + cellH/2;
                const jitterX = (Math.random()*0.34 - 0.17) * cellW; // +/-17% of cell
                const jitterY = (Math.random()*0.34 - 0.17) * cellH;
                const left = Math.max(pad, Math.min(w - baseWidth - pad, centerX + jitterX - baseWidth/2));
                const top = Math.max(pad, Math.min(h - baseHeight - pad, centerY + jitterY - (baseHeight-38)/2));

                const rot = (Math.random() * 24) - 12; // milder rotation
                const scale = 0.95 + Math.random()*0.08;
                el.style.left = left + 'px';
                el.style.top = top + 'px';
                el.style.transform = `rotate(${rot}deg) scale(${scale})`;
                el.style.zIndex = String(z + idx);

                const img = document.createElement('img');
                img.src = src;
                img.alt = 'photo-'+idx;
                img.style.opacity = '1';
                // prefer faces: center slightly higher
                img.style.objectFit = 'cover';
                img.style.objectPosition = 'center 30%';

                const cap = document.createElement('div');
                cap.className = 'caption';
                cap.textContent = '';

                el.appendChild(img);
                el.appendChild(cap);

                el.addEventListener('click', () => {
                    el.style.zIndex = String(++z);
                    gsap.to(el, { scale: 1.02, duration: 0.12 }).then(()=>gsap.to(el, { scale: scale, duration: 0.18 }));
                });

                collage.appendChild(el);
                idx++;
            }
        }

        // responsive: recompute on resize
        window.addEventListener('resize', () => {
            const w2 = collage.clientWidth;
            const h2 = collage.clientHeight;
            const cols2 = Math.ceil(Math.sqrt(n));
            const rows2 = Math.ceil(n / cols2);
            const cellW2 = (w2 - pad*2) / cols2;
            const cellH2 = (h2 - pad*2) / rows2;
            const baseW2 = Math.min(220, cellW2 * 0.85);
            const baseH2 = baseW2 * 0.8 + 38;
            let i2 = 0;
            collage.querySelectorAll('.polaroid').forEach((el) => {
                const r2 = Math.floor(i2 / cols2);
                const c2 = i2 % cols2;
                const cellX2 = pad + c2 * cellW2;
                const cellY2 = pad + r2 * cellH2;
                const centerX2 = cellX2 + cellW2/2;
                const centerY2 = cellY2 + cellH2/2;
                const jitterX2 = (Math.random()*0.34 - 0.17) * cellW2;
                const jitterY2 = (Math.random()*0.34 - 0.17) * cellH2;
                const left2 = Math.max(pad, Math.min(w2 - baseW2 - pad, centerX2 + jitterX2 - baseW2/2));
                const top2 = Math.max(pad, Math.min(h2 - baseH2 - pad, centerY2 + jitterY2 - (baseH2-38)/2));
                el.style.width = baseW2 + 'px';
                el.style.left = left2 + 'px';
                el.style.top = top2 + 'px';
                i2++;
            });
        });
    }
} catch(e) { console.warn('Collage build failed', e); }

// if we arrived via a transition, reveal by sliding overlay out
const flag = sessionStorage.getItem('pageTransition');
if (flag && flag === 'circle') {
    // circular reveal: use transform-scaled circle for smooth GPU animation
    const cx = parseFloat(sessionStorage.getItem('circleX') || window.innerWidth/2);
    const cy = parseFloat(sessionStorage.getItem('circleY') || window.innerHeight/2);
    const grad = sessionStorage.getItem('circleGrad') || 'linear-gradient(135deg, #FFD8B5 0%, #FF9CC0 50%, #FF3CA6 100%)';
    const size = parseFloat(sessionStorage.getItem('circleSize') || Math.max(window.innerWidth, window.innerHeight));

    let circle = document.querySelector('.reveal-circle');
    if (!circle) {
        circle = document.createElement('div');
        circle.className = 'reveal-circle';
        document.body.appendChild(circle);
    }
    circle.style.background = grad;
    circle.style.width = size + 'px';
    circle.style.height = size + 'px';
    circle.style.left = cx + 'px';
    circle.style.top = cy + 'px';

    // start scaled to 1 (covering) then scale down to 0 to reveal
    gsap.set(circle, { scale: 1, xPercent: -50, yPercent: -50, force3D: true });
    gsap.to(circle, { scale: 0, duration: 0.9, ease: 'power3.inOut', force3D: true, onComplete: () => {
        try { circle.remove(); } catch (e) {}
        sessionStorage.removeItem('pageTransition');
        sessionStorage.removeItem('circleX');
        sessionStorage.removeItem('circleY');
        sessionStorage.removeItem('circleGrad');
        sessionStorage.removeItem('circleSize');
    }});
} else if (flag && (flag === 'to-cause' || flag === 'to-index')) {
    const overlay = document.querySelector('.page-overlay') || (() => {
        const d = document.createElement('div'); d.className = 'page-overlay'; d.style.zIndex = 99999; document.body.appendChild(d); return d;
    })();
    // ensure overlay covers and starts at x:0 (use xPercent for smooth GPU transform)
    gsap.set(overlay, { xPercent: 0, force3D: true });
    gsap.to(overlay, { xPercent: -100, duration: 0.8, ease: 'power3.inOut', force3D: true, onComplete: () => {
        try { overlay.remove(); } catch (e) {}
        sessionStorage.removeItem('pageTransition');
    }});
} else {
    // ensure normal state
    sessionStorage.removeItem('pageTransition');
}

// re-bind Go Back button after DOM ready
const backBtn = document.querySelector('.back-button');
if (backBtn) {
    backBtn.addEventListener('click', () => {
        try {
            sessionStorage.setItem('pageTransition', 'to-index');
            let overlay = document.querySelector('.page-overlay');
            if (!overlay) {
                overlay = document.createElement('div'); overlay.className = 'page-overlay'; document.body.appendChild(overlay);
            }
            gsap.set(overlay, { xPercent: 100, force3D: true });
            gsap.to(overlay, { xPercent: 0, duration: 0.8, ease: 'power3.inOut', force3D: true, onComplete: () => { window.location.href = 'index.html'; }});
        } catch (e) {
            gsap.to('body', { opacity: 0, duration: 0.8, onComplete: () => { window.location.href = 'index.html'; } });
        }
    });
}
});
