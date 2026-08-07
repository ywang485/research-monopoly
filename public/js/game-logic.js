// Theory Investment Game - Core Game Logic

// ============================================
// GAME STATE
// ============================================
const GameState = {
    entity: {
        type: '',
        name: ''
    },
    players: [],
    groups: [],
    npc: {
        name: 'Scientific Underdeterminism',
        position: 0
    },
    board: [],
    boardPositions: [], // Stored positions for hover detection
    boardSpaceSize: 60,
    theories: [],
    currentPlayerIndex: 0,
    isNPCTurn: false,
    gameOver: false,
    turnNumber: 1,
    suggestHypothesesForHumans: true, // whether human players see AI-suggested hypotheses
    // LLM state
    llm: {
        available: false,
        provider: null
    },
    // Animation state
    animation: {
        active: false,
        type: null, // 'player' or 'npc'
        entityIndex: null,
        currentPos: 0,
        targetPos: 0,
        progress: 0, // 0-1 for interpolation within a step
        bounceHeight: 0
    },
    // Zoom state
    zoom: {
        level: 1,
        minLevel: 0.5,
        maxLevel: 3,
        step: 0.25,
        panX: 0,
        panY: 0,
        isPanning: false,
        lastMouseX: 0,
        lastMouseY: 0
    }
};

// ============================================
// PLAYER CLASS
// ============================================
class Player {
    constructor(name, color, index, isAI = false, startingAge = null) {
        this.name = name;
        this.color = color;
        this.index = index;
        this.position = 0;
        this.age = startingAge !== null ? startingAge : STARTING_AGE;
        this.totalFame = 0;
        this.spentFame = 0;
        this.students = [];
        this.theoriesPublished = [];
        this.isAlive = true;
        this.isAI = isAI;
        this.groupId = null;
        this.items = { [ITEM_TYPES.LOADED_DICE]: 1 }; // { [itemId]: count } - everyone starts with 1 p-Hacked Results
        this.pendingExtraTurns = 0;
        this.pendingDiceOverride = null;
    }

    get availableFame() {
        return this.totalFame - this.spentFame;
    }

    get availableYears() {
        // Years until death plus student years
        let years = MAX_AGE - this.age;
        this.students.forEach(s => {
            years += STUDENT_TYPES[s.type].years;
        });
        return years;
    }

    addFame(amount) {
        this.totalFame += amount;
        playSound('fame');
        log(`${this.name} gained ${amount} fame points!`, 'important');
    }

    spendFame(amount) {
        if (this.availableFame >= amount) {
            this.spentFame += amount;
            return true;
        }
        return false;
    }

    rejuvenate(years) {
        // Decrease age (but not below starting age)
        const oldAge = this.age;
        this.age = Math.max(STARTING_AGE, this.age - years);
        const actualYears = oldAge - this.age;
        if (actualYears > 0) {
            playSound('rejuvenate');
            log(`${this.name} rejuvenated by ${actualYears} years! Now age ${this.age}.`);
        }
    }

    // studentSelection: optional array of indices into this.students that the player explicitly
    // chose to sacrifice. Omit (or pass null) for automatic cheapest-first selection (used by AI).
    investLife(years, studentSelection = null) {
        let yearsToInvest = years;
        let studentsUsed = [];

        if (studentSelection) {
            // Player's explicit choice - consume exactly these students, regardless of fit
            // (sacrificing an oversized student is allowed, the extra years are just wasted).
            // Remove highest index first so earlier indices stay valid as we splice.
            const indices = [...new Set(studentSelection)].sort((a, b) => b - a);
            indices.forEach(idx => {
                const student = this.students[idx];
                if (student !== undefined) {
                    yearsToInvest -= STUDENT_TYPES[student.type].years;
                    studentsUsed.push(student);
                    this.students.splice(idx, 1);
                }
            });
        } else {
            // No explicit selection - automatic cheapest-first consumption
            const studentOrder = ['undergraduate', 'master', 'phd'];
            for (const type of studentOrder) {
                while (yearsToInvest > 0 && this.students.some(s => s.type === type)) {
                    const studentYears = STUDENT_TYPES[type].years;
                    if (studentYears <= yearsToInvest) {
                        yearsToInvest -= studentYears;
                        const idx = this.students.findIndex(s => s.type === type);
                        const [student] = this.students.splice(idx, 1);
                        studentsUsed.push(student);
                    } else {
                        break;
                    }
                }
            }
        }

        // Remaining years come from own life (increases age)
        if (yearsToInvest > 0) {
            this.age += yearsToInvest;
        }

        // Check for death
        if (this.age >= MAX_AGE) {
            this.die();
        }

        return { studentsUsed, personalYears: Math.max(0, yearsToInvest) };
    }

    die() {
        this.isAlive = false;
        playSound('death');
        log(`${this.name} has passed away at age ${this.age}. Their legacy lives on through ${this.theoriesPublished.length} theories.`, 'important');

        // Show death modal with sarcastic commentary
        const deathMessages = [
            "Should've invested in better health insurance instead of hypotheses.",
            "At least they won't have to peer review any more grant proposals.",
            "Death: the ultimate sabbatical.",
            "Their h-index was never THAT impressive anyway.",
            "Posthumous publications don't count for tenure, unfortunately.",
            "Gone but not cited.",
            "They finally found the one research question they couldn't answer.",
            "Academia claims another victim.",
            "Should've spent less time in the lab and more time exercising.",
            "Their last hypothesis: 'I'll live forever.' Status: Disproven.",
            "The university will replace them with three adjuncts.",
            "At least now they don't have to attend any more faculty meetings.",
            "Their final contribution to science: becoming a cautionary tale.",
            "Too much coffee, not enough sleep, inevitable conclusion."
        ];

        const randomMessage = deathMessages[Math.floor(Math.random() * deathMessages.length)];

        showModal(
            '💀 OBITUARY 💀',
            `
            <p style="font-size: 14px; margin-bottom: 10px;"><strong>${this.name}</strong> has passed away at the ripe old age of <span style="color: #e74c3c;">${this.age}</span>.</p>
            <p style="color: #888; font-style: italic; margin-bottom: 12px;">${randomMessage}</p>
            <div style="border-top: 1px solid #ccc; padding-top: 10px; margin-top: 10px;">
                <p style="font-size: 10px;">Final Stats:</p>
                <p style="font-size: 10px;">📊 Total Fame: <span style="color: #e74c3c;">${this.totalFame}</span></p>
                <p style="font-size: 10px;">📚 Theories Published: <span style="color: #e74c3c;">${this.theoriesPublished.length}</span></p>
                <p style="font-size: 10px;">🎓 Students Exploited: <span style="color: #e74c3c;">${this.students.length}</span></p>
            </div>
            <p style="font-size: 9px; color: #666; margin-top: 12px;">The game continues without them.</p>
            `,
            [
                {
                    text: 'RIP',
                    action: () => { }
                }
            ]
        );
    }

    hireStudent(type) {
        const cost = STUDENT_TYPES[type].cost;
        if (this.spendFame(cost)) {
            const name = generateStudentName();
            this.students.push({ type, name });
            playSound('hire');
            log(`${this.name} hired ${name} as a ${STUDENT_TYPES[type].name} for ${cost} fame.`);
            return true;
        }
        return false;
    }
}

// ============================================
// ANIMATION SYSTEM
// ============================================
let animationFrameId = null;
let lastAnimationTime = 0;

function animateMovement(type, entityIndex, startPos, steps, onComplete) {
    const boardLength = GameState.board.length;
    const targetPos = (startPos + steps) % boardLength;

    GameState.animation = {
        active: true,
        type: type,
        entityIndex: entityIndex,
        startPos: startPos,
        currentPos: startPos,
        targetPos: targetPos,
        totalSteps: steps,
        currentStep: 0,
        progress: 0,
        bounceHeight: 0,
        onComplete: onComplete
    };

    lastAnimationTime = performance.now();
    runAnimationFrame();
}

function runAnimationFrame() {
    const now = performance.now();
    const deltaTime = now - lastAnimationTime;
    lastAnimationTime = now;

    const anim = GameState.animation;
    if (!anim.active) return;

    // Update progress within current step
    anim.progress += deltaTime / ANIMATION_STEP_DURATION;

    // Handle completing one or more steps (in case of lag/tab switch)
    while (anim.progress >= 1 && anim.currentStep < anim.totalSteps) {
        // Complete current step
        anim.progress -= 1;
        anim.currentStep++;
        anim.currentPos = (anim.startPos + anim.currentStep) % GameState.board.length;

        // Play hop sound effect
        if (anim.type === 'npc') {
            playSound('npcMove');
        } else {
            playSound('hop');
        }

        // Center viewport on the moving entity (when zoomed in)
        if (typeof centerViewportOnSpace === 'function') {
            centerViewportOnSpace(anim.currentPos);
        }
    }

    // Check if animation is complete
    if (anim.currentStep >= anim.totalSteps) {
        // Animation complete
        anim.active = false;

        // Update actual position
        if (anim.type === 'player') {
            GameState.players[anim.entityIndex].position = anim.targetPos;
        } else if (anim.type === 'npc') {
            GameState.npc.position = anim.targetPos;
        }

        renderBoard();

        if (anim.onComplete) {
            anim.onComplete();
        }
        return;
    }

    // Calculate bounce height using sine wave
    anim.bounceHeight = Math.sin(anim.progress * Math.PI) * ANIMATION_BOUNCE_HEIGHT;

    renderBoard();
    animationFrameId = requestAnimationFrame(runAnimationFrame);
}

