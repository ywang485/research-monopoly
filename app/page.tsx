'use client'

import { useEffect } from 'react'
import SetupScreen from './components/SetupScreen'
import GameplayScreen from './components/GameplayScreen'

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
        setTimeout(async () => {
          // Load icon images first
          // @ts-ignore - loadIconImages is loaded from rendering.js
          if (typeof window.loadIconImages === 'function') {
            // @ts-ignore
            await window.loadIconImages()
          }

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
        <SetupScreen />
        <GameplayScreen />
      </div>
    </>
  )
}
