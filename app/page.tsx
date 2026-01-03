'use client'

import { useEffect } from 'react'

export default function Home() {
  useEffect(() => {
    // Load game modules
    const loadScript = (src: string) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.src = src
        script.onload = resolve
        script.onerror = reject
        document.body.appendChild(script)
      })
    }

    // Load all game scripts in order
    const loadGameScripts = async () => {
      try {
        await loadScript('/js/constants.js')
        await loadScript('/js/utils.js')
        await loadScript('/js/sound.js')
        await loadScript('/js/game-logic.js')
        await loadScript('/js/rendering.js')
        await loadScript('/js/ai.js')
        await loadScript('/js/ui.js')
        await loadScript('/js/draggable.js')

        // Wait a bit for all functions to be defined
        setTimeout(() => {
          // Initialize the game manually since DOMContentLoaded has already fired
          // @ts-ignore - These functions are loaded from the script files
          if (typeof window.initSetupScreen === 'function') {
            // @ts-ignore
            window.initSetupScreen()
            // @ts-ignore
            window.initZoomControls()
            // @ts-ignore
            window.checkLLMAvailability()
            // @ts-ignore
            window.initDraggableNotepad()
          }
        }, 100)

        // Set up resize handler
        // @ts-ignore
        const handleResize = () => {
          // @ts-ignore
          if (window.GameState && window.GameState.board && window.GameState.board.length > 0) {
            // @ts-ignore
            if (typeof window.renderBoard === 'function') {
              // @ts-ignore
              window.renderBoard()
            }
          }
        }
        window.addEventListener('resize', handleResize)

        return () => {
          window.removeEventListener('resize', handleResize)
        }
      } catch (error) {
        console.error('Failed to load game scripts:', error)
      }
    }

    loadGameScripts()
  }, [])

  return (
    <>
      <div className="paper-texture"></div>

      <div className="formula-doodles">
        <span className="formula f1">E = mc²</span>
        <span className="formula f2">∫∂x</span>
        <span className="formula f3">Σ(n²)</span>
        <span className="formula f4">λ = h/p</span>
        <span className="formula f5">∇ × B</span>
        <span className="formula f6">ψ(x,t)</span>
        <span className="formula f7">∂²u/∂t²</span>
        <span className="formula f8">lim x→∞</span>
        <span className="formula f9">∮ F·dr</span>
        <span className="formula f10">P(A|B)</span>
        <span className="formula f11">∆G = ∆H</span>
        <span className="formula f12">F = ma</span>
      </div>

      <div id="game-container">
        <div id="setup-screen" className="screen notebook-page">
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
              <span className="title-underline">Scientific Research is Gambling with Your Life</span>
            </h1>
            <p className="subtitle"> How much life can you invest? </p>

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
              <div id="player-inputs">
                <div className="player-input">
                  <input type="text" className="player-name" placeholder="Player 1 Name" defaultValue="Dr. Hypothesis" />
                  <input type="color" className="player-color" defaultValue="#F01AB3" />
                  <label className="ai-toggle"><input type="checkbox" className="player-ai" /> AI</label>
                </div>
                <div className="player-input">
                  <input type="text" className="player-name" placeholder="Player 2 Name" defaultValue="Prof. Theory" />
                  <input type="color" className="player-color" defaultValue="#3F1AF0" />
                  <label className="ai-toggle"><input type="checkbox" className="player-ai" defaultChecked /> AI</label>
                </div>
              </div>
              <div className="button-group">
                <button id="add-player-btn" className="sketch-btn">+ Add Player</button>
                <button id="remove-player-btn" className="sketch-btn">- Remove Player</button>
              </div>
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
            </div>

            <button id="start-game-btn" className="sketch-btn large">▶ START GAME!</button>

            <div className="sticker sticker-star">💯</div>
            <div className="sticker sticker-lightbulb">💡</div>
          </div>
        </div>

        <div id="game-screen" className="screen" style={{ display: 'none' }}>
          <div className="notebook-spread-container">
            {/* Paper labels for headers (stapled across top) */}
            <div className="paper-label-row">
              <div id="entity-display" className="paper-label">
                <div className="staple"></div>
                <span id="entity-info"></span>
              </div>
              <div id="llm-status" className="llm-indicator">
                <span className="llm-icon">🤖</span>
                <span className="llm-text">Checking AI...</span>
              </div>
              <div id="turn-display" className="paper-label">
                <div className="staple"></div>
                <span id="current-turn"></span>
              </div>
            </div>

            {/* Two-page spread */}
            <div className="two-page-spread">
              {/* LEFT PAGE - Game Board */}
              <div className="notebook-page left-page">
                {/* Spiral binding on left edge only */}
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

              {/* CENTER BINDING */}
              <div className="center-binding"></div>

              {/* RIGHT PAGE - Info Panels */}
              <div className="notebook-page right-page">
                <div className="right-page-content">
                  {/* Scientists Panel */}
                  <div id="players-panel" className="side-sticky green">
                    <div className="fold-corner"></div>
                    <h3>👩‍🔬 Scientists</h3>
                    <div id="player-stats"></div>
                  </div>

                  {/* Theories Panel */}
                  <div id="theories-panel" className="side-sticky orange">
                    <div className="paper-clip clip-small"></div>
                    <h3>📜 Established Theories</h3>
                    <div id="theories-list"></div>
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

          {/* Draggable mini notepad for game log */}
          <div id="game-log-container" className="mini-notepad">
            <div className="notepad-header">
              <span className="notepad-title">Game Log</span>
              <div className="notepad-clip">📎</div>
            </div>
            <div id="game-log" className="notepad-content"></div>
          </div>
        </div>

        <div id="modal" className="modal" style={{ display: 'none' }}>
          <div className="modal-content torn-note">
            <div className="tape tape-top"></div>
            <h2 id="modal-title"></h2>
            <div id="modal-body"></div>
            <div id="modal-buttons"></div>
          </div>
        </div>

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
            <h1 className="hand-title">📓 GAME OVER 📓</h1>
            <div id="winner-display" className="winner-card"></div>

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
            <button id="play-again-btn" className="sketch-btn large">🔄 PLAY AGAIN!</button>

            <div className="sticker sticker-trophy">🏆</div>
          </div>
        </div>

        <div id="board-tooltip" className="board-tooltip sketch-tooltip"></div>
      </div>
    </>
  )
}