function getAnimatedPosition(type, entityIndex, positions, spaceSize) {
    const anim = GameState.animation;

    if (!anim.active) return null;

    const isAnimating = (type === 'player' && anim.type === 'player' && anim.entityIndex === entityIndex) ||
                        (type === 'npc' && anim.type === 'npc');

    if (!isAnimating) return null;

    const currentSpacePos = positions[anim.currentPos];
    const nextPos = (anim.currentPos + 1) % GameState.board.length;
    const nextSpacePos = positions[nextPos];

    if (!currentSpacePos || !nextSpacePos) return null;

    // Interpolate between current and next position
    const t = easeInOutQuad(anim.progress);
    const x = currentSpacePos.x + (nextSpacePos.x - currentSpacePos.x) * t;
    const y = currentSpacePos.y + (nextSpacePos.y - currentSpacePos.y) * t - anim.bounceHeight;

    return { x, y };
}

// ============================================
// SPACE HANDLING
// ============================================
function handleStartSpace(player) {
    const you = player.isAI ? player.name : 'You';
    const your = player.isAI ? `${player.name}'s` : 'your';

    player.addFame(2);
    showModal(
        'New Academic Year',
        `<p>Congratulations! ${you}'ve survived another trip around the sun without quitting academia.</p>
        <p><span style="color: #e74c3c;">+2 fame</span> for ${your} unrelenting stubbornness</p>
        <p class="info-text">${your} family still doesn't understand what ${you} do for a living.</p>`,
        [{ text: 'Yay...', action: () => { updatePlayerStats(); endTurn(); } }]
    );
}

function handleConferenceSpace(player) {
    const you = player.isAI ? player.name : 'You';
    const you_lower = player.isAI ? player.name : 'you';
    const your = player.isAI ? `${player.name}'s` : 'your';

    // Check if player has any publications
    if (player.theoriesPublished.length === 0) {
        // Small fame gain for just attending
        const smallFameGain = 1;
        player.addFame(smallFameGain);

        showModal(
            'Academic Conference',
            `
            <div class="dice-container">
                <span class="dice">🎲</span>
                <div class="dice-result"><span style="color: #e74c3c;">+${smallFameGain} Fame</span></div>
            </div>
            <p>${you} showed up to the conference, but realized ${you_lower} have nothing to present.</p>
            <p>Awkwardly attended other people's talks and ate free cookies instead.</p>
            <p class="info-text">At least someone remembered ${your} name tag!</p>
            `,
            [{ text: 'Oops', action: () => { updatePlayerStats(); endTurn(); } }]
        );
        return;
    }

    // Randomly select one of player's published hypotheses
    const randomIndex = Math.floor(Math.random() * player.theoriesPublished.length);
    const selectedHypothesis = player.theoriesPublished[randomIndex];

    const fameGain = rollDice() + 2;
    player.addFame(fameGain);

    showModal(
        'Academic Conference',
        `
        <div class="dice-container">
            <span class="dice">🎲</span>
            <div class="dice-result"><span style="color: #e74c3c;">+${fameGain} Fame!</span></div>
        </div>
        <p>${you} traveled across the country to present ${your} groundbreaking work on <strong>"${selectedHypothesis}"</strong> in a windowless room to 6 people (3 were asleep).</p>
        <p class="info-text">At least the hotel breakfast was mediocre!</p>
        `,
        [{ text: 'Worth it?', action: () => { updatePlayerStats(); endTurn(); } }]
    );
}

function handleSabbaticalSpace(player) {
    const you = player.isAI ? player.name : 'You';
    const you_lower = player.isAI ? player.name : 'you';

    player.rejuvenate(2);

    showModal(
        'Sabbatical Leave',
        `
        <p>${you} escaped to "write a book" (really just avoided emails for 6 months).</p>
        <p><span style="color: #e74c3c;">-2 years</span> of aging from not attending meetings!</p>
        <p class="info-text">${you}'ll definitely finish that book chapter... eventually.</p>
        `,
        [{ text: 'Bliss', action: () => { updatePlayerStats(); endTurn(); } }]
    );
}

function handleGrantSpace(player) {
    const you = player.isAI ? player.name : 'you';
    const your = player.isAI ? `${player.name}'s` : 'your';

    player.addFame(2);

    showModal(
        'Research Grant!',
        `
        <div class="dice-container">
            <span class="dice">💰</span>
            <div class="dice-result"><span style="color: #e74c3c;">+2 Fame!</span></div>
        </div>
        <p>After only 47 revisions and 3 panel reviews, they actually gave ${you} money!</p>
        <p><span style="color: #e74c3c;">+2 fame</span> (mostly from other academics jealous of ${your} funding)</p>
        <p class="info-text">Now if only the grant actually covered ${your} students' stipends...</p>
        `,
        [{ text: 'Finally!', action: () => { updatePlayerStats(); endTurn(); } }]
    );
}

// Applies a scandal-style fame loss to `target`, honoring Tenure (Scandal Immunity) if they
// own one. Returns { blocked, fameLoss } so callers can tailor their own flavor text.
function applyScandal(target, amount) {
    if (target.items[ITEM_TYPES.SCANDAL_IMMUNITY] > 0) {
        target.items[ITEM_TYPES.SCANDAL_IMMUNITY]--;
        log(`${target.name}'s Tenure absorbed a scandal that would've hit their fame!`, 'important');
        return { blocked: true, fameLoss: 0 };
    }

    const fameLoss = Math.min(target.totalFame, amount);
    target.totalFame -= fameLoss;
    target.spentFame = Math.min(target.spentFame, target.totalFame);
    return { blocked: false, fameLoss };
}

function handleScandalSpace(player) {
    const you = player.isAI ? player.name : 'you';
    const your = player.isAI ? `${player.name}'s` : 'your';

    playSound('scandal');
    const { blocked, fameLoss } = applyScandal(player, rollDice() + 1);

    showModal(
        'Academic Scandal!',
        blocked
            ? `
            <p style="color: #a86060;">Someone actually read ${your} paper and found... issues.</p>
            <p><span style="color: #2ecc71;">Tenure saves the day!</span> The allegations quietly disappear.</p>
            <p class="info-text">Being unfireable has its perks.</p>
            `
            : `
            <p style="color: #a86060;">Someone actually read ${your} paper and found... issues.</p>
            <p><span style="color: #e74c3c;">-${fameLoss} fame</span> from the Twitter mob and anonymous blog posts</p>
            <p class="info-text">Maybe ${you} should have checked those p-values more carefully...</p>
            `,
        [{ text: 'Oops', action: () => { updatePlayerStats(); endTurn(); } }]
    );
}

const COLLABORATION_BONUS_PERCENT = 0.2;

function handleCollaborationSpace(player) {
    const you = player.isAI ? player.name : 'You';
    const you_lower = player.isAI ? player.name : 'you';

    const otherPlayers = GameState.players.filter(p => p.isAlive && p.index !== player.index);

    if (otherPlayers.length === 0) {
        showModal(
            'Research Collaboration',
            `<p>${you} wanted to collaborate but everyone else is dead or has better things to do.</p>
            <p class="info-text">Solo authorship it is!</p>`,
            [{ text: 'Forever alone', action: () => endTurn() }]
        );
        return;
    }

    if (player.isAI) {
        // AI just grabs whoever's nearby - no strategic pondering
        const collaborator = otherPlayers[Math.floor(Math.random() * otherPlayers.length)];
        resolveCollaboration(player, collaborator);
        return;
    }

    // Human player picks who to collaborate with
    showModal(
        'Research Collaboration',
        `
        <p>${you} bump into a colleague at the coffee machine. Who does ${you_lower} rope into co-authorship?</p>
        <div class="collaborator-choices">
            ${otherPlayers.map(p => `
                <button type="button" class="sketch-btn collaborator-choice-btn" data-player-index="${p.index}" style="border-color: ${p.color}; color: ${p.color};">${p.name}</button>
            `).join('')}
        </div>
        `,
        []
    );

    document.querySelectorAll('.collaborator-choice-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            hideModal();
            const collaborator = GameState.players[Number(btn.dataset.playerIndex)];
            resolveCollaboration(player, collaborator);
        });
    });
}

