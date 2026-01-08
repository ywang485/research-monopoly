// Theory Investment Game - Rendering Functions

// ============================================
// ICON IMAGE LOADING
// ============================================
const IconImages = {
    start: null
};

// Preload icon images
function loadIconImages() {
    return new Promise((resolve) => {
        const imagesToLoad = [
            { key: 'start', src: '/icons/start.svg' },
            { key: 'grant', src: '/icons/grant.svg' },
            { key: 'recruit', src: '/icons/recruit.svg' },
            { key: 'conference', src: '/icons/conference.svg' },
            { key: 'service', src: '/icons/service.svg' },
            { key: 'break', src: '/icons/break.svg' },
            { key: 'scandal', src: '/icons/scandal.svg' },
            { key: 'collaboration', src: '/icons/collaboration.svg' },
            { key: 'eureka', src: '/icons/eureka.svg' }
        ];

        let loadedCount = 0;
        const totalImages = imagesToLoad.length;

        if (totalImages === 0) {
            resolve();
            return;
        }

        imagesToLoad.forEach(({ key, src }) => {
            const img = new Image();
            img.onload = () => {
                IconImages[key] = img;
                loadedCount++;
                if (loadedCount === totalImages) {
                    resolve();
                }
            };
            img.onerror = () => {
                console.warn(`Failed to load icon: ${src}`);
                loadedCount++;
                if (loadedCount === totalImages) {
                    resolve();
                }
            };
            img.src = src;
        });
    });
}

// ============================================
// PIXEL ART ICONS
// ============================================
function drawSpaceIcon(ctx, type, x, y, size, isProven = false) {
    const centerX = x + size / 2;
    const centerY = y + size / 2;
    const scale = size / 60; // Base size is 60px

    ctx.save();

    // Determine which icon type to draw
    let iconType = type;
    if (type === SPACE_TYPES.HYPOTHESIS) {
        iconType = isProven ? 'proven' : 'hypothesis';
    }

    // Draw the icon using the unified function
    drawIcon(ctx, iconType, centerX, centerY, scale);

    ctx.restore();
}

// Unified icon drawing function
function drawIcon(ctx, iconType, cx, cy, scale) {
    // Map icon types to their corresponding IconImages keys
    const iconMapping = {
        [SPACE_TYPES.START]: 'start',
        [SPACE_TYPES.RECRUIT]: 'recruit',
        [SPACE_TYPES.CONFERENCE]: 'conference',
        [SPACE_TYPES.SABBATICAL]: 'break',
        [SPACE_TYPES.COMMUNITY_SERVICE]: 'service',
        [SPACE_TYPES.GRANT]: 'grant',
        [SPACE_TYPES.SCANDAL]: 'scandal',
        [SPACE_TYPES.COLLABORATION]: 'collaboration',
        [SPACE_TYPES.EUREKA]: 'eureka'
    };

    // Get the icon image key
    const iconKey = iconMapping[iconType];

    // Try to draw the SVG icon if available
    if (iconKey && IconImages[iconKey]) {
        const iconSize = 56 * scale;
        const x = cx - iconSize / 2;
        const y = cy - iconSize / 2;

        try {
            ctx.drawImage(IconImages[iconKey], x, y, iconSize, iconSize);
            return; // Successfully drew SVG, exit
        } catch (e) {
            console.error(`Failed to draw ${iconKey.toUpperCase()} icon:`, e);
            // Fall through to procedural drawing if available
        }
    }

    // Procedural fallback drawings for icons that support them
    const s = scale;

    switch (iconType) {
        case SPACE_TYPES.START:
            drawStartFallback(ctx, cx, cy, s);
            break;
        case 'hypothesis':
            drawHypothesisFallback(ctx, cx, cy, s);
            break;
        case 'proven':
            drawProvenFallback(ctx, cx, cy, s);
            break;
        case SPACE_TYPES.RECRUIT:
            drawRecruitFallback(ctx, cx, cy, s);
            break;
        case SPACE_TYPES.CONFERENCE:
            drawConferenceFallback(ctx, cx, cy, s);
            break;
        case SPACE_TYPES.SABBATICAL:
            drawSabbaticalFallback(ctx, cx, cy, s);
            break;
        case SPACE_TYPES.COMMUNITY_SERVICE:
            drawCommunityServiceFallback(ctx, cx, cy, s);
            break;
        case SPACE_TYPES.GRANT:
            drawGrantFallback(ctx, cx, cy, s);
            break;
        case SPACE_TYPES.SCANDAL:
            drawScandalFallback(ctx, cx, cy, s);
            break;
        case SPACE_TYPES.COLLABORATION:
            drawCollaborationFallback(ctx, cx, cy, s);
            break;
        case SPACE_TYPES.EUREKA:
            drawEurekaFallback(ctx, cx, cy, s);
            break;
    }
}

