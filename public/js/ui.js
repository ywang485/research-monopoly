// Theory Investment Game - UI Functions

// ============================================
// MODAL SYSTEM
// ============================================
function showModal(title, bodyHTML, buttons) {
    const modal = document.getElementById('modal');
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').innerHTML = bodyHTML;

    const buttonsContainer = document.getElementById('modal-buttons');
    buttonsContainer.innerHTML = '';

    buttons.forEach(btn => {
        const button = document.createElement('button');
        button.className = 'sketch-btn';
        button.textContent = btn.text;
        button.onclick = () => {
            btn.action();
            if (btn.closeModal !== false) {
                hideModal();
            }
        };
        if (btn.disabled) {
            button.disabled = true;
        }
        buttonsContainer.appendChild(button);
    });

    modal.style.display = 'flex';
    document.body.classList.add('modal-open');
}

function hideModal() {
    document.getElementById('modal').style.display = 'none';
    document.body.classList.remove('modal-open');
}

// ============================================
// LOGGING
// ============================================
function log(message, type = 'normal') {
    const logEl = document.getElementById('game-log');
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.textContent = `[Turn ${GameState.turnNumber}] ${message}`;
    logEl.appendChild(entry);
    logEl.scrollTop = logEl.scrollHeight;

    // Update mobile panels if available
    if (typeof updateMobilePanels === 'function') {
        updateMobilePanels();
    }
}

// ============================================
// PLAYER STATS
// ============================================
function updatePlayerStats() {
    const container = document.getElementById('player-stats');
    container.innerHTML = '';

    GameState.players.forEach((player, index) => {
        const div = document.createElement('div');
        div.className = `player-stat ${player.isAlive ? '' : 'dead'}`;
        div.style.borderLeftColor = player.color;

        const activeIndicator = GameState.currentPlayerIndex === index && !GameState.isNPCTurn ? ' ◄' : '';
        const aiBadge = player.isAI ? '<span class="ai-badge">AI</span>' : '';

        // Team info - who they're grouped with and what the team is trying to prove
        const group = GameState.groups?.find(g => g.id === player.groupId);
        let teamHtml = '';
        if (group) {
            const teammates = group.playerIndices
                .filter(idx => idx !== index)
                .map(idx => GameState.players[idx]?.name)
                .filter(Boolean);
            let inner = '';
            if (teammates.length > 0) {
                inner += `<div class="team-info">🤝 Team: ${teammates.join(', ')}</div>`;
            }
            if (group.argument) {
                inner += `<div class="team-argument">🎯 Arguing: "${group.argument}"</div>`;
            }
            if (inner) {
                teamHtml = `<div class="team-meta">${inner}</div>`;
            }
        }

        div.innerHTML = `
            <div class="name" style="color: ${player.color}">${player.name}${aiBadge}${activeIndicator}</div>
            <div class="stats">
                <span>Age: <span class="stat-value">${player.age}</span></span>
                <span>Avail: <span class="stat-value">${player.availableYears}y</span></span>
                <span>Fame: <span class="stat-value">${player.availableFame}/${player.totalFame}</span></span>
                <span>Students: <span class="stat-value">${player.students.length}</span></span>
            </div>
            ${teamHtml}
        `;
        container.appendChild(div);
    });

    // Update NPC position
    document.getElementById('npc-position').textContent = `Position: ${GameState.board[GameState.npc.position]?.name || 'Start'}`;

    // Update mobile panels if available
    if (typeof updateMobilePanels === 'function') {
        updateMobilePanels();
    }
}

function updateTheoriesList() {
    const container = document.getElementById('theories-list');
    container.innerHTML = '';

    if (GameState.theories.length === 0) {
        container.innerHTML = '<div style="color: #666; font-size: 16px;">No theories established yet</div>';
        return;
    }

    GameState.theories.forEach((theory, index) => {
        const div = document.createElement('div');
        div.className = 'theory-item';
        div.style.cursor = 'pointer';
        div.innerHTML = `
            <div class="theory-name">${theory.hypothesis}</div>
            <div class="theory-author">Published by: ${theory.author}</div>
            <div class="theory-significance">Significance: ${'★'.repeat(theory.significance)}${'☆'.repeat(6 - theory.significance)}</div>
        `;

        // Add hover handlers for tooltip
        div.addEventListener('mouseenter', (e) => {
            const content = generateTheoryTooltipContent(theory);
            showBoardTooltip(e.clientX, e.clientY, content);
        });

        div.addEventListener('mousemove', (e) => {
            const tooltip = document.getElementById('board-tooltip');
            if (tooltip.classList.contains('visible')) {
                showBoardTooltip(e.clientX, e.clientY, tooltip.innerHTML);
            }
        });

        div.addEventListener('mouseleave', () => {
            hideBoardTooltip();
        });

        container.appendChild(div);
    });

    // Update mobile panels if available
    if (typeof updateMobilePanels === 'function') {
        updateMobilePanels();
    }
}

function generateTheoryTooltipContent(theory) {
    let html = `
        <div class="tooltip-title">Established Theory</div>
        <div class="tooltip-type">Published by ${theory.author}</div>
        <div class="tooltip-desc">Significance: ${'★'.repeat(theory.significance)}${'☆'.repeat(6 - theory.significance)} (${theory.fameAwarded} fame awarded)</div>
    `;

    html += `<div class="tooltip-hypothesis proven">`;

    // Show contributions with authors
    if (theory.contributions && theory.contributions.length > 0) {
        html += `<div class="tooltip-contributions">`;
        theory.contributions.forEach((contrib, idx) => {
            const isFirst = idx === 0;
            const label = isFirst ? 'Proposed by' : 'Added by';
            html += `<div class="tooltip-contribution">
                <div class="tooltip-contribution-author">${label} ${contrib.author}:</div>
                <div class="tooltip-contribution-text">"${contrib.text}"</div>
            </div>`;
        });
        html += `</div>`;
    } else {
        // Fallback for old data without contributions array
        html += `<div class="tooltip-hypothesis-text">"${theory.hypothesis}"</div>`;
    }

    if (theory.investments && theory.investments.length > 0) {
        html += `<div class="tooltip-investments">`;
        html += `<div style="color: #6a9a98; margin-bottom: 4px;">Total Investments:</div>`;
        theory.investments.forEach(inv => {
            html += `<div class="tooltip-investor"><span>${inv.player}</span><span>${inv.years} yrs</span></div>`;
        });
        html += `</div>`;
    }

    html += `</div>`;
    html += `<div class="tooltip-status proven">ESTABLISHED THEORY</div>`;

    return html;
}