// Whichever of the two has less fame gets a bonus (no cost to the other) worth
// COLLABORATION_BONUS_PERCENT of the more-famous collaborator's fame
function resolveCollaboration(player, collaborator) {
    let lower = null;
    let higher = null;
    if (player.totalFame < collaborator.totalFame) {
        lower = player;
        higher = collaborator;
    } else if (collaborator.totalFame < player.totalFame) {
        lower = collaborator;
        higher = player;
    }

    let resultHtml = `<p>${player.name} and <span style="color: ${collaborator.color};">${collaborator.name}</span> are now co-authors!</p>`;

    if (lower) {
        const bonus = Math.floor(higher.totalFame * COLLABORATION_BONUS_PERCENT);
        if (bonus > 0) {
            lower.addFame(bonus);
            resultHtml += `
                <p><span style="color: ${lower.color};">${lower.name}</span> rides on <span style="color: ${higher.color};">${higher.name}</span>'s coattails, gaining <span style="color: #e74c3c;">+${bonus} fame</span> (${Math.round(COLLABORATION_BONUS_PERCENT * 100)}% of ${higher.name}'s reputation).</p>
            `;
        } else {
            resultHtml += `<p>Neither of them has any reputation worth borrowing yet.</p>`;
        }
    } else {
        resultHtml += `<p>Equally (un)known, neither gains anything from the association.</p>`;
    }

    resultHtml += `<p class="info-text">May the most passive-aggressive email win the authorship order debate.</p>`;

    showModal(
        'Research Collaboration',
        resultHtml,
        [{ text: 'Awkward', action: () => { updatePlayerStats(); endTurn(); } }]
    );
}

// ============================================
// RESEARCH INSTITUTION (item shop) & INVENTORY
// ============================================
function renderInstitutionShop(player) {
    const itemRows = Object.entries(ITEMS).map(([id, item]) => {
        const owned = player.items[id] || 0;
        const affordable = player.availableFame >= item.cost;
        return `
            <div class="shop-item-row">
                <div class="shop-item-info">
                    <span class="shop-item-icon">${item.icon}</span>
                    <div>
                        <div class="shop-item-name">${item.name} <span class="shop-item-cost">(${item.cost} fame)</span>${owned > 0 ? ` <span class="shop-item-owned">owned ×${owned}</span>` : ''}</div>
                        <div class="shop-item-desc">${item.description}</div>
                    </div>
                </div>
                <button type="button" class="sketch-btn shop-buy-btn" data-item-id="${id}"${affordable ? '' : ' disabled'}>Buy</button>
            </div>`;
    }).join('');

    showModal(
        'Research Institution',
        `
        <p>Welcome to the Research Institution. Fame buys favors here.</p>
        <p class="info-text">Available fame: <span style="color: #e74c3c;">${player.availableFame}</span></p>
        <div class="shop-items">${itemRows}</div>
        `,
        [{ text: 'Leave', action: () => { updatePlayerStats(); updateItemButton(); endTurn(); } }]
    );

    document.querySelectorAll('.shop-buy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const itemId = btn.dataset.itemId;
            const item = ITEMS[itemId];
            if (player.spendFame(item.cost)) {
                player.items[itemId] = (player.items[itemId] || 0) + 1;
                log(`${player.name} bought ${item.name}.`);
                renderInstitutionShop(player); // re-render so fame/owned counts stay live
            }
        });
    });
}

function handleInstitutionSpace(player) {
    if (player.isAI) {
        // Costliest/most-impactful item first, matching makeAIDecision's recruit-space pattern
        const priority = [
            { id: ITEM_TYPES.EXTRA_TURN, threshold: 0.6 },
            { id: ITEM_TYPES.INITIATE_SCANDAL, threshold: 0.5 },
            { id: ITEM_TYPES.LOADED_DICE, threshold: 0.45 },
            { id: ITEM_TYPES.SCANDAL_IMMUNITY, threshold: 0.4 }
        ];

        let bought = null;
        for (const { id, threshold } of priority) {
            const item = ITEMS[id];
            if (player.availableFame >= item.cost && Math.random() > threshold) {
                if (player.spendFame(item.cost)) {
                    player.items[id] = (player.items[id] || 0) + 1;
                    bought = item;
                    break;
                }
            }
        }

        if (bought) {
            log(`${player.name} browsed the Research Institution and bought ${bought.name}.`, 'important');
            updatePlayerStats();
            setTimeout(() => endTurn(), 500);
        } else {
            log(`${player.name} browsed the Research Institution but decided not to buy anything.`);
            setTimeout(() => endTurn(), 300);
        }
        return;
    }

    renderInstitutionShop(player);
}

function openInventoryModal(player) {
    const ownedEntries = Object.entries(ITEMS).filter(([id]) => (player.items[id] || 0) > 0);

    if (ownedEntries.length === 0) {
        showModal('Inventory', '<p>Nothing in the bag yet. Visit a Research Institution to stock up.</p>', [{ text: 'Close', action: () => {} }]);
        return;
    }

    const rows = ownedEntries.map(([id, item]) => {
        const owned = player.items[id];
        const isPassive = id === ITEM_TYPES.SCANDAL_IMMUNITY;
        return `
            <div class="shop-item-row">
                <div class="shop-item-info">
                    <span class="shop-item-icon">${item.icon}</span>
                    <div>
                        <div class="shop-item-name">${item.name} <span class="shop-item-owned">×${owned}</span></div>
                        <div class="shop-item-desc">${isPassive ? 'Passive - active protection, triggers automatically.' : item.description}</div>
                    </div>
                </div>
                ${isPassive ? '' : `<button type="button" class="sketch-btn inventory-use-btn" data-item-id="${id}">Use</button>`}
            </div>`;
    }).join('');

    showModal('Inventory', `<div class="shop-items">${rows}</div>`, [{ text: 'Close', action: () => {} }]);

    document.querySelectorAll('.inventory-use-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const itemId = btn.dataset.itemId;
            hideModal();
            if (itemId === ITEM_TYPES.LOADED_DICE) useLoadedDiceItem(player);
            else if (itemId === ITEM_TYPES.EXTRA_TURN) useExtraTurnItem(player);
            else if (itemId === ITEM_TYPES.INITIATE_SCANDAL) useInitiateScandalItem(player);
        });
    });
}

function useLoadedDiceItem(player) {
    const numberButtons = [1, 2, 3, 4, 5, 6].map(n =>
        `<button type="button" class="sketch-btn dice-pick-btn" data-value="${n}">${n}</button>`
    ).join('');

    showModal(
        'p-Hacked Results',
        `<p>Pick the value you want on your next roll.</p><div class="dice-pick-choices">${numberButtons}</div>`,
        []
    );

    document.querySelectorAll('.dice-pick-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const value = Number(btn.dataset.value);
            player.items[ITEM_TYPES.LOADED_DICE]--;
            player.pendingDiceOverride = value;
            log(`${player.name} p-hacked their results - next roll will be a ${value}.`, 'important');
            hideModal();
            updateItemButton();
        });
    });
}

function useExtraTurnItem(player) {
    player.items[ITEM_TYPES.EXTRA_TURN]--;
    player.pendingExtraTurns++;
    log(`${player.name} used All-Nighter - they'll roll again after this turn.`, 'important');
    updateItemButton();

    showModal(
        'All-Nighter',
        `<p>${player.name} chugs an energy drink and gears up for another roll.</p>`,
        [{ text: 'Buzzing', action: () => {} }]
    );
}

function useInitiateScandalItem(player) {
    const otherPlayers = GameState.players.filter(p => p.isAlive && p.index !== player.index);

    if (otherPlayers.length === 0) {
        showModal('Reviewer #2', "<p>There's nobody left to subject to peer review.</p>", [{ text: 'Shucks', action: () => {} }]);
        return;
    }

    showModal(
        'Reviewer #2',
        `
        <p>Who's getting the Reviewer #2 treatment?</p>
        <div class="collaborator-choices">
            ${otherPlayers.map(p => `<button type="button" class="sketch-btn scandal-target-btn" data-player-index="${p.index}" style="border-color: ${p.color}; color: ${p.color};">${p.name}</button>`).join('')}
        </div>
        `,
        []
    );

    document.querySelectorAll('.scandal-target-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = GameState.players[Number(btn.dataset.playerIndex)];
            player.items[ITEM_TYPES.INITIATE_SCANDAL]--;
            const { blocked, fameLoss } = applyScandal(target, rollDice() + 3);
            log(`${player.name} sicced Reviewer #2 on ${target.name}.`, 'important');

            showModal(
                'Reviewer #2',
                blocked
                    ? `<p><span style="color: ${target.color};">${target.name}</span>'s Tenure protects them - Reviewer #2's rage bounces right off.</p>`
                    : `<p><span style="color: ${target.color};">${target.name}</span> loses <span style="color: #e74c3c;">${fameLoss} fame</span> after a scathing "reject" verdict.</p>`,
                [{ text: 'Sent', action: () => { updatePlayerStats(); updateItemButton(); } }]
            );
        });
    });
}

// AI probabilistically uses banked items right before their turn passes to the next player
function maybeUseAIItems(player) {
    if (player.items[ITEM_TYPES.INITIATE_SCANDAL] > 0 && Math.random() > 0.5) {
        const target = GameState.players
            .filter(p => p.isAlive && p.index !== player.index)
            .sort((a, b) => b.totalFame - a.totalFame)[0];
        if (target) {
            player.items[ITEM_TYPES.INITIATE_SCANDAL]--;
            const { blocked, fameLoss } = applyScandal(target, rollDice() + 3);
            log(blocked
                ? `${player.name} sicced Reviewer #2 on ${target.name}, but Tenure protected them.`
                : `${player.name} sicced Reviewer #2 on ${target.name}, who lost ${fameLoss} fame.`, 'important');
        }
    }

    if (player.items[ITEM_TYPES.EXTRA_TURN] > 0 && Math.random() > 0.4) {
        player.items[ITEM_TYPES.EXTRA_TURN]--;
        player.pendingExtraTurns++;
        log(`${player.name} pulled an All-Nighter and will go again.`, 'important');
    }

    updatePlayerStats();
}

