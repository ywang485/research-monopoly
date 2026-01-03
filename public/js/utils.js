// Theory Investment Game - Utility Functions

// ============================================
// NAME MANAGEMENT
// ============================================
let usedNames = new Set();

function getRandomScientistName() {
    // Filter out already used names
    const availableNames = SCIENTIST_NAMES.filter(name => !usedNames.has(name));

    // If all names used, reset the pool
    if (availableNames.length === 0) {
        usedNames.clear();
        return SCIENTIST_NAMES[Math.floor(Math.random() * SCIENTIST_NAMES.length)];
    }

    const name = availableNames[Math.floor(Math.random() * availableNames.length)];
    usedNames.add(name);
    return name;
}

function resetUsedNames() {
    usedNames.clear();
}

// ============================================
// GAME UTILITIES
// ============================================
function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
}

function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

// ============================================
// PENCIL SKETCH DRAWING HELPERS
// ============================================

// Create a seeded random number generator for consistent sketchy effects
function seededRandom(seed) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

// Draw a sketchy/wobbly line (pencil effect)
function sketchyLine(ctx, x1, y1, x2, y2, seed = 0) {
    const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const segments = Math.max(3, Math.floor(length / 8));

    ctx.beginPath();
    ctx.moveTo(x1, y1);

    for (let i = 1; i <= segments; i++) {
        const t = i / segments;
        const baseX = x1 + (x2 - x1) * t;
        const baseY = y1 + (y2 - y1) * t;

        // Add wobble perpendicular to line direction
        const wobble = (seededRandom(seed + i * 7.3) - 0.5) * 2;
        const angle = Math.atan2(y2 - y1, x2 - x1) + Math.PI / 2;
        const offsetX = Math.cos(angle) * wobble;
        const offsetY = Math.sin(angle) * wobble;

        ctx.lineTo(baseX + offsetX, baseY + offsetY);
    }
    ctx.stroke();
}

// Draw a sketchy rounded rectangle (pencil-drawn box)
function sketchyRoundedRect(ctx, x, y, w, h, radius, seed = 0) {
    // Multiple passes for pencil texture
    for (let pass = 0; pass < 2; pass++) {
        const offset = pass * 0.5;
        const wobbleAmt = 1.5 - pass * 0.5;

        ctx.beginPath();

        // Top-left corner
        const tlWobble = (seededRandom(seed + 1) - 0.5) * wobbleAmt;
        ctx.moveTo(x + radius + tlWobble, y + offset);

        // Top edge (with wobble)
        const topMidWobble = (seededRandom(seed + 2) - 0.5) * wobbleAmt;
        ctx.quadraticCurveTo(
            x + w/2, y + topMidWobble,
            x + w - radius + (seededRandom(seed + 3) - 0.5) * wobbleAmt, y + offset
        );

        // Top-right corner
        ctx.quadraticCurveTo(
            x + w + offset, y + offset,
            x + w + offset, y + radius + (seededRandom(seed + 4) - 0.5) * wobbleAmt
        );

        // Right edge
        const rightMidWobble = (seededRandom(seed + 5) - 0.5) * wobbleAmt;
        ctx.quadraticCurveTo(
            x + w + rightMidWobble, y + h/2,
            x + w + offset, y + h - radius + (seededRandom(seed + 6) - 0.5) * wobbleAmt
        );

        // Bottom-right corner
        ctx.quadraticCurveTo(
            x + w + offset, y + h + offset,
            x + w - radius + (seededRandom(seed + 7) - 0.5) * wobbleAmt, y + h + offset
        );

        // Bottom edge
        const bottomMidWobble = (seededRandom(seed + 8) - 0.5) * wobbleAmt;
        ctx.quadraticCurveTo(
            x + w/2, y + h + bottomMidWobble,
            x + radius + (seededRandom(seed + 9) - 0.5) * wobbleAmt, y + h + offset
        );

        // Bottom-left corner
        ctx.quadraticCurveTo(
            x + offset, y + h + offset,
            x + offset, y + h - radius + (seededRandom(seed + 10) - 0.5) * wobbleAmt
        );

        // Left edge
        const leftMidWobble = (seededRandom(seed + 11) - 0.5) * wobbleAmt;
        ctx.quadraticCurveTo(
            x + leftMidWobble, y + h/2,
            x + offset, y + radius + (seededRandom(seed + 12) - 0.5) * wobbleAmt
        );

        // Back to top-left corner
        ctx.quadraticCurveTo(
            x + offset, y + offset,
            x + radius + tlWobble, y + offset
        );

        ctx.closePath();
    }
}