// ============================================
// BOARD TOOLTIP SYSTEM
// ============================================
function getSpaceAtPosition(mouseX, mouseY) {
    const canvas = document.getElementById('game-board');
    const rect = canvas.getBoundingClientRect();

    // Convert mouse position to logical board coordinates
    // Account for the scale and offset applied during rendering
    const scale = GameState.boardScale || 1;
    const offsetX = GameState.boardOffsetX || 0;
    const offsetY = GameState.boardOffsetY || 0;
    const logicalX = (mouseX - rect.left - offsetX) / scale;
    const logicalY = (mouseY - rect.top - offsetY) / scale;

    // Check each space
    for (let i = 0; i < GameState.boardPositions.length; i++) {
        const pos = GameState.boardPositions[i];
        if (logicalX >= pos.x && logicalX < pos.x + GameState.boardSpaceSize - 2 &&
            logicalY >= pos.y && logicalY < pos.y + GameState.boardSpaceSize - 2) {
            return i;
        }
    }
    return -1;
}

function generateTooltipContent(spaceIndex) {
    const space = GameState.board[spaceIndex];
    if (!space) return '';

    const typeName = space.type.charAt(0).toUpperCase() + space.type.slice(1).replace('_', ' ');
    const description = SPACE_DESCRIPTIONS[space.type] || 'Unknown space type.';

    let html = `
        <div class="tooltip-title">${space.name}</div>
        <div class="tooltip-type">${typeName}</div>
        <div class="tooltip-desc">${description}</div>
    `;

    // Add hypothesis-specific info
    if (space.type === SPACE_TYPES.HYPOTHESIS) {
        if (space.hypothesis) {
            const statusClass = space.isProven ? 'proven' : '';
            html += `<div class="tooltip-hypothesis ${statusClass}">`;

            // Show contributions with authors
            if (space.contributions && space.contributions.length > 0) {
                html += `<div class="tooltip-contributions">`;
                space.contributions.forEach((contrib, idx) => {
                    const isFirst = idx === 0;
                    const label = isFirst ? 'Proposed by' : 'Added by';
                    html += `<div class="tooltip-contribution">
                        <div class="tooltip-contribution-author">${label} ${contrib.author}:</div>
                        <div class="tooltip-contribution-text">"${contrib.text}"</div>
                    </div>`;
                });
                html += `</div>`;
            } else {
                // Fallback for old data without contributions array
                html += `<div class="tooltip-hypothesis-text">"${space.hypothesis}"</div>`;
            }

            if (space.investments.length > 0) {
                html += `<div class="tooltip-investments">`;
                html += `<div style="color: #6a9a98; margin-bottom: 4px;">Investments:</div>`;
                space.investments.forEach(inv => {
                    html += `<div class="tooltip-investor"><span>${inv.player}</span><span>${inv.years} yrs</span></div>`;
                });
                html += `</div>`;
            }

            html += `</div>`;

            if (space.isProven) {
                html += `<div class="tooltip-status proven">ESTABLISHED THEORY</div>`;
            } else {
                html += `<div class="tooltip-status active">Active Research (Cost: ${space.investmentCost} yrs)</div>`;
            }
        } else {
            html += `<div class="tooltip-status empty">Unmarked (Cost: ${space.investmentCost} yrs to start)</div>`;
        }
    }

    // Show who's on this space
    const playersHere = GameState.players.filter(p => p.position === spaceIndex && p.isAlive);
    const npcHere = GameState.npc.position === spaceIndex;

    if (playersHere.length > 0 || npcHere) {
        html += `<div class="tooltip-status" style="margin-top: 8px; color: #6a9a98;">`;
        if (playersHere.length > 0) {
            html += `Players here: ${playersHere.map(p => p.name).join(', ')}`;
        }
        if (npcHere) {
            html += playersHere.length > 0 ? '<br>' : '';
            html += `Scientific Underdeterminism is here`;
        }
        html += `</div>`;
    }

    return html;
}

function showBoardTooltip(mouseX, mouseY, content) {
    const tooltip = document.getElementById('board-tooltip');
    tooltip.innerHTML = content;
    tooltip.classList.add('visible');

    // Position tooltip near mouse but avoid going off screen
    const tooltipRect = tooltip.getBoundingClientRect();
    let left = mouseX + 15;
    let top = mouseY + 15;

    // Adjust if tooltip would go off right edge
    if (left + tooltipRect.width > window.innerWidth - 10) {
        left = mouseX - tooltipRect.width - 15;
    }

    // Adjust if tooltip would go off bottom edge
    if (top + tooltipRect.height > window.innerHeight - 10) {
        top = mouseY - tooltipRect.height - 15;
    }

    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
}

function hideBoardTooltip() {
    const tooltip = document.getElementById('board-tooltip');
    tooltip.classList.remove('visible');
}