async function handleEurekaSpace(player) {
    const you = player.isAI ? player.name : 'You';
    const you_lower = player.isAI ? player.name : 'you';
    const your = player.isAI ? `${player.name}'s` : 'your';

    playSound('eureka');

    // Find the closest uninvested hypothesis space
    const boardSize = GameState.board.length;
    let closestSpace = null;
    let closestDistance = boardSize;

    for (let i = 1; i < boardSize; i++) {
        const checkIndex = (player.position + i) % boardSize;
        const space = GameState.board[checkIndex];

        if (space.type === SPACE_TYPES.HYPOTHESIS && !space.hypothesis) {
            closestSpace = space;
            closestDistance = i;
            break;
        }
    }

    if (!closestSpace) {
        // No uninvested hypothesis spaces available
        showModal(
            'EUREKA! 💡',
            `
            <p style="color: #c8b070; font-size: 12px;">It came to ${you_lower} in the shower!</p>
            <p>${you} had a brilliant idea about ${GameState.entity.name}!</p>
            <p class="info-text">But... every hypothesis space is already claimed. ${your} genius goes to waste.</p>
            <p style="color: #888; font-size: 18px;">Should've thought of this sooner!</p>
            `,
            [{ text: 'Tragic', action: () => { updatePlayerStats(); endTurn(); } }]
        );
        return;
    }

    // Show modal to claim the closest hypothesis for free
    showModal(
        'EUREKA! 💡',
        `
        <p style="color: #c8b070; font-size: 12px;">It came to ${you_lower} in the shower!</p>
        <p>A brilliant insight about <strong>${GameState.entity.name}</strong> just hit ${you_lower}!</p>
        <p>${you} can claim the next available research question (<strong>"${closestSpace.name}"</strong>) <span style="color: #2ecc71;">FOR FREE</span>!</p>
        ${GameState.suggestHypothesesForHumans ? `
        <div class="suggestions-container">
            <label>AI-generated hypotheses (because originality is hard):</label>
            <div id="hypothesis-suggestions" class="hypothesis-suggestions">
                <div class="suggestion-loading">Generating suggestions...</div>
            </div>
        </div>
        ` : ''}
        <div class="input-group">
            <label>Or formulate ${your} eureka moment:</label>
            <textarea id="hypothesis-input" rows="3" placeholder="Enter ${your} hypothesis about ${GameState.entity.name}..."></textarea>
        </div>
        <p class="info-text">Normal cost: <span style="color: #e74c3c;">${closestSpace.investmentCost} years</span>. Eureka cost: <span style="color: #2ecc71;">FREE!</span></p>
        `,
        [
            {
                text: 'Claim it!',
                disabled: true,
                action: () => {
                    const hypothesis = document.getElementById('hypothesis-input').value.trim();
                    if (hypothesis) {
                        closestSpace.hypothesis = hypothesis;
                        closestSpace.contributions.push({ text: hypothesis, author: player.name, playerIndex: player.index });
                        closestSpace.investments.push({ player: player.name, years: closestSpace.investmentCost, playerIndex: player.index });
                        log(`${player.name} had a EUREKA moment and claimed "${closestSpace.name}" with: "${hypothesis}" (FREE!)`, 'important');

                        // Delay rendering until after modal closes for proper visual update
                        setTimeout(() => {
                            renderBoard();
                            updatePlayerStats();
                            checkGameEnd();
                            if (!GameState.gameOver) endTurn();
                        }, 0);
                    }
                },
                closeModal: true
            },
            {
                text: 'Skip',
                action: () => endTurn()
            }
        ]
    );

    // Enable/disable "Claim it!" button based on hypothesis input
    const hypothesisInput = document.getElementById('hypothesis-input');
    const claimButton = document.querySelector('#modal-buttons button');
    hypothesisInput.addEventListener('input', () => {
        claimButton.disabled = !hypothesisInput.value.trim();
    });

    // Fetch suggestions asynchronously and update the modal (if enabled)
    if (!GameState.suggestHypothesesForHumans) return;
    const suggestions = await fetchHypothesisSuggestions(3, player);

    if (suggestions && suggestions.length > 0) {

        const suggestionsHtml = suggestions.map(s =>
            `<div class="suggestion-btn" data-suggestion="${s.replace(/"/g, '&quot;')}">${s}</div>`
        ).join('');

        const suggestionsContainer = document.getElementById('hypothesis-suggestions');
        if (suggestionsContainer) {
            suggestionsContainer.innerHTML = suggestionsHtml;

            // Add click handlers for suggestions
            suggestionsContainer.querySelectorAll('.suggestion-btn').forEach((btn, i) => {
                btn.addEventListener('click', () => {
                    document.getElementById('hypothesis-input').value = suggestions[i];
                    // Enable the claim button since a suggestion was selected
                    document.querySelector('#modal-buttons button').disabled = false;
                    // Highlight the selected suggestion
                    suggestionsContainer.querySelectorAll('.suggestion-btn').forEach(b => b.classList.remove('selected'));
                    btn.classList.add('selected');
                });
            });
        }
    }
}

function handleSpaceLanding(player, space) {
    playSound('land');
    log(`${player.name} landed on "${space.name}" (${space.type})`);

    switch (space.type) {
        case SPACE_TYPES.START:
            handleStartSpace(player);
            break;
        case SPACE_TYPES.HYPOTHESIS:
            handleHypothesisSpace(player, space);
            break;
        case SPACE_TYPES.RECRUIT:
            handleRecruitSpace(player);
            break;
        case SPACE_TYPES.CONFERENCE:
            handleConferenceSpace(player);
            break;
        case SPACE_TYPES.SABBATICAL:
            handleSabbaticalSpace(player);
            break;
        case SPACE_TYPES.COMMUNITY_SERVICE:
            handleCommunityServiceSpace(player);
            break;
        case SPACE_TYPES.GRANT:
            handleGrantSpace(player);
            break;
        case SPACE_TYPES.SCANDAL:
            handleScandalSpace(player);
            break;
        case SPACE_TYPES.COLLABORATION:
            handleCollaborationSpace(player);
            break;
        case SPACE_TYPES.EUREKA:
            handleEurekaSpace(player);
            break;
        case SPACE_TYPES.INSTITUTION:
            handleInstitutionSpace(player);
            break;
        default:
            endTurn();
    }
}

// Renders a checkbox per owned student so the player can choose which ones to
// sacrifice toward an investment's cost, instead of always spending cheapest-first.
function renderStudentSelectionHTML(player) {
    if (player.students.length === 0) return '';

    const rows = player.students.map((student, idx) => `
        <label class="student-select-row">
            <input type="checkbox" class="student-select-checkbox" data-index="${idx}" data-years="${STUDENT_TYPES[student.type].years}">
            ${student.name} <span class="student-select-years">(${STUDENT_TYPES[student.type].name}, ${STUDENT_TYPES[student.type].years}y)</span>
        </label>
    `).join('');

    return `
        <div class="input-group student-select-group">
            <label>Sacrifice students to cover the cost (optional):</label>
            <div class="student-select-list">${rows}</div>
            <p class="info-text">Personal years needed: <span class="personal-years-remaining">-</span></p>
        </div>
    `;
}

// Keeps the "Personal years needed" readout in sync as checkboxes (or the cost itself) change.
// Returns the update function so callers can also hook it up to a cost input, or null if
// there's nothing to wire (player has no students).
function wireStudentSelectionLiveUpdate(getCost) {
    const checkboxes = document.querySelectorAll('.student-select-checkbox');
    const summaryEl = document.querySelector('.personal-years-remaining');
    if (checkboxes.length === 0 || !summaryEl) return null;

    const update = () => {
        const selectedYears = Array.from(checkboxes)
            .filter(cb => cb.checked)
            .reduce((sum, cb) => sum + Number(cb.dataset.years), 0);
        summaryEl.textContent = Math.max(0, getCost() - selectedYears);
    };
    checkboxes.forEach(cb => cb.addEventListener('change', update));
    update();
    return update;
}

function getSelectedStudentIndices() {
    return Array.from(document.querySelectorAll('.student-select-checkbox:checked')).map(cb => Number(cb.dataset.index));
}

