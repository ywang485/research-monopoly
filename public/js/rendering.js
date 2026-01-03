// Theory Investment Game - Rendering Functions

// ============================================
// PIXEL ART ICONS
// ============================================
function drawSpaceIcon(ctx, type, x, y, size, isProven = false) {
    const centerX = x + size / 2;
    const centerY = y + size / 2;
    const scale = size / 60; // Base size is 60px

    ctx.save();

    switch (type) {
        case SPACE_TYPES.START:
            drawStartIcon(ctx, centerX, centerY, scale);
            break;
        case SPACE_TYPES.HYPOTHESIS:
            if (isProven) {
                drawProvenIcon(ctx, centerX, centerY, scale);
            } else {
                drawHypothesisIcon(ctx, centerX, centerY, scale);
            }
            break;
        case SPACE_TYPES.RECRUIT:
            drawRecruitIcon(ctx, centerX, centerY, scale);
            break;
        case SPACE_TYPES.CONFERENCE:
            drawConferenceIcon(ctx, centerX, centerY, scale);
            break;
        case SPACE_TYPES.SABBATICAL:
            drawSabbaticalIcon(ctx, centerX, centerY, scale);
            break;
        case SPACE_TYPES.PEER_REVIEW:
            drawPeerReviewIcon(ctx, centerX, centerY, scale);
            break;
        case SPACE_TYPES.GRANT:
            drawGrantIcon(ctx, centerX, centerY, scale);
            break;
        case SPACE_TYPES.SCANDAL:
            drawScandalIcon(ctx, centerX, centerY, scale);
            break;
        case SPACE_TYPES.COLLABORATION:
            drawCollaborationIcon(ctx, centerX, centerY, scale);
            break;
        case SPACE_TYPES.EUREKA:
            drawEurekaIcon(ctx, centerX, centerY, scale);
            break;
    }

    ctx.restore();
}

function drawStartIcon(ctx, cx, cy, scale) {
    // Quill pen and inkwell - classical scientific beginning
    const s = scale;
    ctx.strokeStyle = '#2c3e50';
    ctx.fillStyle = '#2c3e50';
    ctx.lineWidth = 1.5 * s;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Inkwell base
    ctx.beginPath();
    ctx.ellipse(cx - 4 * s, cy + 6 * s, 6 * s, 3 * s, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - 10 * s, cy + 6 * s);
    ctx.lineTo(cx - 10 * s, cy + 2 * s);
    ctx.quadraticCurveTo(cx - 10 * s, cy - 2 * s, cx - 4 * s, cy - 2 * s);
    ctx.quadraticCurveTo(cx + 2 * s, cy - 2 * s, cx + 2 * s, cy + 2 * s);
    ctx.lineTo(cx + 2 * s, cy + 6 * s);
    ctx.stroke();

    // Quill pen (angled)
    ctx.beginPath();
    ctx.moveTo(cx - 2 * s, cy);
    ctx.quadraticCurveTo(cx + 6 * s, cy - 8 * s, cx + 12 * s, cy - 14 * s);
    ctx.stroke();

    // Quill feather
    ctx.beginPath();
    ctx.moveTo(cx + 12 * s, cy - 14 * s);
    ctx.quadraticCurveTo(cx + 8 * s, cy - 12 * s, cx + 6 * s, cy - 16 * s);
    ctx.quadraticCurveTo(cx + 10 * s, cy - 14 * s, cx + 12 * s, cy - 14 * s);
    ctx.fill();
    ctx.moveTo(cx + 12 * s, cy - 14 * s);
    ctx.quadraticCurveTo(cx + 14 * s, cy - 10 * s, cx + 10 * s, cy - 8 * s);
    ctx.quadraticCurveTo(cx + 14 * s, cy - 12 * s, cx + 12 * s, cy - 14 * s);
    ctx.fill();
}

