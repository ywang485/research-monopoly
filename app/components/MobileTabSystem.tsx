'use client'

export default function MobileTabSystem() {
  return (
    <>
      {/* Mobile Tab Bar */}
      <div className="mobile-tab-bar" id="mobile-tab-bar">
        <button className="mobile-tab-btn" data-tab="players">
          <span className="tab-icon">👨‍🔬</span>
          <span className="tab-label">Players</span>
        </button>
        <button className="mobile-tab-btn" data-tab="theories">
          <span className="tab-icon">📜</span>
          <span className="tab-label">Theories</span>
        </button>
        <button className="mobile-tab-btn" data-tab="log">
          <span className="tab-icon">📝</span>
          <span className="tab-label">Log</span>
        </button>
        <button className="mobile-tab-btn roll-tab" data-tab="dice" id="mobile-dice-btn">
          <span className="tab-icon">🎲</span>
          <span className="tab-label">Roll</span>
        </button>
      </div>

      {/* Players Panel */}
      <div className="mobile-tab-panel" id="mobile-players-panel">
        <div className="mobile-tab-panel-header">
          <h3>Scientists</h3>
          <button className="mobile-tab-close" data-close="players">×</button>
        </div>
        <div id="mobile-player-stats"></div>
      </div>

      {/* Theories Panel */}
      <div className="mobile-tab-panel" id="mobile-theories-panel">
        <div className="mobile-tab-panel-header">
          <h3>Established Theories</h3>
          <button className="mobile-tab-close" data-close="theories">×</button>
        </div>
        <div id="mobile-theories-list"></div>
      </div>

      {/* Game Log Panel */}
      <div className="mobile-tab-panel" id="mobile-log-panel">
        <div className="mobile-tab-panel-header">
          <h3>Game Log</h3>
          <button className="mobile-tab-close" data-close="log">×</button>
        </div>
        <div id="mobile-game-log"></div>
      </div>
    </>
  )
}