async function handleHypothesisSpace(player, space) {
    // Pronoun helpers for AI vs human players
    const you = player.isAI ? player.name : 'You';
    const you_lower = player.isAI ? player.name : 'you';
    const your = player.isAI ? `${player.name}'s` : 'your';
    const your_lower = player.isAI ? `${player.name}'s` : 'your';

    if (!space.hypothesis) {
        // First player to land here - can create hypothesis
        const availableYears = player.availableYears;
        const canAfford = availableYears >= space.investmentCost;

        // Show initial modal with loading state for suggestions (only if player can afford)
        showModal(
            'New Research Opportunity!',
            `
            <p>Nobody's wasted their life on this question about <strong>${GameState.entity.name}</strong> yet!</p>
            <p>Invest <span style="color: #e74c3c;">${space.investmentCost} years</span> to claim this territory before someone else does.</p>
            ${renderStudentSelectionHTML(player)}
            ${canAfford && GameState.suggestHypothesesForHumans ? `
            <div class="suggestions-container">
                <label>AI-generated hypotheses (because originality is hard):</label>
                <div id="hypothesis-suggestions" class="hypothesis-suggestions">
                    <div class="suggestion-loading">Generating suggestions...</div>
                </div>
            </div>
            ` : ''}
            <div class="input-group">
                <label>Or pretend to have original thoughts:</label>
                <textarea id="hypothesis-input" rows="3" placeholder="Enter your hypothesis about ${GameState.entity.name}..."></textarea>
            </div>
            <p class="info-text">Life years remaining: <span style="color: #e74c3c;">${availableYears}</span></p>
            ${!canAfford ? `<p style="color: #a86060;">${you}'ll likely die before ${you_lower} come up with anything</p>` : ''}
            `,
            [
                {
                    text: 'Invest',
                    disabled: true,
                    action: () => {
                        const hypothesis = document.getElementById('hypothesis-input').value.trim();
                        if (hypothesis && availableYears >= space.investmentCost) {
                            space.hypothesis = hypothesis;
                            space.contributions.push({ text: hypothesis, author: player.name, playerIndex: player.index });
                            space.investments.push({ player: player.name, years: space.investmentCost, playerIndex: player.index });
                            player.investLife(space.investmentCost, getSelectedStudentIndices());
                            log(`${player.name} proposed: "${hypothesis}" and invested ${space.investmentCost} years.`, 'important');
                            renderBoard();
                            updatePlayerStats();
                            checkGameEnd();
                            if (!GameState.gameOver) endTurn();
                        }
                    }
                },
                {
                    text: 'Skip',
                    action: () => endTurn()
                }
            ]
        );

        // Enable/disable "Invest" button based on hypothesis input and affordability
        const hypothesisInput = document.getElementById('hypothesis-input');
        const investButton = document.querySelector('#modal-buttons button');
        hypothesisInput.addEventListener('input', () => {
            investButton.disabled = !hypothesisInput.value.trim() || !canAfford;
        });

        wireStudentSelectionLiveUpdate(() => space.investmentCost);

        // Fetch suggestions asynchronously and update the modal (only if player can afford and it's enabled)
        if (canAfford && GameState.suggestHypothesesForHumans) {
            const suggestions = await fetchHypothesisSuggestions(3, player);
            const suggestionsContainer = document.getElementById('hypothesis-suggestions');
            if (suggestionsContainer) {
                suggestionsContainer.innerHTML = suggestions.map((s, i) =>
                    `<button class="suggestion-btn" data-suggestion="${i}">${s}</button>`
                ).join('');

                // Add click handlers to suggestion buttons
                suggestionsContainer.querySelectorAll('.suggestion-btn').forEach((btn, i) => {
                    btn.addEventListener('click', () => {
                        document.getElementById('hypothesis-input').value = suggestions[i];
                        // Enable the invest button since a suggestion was selected
                        document.querySelector('#modal-buttons button').disabled = false;
                        // Highlight the selected suggestion
                        suggestionsContainer.querySelectorAll('.suggestion-btn').forEach(b => b.classList.remove('selected'));
                        btn.classList.add('selected');
                    });
                });
            }
        }
    } else if (!space.isProven) {
        // Hypothesis exists - can invest more or add to description
        const availableYears = player.availableYears;
        const currentInvestment = space.investments.reduce((sum, inv) => sum + inv.years, 0);

        let investmentsHTML = '<div class="investment-display">';
        space.investments.forEach(inv => {
            investmentsHTML += `<div class="investor"><span>${inv.player}</span><span style="color: #e74c3c;">${inv.years} years</span></div>`;
        });
        investmentsHTML += '</div>';

        showModal(
            'Active Hypothesis',
            `
            <p><strong>Current Hypothesis:</strong> "${space.hypothesis}"</p>
            <p>People who've already sacrificed years of their life:</p>
            ${investmentsHTML}
            <div class="input-group" style="margin-top: 10px;">
                <label>Add unnecessary complexity (optional):</label>
                <input type="text" id="hypothesis-addition" placeholder="Make it sound more academic...">
            </div>
            <div class="input-group" style="margin-top: 10px;">
                <label>How many years to waste on this?</label>
                <input type="number" id="investment-years" min="1" max="${availableYears}" value="1" placeholder="Years to invest">
            </div>
            ${renderStudentSelectionHTML(player)}
            <p class="info-text">Life years remaining: <span style="color: #e74c3c;">${availableYears}</span></p>
            ${availableYears < 1 ? `<p style="color: #a86060;">${you} literally can't afford any investment.</p>` : ''}
            `,
            [
                {
                    text: 'Invest',
                    disabled: availableYears < 1,
                    action: () => {
                        const yearsToInvest = parseInt(document.getElementById('investment-years').value) || 0;

                        if (yearsToInvest <= 0) {
                            showModal('Invalid Investment', `<p>${you} need to invest at least 1 year!</p>`,
                                [{ text: 'Oops', action: () => handleHypothesisSpace(player, space) }]);
                            return;
                        }

                        if (availableYears >= yearsToInvest) {
                            // Check if player added to the hypothesis
                            const addition = document.getElementById('hypothesis-addition').value.trim();
                            if (addition) {
                                space.hypothesis = space.hypothesis + ' ' + addition;
                                space.contributions.push({ text: addition, author: player.name, playerIndex: player.index });
                                log(`${player.name} expanded the hypothesis: "${addition}"`, 'important');
                            }

                            const existingInv = space.investments.find(i => i.playerIndex === player.index);
                            if (existingInv) {
                                existingInv.years += yearsToInvest;
                            } else {
                                space.investments.push({ player: player.name, years: yearsToInvest, playerIndex: player.index });
                            }
                            player.investLife(yearsToInvest, getSelectedStudentIndices());
                            log(`${player.name} invested ${yearsToInvest} years in the hypothesis.`);
                            renderBoard();
                            updatePlayerStats();
                            checkGameEnd();
                            if (!GameState.gameOver) endTurn();
                        } else {
                            showModal('Insufficient Life', `<p>${you} don't have ${yearsToInvest} years to spare!</p>`,
                                [{ text: 'Damn', action: () => handleHypothesisSpace(player, space) }]);
                        }
                    }
                },
                {
                    text: 'Pass',
                    action: () => endTurn()
                }
            ]
        );

        const investmentYearsInput = document.getElementById('investment-years');
        const updateStudentSummary = wireStudentSelectionLiveUpdate(() => parseInt(investmentYearsInput.value) || 0);
        if (updateStudentSummary) {
            investmentYearsInput.addEventListener('input', updateStudentSummary);
        }
    } else {
        // Already proven - check if player is the leading investor

        // Find who invested the most (sum up all investments per player)
        const playerInvestments = {};
        space.investments.forEach(inv => {
            if (!playerInvestments[inv.playerIndex]) {
                playerInvestments[inv.playerIndex] = 0;
            }
            playerInvestments[inv.playerIndex] += inv.years;
        });

        // Find the player with maximum total investment
        let maxPlayerIndex = null;
        let maxYears = 0;
        Object.keys(playerInvestments).forEach(playerIndexStr => {
            const playerIndex = parseInt(playerIndexStr);
            const totalYears = playerInvestments[playerIndex];
            if (totalYears > maxYears) {
                maxYears = totalYears;
                maxPlayerIndex = playerIndex;
            }
        });

        // Check if current player is the leading investor
        const isLeadingInvestor = (maxPlayerIndex === player.index);

        if (isLeadingInvestor) {
            // Player is the leading investor - no literature survey needed!
            showModal(
                `${your} Own Theory! 😎`,
                `
                <p><strong>Established Theory:</strong></p>
                <p>"${space.hypothesis}"</p>
                <p style="margin-top: 15px; color: #2ecc71;">This is ${your.toUpperCase()} theory! ${you} invested the most time into this research.</p>
                <p class="info-text" style="margin-top: 15px;">No need to waste time reading ${your_lower} own work. ${you} already know this stuff!</p>
                `,
                [{ text: player.isAI ? 'Obviously' : 'Of course I do', action: () => {
                    log(`${player.name} visited their own established theory.`);
                    updatePlayerStats();
                    checkGameEnd();
                    if (!GameState.gameOver) endTurn();
                }}]
            );
        } else {
            // Player is not the leading investor - must do literature survey
            const surveyCost = 1;
            player.age += surveyCost;

            const citationComplaints = player.isAI ? [
                `Ugh, now ${player.name} has to waste time reading someone else's garbage and pretend it's brilliant.`,
                `Great, another theory ${player.name}'ll have to cite even though ${player.name} knows it's flawed.`,
                `Time to pad ${player.name}'s bibliography with this overhyped nonsense.`,
                `${player.name} HAS to cite this. Academia's unwritten rule: stroke everyone's ego.`,
                `Now ${player.name}'s legally obligated to make this theory sound important in the lit review.`,
                `Fantastic. ${player.name} gets to spend a year analyzing why this theory is 'foundational' (it's not).`,
                `Nothing says 'fun' like begrudgingly adding this to ${player.name}'s reference list.`,
                `${player.name} could've used this year for literally anything else. But no, literature survey time!`,
                `Time to write a whole paragraph explaining why this theory 'informs ${player.name}'s work' (spoiler: barely).`,
                `Congrats, ${player.name} now has to pretend to have always respected this research.`,
                `${player.name}'ll cite this through gritted teeth, knowing full well it has issues.`,
                `Another year lost to academic bureaucracy. At least ${player.name}'s citations look thorough!`,
                `${player.name} has to read this AND cite it. Double the pain, zero the joy.`,
                `Time for a deep dive into theory ${player.name}'ll probably disagree with in 5 years.`
            ] : [
                "Ugh, now you have to waste time reading someone else's garbage and pretend it's brilliant.",
                "Great, another theory you'll have to cite even though you know it's flawed.",
                "Time to pad your bibliography with this overhyped nonsense.",
                "You HAVE to cite this. Academia's unwritten rule: stroke everyone's ego.",
                "Now you're legally obligated to make this theory sound important in your lit review.",
                "Fantastic. You get to spend a year analyzing why this theory is 'foundational' (it's not).",
                "Nothing says 'fun' like begrudgingly adding this to your reference list.",
                "You could've used this year for literally anything else. But no, literature survey time!",
                "Time to write a whole paragraph explaining why this theory 'informs your work' (spoiler: barely).",
                "Congrats, you now have to pretend you've always respected this research.",
                "You'll cite this through gritted teeth, knowing full well it has issues.",
                "Another year lost to academic bureaucracy. At least your citations look thorough!",
                "You have to read this AND cite it. Double the pain, zero the joy.",
                "Time for a deep dive into theory you'll probably disagree with in 5 years."
            ];

            const randomComplaint = citationComplaints[Math.floor(Math.random() * citationComplaints.length)];

            showModal(
                'Literature Survey Required 📚',
                `
                <p><strong>Established Theory:</strong></p>
                <p>"${space.hypothesis}"</p>
                <p style="margin-top: 15px; color: #a86060;">${randomComplaint}</p>
                <p class="info-text" style="margin-top: 15px;">${you} spent <span style="color: #e74c3c;">${surveyCost} year</span> doing a literature survey on this theory.</p>
                <p class="info-text">Age: <span style="color: #e74c3c;">${player.age - surveyCost} → ${player.age}</span> years old</p>
                `,
                [{ text: '*Sigh* Fine', action: () => {
                    log(`${player.name} grudgingly surveyed the literature on: "${space.hypothesis}"`, 'important');
                    updatePlayerStats();
                    checkGameEnd();
                    if (!GameState.gameOver) endTurn();
                }}]
            );
        }
    }
}