function drawHypothesisIcon(ctx, cx, cy, scale) {
    // Classical alchemical retort/flask
    const s = scale;
    ctx.strokeStyle = '#2c3e50';
    ctx.fillStyle = '#2c3e50';
    ctx.lineWidth = 1.5 * s;
    ctx.lineCap = 'round';

    // Flask body (round bottom)
    ctx.beginPath();
    ctx.arc(cx, cy + 2 * s, 8 * s, 0.3 * Math.PI, 0.7 * Math.PI, false);
    ctx.stroke();

    // Flask neck
    ctx.beginPath();
    ctx.moveTo(cx - 3 * s, cy - 4 * s);
    ctx.lineTo(cx - 2 * s, cy - 12 * s);
    ctx.lineTo(cx + 2 * s, cy - 12 * s);
    ctx.lineTo(cx + 3 * s, cy - 4 * s);
    ctx.stroke();

    // Flask rim
    ctx.beginPath();
    ctx.moveTo(cx - 3 * s, cy - 12 * s);
    ctx.lineTo(cx + 3 * s, cy - 12 * s);
    ctx.stroke();

    // Liquid level indication (wavy line)
    ctx.beginPath();
    ctx.moveTo(cx - 5 * s, cy + 2 * s);
    ctx.quadraticCurveTo(cx - 2 * s, cy, cx, cy + 2 * s);
    ctx.quadraticCurveTo(cx + 2 * s, cy + 4 * s, cx + 5 * s, cy + 2 * s);
    ctx.stroke();

    // Question mark above (representing hypothesis)
    ctx.lineWidth = 1.2 * s;
    ctx.beginPath();
    ctx.arc(cx + 8 * s, cy - 10 * s, 3 * s, Math.PI, 0, true);
    ctx.lineTo(cx + 11 * s, cy - 6 * s);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx + 11 * s, cy - 3 * s, 1 * s, 0, Math.PI * 2);
    ctx.fill();
}

