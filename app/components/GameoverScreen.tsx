export default function GameoverScreen() {
  return (
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
          <h2 className="revelation-title">THE GRAND UNIFIED THEORY </h2>
          <div id="theory-entity" className="theory-entity"></div>
          <div id="theory-content" className="theory-content">
            <div className="theory-loading">✏️ Synthesizing groundbreaking discoveries...</div>
          </div>
          <div id="theory-contributors" className="theory-contributors"></div>
        </div>

        <div id="final-stats" className="stats-board"></div>
        <button id="play-again-btn" className="sketch-btn large">🔄 PLAY AGAIN!</button>

        <div className="sticker sticker-trophy">🏆</div>
      </div>
    </div>
  )
}
