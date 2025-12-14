import './js/constants.js'
import { state } from './js/state.js'
import { click, highlightGrid } from './js/input.js'
import { setDimensions, playGame, newGame } from './js/game.js'

state.canvasEl = document.querySelector('canvas')
state.ctx = state.canvasEl.getContext('2d')

state.canvasEl.addEventListener('click', (e) => {
  if (state.gameOver) {
    newGame()
  } else {
    click(e)
  }
})

state.canvasEl.addEventListener('mousemove', highlightGrid)
window.addEventListener('resize', setDimensions)

setDimensions()
requestAnimationFrame(playGame)