function initBoardTooltip() {
    const canvas = document.getElementById('game-board');
    let lastHoveredSpace = -1;

    canvas.addEventListener('mousemove', (e) => {
        const spaceIndex = getSpaceAtPosition(e.clientX, e.clientY);

        if (spaceIndex >= 0 && spaceIndex !== lastHoveredSpace) {
            const content = generateTooltipContent(spaceIndex);
            showBoardTooltip(e.clientX, e.clientY, content);
            lastHoveredSpace = spaceIndex;
        } else if (spaceIndex >= 0) {
            // Update position while hovering same space
            const tooltip = document.getElementById('board-tooltip');
            if (tooltip.classList.contains('visible')) {
                showBoardTooltip(e.clientX, e.clientY, tooltip.innerHTML);
            }
        } else {
            hideBoardTooltip();
            lastHoveredSpace = -1;
        }
    });

    canvas.addEventListener('mouseleave', () => {
        hideBoardTooltip();
        lastHoveredSpace = -1;
    });
}

// ============================================
// ZOOM CONTROLS
// ============================================
function updateZoomLevel(newLevel) {
    const zoom = GameState.zoom;
    zoom.level = Math.max(zoom.minLevel, Math.min(zoom.maxLevel, newLevel));

    // Update UI
    const zoomLevelEl = document.getElementById('zoom-level');
    if (zoomLevelEl) {
        zoomLevelEl.textContent = Math.round(zoom.level * 100) + '%';
    }

    // Re-render the board
    if (GameState.board && GameState.board.length > 0) {
        renderBoard();
    }
}

function zoomIn() {
    updateZoomLevel(GameState.zoom.level + GameState.zoom.step);
}

function zoomOut() {
    updateZoomLevel(GameState.zoom.level - GameState.zoom.step);
}

function zoomReset() {
    updateZoomLevel(1);
    // Reset scroll position
    const container = document.getElementById('board-container');
    if (container) {
        container.scrollLeft = 0;
        container.scrollTop = 0;
    }
}

// Center the viewport on a specific space position (when zoomed in)
function centerViewportOnSpace(spaceIndex) {
    const container = document.getElementById('board-container');
    if (!container) return;

    // Only scroll if zoomed in (board is larger than container)
    if (GameState.zoom.level <= 1) return;

    // Get the space position from stored board positions
    const positions = GameState.boardPositions;
    if (!positions || !positions[spaceIndex]) return;

    const pos = positions[spaceIndex];
    const spaceSize = GameState.boardSpaceSize || 60;
    const scale = GameState.boardScale || 1;
    const offsetX = GameState.boardOffsetX || 0;
    const offsetY = GameState.boardOffsetY || 0;

    // Calculate the center of the space in screen coordinates
    const spaceCenterX = (pos.x + spaceSize / 2) * scale + offsetX;
    const spaceCenterY = (pos.y + spaceSize / 2) * scale + offsetY;

    // Calculate scroll position to center the space in the viewport
    const targetScrollX = spaceCenterX - container.clientWidth / 2;
    const targetScrollY = spaceCenterY - container.clientHeight / 2;

    // Clamp to valid scroll range
    const maxScrollX = container.scrollWidth - container.clientWidth;
    const maxScrollY = container.scrollHeight - container.clientHeight;

    const clampedScrollX = Math.max(0, Math.min(targetScrollX, maxScrollX));
    const clampedScrollY = Math.max(0, Math.min(targetScrollY, maxScrollY));

    // Smooth scroll to the position
    container.scrollTo({
        left: clampedScrollX,
        top: clampedScrollY,
        behavior: 'smooth'
    });
}

// Center viewport on current player (convenience function)
function centerViewportOnCurrentPlayer() {
    if (!GameState.players || GameState.players.length === 0) return;
    const player = GameState.players[GameState.currentPlayerIndex];
    if (player && player.isAlive) {
        centerViewportOnSpace(player.position);
    }
}