// Draw pencil shading/hatching
function drawPencilShading(ctx, x, y, w, h, intensity = 0.15, seed = 0) {
    ctx.save();
    ctx.globalAlpha = intensity;
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 0.5;

    // Diagonal hatching lines
    const spacing = 4;
    const angle = Math.PI / 4; // 45 degrees

    ctx.beginPath();
    for (let i = -h; i < w + h; i += spacing) {
        const wobble = (seededRandom(seed + i) - 0.5) * 1;
        const startX = x + i + wobble;
        const startY = y;
        const endX = x + i - h + wobble;
        const endY = y + h;

        // Clip to rectangle bounds
        let sx = startX, sy = startY, ex = endX, ey = endY;

        if (sx < x) {
            sy = startY + (x - startX);
            sx = x;
        }
        if (ex < x) {
            ey = endY - (x - endX);
            ex = x;
        }
        if (sx > x + w) {
            sy = startY + (sx - (x + w));
            sx = x + w;
        }
        if (ey > y + h) {
            ex = endX + (ey - (y + h));
            ey = y + h;
        }

        if (sx >= x && sx <= x + w && ex >= x && ex <= x + w &&
            sy >= y && sy <= y + h && ey >= y && ey <= y + h) {
            ctx.moveTo(sx, sy);
            ctx.lineTo(ex, ey);
        }
    }
    ctx.stroke();
    ctx.restore();
}

// Draw pencil scribble fill effect
function drawScribbleFill(ctx, x, y, w, h, color, seed = 0) {
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';

    // Draw a few scribble loops
    const numScribbles = 3;
    for (let s = 0; s < numScribbles; s++) {
        ctx.beginPath();
        const startX = x + w * 0.2 + seededRandom(seed + s * 10) * w * 0.6;
        const startY = y + h * 0.2 + seededRandom(seed + s * 10 + 1) * h * 0.6;
        ctx.moveTo(startX, startY);

        for (let i = 0; i < 8; i++) {
            const nextX = x + w * 0.15 + seededRandom(seed + s * 10 + i * 2 + 2) * w * 0.7;
            const nextY = y + h * 0.15 + seededRandom(seed + s * 10 + i * 2 + 3) * h * 0.7;
            const cpX = x + seededRandom(seed + s * 10 + i * 2 + 4) * w;
            const cpY = y + seededRandom(seed + s * 10 + i * 2 + 5) * h;
            ctx.quadraticCurveTo(cpX, cpY, nextX, nextY);
        }
        ctx.stroke();
    }
    ctx.restore();
}

