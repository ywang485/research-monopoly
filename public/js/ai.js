// Theory Investment Game - AI and LLM System

// ============================================
// LLM AVAILABILITY CHECK
// ============================================
async function checkLLMAvailability() {
    // Skip if opened as a file (not served via HTTP)
    if (window.location.protocol === 'file:') {
        GameState.llm.available = false;
        console.log('Running from file:// - LLM not available. Run with: npm start');
        updateLLMIndicator();
        return;
    }

    try {
        const response = await fetch('/api/llm-status');
        const data = await response.json();
        GameState.llm.available = data.available;
        GameState.llm.provider = data.provider;
        if (data.available) {
            console.log(`LLM available: ${data.provider}`);
        }
        updateLLMIndicator();
    } catch (e) {
        // Server not running or endpoint not available
        GameState.llm.available = false;
        console.log('LLM not available - using fallback hypotheses');
        updateLLMIndicator();
    }
}

// Update the LLM status indicator in the UI
function updateLLMIndicator() {
    const indicator = document.getElementById('llm-status');
    if (!indicator) return;

    const icon = indicator.querySelector('.llm-icon');
    const text = indicator.querySelector('.llm-text');

    // Show/hide entity suggestions container based on LLM availability
    const entitySuggestionsContainer = document.getElementById('entity-suggestions-container');
    if (entitySuggestionsContainer) {
        entitySuggestionsContainer.style.display = GameState.llm.available ? 'block' : 'none';
    }

    if (GameState.llm.available) {
        indicator.className = 'llm-indicator active';
        icon.textContent = '🧠';
        const providerNames = {
            'openai': 'GPT',
            'anthropic': 'Claude',
            'google': 'Gemini'
        };
        const displayName = providerNames[GameState.llm.provider] || GameState.llm.provider;
        text.textContent = `AI: ${displayName}`;
    } else {
        indicator.className = 'llm-indicator inactive';
        icon.textContent = '📝';
        text.textContent = 'AI: Templates';
    }
}

// ============================================
// HYPOTHESIS GENERATION
// ============================================
async function generateLLMHypothesis() {
    if (!GameState.llm.available) {
        return generateFallbackHypothesis();
    }

    try {
        // Collect existing hypotheses to avoid repetition
        const existingHypotheses = GameState.board
            .filter(s => s.hypothesis)
            .map(s => s.hypothesis);

        // Collect proven hypotheses to build upon
        const provenHypotheses = GameState.board
            .filter(s => s.hypothesis && s.isProven)
            .map(s => s.hypothesis);

        const response = await fetch('/api/generate-hypothesis', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                entity: GameState.entity.name,
                entityType: GameState.entity.type,
                existingHypotheses,
                provenHypotheses
            })
        });

        const data = await response.json();

        if (data.fallback || data.error) {
            return generateFallbackHypothesis();
        }

        return data.hypothesis;
    } catch (e) {
        console.warn('LLM generation failed, using fallback:', e);
        return generateFallbackHypothesis();
    }
}

async function generateLLMHypothesisAddition(existingHypothesis) {
    if (!GameState.llm.available) {
        return generateFallbackHypothesisAddition();
    }

    try {
        const response = await fetch('/api/generate-addition', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                existingHypothesis
            })
        });

        const data = await response.json();

        if (data.fallback || data.error) {
            return generateFallbackHypothesisAddition();
        }

        return data.addition;
    } catch (e) {
        console.warn('LLM addition failed, using fallback:', e);
        return generateFallbackHypothesisAddition();
    }
}

function generateFallbackHypothesis() {
    const template = AI_HYPOTHESIS_TEMPLATES[Math.floor(Math.random() * AI_HYPOTHESIS_TEMPLATES.length)];
    return template.replace('{entity}', GameState.entity.name);
}

function generateFallbackHypothesisAddition() {
    return AI_HYPOTHESIS_ADDITIONS[Math.floor(Math.random() * AI_HYPOTHESIS_ADDITIONS.length)];
}

// ============================================
// SUGGESTION FETCHING
// ============================================
async function fetchHypothesisSuggestions(count = 3) {
    if (!GameState.llm.available) {
        // Return fallback suggestions
        const suggestions = [];
        for (let i = 0; i < count; i++) {
            suggestions.push(generateFallbackHypothesis());
        }
        return suggestions;
    }

    try {
        const existingHypotheses = GameState.board
            .filter(s => s.hypothesis)
            .map(s => s.hypothesis);

        const response = await fetch('/api/generate-suggestions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                entity: GameState.entity.name,
                existingHypotheses,
                count
            })
        });

        const data = await response.json();

        if (data.fallback || data.error) {
            const suggestions = [];
            for (let i = 0; i < count; i++) {
                suggestions.push(generateFallbackHypothesis());
            }
            return suggestions;
        }

        return data.suggestions;
    } catch (e) {
        console.warn('Failed to fetch suggestions:', e);
        const suggestions = [];
        for (let i = 0; i < count; i++) {
            suggestions.push(generateFallbackHypothesis());
        }
        return suggestions;
    }
}