function initZoomControls() {
    const zoomInBtn = document.getElementById('zoom-in-btn');
    const zoomOutBtn = document.getElementById('zoom-out-btn');
    const zoomResetBtn = document.getElementById('zoom-reset-btn');
    const canvas = document.getElementById('game-board');
    const container = document.getElementById('board-container');

    if (zoomInBtn) zoomInBtn.addEventListener('click', zoomIn);
    if (zoomOutBtn) zoomOutBtn.addEventListener('click', zoomOut);
    if (zoomResetBtn) zoomResetBtn.addEventListener('click', zoomReset);

    // Mouse wheel zoom (direct, no modifier needed)
    if (container) {
        container.addEventListener('wheel', (e) => {
            e.preventDefault();
            if (e.deltaY < 0) {
                zoomIn();
            } else {
                zoomOut();
            }
        }, { passive: false });
    }

    // Pan with mouse drag when zoomed
    if (canvas) {
        canvas.addEventListener('mousedown', (e) => {
            if (GameState.zoom.level > 1) {
                GameState.zoom.isPanning = true;
                GameState.zoom.lastMouseX = e.clientX;
                GameState.zoom.lastMouseY = e.clientY;
                canvas.style.cursor = 'grabbing';
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (GameState.zoom.isPanning && container) {
                const deltaX = e.clientX - GameState.zoom.lastMouseX;
                const deltaY = e.clientY - GameState.zoom.lastMouseY;

                container.scrollLeft -= deltaX;
                container.scrollTop -= deltaY;

                GameState.zoom.lastMouseX = e.clientX;
                GameState.zoom.lastMouseY = e.clientY;
            }
        });

        document.addEventListener('mouseup', () => {
            if (GameState.zoom.isPanning) {
                GameState.zoom.isPanning = false;
                if (canvas) {
                    canvas.style.cursor = GameState.zoom.level > 1 ? 'grab' : 'default';
                }
            }
        });

        // === MOBILE PINCH-TO-ZOOM ===
        let initialPinchDistance = 0;
        let initialZoom = 1;
        let isPinching = false;
        let lastTouchX = 0;
        let lastTouchY = 0;

        canvas.addEventListener('touchstart', (e) => {
            if (e.touches.length === 2) {
                // Start pinch zoom
                e.preventDefault();
                isPinching = true;
                initialPinchDistance = getPinchDistance(e.touches);
                initialZoom = GameState.zoom.level;
            } else if (e.touches.length === 1 && GameState.zoom.level > 1) {
                // Start single-finger pan when zoomed
                lastTouchX = e.touches[0].clientX;
                lastTouchY = e.touches[0].clientY;
            }
        }, { passive: false });

        canvas.addEventListener('touchmove', (e) => {
            if (e.touches.length === 2 && isPinching) {
                // Pinch zoom
                e.preventDefault();
                const currentDistance = getPinchDistance(e.touches);
                const scale = currentDistance / initialPinchDistance;
                const newZoom = initialZoom * scale;
                updateZoomLevel(newZoom);
            } else if (e.touches.length === 1 && GameState.zoom.level > 1 && !isPinching) {
                // Single-finger pan when zoomed
                e.preventDefault();
                const deltaX = e.touches[0].clientX - lastTouchX;
                const deltaY = e.touches[0].clientY - lastTouchY;

                if (container) {
                    container.scrollLeft -= deltaX;
                    container.scrollTop -= deltaY;
                }

                lastTouchX = e.touches[0].clientX;
                lastTouchY = e.touches[0].clientY;
            }
        }, { passive: false });

        canvas.addEventListener('touchend', (e) => {
            if (e.touches.length < 2) {
                isPinching = false;
            }
        });
    }

    // Keyboard shortcuts for zoom
    document.addEventListener('keydown', (e) => {
        // Only handle zoom shortcuts when not in an input field
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        if ((e.ctrlKey || e.metaKey) && e.key === '=') {
            e.preventDefault();
            zoomIn();
        } else if ((e.ctrlKey || e.metaKey) && e.key === '-') {
            e.preventDefault();
            zoomOut();
        } else if ((e.ctrlKey || e.metaKey) && e.key === '0') {
            e.preventDefault();
            zoomReset();
        }
    });
}

// Helper function for pinch-to-zoom distance calculation
function getPinchDistance(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
}

// ============================================
// MOBILE TAP GESTURE HANDLING
// ============================================
function initMobileBoardInteraction() {
    const canvas = document.getElementById('game-board');
    if (!canvas) return;

    let lastTapTime = 0;
    let lastTapX = 0;
    let lastTapY = 0;
    const DOUBLE_TAP_DELAY = 300; // ms
    const TAP_DISTANCE_THRESHOLD = 30; // pixels

    canvas.addEventListener('touchend', (e) => {
        // Ignore if it was a pinch or multi-touch
        if (e.changedTouches.length !== 1) return;

        // Ignore if there are still touches on screen
        if (e.touches.length > 0) return;

        const touch = e.changedTouches[0];
        const currentTime = Date.now();
        const timeDiff = currentTime - lastTapTime;
        const distX = Math.abs(touch.clientX - lastTapX);
        const distY = Math.abs(touch.clientY - lastTapY);

        // Check for double-tap
        if (timeDiff < DOUBLE_TAP_DELAY &&
            distX < TAP_DISTANCE_THRESHOLD &&
            distY < TAP_DISTANCE_THRESHOLD) {
            // Double-tap detected
            handleMobileDoubleTap(touch.clientX, touch.clientY);
            lastTapTime = 0; // Reset to prevent triple-tap
        } else {
            // Single tap - show space info
            handleMobileSingleTap(touch.clientX, touch.clientY);
            lastTapTime = currentTime;
            lastTapX = touch.clientX;
            lastTapY = touch.clientY;
        }
    });
}

function handleMobileSingleTap(x, y) {
    const spaceIndex = getSpaceAtPosition(x, y);
    if (spaceIndex >= 0) {
        showMobileSpaceInfo(spaceIndex);
    }
}

function handleMobileDoubleTap(x, y) {
    // Hide any open space info first
    hideMobileSpaceInfo();

    // Check if tapping on a space
    const spaceIndex = getSpaceAtPosition(x, y);
    if (spaceIndex < 0) return;

    // Get current player
    const player = GameState.players[GameState.currentPlayerIndex];
    if (!player || !player.isAlive || GameState.isNPCTurn || GameState.gameOver) return;

    // If player is on this space, trigger the space action again
    if (player.position === spaceIndex) {
        const space = GameState.board[spaceIndex];
        if (space && typeof handleSpaceLanding === 'function') {
            handleSpaceLanding(player, space);
        }
    }
}

function showMobileSpaceInfo(spaceIndex) {
    const content = generateTooltipContent(spaceIndex);

    // Create or update the mobile space info overlay
    let overlay = document.getElementById('mobile-space-info');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'mobile-space-info';
        overlay.className = 'mobile-space-info';
        document.body.appendChild(overlay);
    }

    overlay.innerHTML = `
        <div class="mobile-space-info-content">
            ${content}
            <button class="mobile-space-info-close" onclick="hideMobileSpaceInfo()">×</button>
        </div>
    `;
    overlay.classList.add('visible');

    // Close when tapping on the backdrop
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            hideMobileSpaceInfo();
        }
    });
}

function hideMobileSpaceInfo() {
    const overlay = document.getElementById('mobile-space-info');
    if (overlay) {
        overlay.classList.remove('visible');
    }
}

// ============================================
// SETUP SCREEN
// ============================================

// ============================================
// PLAYER GROUPS (players + team arguments)
// ============================================
let nextPlayerId = 1;
let nextGroupId = 1;
let playerGroups = [];    // [{ id: number, playerIds: number[] }]
let groupArguments = {};  // { [groupId]: string }
let playerRegistry = {};  // { [playerId]: { name, color, isAI } }
let playerOrder = [];     // playerIds in creation order (drives Add/Remove Player)
let groupArgFetchToken = 0; // guards stale/overlapping async suggestion fetches

