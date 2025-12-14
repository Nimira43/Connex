import { state } from './state.js'
import { AI } from './ai.js'
import { drawBackground, drawGrid, createGrid } from './grid.js'
import { drawText } from './ui.js'

export function setDimensions() {
  const { canvasEl } = state
  state.width = window.innerWidth
  state.height = window.innerHeight
  canvasEl.width = state.width
  canvasEl.height = state.height
  state.margin = Math.min(state.width, state.height) 

  newGame()
}

export function newGame() {
  state.playersTurn = Math.random() < 0.5
  state.gameOver = false
  state.gameTied = false
  createGrid()
}

export function playGame(timeNow) {
  if (!state.timeLast) {
    state.timeLast = timeNow
  }

  const timeDiff = (timeNow - state.timeLast) / 1000
  state.timeLast = timeNow

  AI(timeDiff)
  drawBackground()
  drawGrid()
  drawText()

  requestAnimationFrame(playGame)
}