// Fallback drawing functions - draw text labels
function drawTextFallback(ctx, cx, cy, s, text) {
    ctx.fillStyle = '#2c3e50';
    ctx.font = `${Math.floor(12 * s)}px "Press Start 2P", monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, cx+2, cy);
}

function drawStartFallback(ctx, cx, cy, s) {
    drawTextFallback(ctx, cx, cy, s, 'START');
}

function drawHypothesisFallback(ctx, cx, cy, s) {
    // Larger question mark for hypothesis spaces
    ctx.fillStyle = '#dddddd';
    ctx.font = `${Math.floor(20 * s)}px "Press Start 2P", monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('?', cx, cy);
}

function drawProvenFallback(ctx, cx, cy, s) {
    drawTextFallback(ctx, cx, cy, s, ' ');
}

function drawRecruitFallback(ctx, cx, cy, s) {
    drawTextFallback(ctx, cx, cy, s, 'RECRUIT');
}

function drawConferenceFallback(ctx, cx, cy, s) {
    drawTextFallback(ctx, cx, cy, s, 'CONF');
}

function drawSabbaticalFallback(ctx, cx, cy, s) {
    drawTextFallback(ctx, cx, cy, s, 'BREAK');
}

function drawCommunityServiceFallback(ctx, cx, cy, s) {
    drawTextFallback(ctx, cx, cy, s, 'SERVICE');
}

function drawGrantFallback(ctx, cx, cy, s) {
    drawTextFallback(ctx, cx, cy, s, 'GRANT');
}

function drawScandalFallback(ctx, cx, cy, s) {
    drawTextFallback(ctx, cx, cy, s, 'SCANDAL');
}

function drawCollaborationFallback(ctx, cx, cy, s) {
    drawTextFallback(ctx, cx, cy, s, 'COLLAB');
}

function drawEurekaFallback(ctx, cx, cy, s) {
    drawTextFallback(ctx, cx, cy, s, 'EUREKA');
}