function handleRecruitSpace(player) {
    const you = player.isAI ? player.name : 'you';
    const your = player.isAI ? `${player.name}'s` : 'your';

    const availableFame = player.availableFame;

    let studentsHTML = '';
    Object.entries(STUDENT_TYPES).forEach(([key, val]) => {
        const canAfford = availableFame >= val.cost;
        studentsHTML += `
            <div class="student-option ${canAfford ? '' : 'disabled'}" data-type="${key}" style="${canAfford ? '' : 'opacity: 0.5;'}">
                <div class="student-type">${val.name}</div>
                <div class="student-info">Provides: <span style="color: #e74c3c;">${val.years} years</span> | Cost: <span style="color: #e74c3c;">${val.cost} fame</span></div>
            </div>
        `;
    });

    showModal(
        'Graduate Recruitment',
        `
        <p>Trade ${your} fame points for indentured servants... I mean, research assistants!</p>
        <p>Fame available: <span style="color: #e74c3c;">${availableFame}</span></p>
        <p>Current exploitation victims: <span style="color: #e74c3c;">${player.students.length}</span></p>
        ${studentsHTML}
        <p class="info-text">They'll do all the work while ${you} take all the credit!</p>
        `,
        [{ text: 'Perfect', action: () => endTurn() }]
    );

    // Add click handlers
    setTimeout(() => {
        document.querySelectorAll('.student-option').forEach(el => {
            el.addEventListener('click', () => {
                const type = el.dataset.type;
                if (player.hireStudent(type)) {
                    hideModal();
                    updatePlayerStats();
                    handleRecruitSpace(player); // Show again for more hiring
                }
            });
        });
    }, 100);
}

function handleCommunityServiceSpace(player) {
    const you = player.isAI ? player.name : 'You';
    const you_lower = player.isAI ? player.name : 'you';
    const your = player.isAI ? `${player.name}'s` : 'your';

    const serviceCost = 3; // Years of life spent on community service

    if (player.students.length > 0) {
        // Player has students - offer choice to sacrifice one
        const student = player.students[0];
        const studentName = student.name;
        const studentTypeName = STUDENT_TYPES[student.type].name;

        showModal(
            'Community Service',
            `
            <p>Oh no! ${you}'ve been assigned mandatory community service work.</p>
            <p>This will cost ${you_lower} <strong><span style="color: #e74c3c;">${serviceCost} years</span></strong> of ${your} precious research time.</p>
            <p class="info-text">BUT WAIT... ${you_lower} have <span style="color: #e74c3c;">${studentName}</span>, a ${studentTypeName}, who could take ${your} place!</p>
            <p>What will ${you_lower} do?</p>
            `,
            [
                {
                    text: `Sacrifice ${studentName} 😈`,
                    closeModal: false,
                    action: () => {
                        // Remove the first student
                        const sacrificedStudent = player.students.shift();
                        const sacrificedName = sacrificedStudent.name;

                        log(`${player.name} sacrificed ${sacrificedName} to avoid community service!`, 'important');

                        showModal(
                            'Student Sacrificed',
                            `
                            <p>${you} threw ${your} student <span style="color: #e74c3c;">${sacrificedName}</span> under the bus!</p>
                            <p>They're now spending their days picking up litter instead of doing research.</p>
                            <p class="info-text">Academia: where we build character by crushing dreams!</p>
                            `,
                            [{ text: 'No regrets', action: () => { updatePlayerStats(); endTurn(); } }]
                        );
                    }
                },
                {
                    text: 'Do it myself 😔',
                    closeModal: false,
                    action: () => {
                        player.age += serviceCost;

                        showModal(
                            'Community Service',
                            `
                            <p>${you} nobly chose to do the community service ${you_lower}self.</p>
                            <p><span style="color: #e74c3c;">+${serviceCost} years</span> of aging from mindless bureaucratic tasks.</p>
                            <p class="info-text">${your} student is grateful... for now.</p>
                            `,
                            [{ text: 'Integrity?', action: () => { updatePlayerStats(); endTurn(); } }]
                        );
                    }
                }
            ]
        );
    } else {
        // No students - forced to do community service
        player.age += serviceCost;

        showModal(
            'Community Service',
            `
            <p>${you}'ve been assigned mandatory community service work!</p>
            <p><span style="color: #e74c3c;">+${serviceCost} years</span> of aging from filling out forms and attending sensitivity training.</p>
            <p class="info-text">If only ${you_lower} had a grad student to dump this on...</p>
            `,
            [{ text: 'Such is life', action: () => { updatePlayerStats(); endTurn(); } }]
        );
    }
}

// ============================================
// NPC LOGIC
// ============================================
function handleNPCTurn() {
    GameState.isNPCTurn = true;
    document.getElementById('current-turn').textContent = `Turn: Scientific Underdeterminism`;
    document.getElementById('current-turn').style.color = '#7a6080';
    document.getElementById('roll-dice-btn').disabled = true;
    updateTeamArgumentDisplay(null);

    log('Scientific Underdeterminism is taking its turn...', 'important');
    playSound('dice');

    // Show NPC rolling modal with mystical effect
    showModal(
        'The Universe Decides...',
        `
        <div class="dice-container">
            <span class="dice" id="npc-rolling-dice" style="font-size: 64px;">🎲</span>
            <div class="dice-result" id="npc-dice-result" style="opacity: 0; color: #e74c3c;">?</div>
        </div>
        <p style="text-align: center; color: #7a6080; font-size: 18px;">Scientific Underdeterminism moves...</p>
        `,
        []
    );

    // Animate mystical dice rolling
    const diceEl = document.getElementById('npc-rolling-dice');
    let shakeCount = 0;
    const mysticalSymbols = ['🎲', '✨', '🔮', '⚛️', '🌌', '🎲'];
    const shakeInterval = setInterval(() => {
        diceEl.textContent = mysticalSymbols[shakeCount % mysticalSymbols.length];
        diceEl.style.transform = `rotate(${Math.random() * 60 - 30}deg) scale(${1 + Math.random() * 0.3})`;
        shakeCount++;
        if (shakeCount > 12) {
            clearInterval(shakeInterval);
            diceEl.textContent = '🎲';
            diceEl.style.transform = 'rotate(0deg) scale(1)';
        }
    }, 100);

    setTimeout(() => {
        const roll = rollDice();
        log(`Scientific Underdeterminism rolled a ${roll}`);
        playSound('diceResult');

        document.getElementById('npc-dice-result').textContent = roll;
        document.getElementById('npc-dice-result').style.opacity = '1';

        setTimeout(() => {
            hideModal();

            const startPos = GameState.npc.position;
            const targetPos = (startPos + roll) % GameState.board.length;

            // Start the movement animation
            animateMovement('npc', null, startPos, roll, () => {
                const space = GameState.board[targetPos];

                // Check if landing on a hypothesis with investments
                if (space.type === SPACE_TYPES.HYPOTHESIS && space.hypothesis && !space.isProven) {
                    handleNPCProveTheory(space);
                } else {
                    log(`Scientific Underdeterminism landed on "${space.name}" - nothing happens here.`);
                    finishNPCTurn();
                }
            });
        }, 500);
    }, 1400);
}