function escapeAttr(str) {
    return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function createSingletonGroup(playerId) {
    const group = { id: nextGroupId++, playerIds: [playerId] };
    playerGroups.push(group);
    groupArguments[group.id] = '';
    return group;
}

function removePlayerFromGroups(playerId) {
    for (let i = playerGroups.length - 1; i >= 0; i--) {
        const g = playerGroups[i];
        const idx = g.playerIds.indexOf(playerId);
        if (idx !== -1) {
            g.playerIds.splice(idx, 1);
            if (g.playerIds.length === 0) {
                playerGroups.splice(i, 1);
                delete groupArguments[g.id];
            }
            break;
        }
    }
}

// Registers a new player (own singleton group by default) and returns their id
function createPlayer(name, color, isAI) {
    const id = nextPlayerId++;
    playerRegistry[id] = { name, color, isAI };
    playerOrder.push(id);
    createSingletonGroup(id);
    return id;
}

// Removes the most recently added player entirely (row, registry entry, group membership)
function removeLastPlayer() {
    const id = playerOrder.pop();
    if (id === undefined) return;
    usedNames.delete(playerRegistry[id]?.name);
    delete playerRegistry[id];
    removePlayerFromGroups(id);
}

function renderGroups() {
    const container = document.getElementById('group-list');
    if (!container) return;

    container.innerHTML = playerGroups.map(g => {
        const rows = g.playerIds.map(pid => {
            const p = playerRegistry[pid];
            if (!p) return '';
            return `
                <div class="player-input" data-player-id="${pid}">
                    <span class="drag-handle" draggable="true" data-player-id="${pid}" title="Drag to move to another team">⠿</span>
                    <input type="text" class="player-name" data-player-id="${pid}" placeholder="Player Name" value="${escapeAttr(p.name)}">
                    <button type="button" class="randomize-name-btn" data-player-id="${pid}" title="Random Name">🎲</button>
                    <input type="color" class="player-color" data-player-id="${pid}" value="${p.color}">
                    <label class="ai-toggle"><input type="checkbox" class="player-ai" data-player-id="${pid}"${p.isAI ? ' checked' : ''}> AI</label>
                    ${g.playerIds.length > 1 ? `<button type="button" class="remove-from-group-btn" data-player-id="${pid}" title="Move to a new team">×</button>` : ''}
                </div>`;
        }).join('');

        return `
            <div class="group-card" data-group-id="${g.id}">
                <div class="group-members">${rows}</div>
                <textarea class="group-argument-input" data-group-id="${g.id}" placeholder="What is this team trying to prove?">${groupArguments[g.id] || ''}</textarea>
            </div>`;
    }).join('');
}

// Move a player into an existing group, merging their old group into it.
// Deletes the old group (and adopts its argument, if the target's is empty) once it's empty.
function mergePlayerIntoGroup(playerId, targetGroupId) {
    const targetGroup = playerGroups.find(g => g.id === targetGroupId);
    if (!targetGroup || targetGroup.playerIds.includes(playerId)) return;

    const sourceGroup = playerGroups.find(g => g.playerIds.includes(playerId));
    if (!sourceGroup) return;

    sourceGroup.playerIds = sourceGroup.playerIds.filter(pid => pid !== playerId);
    targetGroup.playerIds.push(playerId);

    if (sourceGroup.playerIds.length === 0) {
        if (!groupArguments[targetGroupId]?.trim() && groupArguments[sourceGroup.id]?.trim()) {
            groupArguments[targetGroupId] = groupArguments[sourceGroup.id];
        }
        playerGroups = playerGroups.filter(g => g.id !== sourceGroup.id);
        delete groupArguments[sourceGroup.id];
    }
}

const DRAG_MIME = 'text/x-theoropoly-player-id';

function setupGroupListEvents(container) {
    container.addEventListener('click', (e) => {
        const removeBtn = e.target.closest('.remove-from-group-btn');
        if (removeBtn) {
            const playerId = Number(removeBtn.dataset.playerId);
            removePlayerFromGroups(playerId);
            createSingletonGroup(playerId);
            renderGroups();
            return;
        }

        const randomizeBtn = e.target.closest('.randomize-name-btn');
        if (randomizeBtn) {
            const pid = Number(randomizeBtn.dataset.playerId);
            const nameInput = randomizeBtn.closest('.player-input')?.querySelector('.player-name');
            usedNames.delete(playerRegistry[pid]?.name);
            const newName = getRandomScientistName();
            if (playerRegistry[pid]) playerRegistry[pid].name = newName;
            if (nameInput) nameInput.value = newName;
        }
    });

    container.addEventListener('input', (e) => {
        const nameInput = e.target.closest('.player-name');
        if (nameInput) {
            const pid = Number(nameInput.dataset.playerId);
            if (playerRegistry[pid]) playerRegistry[pid].name = nameInput.value;
            return;
        }
        const argInput = e.target.closest('.group-argument-input');
        if (argInput) {
            groupArguments[Number(argInput.dataset.groupId)] = argInput.value;
        }
    });

    container.addEventListener('change', (e) => {
        const colorInput = e.target.closest('.player-color');
        if (colorInput) {
            const pid = Number(colorInput.dataset.playerId);
            if (playerRegistry[pid]) playerRegistry[pid].color = colorInput.value;
            return;
        }
        const aiToggle = e.target.closest('.player-ai');
        if (aiToggle) {
            const pid = Number(aiToggle.dataset.playerId);
            if (playerRegistry[pid]) playerRegistry[pid].isAI = aiToggle.checked;
        }
    });

    // Only the drag handle initiates a row drag, so name/color/AI controls stay clickable
    container.addEventListener('dragstart', (e) => {
        const handle = e.target.closest('.drag-handle');
        if (!handle) return;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData(DRAG_MIME, handle.dataset.playerId);
        handle.closest('.player-input')?.classList.add('dragging');
    });

    container.addEventListener('dragend', (e) => {
        const handle = e.target.closest('.drag-handle');
        handle?.closest('.player-input')?.classList.remove('dragging');
        document.querySelectorAll('.group-card.drag-over').forEach(c => c.classList.remove('drag-over'));
    });

    // Dropping on a card merges into it; dropping anywhere else (outside any card,
    // including outside the group list entirely) splits the player into a new group.
    // Listens on `document` so "outside any group card" isn't limited to the list's own bounds.
    document.addEventListener('dragover', (e) => {
        if (!e.dataTransfer.types.includes(DRAG_MIME)) return;
        e.preventDefault();
        const card = e.target.closest('.group-card');
        document.querySelectorAll('.group-card.drag-over').forEach(c => {
            if (c !== card) c.classList.remove('drag-over');
        });
        if (card) card.classList.add('drag-over');
    });

    document.addEventListener('drop', (e) => {
        if (!e.dataTransfer.types.includes(DRAG_MIME)) return;
        e.preventDefault();
        document.querySelectorAll('.group-card.drag-over').forEach(c => c.classList.remove('drag-over'));

        const playerId = Number(e.dataTransfer.getData(DRAG_MIME));
        if (Number.isNaN(playerId)) return;

        const card = e.target.closest('.group-card');
        if (card) {
            mergePlayerIntoGroup(playerId, Number(card.dataset.groupId));
        } else {
            removePlayerFromGroups(playerId);
            createSingletonGroup(playerId);
        }
        renderGroups();
    });
}

// Fetch a suggested argument for each current group and fill in their fields
async function suggestGroupArguments(topic) {
    if (playerGroups.length === 0) return;

    const myToken = ++groupArgFetchToken;
    const groupIdsSnapshot = playerGroups.map(g => g.id);
    const groupListEl = document.getElementById('group-list');

    // Only disable the argument fields themselves - player name/color/AI stay editable
    groupListEl?.querySelectorAll('.group-argument-input').forEach(el => el.disabled = true);

    const suggestions = await fetchGroupArgumentSuggestions(topic, groupIdsSnapshot.length);

    groupListEl?.querySelectorAll('.group-argument-input').forEach(el => el.disabled = false);

    // Stale response - a newer suggestion request superseded this one
    if (myToken !== groupArgFetchToken) return;

    // Structural change guard - groups were merged/split/removed while we were fetching
    const currentIds = playerGroups.map(g => g.id);
    if (currentIds.length !== groupIdsSnapshot.length || !currentIds.every((id, idx) => id === groupIdsSnapshot[idx])) {
        return;
    }

    if (suggestions && suggestions.length > 0) {
        groupIdsSnapshot.forEach((id, idx) => {
            if (suggestions[idx]) groupArguments[id] = suggestions[idx];
        });
        renderGroups();
    }
}

function initSetupScreen() {
    const addBtn = document.getElementById('add-player-btn');
    const removeBtn = document.getElementById('remove-player-btn');
    const groupListEl = document.getElementById('group-list');
    const mapSelect = document.getElementById('map-select');
    const customMapInput = document.getElementById('custom-map-input');
    const startBtn = document.getElementById('start-game-btn');

    // Reset used names and seed the two default players (each their own team)
    resetUsedNames();
    const initialColors = ['#3EAAF7', '#3EE5F7', '#3E6FF7', '#3EF7CC'];
    const initialAI = [false, true];

    playerGroups = [];
    groupArguments = {};
    playerRegistry = {};
    playerOrder = [];
    nextGroupId = 1;
    nextPlayerId = 1;

    createPlayer(getRandomScientistName(), initialColors[0], initialAI[0]);
    createPlayer(getRandomScientistName(), initialColors[1], initialAI[1]);

    setupGroupListEvents(groupListEl);
    renderGroups();

    addBtn.addEventListener('click', () => {
        const total = playerOrder.length;
        if (total < 4) {
            const colors = ['#e74c3c', '#3498db', '#27ae60', '#9b59b6'];
            createPlayer(getRandomScientistName(), colors[total], false);
            renderGroups();
        }
    });

    removeBtn.addEventListener('click', () => {
        if (playerOrder.length > 2) {
            removeLastPlayer();
            renderGroups();
        }
    });

    mapSelect.addEventListener('change', () => {
        customMapInput.style.display = mapSelect.value === 'custom' ? 'block' : 'none';
    });

    startBtn.addEventListener('click', startGame);

    document.getElementById('play-again-btn').addEventListener('click', () => {
        location.reload();
    });

    // Share button - export gameover screen as PDF paper
    document.getElementById('share-btn').addEventListener('click', async () => {
        const shareBtn = document.getElementById('share-btn');
        const originalText = shareBtn.innerHTML;

        try {
            // Show loading state
            shareBtn.innerHTML = '📄 GENERATING PDF...';
            shareBtn.disabled = true;

            // Use globally loaded jsPDF library
            const { jsPDF } = window;
            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            // Extract data from GameState and DOM
            // Capitalize the title for the PDF
            const researchSubject = GameState.entity.name
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ');

            // Get proven theories (established theories)
            const provenSpaces = GameState.board.filter(s => s.isProven && s.hypothesis);
            const establishedTheories = provenSpaces.map(s => {
                // Get contributors sorted by years invested (descending)
                const contributors = s.investments
                    .sort((a, b) => b.years - a.years)
                    .map(inv => inv.player);

                return {
                    hypothesis: s.hypothesis,
                    contributors: contributors
                };
            });
            
            // Get theory content from DOM
            const theoryContentEl = document.getElementById('theory-content');
            const theoryTextEl = theoryContentEl?.querySelector('.theory-text');
            const theoryContent = theoryTextEl ? theoryTextEl.textContent.trim() : 
                'After years of rigorous research and academic debate, the scientific community has established the following truths.';
            
            // Get authors who contributed to established theories, sorted by total fame
            const contributors = {};
            provenSpaces.forEach(space => {
                space.investments.forEach(inv => {
                    if (!contributors[inv.playerIndex]) {
                        const player = GameState.players[inv.playerIndex];
                        if (player) {
                            contributors[inv.playerIndex] = {
                                name: player.name,
                                totalFame: player.totalFame,
                                index: inv.playerIndex
                            };
                        }
                    }
                });
                space.contributions.forEach(contrib => {
                    if (!contributors[contrib.playerIndex]) {
                        const player = GameState.players[contrib.playerIndex];
                        if (player) {
                            contributors[contrib.playerIndex] = {
                                name: player.name,
                                totalFame: player.totalFame,
                                index: contrib.playerIndex
                            };
                        }
                    }
                });
            });
            
            // Sort authors by total fame (descending)
            const sortedAuthors = Object.values(contributors)
                .sort((a, b) => b.totalFame - a.totalFame);
            
            // Get author bios from DOM
            const contributorsEl = document.getElementById('theory-contributors');
            const authorBios = {};
            if (contributorsEl) {
                const bioElements = contributorsEl.querySelectorAll('.contributor-bio');
                bioElements.forEach((bioEl, idx) => {
                    const bioText = bioEl.textContent.trim();
                    // Find corresponding player by matching with sortedContributors
                    // We'll match by index in the contributors list
                    if (sortedAuthors[idx]) {
                        authorBios[sortedAuthors[idx].index] = bioText;
                    }
                });
            }
            
            // If bios aren't loaded yet, try to fetch them
            if (Object.keys(authorBios).length === 0) {
                const logEntries = Array.from(document.querySelectorAll('.log-entry')).map(entry => entry.textContent);
                const gameLog = logEntries.join('\n');
                try {
                    const bios = await fetchPlayerBios(GameState.players, gameLog);
                    if (bios && bios.length === GameState.players.length) {
                        GameState.players.forEach((player, idx) => {
                            if (bios[idx] && sortedAuthors.find(a => a.index === player.index)) {
                                authorBios[player.index] = bios[idx];
                            }
                        });
                    }
                } catch (err) {
                    console.warn('Could not fetch bios for PDF:', err);
                }
            }

            // Set up PDF styling (arXiv style)
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const margin = 25; // Academic paper margins
            const maxWidth = pageWidth - (margin * 2);
            const centerX = pageWidth / 2;
            let yPos = margin + 10;
            let pageNumber = 1;

            // Helper function to add page numbers
            const addPageNumber = () => {
                doc.setFontSize(10);
                doc.setFont('times', 'normal');
                doc.setTextColor(0, 0, 0);
                doc.text(String(pageNumber), centerX, pageHeight - 15, { align: 'center' });
            };

            // Helper function to check page break and add new page
            const checkPageBreak = (requiredSpace) => {
                if (yPos + requiredSpace > pageHeight - 25) {
                    addPageNumber();
                    doc.addPage();
                    pageNumber++;
                    yPos = margin;
                }
            };

            // === TITLE SECTION ===
            doc.setFontSize(20);
            doc.setFont('times', 'bold');
            doc.setTextColor(0, 0, 0);

            // Split title into lines if needed
            const titleLines = doc.splitTextToSize(researchSubject, maxWidth - 20);
            titleLines.forEach(line => {
                doc.text(line, centerX, yPos, { align: 'center' });
                yPos += 24;
            });

            yPos += 5;

            // === AUTHORS SECTION ===
            if (sortedAuthors.length > 0) {
                doc.setFontSize(12);
                doc.setFont('times', 'normal');
                doc.setTextColor(0, 0, 0);

                const authorNames = sortedAuthors.map(a => a.name).join(', ');
                const authorLines = doc.splitTextToSize(authorNames, maxWidth - 20);
                authorLines.forEach(line => {
                    doc.text(line, centerX, yPos, { align: 'center' });
                    yPos += 14;
                });
                yPos += 10;
            }

            // Horizontal line separator
            doc.setLineWidth(0.5);
            doc.line(margin, yPos, pageWidth - margin, yPos);
            yPos += 15;

            // === ABSTRACT SECTION ===
            checkPageBreak(30);

            // Abstract header (centered and bold)
            doc.setFontSize(12);
            doc.setFont('times', 'bold');
            doc.text('Abstract', centerX, yPos, { align: 'center' });
            yPos += 15;

            // Abstract content (indented and slightly smaller)
            const abstractIndent = 15;
            doc.setFontSize(10);
            doc.setFont('times', 'italic');
            doc.setTextColor(0, 0, 0);

            const abstractLines = doc.splitTextToSize(theoryContent, maxWidth - (abstractIndent * 2));
            abstractLines.forEach(line => {
                checkPageBreak(12);
                doc.text(line, margin + abstractIndent, yPos);
                yPos += 12;
            });
            yPos += 15;

            // === REFERENCES SECTION ===
            if (establishedTheories.length > 0) {
                checkPageBreak(25);

                // Section header
                doc.setFontSize(13);
                doc.setFont('times', 'bold');
                doc.setTextColor(0, 0, 0);
                doc.text('References', margin, yPos);
                yPos += 18;

                // References with hanging indent
                doc.setFontSize(9);
                doc.setFont('times', 'normal');

                establishedTheories.forEach((theory, idx) => {
                    checkPageBreak(15);

                    const refNumber = `[${idx + 1}]`;
                    const refIndent = 10;

                    // Reference number
                    doc.text(refNumber, margin, yPos);

                    // Reference text with contributors
                    let refText = theory.hypothesis;
                    if (theory.contributors && theory.contributors.length > 0) {
                        refText += ` , ${theory.contributors.join(', ')}`;
                    }

                    // Reference text with hanging indent
                    const refLines = doc.splitTextToSize(refText, maxWidth - refIndent - 5);
                    refLines.forEach((line, lineIdx) => {
                        if (lineIdx === 0) {
                            doc.text(line, margin + refIndent, yPos);
                        } else {
                            checkPageBreak(11);
                            yPos += 11;
                            doc.text(line, margin + refIndent, yPos);
                        }
                    });
                    yPos += 14;
                });
                yPos += 10;
            }

            // === AUTHOR BIOGRAPHIES SECTION ===
            if (sortedAuthors.length > 0 && Object.keys(authorBios).length > 0) {
                checkPageBreak(25);

                // Section header
                doc.setFontSize(13);
                doc.setFont('times', 'bold');
                doc.setTextColor(0, 0, 0);
                doc.text('Author Biographies', margin, yPos);
                yPos += 18;

                sortedAuthors.forEach(author => {
                    if (authorBios[author.index]) {
                        checkPageBreak(20);

                        // Author name
                        doc.setFontSize(11);
                        doc.setFont('times', 'bold');
                        doc.text(author.name, margin, yPos);
                        yPos += 14;

                        // Author bio
                        doc.setFontSize(10);
                        doc.setFont('times', 'normal');
                        doc.setTextColor(40, 40, 40);

                        const bioLines = doc.splitTextToSize(authorBios[author.index], maxWidth - 5);
                        bioLines.forEach(line => {
                            checkPageBreak(12);
                            doc.text(line, margin + 5, yPos);
                            yPos += 12;
                        });
                        yPos += 12;
                    }
                });
            }

            // Add final page number
            addPageNumber();

            // Save the PDF
            const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
            doc.save(`research-paper-${timestamp}.pdf`);

            // Restore button
            shareBtn.innerHTML = originalText;
            shareBtn.disabled = false;

        } catch (error) {
            console.error('Failed to generate PDF:', error);
            alert('Failed to generate PDF. Please try again.');
            shareBtn.innerHTML = originalText;
            shareBtn.disabled = false;
        }
    });


    // Entity suggestions button
    const generateEntitiesBtn = document.getElementById('generate-entities-btn');
    if (generateEntitiesBtn) {
        generateEntitiesBtn.addEventListener('click', async () => {
            const entityType = document.getElementById('entity-type').value;
            const suggestionsContainer = document.getElementById('entity-suggestions');

            // Show loading state
            generateEntitiesBtn.disabled = true;
            generateEntitiesBtn.innerHTML = '<p style="font-size: 20px;">⏳</p>';
            suggestionsContainer.innerHTML = '<div class="suggestion-loading">Generating suggestions...</div>';

            const entities = await fetchEntitySuggestions(entityType, 3);

            // Restore button
            generateEntitiesBtn.disabled = false;
            generateEntitiesBtn.innerHTML = '<p style="font-size: 20px;">🎲</p>';

            if (entities && entities.length > 0) {
                suggestionsContainer.innerHTML = entities.map((entity, i) =>
                    `<button class="entity-suggestion-btn" data-entity="${i}">${entity}</button>`
                ).join('');

                // Add click handlers
                suggestionsContainer.querySelectorAll('.entity-suggestion-btn').forEach((btn, i) => {
                    btn.addEventListener('click', () => {
                        document.getElementById('entity-name').value = entities[i];
                        // Highlight selected
                        suggestionsContainer.querySelectorAll('.entity-suggestion-btn').forEach(b => b.classList.remove('selected'));
                        btn.classList.add('selected');

                        // Also suggest a team argument for each current group
                        suggestGroupArguments(entities[i]);
                    });
                });
            } else {
                suggestionsContainer.innerHTML = '<div class="suggestion-error">Failed to generate suggestions</div>';
            }
        });
    }

    // Manually-typed topic - pressing Enter also suggests a team argument for each group
    const entityNameInput = document.getElementById('entity-name');
    if (entityNameInput) {
        entityNameInput.addEventListener('keydown', (e) => {
            if (e.key !== 'Enter') return;
            e.preventDefault();
            const topic = entityNameInput.value.trim();
            if (topic) {
                suggestGroupArguments(topic);
            }
        });
    }
}

function startGame() {
    // Initialize audio system
    initAudio();
    playSound('click');

    // Get entity info
    GameState.entity.type = document.getElementById('entity-type').value;
    GameState.entity.name = document.getElementById('entity-name').value || 'The Unknown';

    // Get starting age
    const startingAgeInput = document.getElementById('starting-age');
    let startingAge = STARTING_AGE;
    if (startingAgeInput) {
        const inputValue = parseInt(startingAgeInput.value);
        if (!isNaN(inputValue) && inputValue >= 1 && inputValue < MAX_AGE) {
            startingAge = inputValue;
        }
    }

    // Get players (from the registry kept in sync by the group editor's input listeners)
    const playerIdToIndex = {};
    playerOrder.forEach((pid, index) => {
        const p = playerRegistry[pid];
        const name = (p.name || '').trim() || `Player ${index + 1}`;
        GameState.players.push(new Player(name, p.color, index, p.isAI, startingAge));
        playerIdToIndex[pid] = index;
    });

    // Capture team groups and their arguments
    GameState.groups = playerGroups
        .map(g => ({
            id: g.id,
            argument: (groupArguments[g.id] || '').trim(),
            playerIndices: g.playerIds.map(pid => playerIdToIndex[pid]).filter(idx => idx !== undefined)
        }))
        .filter(g => g.playerIndices.length > 0);

    GameState.groups.forEach(g => {
        g.playerIndices.forEach(idx => {
            GameState.players[idx].groupId = g.id;
        });
    });

    // Parse map
    const mapSelect = document.getElementById('map-select').value;
    const mapText = mapSelect === 'custom'
        ? document.getElementById('map-text').value
        : DEFAULT_MAP;

    GameState.board = parseMap(mapText);

    // Initialize display
    document.getElementById('setup-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'flex';
    document.body.classList.add('game-active');

    document.getElementById('entity-info').textContent =
        `Researching: ${GameState.entity.name}`;

    // Setup game controls
    document.getElementById('roll-dice-btn').addEventListener('click', playerRollDice);

    // Initial render
    renderBoard();
    updatePlayerStats();
    updateTheoriesList();
    updateTurnDisplay();

    // Initialize board tooltip
    initBoardTooltip();

    log(`The research on "${GameState.entity.name}" begins!`, 'important');
    log(`${GameState.players.length} researchers compete for scientific glory.`);
}