// ============================================
// MAIN BOARD RENDERING
// ============================================
function renderBoard() {
    const canvas = document.getElementById('game-board');
    const ctx = canvas.getContext('2d');
    const board = GameState.board;
    const numSpaces = board.length;
    const container = document.getElementById('board-container');

    // Get container dimensions
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    // Set canvas to fill entire container
    const dpr = window.devicePixelRatio || 1;
    canvas.width = containerWidth * dpr;
    canvas.height = containerHeight * dpr;
    canvas.style.width = containerWidth + 'px';
    canvas.style.height = containerHeight + 'px';

    // Calculate logical board dimensions
    const baseSpaceSize = 60;
    const basePadding = 20;
    // Calculate space distribution across edges (with corner sharing like Monopoly)
    // Total edge spaces needed: numSpaces + 3 (because 3 corners are shared)
    const totalWithCorners = numSpaces + 3;
    const basePerEdge = Math.floor(totalWithCorners / 4);
    const edgeExtras = totalWithCorners % 4;
    const bottomSpaces = basePerEdge + (edgeExtras > 0 ? 1 : 0);
    const rightSpaces = basePerEdge + (edgeExtras > 1 ? 1 : 0);
    const topSpaces = basePerEdge + (edgeExtras > 2 ? 1 : 0);
    const leftSpaces = basePerEdge + (edgeExtras > 3 ? 1 : 0);

    // Board size is based on the maximum edge (to keep it square)
    const sideLength = Math.max(bottomSpaces, rightSpaces, topSpaces, leftSpaces);
    const logicalBoardWidth = sideLength * baseSpaceSize + basePadding * 2;
    const logicalBoardHeight = sideLength * baseSpaceSize + basePadding * 2;

    // Calculate base scale to fit board in container while maintaining aspect ratio
    const scaleX = containerWidth / logicalBoardWidth;
    const scaleY = containerHeight / logicalBoardHeight;
    const baseScale = Math.min(scaleX, scaleY) * 0.8; // 0.8 to add some margin

    // Apply zoom level
    const zoomLevel = GameState.zoom.level;
    const scale = baseScale * zoomLevel;

    // Calculate board position (centered or scrolled when zoomed)
    const boardWidth = logicalBoardWidth * scale;
    const boardHeight = logicalBoardHeight * scale;
    let offsetX = (containerWidth - boardWidth) / 2;
    let offsetY = (containerHeight - boardHeight) / 2;

    // Update container class for scroll behavior
    if (zoomLevel > 1) {
        container.classList.add('zoomed');
        canvas.classList.add('zoomed');
        // When zoomed, expand canvas to accommodate board
        const expandedWidth = Math.max(containerWidth, boardWidth);
        const expandedHeight = Math.max(containerHeight, boardHeight);
        canvas.width = expandedWidth * dpr;
        canvas.height = expandedHeight * dpr;
        canvas.style.width = expandedWidth + 'px';
        canvas.style.height = expandedHeight + 'px';
        offsetX = Math.max(0, offsetX);
        offsetY = Math.max(0, offsetY);
    } else {
        container.classList.remove('zoomed');
        canvas.classList.remove('zoomed');
    }

    // Store scale and offset for hover detection
    GameState.boardScale = scale;
    GameState.boardBaseScale = baseScale;
    GameState.boardOffsetX = offsetX;
    GameState.boardOffsetY = offsetY;

    // Use logical dimensions for drawing
    const spaceSize = baseSpaceSize;
    const padding = basePadding;

    // === CLEAR CANVAS ===
    // Canvas is transparent - grid background is now on .two-page-spread CSS
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

    // === DRAW BOARD (zoomable, centered) ===
    // Apply transform for board: scale and center
    ctx.setTransform(scale * dpr, 0, 0, scale * dpr, offsetX * dpr, offsetY * dpr);

    // Calculate positions for each space (going clockwise)
    // Distribute spaces evenly across all four edges
    const positions = [];
    const startX = padding;
    const startY = logicalBoardHeight - padding - spaceSize;
 
    // Calculate edge boundaries (edges share corners, so we subtract when transitioning)
    const bottomEnd = bottomSpaces - 1;
    const rightEnd = bottomEnd + rightSpaces - 1;  // -1 because we share bottom-right corner
    const topEnd = rightEnd + topSpaces - 1;        // -1 because we share top-right corner


    for (let i = 0; i < numSpaces; i++) {
        let x, y;
        if (i <= bottomEnd) {
            // Bottom edge (left to right, includes both corners)
            x = startX + i * spaceSize;
            y = startY;
        } else if (i <= rightEnd) {
            // Right edge (bottom to top, shares bottom-right corner with bottom edge)
            const edgeIndex = i - bottomEnd;  // Start from 1 (skip shared corner)
            x = startX + (bottomSpaces - 1) * spaceSize;
            y = startY - edgeIndex * spaceSize;
        } else if (i <= topEnd) {
            // Top edge (right to left, shares top-right corner with right edge)
            const edgeIndex = i - rightEnd;  // Start from 1 (skip shared corner)
            x = startX + (bottomSpaces - 1) * spaceSize - edgeIndex * spaceSize;
            y = startY - (rightSpaces - 1) * spaceSize;
        } else {
            // Left edge (top to bottom, shares top-left corner with top edge)
            const edgeIndex = i - topEnd;  // Start from 1 (skip shared corner)
            x = startX;
            y = startY - (rightSpaces - 1) * spaceSize + edgeIndex * spaceSize;
        }
        positions.push({ x, y });
    }

    // Store positions for hover detection
    GameState.boardPositions = positions;
    GameState.boardSpaceSize = spaceSize;

    // Draw spaces with pencil-sketch style
    board.forEach((space, i) => {
        const pos = positions[i];
        if (!pos) return;

        // Draw space with sketchy pencil-drawn style
        const radius = 5;
        const w = spaceSize - 4;
        const h = spaceSize - 4;
        const x = pos.x + 2;
        const y = pos.y + 2;
        const seed = i * 100; // Unique seed per space for consistent randomness

        ctx.save();

        const isHypothesis = space.type === SPACE_TYPES.HYPOTHESIS;
        const hasInvestment = space.investments && space.investments.length > 0;
        const totalYearsInvested = hasInvestment
            ? space.investments.reduce((sum, inv) => sum + inv.years, 0)
            : 0;

        // Draw faint paper background
        sketchyRoundedRect(ctx, x, y, w, h, radius, seed);
        ctx.fillStyle = '#f8f4e8'; // Very light cream/blank paper
        ctx.fill();

        // Draw space type icon (hand-drawn style) - grey for non-hypothesis
        drawSpaceIcon(ctx, space.type, pos.x, pos.y, spaceSize - 2, space.isProven);

        // Draw investment cost for hypothesis (pixel font with hand-drawn underline)
        if (isHypothesis && space.investmentCost > 0) {
            ctx.fillStyle = hasInvestment ? '#2c3e50' : '#888';
            ctx.font = '7px "Press Start 2P", monospace';
            ctx.textAlign = 'center';
            const costText = space.investmentCost + 'y';
            const textX = pos.x + spaceSize/2;
            const textY = pos.y + spaceSize - 6;
            ctx.fillText(costText, textX, textY);

            // Add sketchy underline
            ctx.strokeStyle = hasInvestment ? 'rgba(44, 62, 80, 0.4)' : 'rgba(100, 100, 100, 0.3)';
            ctx.lineWidth = 1;
            sketchyLine(ctx, textX - 12, textY + 2, textX + 12, textY + 2, seed + 200);

            ctx.textAlign = 'left';
        }

        ctx.restore();

        if (isHypothesis) {
            // HYPOTHESIS SPACES: Blank until invested, then show colored pencil hatching

            if (hasInvestment) {
                // Draw colored pencil hatching based on investments
                // Clip to the space shape
                ctx.save();
                sketchyRoundedRect(ctx, x + 2, y + 2, w - 4, h - 4, radius - 1, seed);
                ctx.clip();

                // Draw investment-based colored hatching
                drawInvestmentHatching(ctx, x + 2, y + 2, w - 4, h - 4, space.investments, totalYearsInvested, seed + 500);

                ctx.restore();
            }

            // Draw border - faint if no investment, stronger if invested
            ctx.lineWidth = hasInvestment ? 1.5 : 0.8;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            sketchyRoundedRect(ctx, x, y, w, h, radius, seed);
            ctx.strokeStyle = hasInvestment ? 'rgba(44, 62, 80, 0.6)' : 'rgba(44, 62, 80, 0.25)';
            ctx.stroke();

            // Second pass for pencil texture
            if (hasInvestment) {
                sketchyRoundedRect(ctx, x + 0.3, y + 0.3, w, h, radius, seed + 20);
                ctx.strokeStyle = 'rgba(44, 62, 80, 0.2)';
                ctx.lineWidth = 0.6;
                ctx.stroke();
            }

            // Draw extra border for poven hypothesis spaces
            if (space.hypothesis && space.isProven) {
                ctx.strokeStyle = '#2749ae';
                ctx.lineWidth = 2.5;
                ctx.setLineDash([4, 2]);
                sketchyRoundedRect(ctx, x - 1, y - 1, w + 2, h + 2, radius + 1, seed + 30);
                ctx.stroke();
                ctx.setLineDash([]);
            }

        } else {
            // NON-HYPOTHESIS SPACES: Plain grey pencil sketches

            // Draw light paper background
            //sketchyRoundedRect(ctx, x, y, w, h, radius, seed);
            //ctx.fillStyle = '#f0ece0';
            //ctx.fill();

            // Add grey pencil shading
            drawPencilShading(ctx, x + 3, y + 3, w - 6, h - 6, 0.12, seed + 50);

            // Add grey scribble texture
            drawScribbleFill(ctx, x + 4, y + 4, w - 8, h - 8, 'rgba(100, 100, 100, 0.3)', seed + 100);

            // Draw grey pencil border
            ctx.lineWidth = 1.2;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            // First pass - main border (grey)
            sketchyRoundedRect(ctx, x, y, w, h, radius, seed);
            ctx.strokeStyle = 'rgba(80, 80, 80, 0.6)';
            ctx.stroke();

            // Second pass - slightly offset for pencil texture
            sketchyRoundedRect(ctx, x + 0.3, y + 0.3, w, h, radius, seed + 20);
            ctx.strokeStyle = 'rgba(80, 80, 80, 0.25)';
            ctx.lineWidth = 0.8;
            ctx.stroke();
        }

    });

    // Draw players (pencil-sketch circle tokens)
    GameState.players.forEach((player, pIndex) => {
        if (!player.isAlive) return;

        // Check for animated position
        const animPos = getAnimatedPosition('player', pIndex, positions, spaceSize);
        const basePos = animPos || positions[player.position];
        if (!basePos) return;

        // Position pencils above the space, arranged horizontally
        const offsetX = (pIndex % 2) * 20 + 25;
        const offsetY = Math.floor(pIndex / 2) * 15 + 25; // Above the space

        const drawX = basePos.x + offsetX;
        const drawY = basePos.y + offsetY;

        // Calculate pencil length based on remaining years
        const maxYears = 50; // Approximate max available years
        const minLength = 10;
        const maxLength = 35;
        const yearsRatio = Math.min(player.availableYears / maxYears, 1);
        const pencilLength = minLength + (maxLength - minLength) * yearsRatio;

        const pencilWidth = 5;
        const tipLength = 6;
        const eraserLength = 4;

        ctx.save();

        // Add small random rotation (1-3 degrees) for natural look
        const rotationSeed = pIndex * 123 + 456;
        const magnitude = seededRandom(rotationSeed) * 2 + 1; // 1-3 degrees
        const direction = seededRandom(rotationSeed + 100) < 0.5 ? -1 : 1; // Random direction
        const randomRotation = magnitude * direction;
        const totalRotation = 190 + randomRotation;

        // Translate to the drawing position and rotate
        ctx.translate(drawX, drawY);
        ctx.rotate(totalRotation * Math.PI / 180);

        // Draw shadow when bouncing (positioned at tip)
        if (animPos && GameState.animation.bounceHeight > 0) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
            ctx.beginPath();
            ctx.ellipse(tipLength / 2, -GameState.animation.bounceHeight * 0.3,
                       pencilWidth * 0.8, 2, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        // PENCIL TIP (wooden point) - drawing at origin after rotation
        ctx.fillStyle = '#d4a574'; // Wood color
        ctx.strokeStyle = '#2c3e50';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, 0); // Tip point at origin
        ctx.lineTo(-pencilWidth / 2, tipLength);
        ctx.lineTo(pencilWidth / 2, tipLength);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Graphite core at tip
        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.moveTo(0, 1);
        ctx.lineTo(-1.5, 3);
        ctx.lineTo(1.5, 3);
        ctx.closePath();
        ctx.fill();

        // PENCIL BODY (colored paint)
        ctx.fillStyle = player.color;
        ctx.strokeStyle = '#2c3e50';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.rect(-pencilWidth / 2, tipLength, pencilWidth, pencilLength);
        ctx.fill();
        ctx.stroke();

        // Pencil body highlight (shiny paint)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-pencilWidth / 2 + 1, tipLength + 2);
        ctx.lineTo(-pencilWidth / 2 + 1, tipLength + pencilLength - 2);
        ctx.stroke();

        // Metal ferrule (band holding eraser)
        const ferruleY = tipLength + pencilLength;
        ctx.fillStyle = '#c0c0c0'; // Silver
        ctx.strokeStyle = '#2c3e50';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.rect(-pencilWidth / 2, ferruleY, pencilWidth, 2);
        ctx.fill();
        ctx.stroke();

        // ERASER (pink/red)
        ctx.fillStyle = '#e67e8e'; // Pink eraser
        ctx.strokeStyle = '#2c3e50';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.rect(-pencilWidth / 2, ferruleY + 2, pencilWidth, eraserLength);
        ctx.fill();
        ctx.stroke();

        // Eraser highlight
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(-pencilWidth / 2 + 1, ferruleY + 3);
        ctx.lineTo(-pencilWidth / 2 + 1, ferruleY + 2 + eraserLength - 1);
        ctx.stroke();

        // Player number on pencil body (rotated back for readability)
        ctx.save();
        ctx.translate(0, tipLength + pencilLength / 2);
        ctx.rotate(-totalRotation * Math.PI / 180); // Counter-rotate the text
        ctx.fillStyle = '#fff';
        ctx.font = '6px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText((pIndex + 1).toString(), 0, 0);
        ctx.restore();

        ctx.restore();
    });

    // Draw NPC (Scientific Underdeterminism - pencil-sketch diamond shape)
    const animNpcPos = getAnimatedPosition('npc', null, positions, spaceSize);
    const npcBasePos = animNpcPos || positions[GameState.npc.position];
    if (npcBasePos) {
        const npcX = npcBasePos.x + spaceSize/2 - 10;
        const npcY = npcBasePos.y + spaceSize/2 + 10;
        const npcSeed = 9999;

        // Draw shadow when bouncing
        if (animNpcPos && GameState.animation.bounceHeight > 0) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
            ctx.beginPath();
            ctx.ellipse(npcX, positions[GameState.animation.currentPos].y + spaceSize/2 + 8 + GameState.animation.bounceHeight * 0.3,
                       11, 5, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.save();

        // Helper to draw wobbly diamond
        const drawWobbyDiamond = (offsetScale, seed) => {
            const w1 = (seededRandom(seed) - 0.5) * offsetScale;
            const w2 = (seededRandom(seed + 1) - 0.5) * offsetScale;
            const w3 = (seededRandom(seed + 2) - 0.5) * offsetScale;
            const w4 = (seededRandom(seed + 3) - 0.5) * offsetScale;
            ctx.beginPath();
            ctx.moveTo(npcX + w1, npcY - 12 + w2);
            ctx.lineTo(npcX + 10 + w3, npcY + w4);
            ctx.lineTo(npcX + w2, npcY + 12 + w1);
            ctx.lineTo(npcX - 10 + w4, npcY + w3);
            ctx.closePath();
        };

        // NPC token fill (purple diamond)
        ctx.fillStyle = '#9b59b6';
        drawWobbyDiamond(1.5, npcSeed);
        ctx.fill();

        // Add pencil cross-hatching for texture
        ctx.save();
        ctx.clip();
        drawPencilShading(ctx, npcX - 10, npcY - 12, 20, 24, 0.12, npcSeed + 100);
        ctx.restore();

        // Multiple pencil stroke outlines
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // First outline
        ctx.strokeStyle = 'rgba(44, 62, 80, 0.8)';
        drawWobbyDiamond(1.2, npcSeed);
        ctx.stroke();

        // Second outline (offset)
        ctx.strokeStyle = 'rgba(44, 62, 80, 0.3)';
        ctx.lineWidth = 1;
        drawWobbyDiamond(1.5, npcSeed + 50);
        ctx.stroke();

        ctx.restore();

        // Question mark inside (pixel style)
        ctx.fillStyle = '#fff';
        ctx.font = '8px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('?', npcX, npcY + 1);
        ctx.textBaseline = 'alphabetic';

        // Add a mystical glow effect during animation
        if (animNpcPos) {
            ctx.strokeStyle = 'rgba(155, 89, 182, 0.5)';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(npcX, npcY - 16);
            ctx.lineTo(npcX + 14, npcY);
            ctx.lineTo(npcX, npcY + 16);
            ctx.lineTo(npcX - 14, npcY);
            ctx.closePath();
            ctx.stroke();
        }
    }

    // Store positions for click handling
    canvas.positionData = positions;
}
