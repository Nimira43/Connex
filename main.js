import { DELAY_AI, GRID_CIRCLE, GRID_COLS, GRID_ROWS, MARGIN, COLOUR_BG, COLOUR_FRAME, COLOUR_FRAME_BOTTOM,COLOUR_RI, COLOUR_RI_DARK, COLOUR_AI, COLOUR_AI_DARK, COLOUR_TIE, COLOUR_TIE_DARK, COLOUR_WIN, TEXT_RI, TEXT_AI, TEXT_TIE, TEXT_WIN } from './js/constants.js'

const canvasEl = document.querySelector('canvas')
const ctx = canvasEl.getContext('2d')



let gameOver,
    gameTied,
    grid = [],
    playersTurn,
    timeAI

let width,
    height,
    margin
setDimensions()

canvasEl.addEventListener('click', click)
canvasEl.addEventListener('mousemove', highlightGrid)
window.addEventListener('resize', setDimensions)

let timeDiff, timeLast
requestAnimationFrame(playGame)

function playGame(timeNow) {
  if (!timeLast) {
    timeLast = timeNow
  }

  timeDiff = (timeNow - timeLast) / 1000
  timeLast = timeNow
  AI(timeDiff)
  drawBackground()
  drawGrid()
  drawText()
  requestAnimationFrame(playGame)
}







function newGame() {
  playersTurn = Math.random() < 0.5
  gameOver = false
  gameTied = false
  createGrid()
}



function setDimensions() {
  width = window.innerWidth
  height = window.innerHeight
  canvasEl.width = width
  canvasEl.height = height
  margin = MARGIN * Math.min(height, width)

  newGame()
}