async function fetchEntitySuggestions(entityType, count = 3) {
    if (!GameState.llm.available) {
        return null; // No fallback for entities - return null to hide suggestions
    }

    try {
        const response = await fetch('/api/generate-entities', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ entityType, count })
        });

        const data = await response.json();

        if (data.fallback || data.error) {
            return null;
        }

        return data.entities;
    } catch (e) {
        console.warn('Failed to fetch entity suggestions:', e);
        return null;
    }
}

async function fetchIntegratedTheory(entity, hypotheses) {
    if (!GameState.llm.available || hypotheses.length === 0) {
        return null;
    }

    try {
        const response = await fetch('/api/generate-theory', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ entity, hypotheses })
        });

        const data = await response.json();

        if (data.fallback || data.error) {
            return null;
        }

        return data.theory;
    } catch (e) {
        console.warn('Failed to fetch integrated theory:', e);
        return null;
    }
}

async function fetchPeerReview(hypothesis) {
    if (!GameState.llm.available) {
        return null;
    }

    try {
        const response = await fetch('/api/generate-review', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ hypothesis })
        });

        const data = await response.json();

        if (data.fallback || data.error) {
            return null;
        }

        return data.review;
    } catch (e) {
        console.warn('Failed to fetch peer review:', e);
        return null;
    }
}

async function fetchPlayerBios(players, gameLog) {
    if (!GameState.llm.available || players.length === 0) {
        return null;
    }

    try {
        // Prepare player data with their invested hypotheses
        const playerData = players.map(player => ({
            name: player.name,
            totalFame: player.totalFame,
            finalAge: player.age,
            isAlive: player.isAlive,
            theoriesPublished: player.theoriesPublished,
            totalYearsInvested: 0 // Will be calculated from game board
        }));

        // Calculate total years invested per player from board
        GameState.board.filter(s => s.isProven && s.hypothesis).forEach(space => {
            const playerInvestments = {};
            space.investments.forEach(inv => {
                if (!playerInvestments[inv.playerIndex]) {
                    playerInvestments[inv.playerIndex] = 0;
                }
                playerInvestments[inv.playerIndex] += inv.years;
            });

            Object.keys(playerInvestments).forEach(playerIndexStr => {
                const playerIndex = parseInt(playerIndexStr);
                if (playerData[playerIndex]) {
                    playerData[playerIndex].totalYearsInvested += playerInvestments[playerIndex];
                }
            });
        });

        const response = await fetch('/api/generate-bios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                players: playerData,
                gameLog: gameLog
            })
        });

        const data = await response.json();

        if (data.fallback || data.error) {
            return null;
        }

        return data.bios; // Should be an array of bios, one per player
    } catch (e) {
        console.warn('Failed to fetch player bios:', e);
        return null;
    }
}

// ============================================
// AI DECISION MAKING (for AI players)
// ============================================
function generateAIHypothesis() {
    return generateFallbackHypothesis();
}

function generateAIHypothesisAddition() {
    return generateFallbackHypothesisAddition();
}

function makeAIDecision(player, space, decisionType) {
    // AI decision-making logic
    const availableYears = player.availableYears;
    const availableFame = player.availableFame;

    switch (decisionType) {
        case 'hypothesis_new':
            // Decide whether to create a new hypothesis
            // AI is more likely to invest if they have plenty of years
            if (availableYears >= space.investmentCost * 2) {
                return { action: 'invest', hypothesis: generateAIHypothesis() };
            } else if (availableYears >= space.investmentCost && Math.random() > 0.3) {
                return { action: 'invest', hypothesis: generateAIHypothesis() };
            }
            return { action: 'skip' };

        case 'hypothesis_existing':
            // Decide whether to invest in existing hypothesis
            // Check current investment leader
            const myInvestment = space.investments.find(i => i.playerIndex === player.index);
            const maxInvestment = Math.max(...space.investments.map(i => i.years));
            const myYears = myInvestment ? myInvestment.years : 0;

            // More likely to invest if behind or can take the lead
            if (availableYears >= space.investmentCost) {
                // 40% chance to add to the hypothesis when investing
                const addition = Math.random() > 0.6 ? generateAIHypothesisAddition() : null;
                if (myYears < maxInvestment && Math.random() > 0.2) {
                    return { action: 'invest', addition };
                } else if (myYears >= maxInvestment && Math.random() > 0.5) {
                    return { action: 'invest', addition };
                }
            }
            return { action: 'pass' };

        case 'recruit':
            // Decide which students to hire
            const studentsToHire = [];
            // Prioritize PhD students if affordable
            if (availableFame >= STUDENT_TYPES.phd.cost && Math.random() > 0.3) {
                studentsToHire.push('phd');
            } else if (availableFame >= STUDENT_TYPES.master.cost && Math.random() > 0.4) {
                studentsToHire.push('master');
            } else if (availableFame >= STUDENT_TYPES.undergraduate.cost && Math.random() > 0.5) {
                studentsToHire.push('undergraduate');
            }
            return { action: studentsToHire.length > 0 ? 'hire' : 'leave', students: studentsToHire };

        default:
            return { action: 'continue' };
    }
}