function drawProvenIcon(ctx, cx, cy, scale) {
    // Laurel wreath - symbol of established achievement
    const s = scale;
    ctx.strokeStyle = '#2c3e50';
    ctx.fillStyle = '#4a5a4d';
    ctx.lineWidth = 1.2 * s;
    ctx.lineCap = 'round';

    // Left branch of laurel
    for (let i = 0; i < 5; i++) {
        const angle = -0.4 - i * 0.25;
        const leafX = cx - 6 * s + i * 1.5 * s;
        const leafY = cy - 6 * s + i * 3 * s;
        ctx.beginPath();
        ctx.ellipse(leafX, leafY, 4 * s, 2 * s, angle, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }

    // Right branch of laurel
    for (let i = 0; i < 5; i++) {
        const angle = 0.4 + i * 0.25;
        const leafX = cx + 6 * s - i * 1.5 * s;
        const leafY = cy - 6 * s + i * 3 * s;
        ctx.beginPath();
        ctx.ellipse(leafX, leafY, 4 * s, 2 * s, angle, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }

    // Central stem/ribbon at bottom
    ctx.strokeStyle = '#a89458';
    ctx.lineWidth = 2 * s;
    ctx.beginPath();
    ctx.moveTo(cx - 4 * s, cy + 8 * s);
    ctx.quadraticCurveTo(cx, cy + 6 * s, cx + 4 * s, cy + 8 * s);
    ctx.stroke();
}

function drawRecruitIcon(ctx, cx, cy, scale) {
    // Classical scholar with scroll - period appropriate student
    const s = scale;
    ctx.strokeStyle = '#2c3e50';
    ctx.fillStyle = '#2c3e50';
    ctx.lineWidth = 1.5 * s;
    ctx.lineCap = 'round';

    // Scholar's head (with period wig suggestion)
    ctx.beginPath();
    ctx.arc(cx, cy - 8 * s, 5 * s, 0, Math.PI * 2);
    ctx.stroke();
    // Curly wig sides
    ctx.beginPath();
    ctx.arc(cx - 5 * s, cy - 6 * s, 2 * s, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx + 5 * s, cy - 6 * s, 2 * s, 0, Math.PI * 2);
    ctx.stroke();

    // Scholarly robe/gown
    ctx.beginPath();
    ctx.moveTo(cx - 4 * s, cy - 3 * s);
    ctx.lineTo(cx - 6 * s, cy + 10 * s);
    ctx.lineTo(cx + 6 * s, cy + 10 * s);
    ctx.lineTo(cx + 4 * s, cy - 3 * s);
    ctx.closePath();
    ctx.stroke();

    // Scroll being held
    ctx.lineWidth = 1.2 * s;
    ctx.beginPath();
    ctx.ellipse(cx + 10 * s, cy + 2 * s, 2 * s, 5 * s, 0.2, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + 8 * s, cy - 2 * s);
    ctx.lineTo(cx + 5 * s, cy + 2 * s);
    ctx.stroke();
}

function drawConferenceIcon(ctx, cx, cy, scale) {
    // Royal Society style lectern with open book
    const s = scale;
    ctx.strokeStyle = '#2c3e50';
    ctx.fillStyle = '#2c3e50';
    ctx.lineWidth = 1.5 * s;
    ctx.lineCap = 'round';

    // Lectern stand
    ctx.beginPath();
    ctx.moveTo(cx, cy + 10 * s);
    ctx.lineTo(cx - 6 * s, cy + 10 * s);
    ctx.lineTo(cx + 6 * s, cy + 10 * s);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx, cy + 10 * s);
    ctx.lineTo(cx, cy - 2 * s);
    ctx.stroke();

    // Lectern top surface (angled)
    ctx.beginPath();
    ctx.moveTo(cx - 8 * s, cy - 4 * s);
    ctx.lineTo(cx + 8 * s, cy - 4 * s);
    ctx.lineTo(cx + 6 * s, cy);
    ctx.lineTo(cx - 6 * s, cy);
    ctx.closePath();
    ctx.stroke();

    // Open book on lectern
    ctx.lineWidth = 1.2 * s;
    // Left page
    ctx.beginPath();
    ctx.moveTo(cx, cy - 6 * s);
    ctx.quadraticCurveTo(cx - 4 * s, cy - 8 * s, cx - 7 * s, cy - 6 * s);
    ctx.lineTo(cx - 7 * s, cy - 2 * s);
    ctx.stroke();
    // Right page
    ctx.beginPath();
    ctx.moveTo(cx, cy - 6 * s);
    ctx.quadraticCurveTo(cx + 4 * s, cy - 8 * s, cx + 7 * s, cy - 6 * s);
    ctx.lineTo(cx + 7 * s, cy - 2 * s);
    ctx.stroke();
    // Text lines on pages
    ctx.lineWidth = 0.8 * s;
    ctx.beginPath();
    ctx.moveTo(cx - 6 * s, cy - 5 * s);
    ctx.lineTo(cx - 2 * s, cy - 5 * s);
    ctx.moveTo(cx + 2 * s, cy - 5 * s);
    ctx.lineTo(cx + 6 * s, cy - 5 * s);
    ctx.stroke();
}

function drawSabbaticalIcon(ctx, cx, cy, scale) {
    // Stack of books with candle - scholarly rest and contemplation
    const s = scale;
    ctx.strokeStyle = '#2c3e50';
    ctx.fillStyle = '#2c3e50';
    ctx.lineWidth = 1.5 * s;
    ctx.lineCap = 'round';

    // Stack of books
    // Bottom book
    ctx.beginPath();
    ctx.rect(cx - 8 * s, cy + 4 * s, 12 * s, 4 * s);
    ctx.stroke();
    // Middle book
    ctx.beginPath();
    ctx.rect(cx - 7 * s, cy, 10 * s, 3.5 * s);
    ctx.stroke();
    // Top book (slightly angled)
    ctx.beginPath();
    ctx.moveTo(cx - 6 * s, cy - 4 * s);
    ctx.lineTo(cx + 5 * s, cy - 3 * s);
    ctx.lineTo(cx + 5 * s, cy);
    ctx.lineTo(cx - 6 * s, cy - 0.5 * s);
    ctx.closePath();
    ctx.stroke();

    // Candle holder and candle
    ctx.beginPath();
    ctx.moveTo(cx + 6 * s, cy + 8 * s);
    ctx.lineTo(cx + 10 * s, cy + 8 * s);
    ctx.lineTo(cx + 9 * s, cy + 4 * s);
    ctx.lineTo(cx + 7 * s, cy + 4 * s);
    ctx.closePath();
    ctx.stroke();
    // Candle
    ctx.beginPath();
    ctx.rect(cx + 7 * s, cy - 4 * s, 2 * s, 8 * s);
    ctx.stroke();
    // Flame
    ctx.fillStyle = '#a89458';
    ctx.beginPath();
    ctx.moveTo(cx + 8 * s, cy - 4 * s);
    ctx.quadraticCurveTo(cx + 6 * s, cy - 8 * s, cx + 8 * s, cy - 10 * s);
    ctx.quadraticCurveTo(cx + 10 * s, cy - 8 * s, cx + 8 * s, cy - 4 * s);
    ctx.fill();
}

function drawPeerReviewIcon(ctx, cx, cy, scale) {
    // Period spectacles examining a document
    const s = scale;
    ctx.strokeStyle = '#2c3e50';
    ctx.fillStyle = '#2c3e50';
    ctx.lineWidth = 1.5 * s;
    ctx.lineCap = 'round';

    // Document/paper
    ctx.beginPath();
    ctx.rect(cx - 8 * s, cy - 2 * s, 14 * s, 12 * s);
    ctx.stroke();
    // Text lines on document
    ctx.lineWidth = 0.8 * s;
    ctx.beginPath();
    ctx.moveTo(cx - 6 * s, cy + 1 * s);
    ctx.lineTo(cx + 4 * s, cy + 1 * s);
    ctx.moveTo(cx - 6 * s, cy + 4 * s);
    ctx.lineTo(cx + 4 * s, cy + 4 * s);
    ctx.moveTo(cx - 6 * s, cy + 7 * s);
    ctx.lineTo(cx + 2 * s, cy + 7 * s);
    ctx.stroke();

    // Classical round spectacles above
    ctx.lineWidth = 1.5 * s;
    // Left lens
    ctx.beginPath();
    ctx.arc(cx - 4 * s, cy - 8 * s, 4 * s, 0, Math.PI * 2);
    ctx.stroke();
    // Right lens
    ctx.beginPath();
    ctx.arc(cx + 4 * s, cy - 8 * s, 4 * s, 0, Math.PI * 2);
    ctx.stroke();
    // Bridge
    ctx.beginPath();
    ctx.moveTo(cx - 0.5 * s, cy - 8 * s);
    ctx.lineTo(cx + 0.5 * s, cy - 8 * s);
    ctx.stroke();
    // Temple arms
    ctx.beginPath();
    ctx.moveTo(cx - 8 * s, cy - 8 * s);
    ctx.lineTo(cx - 11 * s, cy - 6 * s);
    ctx.moveTo(cx + 8 * s, cy - 8 * s);
    ctx.lineTo(cx + 11 * s, cy - 6 * s);
    ctx.stroke();
}

function drawGrantIcon(ctx, cx, cy, scale) {
    // Royal coin purse with coins - period patronage
    const s = scale;
    ctx.strokeStyle = '#2c3e50';
    ctx.fillStyle = '#2c3e50';
    ctx.lineWidth = 1.5 * s;
    ctx.lineCap = 'round';

    // Coin purse body
    ctx.beginPath();
    ctx.moveTo(cx - 6 * s, cy - 4 * s);
    ctx.quadraticCurveTo(cx - 8 * s, cy + 4 * s, cx, cy + 8 * s);
    ctx.quadraticCurveTo(cx + 8 * s, cy + 4 * s, cx + 6 * s, cy - 4 * s);
    ctx.stroke();

    // Purse opening with drawstring
    ctx.beginPath();
    ctx.ellipse(cx, cy - 4 * s, 6 * s, 2 * s, 0, 0, Math.PI, true);
    ctx.stroke();
    // Drawstring ties
    ctx.beginPath();
    ctx.moveTo(cx - 4 * s, cy - 5 * s);
    ctx.quadraticCurveTo(cx - 6 * s, cy - 10 * s, cx - 2 * s, cy - 10 * s);
    ctx.moveTo(cx + 4 * s, cy - 5 * s);
    ctx.quadraticCurveTo(cx + 6 * s, cy - 10 * s, cx + 2 * s, cy - 10 * s);
    ctx.stroke();

    // Gold coins spilling out
    ctx.fillStyle = '#a89458';
    ctx.strokeStyle = '#6a5a3a';
    ctx.lineWidth = 1 * s;
    // Coin 1
    ctx.beginPath();
    ctx.ellipse(cx + 8 * s, cy + 2 * s, 4 * s, 3 * s, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Coin 2
    ctx.beginPath();
    ctx.ellipse(cx + 6 * s, cy + 6 * s, 3.5 * s, 2.5 * s, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
}

function drawScandalIcon(ctx, cx, cy, scale) {
    // Broken quill and spilled ink - scientific scandal
    const s = scale;
    ctx.strokeStyle = '#2c3e50';
    ctx.fillStyle = '#2c3e50';
    ctx.lineWidth = 1.5 * s;
    ctx.lineCap = 'round';

    // Broken quill - upper part
    ctx.beginPath();
    ctx.moveTo(cx + 8 * s, cy - 12 * s);
    ctx.quadraticCurveTo(cx + 4 * s, cy - 10 * s, cx + 2 * s, cy - 6 * s);
    ctx.stroke();
    // Feather on upper part
    ctx.beginPath();
    ctx.moveTo(cx + 8 * s, cy - 12 * s);
    ctx.quadraticCurveTo(cx + 5 * s, cy - 14 * s, cx + 4 * s, cy - 10 * s);
    ctx.fill();

    // Broken quill - lower part (fallen)
    ctx.beginPath();
    ctx.moveTo(cx - 2 * s, cy - 4 * s);
    ctx.lineTo(cx - 8 * s, cy + 4 * s);
    ctx.stroke();

    // Break mark (jagged)
    ctx.lineWidth = 1 * s;
    ctx.beginPath();
    ctx.moveTo(cx + 2 * s, cy - 6 * s);
    ctx.lineTo(cx, cy - 5 * s);
    ctx.lineTo(cx + 1 * s, cy - 4 * s);
    ctx.lineTo(cx - 2 * s, cy - 4 * s);
    ctx.stroke();

    // Spilled ink blot
    ctx.fillStyle = '#2e2420';
    ctx.beginPath();
    ctx.ellipse(cx - 4 * s, cy + 6 * s, 6 * s, 4 * s, 0.2, 0, Math.PI * 2);
    ctx.fill();
    // Smaller splatter
    ctx.beginPath();
    ctx.ellipse(cx + 2 * s, cy + 8 * s, 3 * s, 2 * s, -0.3, 0, Math.PI * 2);
    ctx.fill();
}

function drawCollaborationIcon(ctx, cx, cy, scale) {
    // Two hands shaking with period sleeve cuffs
    const s = scale;
    ctx.strokeStyle = '#2c3e50';
    ctx.fillStyle = '#2c3e50';
    ctx.lineWidth = 1.5 * s;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Left sleeve cuff
    ctx.beginPath();
    ctx.moveTo(cx - 12 * s, cy - 2 * s);
    ctx.lineTo(cx - 12 * s, cy + 4 * s);
    ctx.lineTo(cx - 8 * s, cy + 4 * s);
    ctx.lineTo(cx - 8 * s, cy - 2 * s);
    ctx.stroke();
    // Lace cuff detail
    ctx.lineWidth = 0.8 * s;
    ctx.beginPath();
    ctx.arc(cx - 10 * s, cy - 3 * s, 2 * s, 0, Math.PI, true);
    ctx.stroke();

    // Right sleeve cuff
    ctx.lineWidth = 1.5 * s;
    ctx.beginPath();
    ctx.moveTo(cx + 12 * s, cy - 2 * s);
    ctx.lineTo(cx + 12 * s, cy + 4 * s);
    ctx.lineTo(cx + 8 * s, cy + 4 * s);
    ctx.lineTo(cx + 8 * s, cy - 2 * s);
    ctx.stroke();
    // Lace cuff detail
    ctx.lineWidth = 0.8 * s;
    ctx.beginPath();
    ctx.arc(cx + 10 * s, cy - 3 * s, 2 * s, 0, Math.PI, true);
    ctx.stroke();

    // Clasped hands in center
    ctx.lineWidth = 1.5 * s;
    // Left hand reaching right
    ctx.beginPath();
    ctx.moveTo(cx - 8 * s, cy + 1 * s);
    ctx.lineTo(cx - 2 * s, cy + 1 * s);
    ctx.quadraticCurveTo(cx, cy - 2 * s, cx + 2 * s, cy);
    ctx.stroke();
    // Right hand reaching left
    ctx.beginPath();
    ctx.moveTo(cx + 8 * s, cy + 1 * s);
    ctx.lineTo(cx + 2 * s, cy + 1 * s);
    ctx.quadraticCurveTo(cx, cy + 4 * s, cx - 2 * s, cy + 2 * s);
    ctx.stroke();
    // Thumb detail
    ctx.beginPath();
    ctx.moveTo(cx - 1 * s, cy - 1 * s);
    ctx.lineTo(cx + 1 * s, cy + 3 * s);
    ctx.stroke();
}

function drawEurekaIcon(ctx, cx, cy, scale) {
    // Newton's apple with enlightenment rays - classical eureka
    const s = scale;
    ctx.strokeStyle = '#2c3e50';
    ctx.fillStyle = '#6b4a4e';
    ctx.lineWidth = 1.5 * s;
    ctx.lineCap = 'round';

    // Apple body
    ctx.beginPath();
    ctx.moveTo(cx, cy - 6 * s);
    ctx.bezierCurveTo(cx - 8 * s, cy - 6 * s, cx - 8 * s, cy + 6 * s, cx, cy + 6 * s);
    ctx.bezierCurveTo(cx + 8 * s, cy + 6 * s, cx + 8 * s, cy - 6 * s, cx, cy - 6 * s);
    ctx.fill();
    ctx.strokeStyle = '#5a3a40';
    ctx.stroke();

    // Apple stem
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 1.5 * s;
    ctx.beginPath();
    ctx.moveTo(cx, cy - 6 * s);
    ctx.quadraticCurveTo(cx + 2 * s, cy - 10 * s, cx + 1 * s, cy - 12 * s);
    ctx.stroke();

    // Leaf
    ctx.fillStyle = '#4a5a4d';
    ctx.beginPath();
    ctx.moveTo(cx + 1 * s, cy - 10 * s);
    ctx.quadraticCurveTo(cx + 6 * s, cy - 12 * s, cx + 5 * s, cy - 8 * s);
    ctx.quadraticCurveTo(cx + 2 * s, cy - 9 * s, cx + 1 * s, cy - 10 * s);
    ctx.fill();

    // Enlightenment rays (radiating lines)
    ctx.strokeStyle = '#a89458';
    ctx.lineWidth = 1 * s;
    ctx.beginPath();
    // Top ray
    ctx.moveTo(cx, cy - 14 * s);
    ctx.lineTo(cx, cy - 17 * s);
    // Upper left
    ctx.moveTo(cx - 8 * s, cy - 8 * s);
    ctx.lineTo(cx - 11 * s, cy - 11 * s);
    // Upper right
    ctx.moveTo(cx + 8 * s, cy - 8 * s);
    ctx.lineTo(cx + 11 * s, cy - 11 * s);
    // Left
    ctx.moveTo(cx - 10 * s, cy);
    ctx.lineTo(cx - 13 * s, cy);
    // Right
    ctx.moveTo(cx + 10 * s, cy);
    ctx.lineTo(cx + 13 * s, cy);
    ctx.stroke();
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
    const sideLength = Math.ceil(numSpaces / 4);
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

    // === DRAW FIXED BACKGROUND (fills entire canvas, not zoomable) ===
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const bgWidth = canvas.width / dpr;
    const bgHeight = canvas.height / dpr;

    // Clear canvas with aged yellowish paper background
    ctx.fillStyle = '#f5edd8';
    ctx.fillRect(0, 0, bgWidth, bgHeight);

    // Add aged paper stains/spots (scattered across full canvas)
    ctx.save();
    ctx.globalAlpha = 0.08;
    ctx.fillStyle = '#8B7750';
    ctx.beginPath();
    ctx.ellipse(bgWidth * 0.15, bgHeight * 0.2, 25, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(bgWidth * 0.85, bgHeight * 0.8, 20, 25, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(bgWidth * 0.5, bgHeight * 0.9, 15, 12, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Draw dot grid pattern spanning entire canvas
    ctx.fillStyle = '#a8a090';
    const dotSpacing = 20;
    for (let dotX = dotSpacing; dotX < bgWidth; dotX += dotSpacing) {
        for (let dotY = dotSpacing; dotY < bgHeight; dotY += dotSpacing) {
            ctx.beginPath();
            ctx.arc(dotX, dotY, 1, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // === DRAW BOARD (zoomable, centered) ===
    // Apply transform for board: scale and center
    ctx.setTransform(scale * dpr, 0, 0, scale * dpr, offsetX * dpr, offsetY * dpr);

    // Calculate positions for each space (going clockwise)
    const positions = [];
    const startX = padding;
    const startY = logicalBoardHeight - padding - spaceSize;

    for (let i = 0; i < numSpaces; i++) {
        let x, y;
        const perSide = Math.ceil(numSpaces / 4);

        if (i < perSide) {
            // Bottom edge (left to right)
            x = startX + i * spaceSize;
            y = startY;
        } else if (i < perSide * 2) {
            // Right edge (bottom to top)
            x = startX + (perSide - 1) * spaceSize;
            y = startY - (i - perSide + 1) * spaceSize;
        } else if (i < perSide * 3) {
            // Top edge (right to left)
            x = startX + (perSide - 1 - (i - perSide * 2 + 1)) * spaceSize;
            y = startY - (perSide - 1) * spaceSize;
        } else {
            // Left edge (top to bottom)
            x = startX;
            y = startY - (perSide - 1 - (i - perSide * 3 + 1)) * spaceSize;
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

        if (isHypothesis) {
            // HYPOTHESIS SPACES: Blank until invested, then show colored pencil hatching

            // Draw faint paper background
            sketchyRoundedRect(ctx, x, y, w, h, radius, seed);
            ctx.fillStyle = '#f8f4e8'; // Very light cream/blank paper
            ctx.fill();

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

            // Draw extra border for hypothesis spaces with content (proven or in progress)
            if (space.hypothesis) {
                ctx.strokeStyle = space.isProven ? '#27ae60' : '#e67e22';
                ctx.lineWidth = 2.5;
                ctx.setLineDash([4, 2]);
                sketchyRoundedRect(ctx, x - 1, y - 1, w + 2, h + 2, radius + 1, seed + 30);
                ctx.stroke();
                ctx.setLineDash([]);
            }

        } else {
            // NON-HYPOTHESIS SPACES: Plain grey pencil sketches

            // Draw light paper background
            sketchyRoundedRect(ctx, x, y, w, h, radius, seed);
            ctx.fillStyle = '#f0ece0';
            ctx.fill();

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

        ctx.restore();

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
    });

    // Draw players (pencil-sketch circle tokens)
    GameState.players.forEach((player, pIndex) => {
        if (!player.isAlive) return;

        // Check for animated position
        const animPos = getAnimatedPosition('player', pIndex, positions, spaceSize);
        const basePos = animPos || positions[player.position];
        if (!basePos) return;

        const offsetX = (pIndex % 2) * 25 + 8;
        const offsetY = Math.floor(pIndex / 2) * 20 + 8;

        const drawX = basePos.x + offsetX;
        const drawY = basePos.y + offsetY;
        const tokenSeed = pIndex * 500 + 1000;

        // Draw shadow when bouncing
        if (animPos && GameState.animation.bounceHeight > 0) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
            ctx.beginPath();
            ctx.ellipse(drawX, basePos.y + offsetY + GameState.animation.bounceHeight * 0.3,
                       9, 4, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        // Draw sketchy circle token with multiple passes
        ctx.save();

        // Main fill
        ctx.fillStyle = player.color;
        ctx.beginPath();
        // Draw slightly wobbly circle
        for (let angle = 0; angle <= Math.PI * 2; angle += 0.2) {
            const wobble = (seededRandom(tokenSeed + angle * 10) - 0.5) * 1.5;
            const r = 9 + wobble;
            const px = drawX + Math.cos(angle) * r;
            const py = drawY + Math.sin(angle) * r;
            if (angle === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();

        // Multiple pencil stroke outlines
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';

        // First outline pass
        ctx.strokeStyle = 'rgba(44, 62, 80, 0.8)';
        ctx.beginPath();
        for (let angle = 0; angle <= Math.PI * 2; angle += 0.15) {
            const wobble = (seededRandom(tokenSeed + angle * 10) - 0.5) * 1.2;
            const r = 9 + wobble;
            const px = drawX + Math.cos(angle) * r;
            const py = drawY + Math.sin(angle) * r;
            if (angle === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();

        // Second outline pass (offset for texture)
        ctx.strokeStyle = 'rgba(44, 62, 80, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let angle = 0; angle <= Math.PI * 2; angle += 0.2) {
            const wobble = (seededRandom(tokenSeed + 50 + angle * 10) - 0.5) * 1;
            const r = 9.5 + wobble;
            const px = drawX + Math.cos(angle) * r;
            const py = drawY + Math.sin(angle) * r;
            if (angle === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();

        // Inner pencil highlight scribble
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(drawX - 2, drawY - 2, 3, Math.PI * 0.8, Math.PI * 1.8);
        ctx.stroke();

        ctx.restore();

        // Player number (pixel style)
        ctx.fillStyle = '#fff';
        ctx.font = '6px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText((pIndex + 1).toString(), drawX, drawY + 1);
        ctx.textBaseline = 'alphabetic';
    });

    // Draw NPC (Scientific Underdeterminism - pencil-sketch diamond shape)
    const animNpcPos = getAnimatedPosition('npc', null, positions, spaceSize);
    const npcBasePos = animNpcPos || positions[GameState.npc.position];
    if (npcBasePos) {
        const npcX = npcBasePos.x + spaceSize/2;
        const npcY = npcBasePos.y + spaceSize/2;
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
