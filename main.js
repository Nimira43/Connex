import { DELAY_AI, GRID_CIRCLE, GRID_COLS, GRID_ROWS, MARGIN, COLOUR_BG, COLOUR_FRAME, COLOUR_FRAME_BOTTOM,COLOUR_RI, COLOUR_RI_DARK, COLOUR_AI, COLOUR_AI_DARK, COLOUR_TIE, COLOUR_TIE_DARK, COLOUR_WIN, TEXT_RI, TEXT_AI, TEXT_TIE, TEXT_WIN } from './js/constants.js'

const canvasEl = document.querySelector('canvas')
const ctx = canvasEl.getContext('2d')

class Cell {
  constructor(left, top, w, h, row, col) {
    this.left = left
    this.right = left + w
    this.top = top
    this.bottom = top + h
    this.w = w
    this.h = h
    this.row = row
    this.col = col
    this.centreX = left + w / 2
    this.centreY = top + h / 2
    this.r = (w * GRID_CIRCLE) / 2
    this.highlight = null
    this.owner = null
    this.winner = false
  }

  contains(x, y) {
    return (
      x > this.left && 
      x < this.right && 
      y > this.top && 
      y < this.bottom
    )
  }

  draw(canvasContext) {
    let colour = this.owner == null
      ? COLOUR_BG 
      : this.owner
        ? COLOUR_RI
        : COLOUR_AI

    canvasContext.fillStyle = colour
    canvasContext.beginPath()
    canvasContext.arc(
      this.centreX,
      this.centreY,
      this.r,
      0,
      Math.PI * 2
    )
    canvasContext.fill()
  
    if (this.winner || this.highlight != null) {
      colour = this.winner 
        ? COLOUR_WIN
        : this.highlight
          ? COLOUR_RI
          : COLOUR_AI
      
      canvasContext.lineWidth = this.r / 4
      canvasContext.strokeStyle = colour
      canvasContext.beginPath()
      canvasContext.arc(
        this.centreX,
        this.centreY,
        this.r,
        0,
        Math.PI * 2  
      )
      canvasContext.stroke()
    }
  }
}

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

function checkWin(row, col) {
  let diagonalLeft = []
  let diagonalRight = []
  let horizontal = []
  let vertical = []

  for (let i = 0; i < GRID_ROWS; i++) {
    for (let j = 0; j < GRID_COLS; j++) {
      if (i == row) horizontal.push(grid[i][j])
      if (j == col) vertical.push(grid[i][j])
      if (i - j == row - col) diagonalLeft.push(grid[i][j])
      if (i + j == row + col) diagonalRight.push(grid[i][j])
    }
  }
  return (  
    connex(diagonalLeft) ||
    connex(diagonalRight) ||
    connex(horizontal) ||
    connex(vertical)
  )
}

function connex(cells = []) {
  let count = 0
  let lastOwner = null
  let winningCells = []

  for (let i = 0; i < cells.length; i++) {
    if (cells[i].owner == null) {
      count = 0
      winningCells = []
    }
    else if (cells[i].owner == lastOwner) {
      count++
      winningCells.push(cells[i])
    }
    else {
      count = 1
      winningCells = []
      winningCells.push(cells[i])
    }

    lastOwner = cells[i].owner

    if (count == 4) {
      for (let cell of winningCells) {
        cell.winner = true
      }
      return true
    }
  }
  return false
}

function click() {
  if (gameOver) {
    newGame()
    return
  }

  if (!playersTurn) {
    return
  }

  selectCell()
}

function createGrid() {
  grid = []
  let cell, marginX, marginY

  if (
    ((width - margin * 2) * GRID_ROWS) /
    GRID_COLS < height - margin * 2
  ) {
    cell = (width - margin * 2) / GRID_COLS
    marginX = margin
    marginY = (height - cell * GRID_ROWS) / 2
  } else {
    cell = (height - margin * 2) / GRID_ROWS
    marginY = margin
    marginX = (width - cell * GRID_COLS) / 2
  }

  for (let i = 0; i < GRID_ROWS; i++) {
    grid[i] = []
    for(let j = 0; j < GRID_COLS; j++) {
      let left =  marginX + j * cell 
      let top =  marginY + i * cell
      grid[i][j] = new Cell(left, top, cell, cell, i, j) 
    }
  }
}