// ============================================
// AI TURN EXECUTION
// ============================================
function executeAITurn(player) {
    log(`${player.name} (AI) is thinking...`);

    // Add a delay to simulate thinking
    setTimeout(() => {
        playSound('dice');
        const roll = rollDice();
        log(`${player.name} rolled a ${roll}`);

        // Show dice modal briefly
        showModal(
            `${player.name} (AI) Rolling...`,
            `
            <div class="dice-container">
                <span class="dice">🎲</span>
                <div class="dice-result">${roll}</div>
            </div>
            `,
            []
        );

        setTimeout(() => {
            playSound('diceResult');
        }, 300);

        setTimeout(() => {
            hideModal();

            const startPos = player.position;
            const targetPos = (startPos + roll) % GameState.board.length;

            // Start the movement animation
            animateMovement('player', player.index, startPos, roll, () => {
                // Animation complete - handle space for AI
                const space = GameState.board[targetPos];
                handleAISpaceLanding(player, space);
            });
        }, 800);
    }, 500);
}

function handleAISpaceLanding(player, space) {
    playSound('land');
    log(`${player.name} landed on "${space.name}" (${space.type})`);

    // Small delay before AI makes decision
    setTimeout(() => {
        switch (space.type) {
            case SPACE_TYPES.START:
                handleStartSpace(player);
                break;
            case SPACE_TYPES.HYPOTHESIS:
                handleAIHypothesisSpace(player, space);
                break;
            case SPACE_TYPES.RECRUIT:
                handleAIRecruitSpace(player);
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
    }, 300);
}

async function handleAIHypothesisSpace(player, space) {
    if (!space.hypothesis) {
        // New hypothesis space - use LLM if available
        const availableYears = player.availableYears;
        const shouldInvest = availableYears >= space.investmentCost * 2 ||
                            (availableYears >= space.investmentCost && Math.random() > 0.3);

        if (shouldInvest && player.availableYears >= space.investmentCost) {
            // Show thinking message while generating
            if (GameState.llm.available) {
                log(`${player.name} is formulating a hypothesis...`);
            }

            // Generate hypothesis (async if LLM available)
            const hypothesis = await generateLLMHypothesis();

            space.hypothesis = hypothesis;
            space.contributions.push({ text: hypothesis, author: player.name, playerIndex: player.index });
            space.investments.push({ player: player.name, years: space.investmentCost, playerIndex: player.index });
            player.investLife(space.investmentCost);
            log(`${player.name} proposed: "${hypothesis}" and invested ${space.investmentCost} years.`, 'important');
            renderBoard();
            updatePlayerStats();
            checkGameEnd();
            if (!GameState.gameOver) {
                setTimeout(() => endTurn(), 500);
            }
        } else {
            log(`${player.name} decided to skip this research opportunity.`);
            setTimeout(() => endTurn(), 300);
        }
    } else if (!space.isProven) {
        // Existing hypothesis
        const decision = makeAIDecision(player, space, 'hypothesis_existing');

        if (decision.action === 'invest' && player.availableYears >= space.investmentCost) {
            // AI always tries to add to the hypothesis when investing (use LLM if available)
            if (GameState.llm.available) {
                log(`${player.name} is elaborating on the hypothesis...`);
            }
            const addition = await generateLLMHypothesisAddition(space.hypothesis);
            if (addition) {
                space.hypothesis = space.hypothesis + ' ' + addition;
                space.contributions.push({ text: addition, author: player.name, playerIndex: player.index });
                log(`${player.name} expanded the hypothesis: "${addition}"`, 'important');
            }

            const existingInv = space.investments.find(i => i.playerIndex === player.index);
            if (existingInv) {
                existingInv.years += space.investmentCost;
            } else {
                space.investments.push({ player: player.name, years: space.investmentCost, playerIndex: player.index });
            }
            player.investLife(space.investmentCost);
            log(`${player.name} invested ${space.investmentCost} more years in the hypothesis.`);
            renderBoard();
            updatePlayerStats();
            checkGameEnd();
            if (!GameState.gameOver) {
                setTimeout(() => endTurn(), 500);
            }
        } else {
            log(`${player.name} decided not to invest in this hypothesis.`);
            setTimeout(() => endTurn(), 300);
        }
    } else {
        // Already proven
        log(`${player.name} observed the established theory.`);
        setTimeout(() => endTurn(), 300);
    }
}

function handleAIRecruitSpace(player) {
    const decision = makeAIDecision(player, null, 'recruit');

    if (decision.action === 'hire' && decision.students.length > 0) {
        let hired = false;
        for (const studentType of decision.students) {
            if (player.hireStudent(studentType)) {
                hired = true;
                break; // Just hire one per turn
            }
        }
        if (!hired) {
            log(`${player.name} couldn't afford to hire students.`);
        }
        updatePlayerStats();
        setTimeout(() => endTurn(), 500);
    } else {
        log(`${player.name} decided not to hire any students.`);
        setTimeout(() => endTurn(), 300);
    }
}
