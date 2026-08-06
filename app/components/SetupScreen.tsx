export default function SetupScreen() {
  return (
    <div id="setup-screen" className="screen notebook-page">
      {/* Spiral binding decoration */}
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
        <h1 className="hand-title">
          <span className="title-underline">Theoropoly</span>
        </h1>
        <p className="subtitle"> How much would you sacrifice for science? </p>

        {/* Decorative tape */}
        <div className="tape tape-1"></div>

        <div className="setup-section sticky-note yellow">
          <div className="pushpin"></div>
          <h2>Research Topic</h2>
          <div className="input-group">
            <select id="entity-type" style={{ display: 'none' }}>
              <option value="explanation">Explanation</option>
              <option value="matter">Matter</option>
              <option value="creature">Creature</option>
              <option value="phenomenon">Social Phenomenon</option>
              <option value="place">Place</option>
              <option value="mechanism">Mechanism</option>
            </select>
          </div>
          <div className="input-group">
            <label htmlFor="entity-name">What are we studying?:</label>
            <div className="research-subject-input">
              <input type="text" id="entity-name" placeholder="e.g., The Existential Dust Bunny, Why cats judge our life choice..." />
              <button id="generate-entities-btn" className="sketch-btn suggest-btn"><p style={{ fontSize: '20px' }}>🎲</p></button>
            </div>
          </div>
          <div id="entity-suggestions-container" className="entity-suggestions-container" style={{ display: 'none' }}>
            <div id="entity-suggestions" className="entity-suggestions"></div>
          </div>
        </div>

        <div className="setup-section sticky-note pink">
          <div className="paper-clip">📎</div>
          <h2>Players (2-4)</h2>
          <div className="button-group">
            <button id="add-player-btn" className="sketch-btn">+ Add Player</button>
            <button id="remove-player-btn" className="sketch-btn">- Remove Player</button>
          </div>
          <div id="group-list" className="group-list"></div>
        </div>

        <div className="setup-section sticky-note blue">
          <div className="tape tape-corner"></div>
          <h2>🗺️ Board Configuration</h2>
          <div className="input-group">
            <label htmlFor="map-select">Select Map:</label>
            <select id="map-select">
              <option value="default">Default Board</option>
              <option value="custom">Load Custom Map</option>
            </select>
          </div>
          <div id="custom-map-input" style={{ display: 'none' }}>
            <textarea id="map-text" placeholder="Paste map configuration here..."></textarea>
          </div>
          <div className="input-group">
            <label htmlFor="starting-age">Initial Player Age:</label>
            <input type="number" id="starting-age" min="1" max="79" defaultValue="70" />
          </div>
        </div>

        <button id="start-game-btn" className="sketch-btn large">▶ START GAME!</button>

        {/* Decorative stickers */}
        <div className="sticker sticker-star">💯</div>
        <div className="sticker sticker-lightbulb">💡</div>
      </div>
    </div>
  )
}
