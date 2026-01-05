// Theory Investment Game - Sound System

// ============================================
// SOUND SYSTEM
// ============================================
let audioContext = null;
let soundEnabled = true;

function initAudio() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
        console.warn('Web Audio API not supported');
        soundEnabled = false;
    }
}

function playSound(type) {
    if (!soundEnabled || !audioContext) return;

    // Resume audio context if suspended (browser autoplay policy)
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }

    switch (type) {
        case 'hop':
            playHopSound();
            break;
        case 'dice':
            playDiceSound();
            break;
        case 'diceResult':
            playDiceResultSound();
            break;
        case 'land':
            playLandSound();
            break;
        case 'fame':
            playFameSound();
            break;
        case 'theory':
            playTheorySound();
            break;
        case 'rejuvenate':
            playRejuvenateSound();
            break;
        case 'hire':
            playHireSound();
            break;
        case 'scandal':
            playScandalSound();
            break;
        case 'npcMove':
            playNPCMoveSound();
            break;
        case 'eureka':
            playEurekaSound();
            break;
        case 'death':
            playDeathSound();
            break;
        case 'click':
            playClickSound();
            break;
        case 'win':
            playWinSound();
            break;
    }
}

function createOscillator(freq, type = 'sine', duration = 0.1) {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc.type = type;
    osc.frequency.value = freq;
    osc.connect(gain);
    gain.connect(audioContext.destination);

    gain.gain.setValueAtTime(0.3, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

    osc.start(audioContext.currentTime);
    osc.stop(audioContext.currentTime + duration);

    return { osc, gain };
}

function playHopSound() {
    const freq = 300 + Math.random() * 100;
    createOscillator(freq, 'sine', 0.08);
    setTimeout(() => createOscillator(freq * 1.2, 'sine', 0.06), 30);
}

function playDiceSound() {
    // Rattling dice sound
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const freq = 200 + Math.random() * 300;
            createOscillator(freq, 'square', 0.03);
        }, i * 40);
    }
}

function playDiceResultSound() {
    createOscillator(440, 'sine', 0.15);
    setTimeout(() => createOscillator(550, 'sine', 0.15), 80);
    setTimeout(() => createOscillator(660, 'sine', 0.2), 160);
}

function playLandSound() {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(audioContext.destination);

    gain.gain.setValueAtTime(0.3, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);

    osc.start(audioContext.currentTime);
    osc.stop(audioContext.currentTime + 0.15);
}

function playFameSound() {
    // Ascending arpeggio
    const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
        setTimeout(() => createOscillator(freq, 'sine', 0.15), i * 60);
    });
}

function playTheorySound() {
    // Triumphant fanfare
    const notes = [523, 659, 784, 1047, 1319, 1568];
    notes.forEach((freq, i) => {
        setTimeout(() => {
            createOscillator(freq, 'sine', 0.25);
            createOscillator(freq * 0.5, 'sine', 0.25); // Add bass
        }, i * 100);
    });
}

function playRejuvenateSound() {
    // Magical sparkle ascending
    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            const freq = 800 + i * 100 + Math.random() * 50;
            createOscillator(freq, 'sine', 0.1);
        }, i * 50);
    }
}

function playHireSound() {
    createOscillator(400, 'triangle', 0.1);
    setTimeout(() => createOscillator(500, 'triangle', 0.1), 100);
    setTimeout(() => createOscillator(600, 'triangle', 0.15), 200);
}

function playScandalSound() {
    // Descending doom sound
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(400, audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(audioContext.destination);

    gain.gain.setValueAtTime(0.2, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);

    osc.start(audioContext.currentTime);
    osc.stop(audioContext.currentTime + 0.4);
}

function playNPCMoveSound() {
    // Ethereal/mystical sound
    const osc1 = audioContext.createOscillator();
    const osc2 = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc1.type = 'sine';
    osc2.type = 'sine';
    osc1.frequency.value = 220;
    osc2.frequency.value = 223; // Slight detuning for ethereal effect

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(audioContext.destination);

    gain.gain.setValueAtTime(0.15, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

    osc1.start(audioContext.currentTime);
    osc2.start(audioContext.currentTime);
    osc1.stop(audioContext.currentTime + 0.3);
    osc2.stop(audioContext.currentTime + 0.3);
}

function playEurekaSound() {
    // Light bulb moment!
    setTimeout(() => createOscillator(800, 'sine', 0.1), 0);
    setTimeout(() => createOscillator(1000, 'sine', 0.1), 50);
    setTimeout(() => createOscillator(1200, 'sine', 0.15), 100);
    setTimeout(() => {
        createOscillator(1600, 'sine', 0.3);
        createOscillator(800, 'sine', 0.3);
    }, 150);
}

function playDeathSound() {
    // Somber descending
    const notes = [400, 350, 300, 250, 200];
    notes.forEach((freq, i) => {
        setTimeout(() => createOscillator(freq, 'sine', 0.3), i * 150);
    });
}

function playClickSound() {
    createOscillator(600, 'square', 0.02);
}

function playWinSound() {
    // Victory fanfare
    const melody = [523, 523, 523, 698, 880, 784, 698, 880, 1047];
    const durations = [0.1, 0.1, 0.1, 0.3, 0.1, 0.1, 0.3, 0.1, 0.4];

    let time = 0;
    melody.forEach((freq, i) => {
        setTimeout(() => {
            createOscillator(freq, 'sine', durations[i]);
            createOscillator(freq * 0.5, 'sine', durations[i]);
        }, time);
        time += durations[i] * 800;
    });
}