function drawBackground() {
  ctx.fillStyle = COLOUR_BG
  ctx.fillRect(0, 0, width, height)
}

function drawGrid() {
  let cell = grid[0][0]
  let frameHeight = cell.h * GRID_ROWS
  let frameWidth = cell.w * GRID_COLS
  ctx.fillStyle = COLOUR_FRAME
  ctx.fillRect(
    cell.left,
    cell.top,
    frameWidth,
    frameHeight
  )
  ctx.fillStyle = COLOUR_FRAME_BOTTOM
  ctx.fillRect(
    cell.left - margin / 2,
    cell.top + frameHeight - margin / 2,
    frameWidth + margin,
    margin
  )

  ctx.fill()

  for(let row of grid) {
    for (let cell of row) {
      cell.draw(ctx)
    }
  }
}

function drawText() {
  if (!gameOver) {
    return
  }

  let size = grid[0][0].h
  ctx.fillStyle  = gameTied
    ? COLOUR_TIE
    : playersTurn
    ? COLOUR_RI
    : COLOUR_AI
  ctx.font = size + 'px sans-serif'
  ctx.lineJoin = 'round'
  ctx.lineWidth = size / 10
  ctx.fillStyle  = gameTied
    ? COLOUR_TIE_DARK
    : playersTurn
    ? COLOUR_RI_DARK
    : COLOUR_AI_DARK
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  let offset = size * 0.6
  let text = gameTied
    ? TEXT_TIE
    : playersTurn
      ? TEXT_RI
      : TEXT_AI

  if (gameTied) {
    ctx.strokeText(text, width / 2, height / 2)
    ctx.fillText(text, width / 2, height / 2)
  } else {
    ctx.strokeText(text, width / 2, height / 2 - offset)
    ctx.fillText(text, width / 2, height / 2 - offset)
    ctx.strokeText(TEXT_WIN, width / 2, height / 2 + offset)
    ctx.fillText(TEXT_WIN, width / 2, height / 2 + offset)
  }
}

function AI(diff) {
  if (playersTurn || gameOver) {
    return
  }

  if (timeAI > 0) {
    timeAI -= diff
    if (timeAI <= 0) {
      selectCell()
    }
    return
  }

  let options = []
  options[0] = []
  options[1] = []
  options[2] = []
  options[3] = []

  let cell

  for (let i = 0; i < GRID_COLS; i++) {
    cell = highlightCell(
      grid[0][i].centreX,
      grid[0][i].centreY,
    )
  }
}

function highlightCell(x, y) {}

function highlightGrid(e) {}

function newGame() {
  playersTurn = Math.random() < 0.5
  gameOver = false
  gameTied = false
  createGrid()
}

function selectCell() {
  let highlighting = false
  OUTER: for (let row of grid) {
    for (let cell of row) {
      if (cell.highlight != null) {
        highlighting = true
        cell.highlight = null
        cell.owner = playersTurn

        if (checkWin(cell.row, cell.col)) {
          gameOver = true
        }
        break OUTER
      }
    }
  }

  if (!highlighting) {
    return
  }

  if (!gameOver) {
    gameTied = true
    OUTER: for (let row of grid) {
      for (let cell of row) {
        if (cell.owner == null) {
          gameTied = false
          break OUTER
        }
      }
    }

    if (gameTied) {
      gameOver = true
    }
  }

  if (!gameOver) {
    playersTurn = !playersTurn
  }
}

function setDimensions() {
  width = window.innerWidth
  height = window.innerHeight
  canvasEl.width = width
  canvasEl.height = height
  margin = MARGIN * Math.min(height, width)

  newGame()
}




