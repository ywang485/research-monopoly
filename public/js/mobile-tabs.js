// Mobile Tab System for phone-sized screens

let isMobileView = false;
let currentOpenTab = null;

function checkMobileView() {
    isMobileView = window.innerWidth <= 480;
    return isMobileView;
}

function initMobileTabSystem() {
    // Always attach handlers - CSS controls visibility via media queries
    // This ensures handlers work even when page loads at desktop width then resizes

    const tabBar = document.getElementById('mobile-tab-bar');
    if (!tabBar) return;

    // Update the mobile view state
    checkMobileView();

    // Tab button click handlers
    tabBar.querySelectorAll('.mobile-tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tabName = btn.dataset.tab;

            if (tabName === 'dice') {
                // Trigger dice roll via the main roll button
                const rollBtn = document.getElementById('roll-dice-btn');
                if (rollBtn && !rollBtn.disabled) {
                    rollBtn.click();
                }
                return;
            }

            toggleMobilePanel(tabName);
        });
    });

    // Close button handlers
    document.querySelectorAll('.mobile-tab-close').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.dataset.close;
            closeMobilePanel(tabName);
        });
    });

    // Close panel when clicking outside (on the backdrop area)
    document.addEventListener('click', (e) => {
        if (currentOpenTab &&
            !e.target.closest('.mobile-tab-panel') &&
            !e.target.closest('.mobile-tab-btn') &&
            !e.target.closest('.modal')) {
            closeMobilePanel(currentOpenTab);
        }
    });

    // Update dice button state based on game state
    updateMobileDiceButton();
}

function toggleMobilePanel(tabName) {
    const panel = document.getElementById(`mobile-${tabName}-panel`);
    const btn = document.querySelector(`[data-tab="${tabName}"]`);

    if (!panel || !btn) return;

    if (currentOpenTab === tabName) {
        closeMobilePanel(tabName);
    } else {
        // Close any open panel
        if (currentOpenTab) {
            closeMobilePanel(currentOpenTab);
        }

        // Open new panel
        panel.classList.add('open');
        btn.classList.add('active');
        currentOpenTab = tabName;

        // Sync content with desktop panels
        syncMobilePanelContent(tabName);
    }
}

function closeMobilePanel(tabName) {
    const panel = document.getElementById(`mobile-${tabName}-panel`);
    const btn = document.querySelector(`[data-tab="${tabName}"]`);

    if (panel) panel.classList.remove('open');
    if (btn) btn.classList.remove('active');
    currentOpenTab = null;
}

function closeAllMobilePanels() {
    document.querySelectorAll('.mobile-tab-panel').forEach(panel => {
        panel.classList.remove('open');
    });
    document.querySelectorAll('.mobile-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    currentOpenTab = null;
}

function syncMobilePanelContent(tabName) {
    switch (tabName) {
        case 'players':
            const playerStats = document.getElementById('player-stats');
            const mobilePlayerStats = document.getElementById('mobile-player-stats');
            if (playerStats && mobilePlayerStats) {
                mobilePlayerStats.innerHTML = playerStats.innerHTML;
            }
            break;
        case 'theories':
            const theoriesList = document.getElementById('theories-list');
            const mobileTheoriesList = document.getElementById('mobile-theories-list');
            if (theoriesList && mobileTheoriesList) {
                mobileTheoriesList.innerHTML = theoriesList.innerHTML;
            }
            break;
        case 'log':
            const gameLog = document.getElementById('game-log');
            const mobileGameLog = document.getElementById('mobile-game-log');
            if (gameLog && mobileGameLog) {
                mobileGameLog.innerHTML = gameLog.innerHTML;
                // Scroll to bottom of log
                mobileGameLog.scrollTop = mobileGameLog.scrollHeight;
            }
            break;
    }
}

// Update mobile panels when desktop content changes
function updateMobilePanels() {
    if (!isMobileView) return;

    // Always sync if a panel is open
    if (currentOpenTab) {
        syncMobilePanelContent(currentOpenTab);
    }

    // Update dice button state
    updateMobileDiceButton();
}

// Update the mobile dice button state
function updateMobileDiceButton() {
    if (!isMobileView) return;

    const mobileDiceBtn = document.getElementById('mobile-dice-btn');
    const rollBtn = document.getElementById('roll-dice-btn');

    if (mobileDiceBtn && rollBtn) {
        mobileDiceBtn.disabled = rollBtn.disabled;
        if (rollBtn.disabled) {
            mobileDiceBtn.classList.add('disabled');
        } else {
            mobileDiceBtn.classList.remove('disabled');
        }
    }
}

// Window resize handler
window.addEventListener('resize', () => {
    const wasMobile = isMobileView;
    checkMobileView();

    // Close panels when switching from mobile to desktop
    if (wasMobile && !isMobileView) {
        closeAllMobilePanels();
    }

    // Reinitialize if switched to mobile
    if (!wasMobile && isMobileView) {
        initMobileTabSystem();
    }
});

// Export for use in other modules
window.initMobileTabSystem = initMobileTabSystem;
window.updateMobilePanels = updateMobilePanels;
window.updateMobileDiceButton = updateMobileDiceButton;
window.checkMobileView = checkMobileView;
