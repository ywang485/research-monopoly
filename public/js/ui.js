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
}

function hideModal() {
    document.getElementById('modal').style.display = 'none';
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

        div.innerHTML = `
            <div class="name" style="color: ${player.color}">${player.name}${aiBadge}${activeIndicator}</div>
            <div class="stats">
                <span>Age: <span class="stat-value">${player.age}</span></span>
                <span>Avail: <span class="stat-value">${player.availableYears}y</span></span>
                <span>Fame: <span class="stat-value">${player.availableFame}/${player.totalFame}</span></span>
                <span>Students: <span class="stat-value">${player.students.length}</span></span>
            </div>
        `;
        container.appendChild(div);
    });

    // Update NPC position
    document.getElementById('npc-position').textContent = `Position: ${GameState.board[GameState.npc.position]?.name || 'Start'}`;
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

// ============================================
// SETUP SCREEN
// ============================================

// Helper to create player input HTML
function createPlayerInputHTML(playerNum, name, color, isAI = false) {
    return `
        <input type="text" class="player-name" placeholder="Player ${playerNum} Name" value="${name}">
        <button type="button" class="randomize-name-btn" title="Random Name">🎲</button>
        <input type="color" class="player-color" value="${color}">
        <label class="ai-toggle"><input type="checkbox" class="player-ai"${isAI ? ' checked' : ''}> AI</label>
    `;
}

// Handle randomize button clicks (using event delegation)
function setupRandomizeButtons(container) {
    container.addEventListener('click', (e) => {
        if (e.target.classList.contains('randomize-name-btn')) {
            const playerInput = e.target.closest('.player-input');
            const nameInput = playerInput.querySelector('.player-name');
            const oldName = nameInput.value;

            // Remove old name from used set so it can be reused
            usedNames.delete(oldName);

            // Get new random name
            nameInput.value = getRandomScientistName();
        }
    });
}

function initSetupScreen() {
    const addBtn = document.getElementById('add-player-btn');
    const removeBtn = document.getElementById('remove-player-btn');
    const playerInputs = document.getElementById('player-inputs');
    const mapSelect = document.getElementById('map-select');
    const customMapInput = document.getElementById('custom-map-input');
    const startBtn = document.getElementById('start-game-btn');

    // Reset used names and randomize initial player names
    resetUsedNames();
    const initialColors = ['#3EAAF7', '#3EE5F7', '#3E6FF7', '#3EF7CC'];
    const initialAI = [false, true];

    // Update initial player inputs with random names and randomize buttons
    const existingInputs = playerInputs.querySelectorAll('.player-input');
    existingInputs.forEach((input, index) => {
        const randomName = getRandomScientistName();
        input.innerHTML = createPlayerInputHTML(index + 1, randomName, initialColors[index], initialAI[index]);
    });

    // Setup event delegation for randomize buttons
    setupRandomizeButtons(playerInputs);

    addBtn.addEventListener('click', () => {
        const count = playerInputs.children.length;
        if (count < 4) {
            const colors = ['#e74c3c', '#3498db', '#27ae60', '#9b59b6'];
            const randomName = getRandomScientistName();

            const div = document.createElement('div');
            div.className = 'player-input';
            div.innerHTML = createPlayerInputHTML(count + 1, randomName, colors[count], false);
            playerInputs.appendChild(div);
        }
    });

    removeBtn.addEventListener('click', () => {
        if (playerInputs.children.length > 2) {
            // Remove the name from used set
            const lastInput = playerInputs.lastChild;
            const nameInput = lastInput.querySelector('.player-name');
            if (nameInput) {
                usedNames.delete(nameInput.value);
            }
            playerInputs.removeChild(lastInput);
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
                    });
                });
            } else {
                suggestionsContainer.innerHTML = '<div class="suggestion-error">Failed to generate suggestions</div>';
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

    // Get players
    const playerInputs = document.querySelectorAll('.player-input');
    playerInputs.forEach((input, index) => {
        const name = input.querySelector('.player-name').value || `Player ${index + 1}`;
        const color = input.querySelector('.player-color').value;
        const isAI = input.querySelector('.player-ai')?.checked || false;
        GameState.players.push(new Player(name, color, index, isAI, startingAge));
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
