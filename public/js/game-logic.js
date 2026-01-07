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
    constructor(name, color, index, isAI = false) {
        this.name = name;
        this.color = color;
        this.index = index;
        this.position = 0;
        this.age = STARTING_AGE;
        this.totalFame = 0;
        this.spentFame = 0;
        this.students = [];
        this.theoriesPublished = [];
        this.isAlive = true;
        this.isAI = isAI;
    }

    get availableFame() {
        return this.totalFame - this.spentFame;
    }

    get availableYears() {
        // Years until death plus student years
        let years = MAX_AGE - this.age;
        this.students.forEach(s => {
            years += STUDENT_TYPES[s].years;
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

    investLife(years, useStudents = true) {
        let yearsToInvest = years;
        let studentsUsed = [];

        if (useStudents) {
            // Use students first (prioritize lower value students)
            const studentOrder = ['undergraduate', 'master', 'phd'];
            for (const type of studentOrder) {
                while (yearsToInvest > 0 && this.students.includes(type)) {
                    const studentYears = STUDENT_TYPES[type].years;
                    if (studentYears <= yearsToInvest) {
                        yearsToInvest -= studentYears;
                        const idx = this.students.indexOf(type);
                        this.students.splice(idx, 1);
                        studentsUsed.push(type);
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

        return { studentsUsed, personalYears: yearsToInvest };
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
            <p style="font-size: 14px; margin-bottom: 10px;"><strong>${this.name}</strong> has passed away at the ripe old age of ${this.age}.</p>
            <p style="color: #888; font-style: italic; margin-bottom: 12px;">${randomMessage}</p>
            <div style="border-top: 1px solid #ccc; padding-top: 10px; margin-top: 10px;">
                <p style="font-size: 10px;">Final Stats:</p>
                <p style="font-size: 10px;">📊 Total Fame: ${this.totalFame}</p>
                <p style="font-size: 10px;">📚 Theories Published: ${this.theoriesPublished.length}</p>
                <p style="font-size: 10px;">🎓 Students Exploited: ${this.students.length}</p>
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
            this.students.push(type);
            playSound('hire');
            log(`${this.name} hired a ${STUDENT_TYPES[type].name} for ${cost} fame.`);
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
    player.addFame(2);
    showModal(
        'New Academic Year',
        `<p>Congratulations! You've survived another trip around the sun without quitting academia.</p>
        <p>+2 fame for your unrelenting stubbornness</p>
        <p class="info-text">Your family still doesn't understand what you do for a living.</p>`,
        [{ text: 'Yay...', action: () => { updatePlayerStats(); endTurn(); } }]
    );
}

function handleConferenceSpace(player) {
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
                <div class="dice-result">+${smallFameGain} Fame</div>
            </div>
            <p>You showed up to the conference, but realized you have nothing to present.</p>
            <p>Awkwardly attended other people's talks and ate free cookies instead.</p>
            <p class="info-text">At least someone remembered your name tag!</p>
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
            <div class="dice-result">+${fameGain} Fame!</div>
        </div>
        <p>You traveled across the country to present your groundbreaking work on <strong>"${selectedHypothesis}"</strong> in a windowless room to 6 people (3 were asleep).</p>
        <p class="info-text">At least the hotel breakfast was mediocre!</p>
        `,
        [{ text: 'Worth it?', action: () => { updatePlayerStats(); endTurn(); } }]
    );
}

function handleSabbaticalSpace(player) {
    player.rejuvenate(2);

    showModal(
        'Sabbatical Leave',
        `
        <p>You escaped to "write a book" (really just avoided emails for 6 months).</p>
        <p>-2 years of aging from not attending meetings!</p>
        <p class="info-text">You'll definitely finish that book chapter... eventually.</p>
        `,
        [{ text: 'Bliss', action: () => { updatePlayerStats(); endTurn(); } }]
    );
}

function handleGrantSpace(player) {
    player.addFame(2);

    showModal(
        'Research Grant!',
        `
        <div class="dice-container">
            <span class="dice">💰</span>
            <div class="dice-result">+2 Fame!</div>
        </div>
        <p>After only 47 revisions and 3 panel reviews, they actually gave you money!</p>
        <p>+2 fame (mostly from other academics jealous of your funding)</p>
        <p class="info-text">Now if only the grant actually covered your students' stipends...</p>
        `,
        [{ text: 'Finally!', action: () => { updatePlayerStats(); endTurn(); } }]
    );
}

function handleScandalSpace(player) {
    playSound('scandal');
    const fameLoss = Math.min(player.totalFame, rollDice() + 1);
    player.totalFame -= fameLoss;
    player.spentFame = Math.min(player.spentFame, player.totalFame);

    showModal(
        'Academic Scandal!',
        `
        <p style="color: #a86060;">Someone actually read your paper and found... issues.</p>
        <p>-${fameLoss} fame from the Twitter mob and anonymous blog posts</p>
        <p class="info-text">Maybe you should have checked those p-values more carefully...</p>
        `,
        [{ text: 'Oops', action: () => { updatePlayerStats(); endTurn(); } }]
    );
}

function handleCollaborationSpace(player) {
    const otherPlayers = GameState.players.filter(p => p.isAlive && p.index !== player.index);

    if (otherPlayers.length > 0) {
        const collaborator = otherPlayers[Math.floor(Math.random() * otherPlayers.length)];
        const bonus = 3;
        player.addFame(bonus);
        collaborator.addFame(bonus);

        showModal(
            'Research Collaboration',
            `
            <p>You and ${collaborator.name} are now co-authors!</p>
            <p>Both +${bonus} fame (now you have to decide authorship order...)</p>
            <p class="info-text">May the most passive-aggressive email win.</p>
            `,
            [{ text: 'Awkward', action: () => { updatePlayerStats(); endTurn(); } }]
        );
    } else {
        showModal(
            'Research Collaboration',
            `<p>You wanted to collaborate but everyone else is dead or has better things to do.</p>
            <p class="info-text">Solo authorship it is!</p>`,
            [{ text: 'Forever alone', action: () => endTurn() }]
        );
    }
}

async function handleEurekaSpace(player) {
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
            <p style="color: #c8b070; font-size: 12px;">It came to you in the shower!</p>
            <p>You had a brilliant idea about ${GameState.entity.name}!</p>
            <p class="info-text">But... every hypothesis space is already claimed. Your genius goes to waste.</p>
            <p style="color: #888; font-size: 11px;">Should've thought of this sooner!</p>
            `,
            [{ text: 'Tragic', action: () => { updatePlayerStats(); endTurn(); } }]
        );
        return;
    }

    // Show modal to claim the closest hypothesis for free
    showModal(
        'EUREKA! 💡',
        `
        <p style="color: #c8b070; font-size: 12px;">It came to you in the shower!</p>
        <p>A brilliant insight about <strong>${GameState.entity.name}</strong> just hit you!</p>
        <p>You can claim the next available research question (<strong>"${closestSpace.name}"</strong>) <span style="color: #2ecc71;">FOR FREE</span>!</p>
        <div class="suggestions-container">
            <label>AI-generated hypotheses (because originality is hard):</label>
            <div id="hypothesis-suggestions" class="hypothesis-suggestions">
                <div class="suggestion-loading">Generating suggestions...</div>
            </div>
        </div>
        <div class="input-group">
            <label>Or formulate your eureka moment:</label>
            <input type="text" id="hypothesis-input" placeholder="Enter your hypothesis about ${GameState.entity.name}...">
        </div>
        <p class="info-text">Normal cost: ${closestSpace.investmentCost} years. Eureka cost: FREE!</p>
        `,
        [
            {
                text: 'Claim it!',
                action: () => {
                    const hypothesis = document.getElementById('hypothesis-input').value.trim();
                    if (hypothesis) {
                        closestSpace.hypothesis = hypothesis;
                        closestSpace.contributions.push({ text: hypothesis, author: player.name, playerIndex: player.index });
                        closestSpace.investments.push({ player: player.name, years: space.investmentCost, playerIndex: player.index });
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

    // Fetch suggestions asynchronously and update the modal
    const suggestions = await fetchHypothesisSuggestions(3);

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
        default:
            endTurn();
    }
}

async function handleHypothesisSpace(player, space) {
    if (!space.hypothesis) {
        // First player to land here - can create hypothesis
        const availableYears = player.availableYears;
        const canAfford = availableYears >= space.investmentCost;

        // Show initial modal with loading state for suggestions (only if player can afford)
        showModal(
            'New Research Opportunity!',
            `
            <p>Nobody's wasted their life on this question about <strong>${GameState.entity.name}</strong> yet!</p>
            <p>Invest ${space.investmentCost} years to claim this territory before someone else does.</p>
            ${canAfford ? `
            <div class="suggestions-container">
                <label>AI-generated hypotheses (because originality is hard):</label>
                <div id="hypothesis-suggestions" class="hypothesis-suggestions">
                    <div class="suggestion-loading">Generating suggestions...</div>
                </div>
            </div>
            ` : ''}
            <div class="input-group">
                <label>Or pretend to have original thoughts:</label>
                <input type="text" id="hypothesis-input" placeholder="Enter your hypothesis about ${GameState.entity.name}...">
            </div>
            <p class="info-text">Life years remaining: ${availableYears}</p>
            ${!canAfford ? '<p style="color: #a86060;">You\'ll likely die before you come up with anything</p>' : ''}
            `,
            [
                {
                    text: 'Invest',
                    disabled: !canAfford,
                    action: () => {
                        const hypothesis = document.getElementById('hypothesis-input').value.trim();
                        if (hypothesis && availableYears >= space.investmentCost) {
                            space.hypothesis = hypothesis;
                            space.contributions.push({ text: hypothesis, author: player.name, playerIndex: player.index });
                            space.investments.push({ player: player.name, years: space.investmentCost, playerIndex: player.index });
                            player.investLife(space.investmentCost);
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

        // Fetch suggestions asynchronously and update the modal (only if player can afford)
        if (canAfford) {
            const suggestions = await fetchHypothesisSuggestions(3);
            const suggestionsContainer = document.getElementById('hypothesis-suggestions');
            if (suggestionsContainer) {
                suggestionsContainer.innerHTML = suggestions.map((s, i) =>
                    `<button class="suggestion-btn" data-suggestion="${i}">${s}</button>`
                ).join('');

                // Add click handlers to suggestion buttons
                suggestionsContainer.querySelectorAll('.suggestion-btn').forEach((btn, i) => {
                    btn.addEventListener('click', () => {
                        document.getElementById('hypothesis-input').value = suggestions[i];
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
            investmentsHTML += `<div class="investor"><span>${inv.player}</span><span>${inv.years} years</span></div>`;
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
            <p class="info-text">Life years remaining: ${availableYears}</p>
            ${availableYears < 1 ? '<p style="color: #a86060;">You literally can\'t afford any investment.</p>' : ''}
            `,
            [
                {
                    text: 'Invest',
                    disabled: availableYears < 1,
                    action: () => {
                        const yearsToInvest = parseInt(document.getElementById('investment-years').value) || 0;

                        if (yearsToInvest <= 0) {
                            showModal('Invalid Investment', '<p>You need to invest at least 1 year!</p>',
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
                            player.investLife(yearsToInvest);
                            log(`${player.name} invested ${yearsToInvest} years in the hypothesis.`);
                            renderBoard();
                            updatePlayerStats();
                            checkGameEnd();
                            if (!GameState.gameOver) endTurn();
                        } else {
                            showModal('Insufficient Life', `<p>You don't have ${yearsToInvest} years to spare!</p>`,
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
                'Your Own Theory! 😎',
                `
                <p><strong>Established Theory:</strong></p>
                <p>"${space.hypothesis}"</p>
                <p style="margin-top: 15px; color: #2ecc71;">This is YOUR theory! You invested the most time into this research.</p>
                <p class="info-text" style="margin-top: 15px;">No need to waste time reading your own work. You already know this stuff!</p>
                `,
                [{ text: 'Of course I do', action: () => {
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

            const citationComplaints = [
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
                <p class="info-text" style="margin-top: 15px;">You spent ${surveyCost} year doing a literature survey on this theory.</p>
                <p class="info-text">Age: ${player.age - surveyCost} → ${player.age} years old</p>
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
    const availableFame = player.availableFame;

    let studentsHTML = '';
    Object.entries(STUDENT_TYPES).forEach(([key, val]) => {
        const canAfford = availableFame >= val.cost;
        studentsHTML += `
            <div class="student-option ${canAfford ? '' : 'disabled'}" data-type="${key}" style="${canAfford ? '' : 'opacity: 0.5;'}">
                <div class="student-type">${val.name}</div>
                <div class="student-info">Provides: ${val.years} years | Cost: ${val.cost} fame</div>
            </div>
        `;
    });

    showModal(
        'Graduate Recruitment',
        `
        <p>Trade your fame points for indentured servants... I mean, research assistants!</p>
        <p>Fame available: ${availableFame}</p>
        <p>Current exploitation victims: ${player.students.length}</p>
        ${studentsHTML}
        <p class="info-text">They'll do all the work while you take all the credit!</p>
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
    const serviceCost = 3; // Years of life spent on community service

    if (player.students.length > 0) {
        // Player has students - offer choice to sacrifice one
        const studentType = player.students[0];
        const studentName = STUDENT_TYPES[studentType].name;

        showModal(
            'Community Service',
            `
            <p>Oh no! You've been assigned mandatory community service work.</p>
            <p>This will cost you <strong>${serviceCost} years</strong> of your precious research time.</p>
            <p class="info-text">BUT WAIT... you have a ${studentName} who could take your place!</p>
            <p>What will you do?</p>
            `,
            [
                {
                    text: `Sacrifice ${studentName} 😈`,
                    closeModal: false,
                    action: () => {
                        // Remove the first student
                        const sacrificedStudent = player.students.shift();
                        const sacrificedName = STUDENT_TYPES[sacrificedStudent].name;

                        log(`${player.name} sacrificed their ${sacrificedName} to avoid community service!`, 'important');

                        showModal(
                            'Student Sacrificed',
                            `
                            <p>You threw your ${sacrificedName} under the bus!</p>
                            <p>They're now spending their days picking up litter instead of doing research.</p>
                            <p class="info-text">Academia: where we build character by crushing dreams!</p>
                            `,
                            [{ text: 'No regrets', action: () => { updatePlayerStats(); endTurn(); } }]
                        );
                    }
                },
                {
                    text: 'Do it myself 😔',
                    action: () => {
                        player.age += serviceCost;

                        showModal(
                            'Community Service',
                            `
                            <p>You nobly chose to do the community service yourself.</p>
                            <p>+${serviceCost} years of aging from mindless bureaucratic tasks.</p>
                            <p class="info-text">Your student is grateful... for now.</p>
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
            <p>You've been assigned mandatory community service work!</p>
            <p>+${serviceCost} years of aging from filling out forms and attending sensitivity training.</p>
            <p class="info-text">If only you had a grad student to dump this on...</p>
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

    log('Scientific Underdeterminism is taking its turn...', 'important');
    playSound('dice');

    // Show NPC rolling modal with mystical effect
    showModal(
        'The Universe Decides...',
        `
        <div class="dice-container">
            <span class="dice" id="npc-rolling-dice" style="font-size: 64px;">🎲</span>
            <div class="dice-result" id="npc-dice-result" style="opacity: 0; color: #7a6080;">?</div>
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
    const fameReward = significance * 5;

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
            <div class="dice-result">Significance: ${'★'.repeat(significance)}${'☆'.repeat(6 - significance)}</div>
        </div>
        <p><strong>${maxInvestor.player}</strong> published the paper and earned <strong>${fameReward} fame!</strong></p>
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

    log(`THEORY: "${space.hypothesis}" proven! ${maxInvestor.player} earned ${fameReward} fame!`, 'theory');
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

    // If current player is AI, automatically start their turn
    if (player.isAI && player.isAlive && !GameState.gameOver && !GameState.animation.active) {
        document.getElementById('roll-dice-btn').disabled = true;
        document.getElementById('roll-dice-btn').textContent = 'AI Thinking...';
        setTimeout(() => executeAITurn(player), 800);
    } else if (!player.isAI) {
        document.getElementById('roll-dice-btn').disabled = false;
        document.getElementById('roll-dice-btn').textContent = 'Roll Dice';
    }
}

function endTurn() {
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

    const roll = rollDice();
    log(`${player.name} rolled a ${roll}`);

    // Animate dice rolling
    showModal(
        'Rolling...',
        `
        <div class="dice-container">
            <span class="dice" id="rolling-dice">🎲</span>
            <div class="dice-result" id="dice-result" style="opacity: 0">${roll}</div>
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
        endGame(winner, 'All hypotheses have been invested! Victory to the most famous researcher!');
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
        <div class="entity-reveal">Concerning the nature of</div>
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

        if (integratedTheory) {
            document.getElementById('theory-content').innerHTML = `
                <div class="theory-text">${integratedTheory}</div>
                <div class="theory-hypotheses">
                    <h4>Established Theories:</h4>
                    ${provenHypotheses.map((h, i) => `<div class="proven-hypothesis">${i + 1}. "${h}"</div>`).join('')}
                </div>
            `;
        } else {
            // Fallback: just list the hypotheses
            document.getElementById('theory-content').innerHTML = `
                <div class="theory-text fallback">
                    After years of rigorous research and academic debate, the scientific community has established the following truths:
                </div>
                <div class="theory-hypotheses">
                    ${provenHypotheses.map((h, i) => `<div class="proven-hypothesis">${i + 1}. "${h}"</div>`).join('')}
                </div>
            `;
        }

        // Show contributors
        if (sortedContributors.length > 0) {
            document.getElementById('theory-contributors').innerHTML = `
                <h4>📚 Contributors to Science 📚</h4>
                <div class="contributors-list">
                    ${sortedContributors.map((c, i) => `
                        <div class="contributor ${i === 0 ? 'top-contributor' : ''}" style="border-color: ${c.player.color}">
                            <span class="contributor-rank">${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}</span>
                            <span class="contributor-name" style="color: ${c.player.color}">${c.player.name}</span>
                            <span class="contributor-stats">${c.years} years invested</span>
                        </div>
                    `).join('')}
                </div>
            `;
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
    let statsHTML = '<h3>Final Standings</h3><div class="final-stats-grid">';
    // Sort players by fame for final standings
    const sortedPlayers = [...GameState.players].sort((a, b) => b.totalFame - a.totalFame);
    sortedPlayers.forEach((player, rank) => {
        const isWinner = player.index === winner.index;
        statsHTML += `
            <div class="final-player-stat ${isWinner ? 'winner-stat' : ''}" style="border-color: ${player.color}">
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