function handleNPCProveTheory(space) {
    playSound('theory');
    space.isProven = true;

    // Find who invested the most (sum up all investments per player)
    const playerInvestments = {};
    space.investments.forEach(inv => {
        if (!playerInvestments[inv.playerIndex]) {
            playerInvestments[inv.playerIndex] = 0;
        }
        playerInvestments[inv.playerIndex] += inv.years;
    });

    // Find the player with maximum total investment
    let maxPlayerIndex = null;
    let maxYears = 0;
    Object.keys(playerInvestments).forEach(playerIndexStr => {
        const playerIndex = parseInt(playerIndexStr);
        const totalYears = playerInvestments[playerIndex];
        if (totalYears > maxYears) {
            maxYears = totalYears;
            maxPlayerIndex = playerIndex;
        }
    });

    // Roll for significance
    const significance = rollDice();
    const fameReward = significance * maxYears;

    // Find the player and reward them
    const winner = GameState.players[maxPlayerIndex];
    if (winner) {
        winner.addFame(fameReward);
        winner.theoriesPublished.push(space.hypothesis);
    }

    // Add to theories list
    GameState.theories.push({
        hypothesis: space.hypothesis,
        author: winner ? winner.name : 'Unknown',
        significance: significance,
        fameAwarded: fameReward,
        contributions: space.contributions ? [...space.contributions] : [],
        investments: space.investments ? [...space.investments] : []
    });

    showModal(
        'THEORY ESTABLISHED!',
        `
        <p style="color: #c8b070;">Scientific Underdeterminism has validated a hypothesis!</p>
        <p><strong>"${space.hypothesis}"</strong></p>
        <p>This is now an established theory about ${GameState.entity.name}!</p>
        <div class="dice-container">
            <span class="dice">🎲</span>
            <div class="dice-result">Significance: <span style="color: #e74c3c;">${'★'.repeat(significance)}${'☆'.repeat(6 - significance)}</span></div>
        </div>
        <p><strong>${winner ? winner.name : 'Unknown'}</strong> published the paper and earned <span style="color: #e74c3c;"><strong>${fameReward} fame!</strong></span></p>
        `,
        [{
            text: 'Historic!',
            action: () => {
                updatePlayerStats();
                updateTheoriesList();
                renderBoard();
                finishNPCTurn();
            }
        }]
    );

    log(`THEORY: "${space.hypothesis}" proven! ${winner ? winner.name : 'Unknown'} earned ${fameReward} fame!`, 'theory');
}

function finishNPCTurn() {
    GameState.isNPCTurn = false;
    GameState.turnNumber++;

    // Don't call nextPlayer() here - currentPlayerIndex is already set correctly
    // by endTurn() before NPC turn was triggered. Just skip any dead players.
    let attempts = 0;
    while (!GameState.players[GameState.currentPlayerIndex].isAlive && attempts < GameState.players.length) {
        GameState.currentPlayerIndex = (GameState.currentPlayerIndex + 1) % GameState.players.length;
        attempts++;
    }

    checkGameEnd();

    if (!GameState.gameOver) {
        updateTurnDisplay();
        // Don't enable button here - updateTurnDisplay handles it based on AI status
    }
}

// ============================================
// TURN MANAGEMENT
// ============================================
function nextPlayer() {
    let attempts = 0;
    do {
        GameState.currentPlayerIndex = (GameState.currentPlayerIndex + 1) % GameState.players.length;
        attempts++;
    } while (!GameState.players[GameState.currentPlayerIndex].isAlive && attempts < GameState.players.length);
}

// Shows the current player's team argument underneath the research topic label
function updateTeamArgumentDisplay(player) {
    const el = document.getElementById('team-argument-display');
    if (!el) return;

    const group = player ? GameState.groups?.find(g => g.id === player.groupId) : null;
    if (group && group.argument) {
        el.textContent = `"${group.argument}"`;
        el.style.display = 'block';
    } else {
        el.textContent = '';
        el.style.display = 'none';
    }
}

function updateTurnDisplay() {
    const player = GameState.players[GameState.currentPlayerIndex];

    // Check if player should die at the start of their turn
    if (player.isAlive && player.age >= MAX_AGE) {
        player.die();
        checkGameEnd();

        // Skip to next player if current player just died
        if (!player.isAlive) {
            endTurn();
            return;
        }
    }

    const aiIndicator = player.isAI ? ' (AI)' : '';
    document.getElementById('current-turn').textContent = `Turn: ${player.name}${aiIndicator}`;
    document.getElementById('current-turn').style.color = player.color;
    updatePlayerStats();
    updateTeamArgumentDisplay(player);
    updateItemButton();

    // If current player is AI, automatically start their turn
    if (player.isAI && player.isAlive && !GameState.gameOver && !GameState.animation.active) {
        document.getElementById('roll-dice-btn').disabled = true;
        document.getElementById('roll-dice-btn').textContent = 'AI Thinking...';
        if (typeof updateMobileDiceButton === 'function') updateMobileDiceButton();
        setTimeout(() => executeAITurn(player), 800);
    } else if (!player.isAI) {
        // Show turn indicator modal for human players
        showModal(
            `${player.name}'s Turn`,
            `
            <div style="text-align: center; padding: 20px;">
                <p style="color: #888; font-size: 30x;">Your turn to roll!</p>
            </div>
            `,
            [{ text: 'Ready!', action: () => {} }]
        );

        // Auto-close after 1 second
        //setTimeout(() => {
        //    hideModal();
        //}, 1000);

        document.getElementById('roll-dice-btn').disabled = false;
        document.getElementById('roll-dice-btn').textContent = 'Roll Dice';
        if (typeof updateMobileDiceButton === 'function') updateMobileDiceButton();

        // Start the arrow animation loop for the current player
        renderBoard();
    }
}

function endTurn() {
    const endingPlayer = GameState.players[GameState.currentPlayerIndex];

    if (endingPlayer && endingPlayer.isAI) {
        maybeUseAIItems(endingPlayer);
    }

    if (endingPlayer && endingPlayer.pendingExtraTurns > 0) {
        endingPlayer.pendingExtraTurns--;
        log(`${endingPlayer.name} gets to go again!`, 'important');
        updateTurnDisplay();
        return;
    }

    // Check if all players have gone, then NPC takes turn
    const startIndex = GameState.currentPlayerIndex;
    nextPlayer();

    if (GameState.currentPlayerIndex <= startIndex || !GameState.players.some(p => p.isAlive)) {
        // All players have gone, NPC turn
        handleNPCTurn();
    } else {
        updateTurnDisplay();
        // Don't enable button here - updateTurnDisplay handles it based on AI status
    }
}

function playerRollDice() {
    const player = GameState.players[GameState.currentPlayerIndex];
    if (!player.isAlive || GameState.isNPCTurn || GameState.gameOver || GameState.animation.active) return;

    document.getElementById('roll-dice-btn').disabled = true;
    playSound('dice');

    const roll = player.pendingDiceOverride ?? rollDice();
    player.pendingDiceOverride = null;
    log(`${player.name} rolled a ${roll}`);

    // Animate dice rolling
    showModal(
        'Rolling...',
        `
        <div class="dice-container">
            <span class="dice" id="rolling-dice">🎲</span>
            <div class="dice-result" id="dice-result" style="opacity: 0; color: #e74c3c;">${roll}</div>
        </div>
        `,
        []
    );

    // Animate the dice shaking
    const diceEl = document.getElementById('rolling-dice');
    let shakeCount = 0;
    const shakeInterval = setInterval(() => {
        diceEl.style.transform = `rotate(${Math.random() * 40 - 20}deg) scale(${1 + Math.random() * 0.2})`;
        shakeCount++;
        if (shakeCount > 8) {
            clearInterval(shakeInterval);
            diceEl.style.transform = 'rotate(0deg) scale(1)';
            document.getElementById('dice-result').style.opacity = '1';
            playSound('diceResult');
        }
    }, 80);

    setTimeout(() => {
        hideModal();

        const startPos = player.position;
        const targetPos = (startPos + roll) % GameState.board.length;

        // Start the movement animation
        animateMovement('player', player.index, startPos, roll, () => {
            // Animation complete - handle space
            const space = GameState.board[targetPos];
            handleSpaceLanding(player, space);
        });
    }, 900);
}

