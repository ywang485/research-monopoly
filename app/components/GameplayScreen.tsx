export default function GameplayScreen() {
  return (
    <>
      <div id="game-screen" className="screen" style={{ display: 'none' }}>
        <div className="notebook-spread-container">
          {/* Paper labels for headers (stapled across top) */}
            <div className="paper-label-row">
              <div id="entity-display" className="paper-label">
                <div className="staple"></div>
                <span id="entity-info"></span>
              </div>
              <div id="turn-display" className="paper-label">
                <div className="staple"></div>
                <span id="current-turn"></span>
              </div>
            </div>
          {/* Two-page spread */}
          <div className="two-page-spread">
            {/* LEFT PAGE - Game Board */}
            <div className="notebook-page left-page" style={{ border: 'none', boxShadow: 'none'}}>
              <div className="spiral-binding">
              <div className="spiral-ring"></div>
              <div className="spiral-ring"></div>
              <div className="spiral-ring"></div>
              <div className="spiral-ring"></div>
              <div className="spiral-ring"></div>
              <div className="spiral-ring"></div>
              <div className="spiral-ring"></div>
              <div className="spiral-ring"></div>
            </div>
              <div id="board-wrapper">
                <div id="board-container">
                  <canvas id="game-board"></canvas>
                </div>
                <div id="zoom-controls">
                  <button id="zoom-in-btn" className="zoom-btn" title="Zoom In">+</button>
                  <span id="zoom-level">100%</span>
                  <button id="zoom-out-btn" className="zoom-btn" title="Zoom Out">−</button>
                  <button id="zoom-reset-btn" className="zoom-btn" title="Reset Zoom">⟲</button>
                </div>
              </div>
            </div>
            {/* RIGHT PAGE - Info Panels */}
            <div className="right-page">
              <div className="right-page-content">
              <div id="llm-status" className="llm-indicator">
                <span className="llm-icon">🤖</span>
                <span className="llm-text">Checking AI...</span>
              </div>
                {/* Theories Panel */}
                <div id="theories-panel" className="side-sticky blue">
                  <div className="paper-clip clip-small"></div>
                  <h3>Established Theories</h3>
                  <div id="theories-list"></div>
                </div>

                {/* Scientists Panel */}
                <div id="players-panel" className="side-sticky green">
                  <div className="fold-corner"></div>
                  <h3>Scientists</h3>
                  <div id="player-stats"></div>
                </div>

                {/* Draggable mini notepad for game log */}
                <div id="game-log-container" className="mini-notepad">
                  <div className="notepad-header">
                    <span className="notepad-title">Game Log</span>
                    <div className="notepad-clip">📎</div>
                  </div>
                  <div id="game-log" className="notepad-content"></div>
                </div>
              </div>


                {/* Dice button */}
                <div id="action-buttons">
                  <button id="roll-dice-btn" className="sketch-btn roll-btn">🎲 Roll Dice</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hidden underdeterminism info for tooltip */}
        <div id="underdeterminism-info" style={{ display: 'none' }}>
          <span className="npc-icon">🎲</span>
          <span id="npc-position">Position: Start</span>
        </div>

      {/* Modal for actions */}
      <div id="modal" className="modal" style={{ display: 'none' }}>
        <div className="modal-content torn-note">
          <div className="tape tape-top"></div>
          <h2 id="modal-title"></h2>
          <div id="modal-body"></div>
          <div id="modal-buttons"></div>
        </div>
      </div>

      {/* Game Over Screen */}
      <div id="gameover-screen" className="screen notebook-page" style={{ display: 'none' }}>
        <div className="spiral-binding">
          <div className="spiral-ring"></div>
          <div className="spiral-ring"></div>
          <div className="spiral-ring"></div>
          <div className="spiral-ring"></div>
          <div className="spiral-ring"></div>
          <div className="spiral-ring"></div>
          <div className="spiral-ring"></div>
          <div className="spiral-ring"></div>
        </div>

        <div className="page-content">
          <h1 className="hand-title">GAME OVER</h1>
          <div id="winner-display" className="winner-card"></div>

          {/* Theory Revelation Section */}
          <div id="theory-revelation" className="theory-revelation notebook-insert">
            <div className="tape tape-left"></div>
            <div className="tape tape-right"></div>
            <h2 className="revelation-title">📜 THE GRAND UNIFIED THEORY 📜</h2>
            <div id="theory-entity" className="theory-entity"></div>
            <div id="theory-content" className="theory-content">
              <div className="theory-loading">✏️ Synthesizing groundbreaking discoveries...</div>
            </div>
            <div id="theory-contributors" className="theory-contributors"></div>
          </div>

          <div id="final-stats" className="stats-board"></div>
          <button id="play-again-btn" className="sketch-btn large">PLAY AGAIN!</button>

          <div className="sticker sticker-trophy">🏆</div>
        </div>
      </div>

      {/* Board Tooltip */}
      <div id="board-tooltip" className="board-tooltip sketch-tooltip"></div>
    </>
  )
}
