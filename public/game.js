// Theory Investment Game - Main Entry Point
//
// This file serves as the entry point and initializes the game.
// The game logic is organized into the following modules:
//   - js/constants.js  - Game constants and configuration
//   - js/utils.js      - Utility functions
//   - js/sound.js      - Sound system
//   - js/rendering.js  - Board rendering functions
//   - js/game-logic.js - Core game mechanics
//   - js/ui.js         - UI handling
//   - js/ai.js         - AI and LLM system

// ============================================
// INITIALIZATION
// ============================================

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initSetupScreen();
    initZoomControls();
    // Check LLM availability (async, non-blocking)
    checkLLMAvailability();
});

// Redraw board on window resize
window.addEventListener('resize', () => {
    if (GameState.board && GameState.board.length > 0) {
        renderBoard();
    }
});