// ============================================
// WIN CONDITIONS
// ============================================
function checkGameEnd() {
    const alivePlayers = GameState.players.filter(p => p.isAlive);

    // Check if all hypothesis spaces are invested
    const hypothesisSpaces = GameState.board.filter(s => s.type === SPACE_TYPES.HYPOTHESIS);
    const allHypothesesInvested = hypothesisSpaces.every(s => s.investments && s.investments.length > 0);

    if (allHypothesesInvested && hypothesisSpaces.length > 0) {
        // All hypotheses invested - highest total fame wins
        const winner = GameState.players.reduce((a, b) => a.totalFame > b.totalFame ? a : b);
        endGame(winner, 'The academic world is too crowded.');
        return;
    }

    if (alivePlayers.length === 0) {
        // All dead - highest total fame wins
        const winner = GameState.players.reduce((a, b) => a.totalFame > b.totalFame ? a : b);
        endGame(winner, 'All researchers have passed away.');
    } else if (alivePlayers.length === 1) {
        // One alive - check if they have highest fame
        const alivePlayer = alivePlayers[0];
        const highestFame = Math.max(...GameState.players.map(p => p.totalFame));

        if (alivePlayer.totalFame >= highestFame) {
            endGame(alivePlayer, 'Last researcher standing with the highest fame!');
        }
    }
}

async function endGame(winner, reason) {
    GameState.gameOver = true;
    playSound('win');

    // Disable roll button
    document.getElementById('roll-dice-btn').disabled = true;
    if (typeof updateMobileDiceButton === 'function') {
        updateMobileDiceButton();
    }

    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('gameover-screen').style.display = 'block';

    // Winner display with trophy
    document.getElementById('winner-display').innerHTML = `
        <h2>🏆 WINNER 🏆</h2>
        <div class="winner-name" style="color: ${winner.color}">${winner.name}</div>
        <div class="winner-fame">Total Fame: ${winner.totalFame}</div>
        <p style="margin-top: 15px; font-size: 16px;">${reason}</p>
    `;

    // Collect all proven hypotheses and calculate contributions
    const provenSpaces = GameState.board.filter(s => s.isProven && s.hypothesis);
    const provenHypotheses = provenSpaces.map(s => s.hypothesis);

    // Calculate contributions per player
    const contributions = {};
    GameState.players.forEach(p => {
        contributions[p.index] = { player: p, years: 0, hypotheses: 0 };
    });

    provenSpaces.forEach(space => {
        space.investments.forEach(inv => {
            if (contributions[inv.playerIndex]) {
                contributions[inv.playerIndex].years += inv.years;
            }
        });
        space.contributions.forEach(contrib => {
            if (contributions[contrib.playerIndex]) {
                contributions[contrib.playerIndex].hypotheses++;
            }
        });
    });

    // Sort contributors by years invested
    const sortedContributors = Object.values(contributions)
        .filter(c => c.years > 0 || c.hypotheses > 0)
        .sort((a, b) => b.years - a.years);

    // Show entity name
    document.getElementById('theory-entity').innerHTML = `
        <div class="entity-reveal">The grand unified theory</div>
        <div class="entity-name">"${GameState.entity.name}"</div>
    `;

    // Generate theory revelation
    if (provenHypotheses.length > 0) {
        // Show loading state
        document.getElementById('theory-content').innerHTML = `
            <div class="theory-loading">✨ Synthesizing groundbreaking discoveries... ✨</div>
        `;

        // Try to get LLM-generated integrated theory
        const integratedTheory = await fetchIntegratedTheory(GameState.entity.name, provenHypotheses);

        // Helper function to find leading investor for a space
        const getLeadingInvestor = (space) => {
            const playerInvestments = {};
            space.investments.forEach(inv => {
                if (!playerInvestments[inv.playerIndex]) {
                    playerInvestments[inv.playerIndex] = 0;
                }
                playerInvestments[inv.playerIndex] += inv.years;
            });

            let maxPlayerIndex = null;
            let maxYears = 0;
            Object.keys(playerInvestments).forEach(playerIndexStr => {
                const playerIndex = parseInt(playerIndexStr);
                const totalYears = playerInvestments[playerIndex];
                if (totalYears > maxYears) {
                    maxYears = totalYears;
                    maxPlayerIndex = playerIndex;
                }
            });

            return maxPlayerIndex !== null ? GameState.players[maxPlayerIndex] : null;
        };

        if (integratedTheory) {
            document.getElementById('theory-content').innerHTML = `
                <div class="theory-text">${integratedTheory}</div>
                <div class="theory-hypotheses">
                    <h4>References:</h4>
                    ${provenSpaces.map((space, i) => {
                        const leadingInvestor = getLeadingInvestor(space);
                        return `<div class="proven-hypothesis">
                            ${i + 1}. "${space.hypothesis}"
                            ${leadingInvestor ? `<span style="color: ${leadingInvestor.color}; font-size: 18px; margin-left: 10px;">(Leading Investor: ${leadingInvestor.name})</span>` : ''}
                        </div>`;
                    }).join('')}
                </div>
            `;
        } else {
            // Fallback: just list the hypotheses
            document.getElementById('theory-content').innerHTML = `
                <div class="theory-text fallback">
                    After years of rigorous research and academic debate, the scientific community has established the following truths:
                </div>
                <div class="theory-hypotheses">
                    ${provenSpaces.map((space, i) => {
                        const leadingInvestor = getLeadingInvestor(space);
                        return `<div class="proven-hypothesis">
                            ${i + 1}. "${space.hypothesis}"
                            ${leadingInvestor ? `<span style="color: ${leadingInvestor.color}; font-size: 20px; margin-left: 10px;">(Leading Investor: ${leadingInvestor.name})</span>` : ''}
                        </div>`;
                    }).join('')}
                </div>
            `;
        }

        // Show contributors with loading state
        if (sortedContributors.length > 0) {
            document.getElementById('theory-contributors').innerHTML = `
                <h4>Contributors to Science</h4>
                <div class="contributors-list">
                    ${sortedContributors.map((c, i) => `
                        <div class="contributor ${i === 0 ? 'top-contributor' : ''}" style="border-color: ${c.player.color}">
                            <span class="contributor-rank">${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}</span>
                            <span class="contributor-name" style="color: ${c.player.color}">${c.player.name}</span>
                            <span class="contributor-stats">${c.years} years invested</span>
                            <div class="contributor-bio" style="margin-top: 10px; font-size: 25px; font-style: italic; color: #666;">
                                ✨ Generating career bio...
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;

            // Collect game log from DOM
            const logEntries = Array.from(document.querySelectorAll('.log-entry')).map(entry => entry.textContent);
            const gameLog = logEntries.join('\n');

            // Fetch player bios asynchronously
            fetchPlayerBios(GameState.players, gameLog).then(bios => {
                if (bios && bios.length === GameState.players.length) {
                    // Update the contributors display with bios
                    document.getElementById('theory-contributors').innerHTML = `
                        <h4>📚 Contributors to Science 📚</h4>
                        <div class="contributors-list">
                            ${sortedContributors.map((c, i) => {
                                const playerBio = bios[c.player.index] || 'A mysterious figure in the annals of academic history.';
                                return `
                                    <div class="contributor ${i === 0 ? 'top-contributor' : ''}" style="border-color: ${c.player.color}">
                                        <span class="contributor-rank">${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}</span>
                                        <span class="contributor-name" style="color: ${c.player.color}">${c.player.name}</span>
                                        <span class="contributor-stats">${c.years} years invested</span>
                                        <div class="contributor-bio" style="margin-top: 10px; font-size: 18px; font-style: italic; color: #666; line-height: 1.4;">
                                            ${playerBio}
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    `;
                }
            }).catch(err => {
                console.warn('Failed to generate player bios:', err);
                // Keep the display without bios if generation fails
            });
        }
    } else {
        // No proven theories
        document.getElementById('theory-content').innerHTML = `
            <div class="theory-text no-theories">
                Alas, no hypotheses were proven during this research session.
                The mystery of "${GameState.entity.name}" remains unsolved...
            </div>
        `;
        document.getElementById('theory-contributors').innerHTML = '';
    }

    // Final stats
    let statsHTML = '<h4>Final Standings</h4><div class="final-stats-grid">';
    // Sort players by fame for final standings
    const sortedPlayers = [...GameState.players].sort((a, b) => b.totalFame - a.totalFame);
    sortedPlayers.forEach((player, rank) => {
        const isWinner = player.index === winner.index;
        statsHTML += `
            <div class="final-player-stat ${isWinner ? 'winner-stat' : ''}">
                <div class="player-rank">${rank === 0 ? '🥇' : rank === 1 ? '🥈' : rank === 2 ? '🥉' : `#${rank + 1}`}</div>
                <h3 style="color: ${player.color}">${player.name}</h3>
                <div class="stat-row"><span>Total Fame:</span><span class="value">${player.totalFame}</span></div>
                <div class="stat-row"><span>Final Age:</span><span class="value">${player.age}</span></div>
                <div class="stat-row"><span>Theories:</span><span class="value">${player.theoriesPublished.length}</span></div>
                <div class="stat-row"><span>Status:</span><span class="value">${player.isAlive ? 'Alive' : 'Deceased'}</span></div>
            </div>
        `;
    });
    statsHTML += '</div>';
    document.getElementById('final-stats').innerHTML = statsHTML;
}