// Draw investment-based colored pencil strokes for hypothesis spaces
// investments: array of { playerIndex, years } objects
// totalYears: total years invested (affects density)
function drawInvestmentHatching(ctx, x, y, w, h, investments, totalYears, seed = 0) {
    if (!investments || investments.length === 0) return;

    ctx.save();
    ctx.lineCap = 'round';

    // Calculate density based on total investment (more years = more lines)
    const baseSpacing = 8;
    const minSpacing = 2;
    const densityFactor = Math.min(1, totalYears / 30); // Max density at 30 years
    const spacing = baseSpacing - (baseSpacing - minSpacing) * densityFactor;

    // Group investments by player
    const playerInvestments = {};
    investments.forEach(inv => {
        if (!playerInvestments[inv.playerIndex]) {
            playerInvestments[inv.playerIndex] = 0;
        }
        playerInvestments[inv.playerIndex] += inv.years;
    });

    // Draw hatching for each player with their color
    const playerIndices = Object.keys(playerInvestments);
    const angleStep = Math.PI / (playerIndices.length + 1); // Different angles for each player

    playerIndices.forEach((playerIndexStr, pIdx) => {
        const playerIndex = parseInt(playerIndexStr);
        const player = GameState.players[playerIndex];
        if (!player) return;

        const playerYears = playerInvestments[playerIndex];
        const playerDensity = playerYears / totalYears; // Proportion of total
        const angle = (Math.PI / 4) + (pIdx - (playerIndices.length - 1) / 2) * 0.3; // Vary angle slightly

        ctx.strokeStyle = player.color;
        ctx.globalAlpha = 0.4 + playerDensity * 0.3; // More investment = more opaque
        ctx.lineWidth = 1 + playerDensity * 0.5;

        // Draw diagonal hatching lines
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);
        const diagLength = Math.sqrt(w * w + h * h);

        ctx.beginPath();
        for (let i = -diagLength; i < diagLength * 2; i += spacing / playerDensity) {
            const wobble = (seededRandom(seed + i * 7 + playerIndex * 100) - 0.5) * 1.5;

            // Calculate line endpoints based on angle
            const offsetX = i * cosA + wobble;
            const offsetY = i * sinA;

            // Start and end points for line crossing the box
            let x1 = x + offsetX;
            let y1 = y;
            let x2 = x + offsetX - h * sinA / cosA;
            let y2 = y + h;

            // Clip to box bounds
            if (x1 < x) { y1 += (x - x1) * sinA / cosA; x1 = x; }
            if (x1 > x + w) { y1 += (x1 - (x + w)) * sinA / cosA; x1 = x + w; }
            if (x2 < x) { y2 -= (x - x2) * sinA / cosA; x2 = x; }
            if (x2 > x + w) { y2 -= (x2 - (x + w)) * sinA / cosA; x2 = x + w; }

            if (y1 >= y && y1 <= y + h && y2 >= y && y2 <= y + h) {
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
            }
        }
        ctx.stroke();

        // Add some scribble marks for texture
        const numScribbles = Math.ceil(playerYears / 5);
        ctx.lineWidth = 1.5;
        for (let s = 0; s < numScribbles; s++) {
            ctx.beginPath();
            const sx = x + 5 + seededRandom(seed + s * 3 + playerIndex * 50) * (w - 10);
            const sy = y + 5 + seededRandom(seed + s * 3 + 1 + playerIndex * 50) * (h - 10);
            const scribbleSize = 3 + seededRandom(seed + s * 3 + 2 + playerIndex * 50) * 5;

            ctx.moveTo(sx, sy);
            for (let p = 0; p < 4; p++) {
                const nx = sx + (seededRandom(seed + s * 10 + p + playerIndex * 50) - 0.5) * scribbleSize * 2;
                const ny = sy + (seededRandom(seed + s * 10 + p + 5 + playerIndex * 50) - 0.5) * scribbleSize * 2;
                ctx.lineTo(nx, ny);
            }
            ctx.stroke();
        }
    });

    ctx.restore();
}

// ============================================
// MAP PARSING
// ============================================
function parseMap(mapText) {
    const lines = mapText.trim().split('\n')
        .filter(line => line.trim() && !line.trim().startsWith('#'));

    return lines.map((line, index) => {
        const parts = line.split('|');
        const type = parts[0].trim().toLowerCase();
        const name = parts[1] ? parts[1].trim() : `Space ${index}`;
        const extraData = parts[2] ? parseInt(parts[2].trim()) : 0;

        return {
            index,
            type,
            name,
            investmentCost: type === SPACE_TYPES.HYPOTHESIS ? extraData : 0,
            hypothesis: null,
            contributions: [], // Track who contributed what to the hypothesis
            investments: [],
            isProven: false
        };
    });
}
