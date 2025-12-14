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
    cell = highlightCell(grid[0][i].centreX, grid[0][i].centreY)

    if (Cell == null) {
      continue
    }

    cell.owner = playersTurn

    if (checkWin(cell.row, cell.col)) {
      options[0].push(i)
    } else {
      cell.owner = !playersTurn
      
      if (checkWin(cell.row, cell.col)) {
        options[1].push(i)
      } else {
        cell.owner = playersTurn
      
        if (cell.row > 0) {
          grid[cell.row - 1][cell.col].owner = !playersTurn
          
          if (checkWin(cell.row - 1, cell.col)) {
            options[3].push(i)
          }

          else {
            options[2].push(i)
          }

          grid[cell.row - 1][cell.col].owner = null
        }

        else {
          options[2].push(i)
        }
      }
    }

    cell.highlight = null
    cell.owner = null
  }

  for (let row of grid) {
    for (let cell of row) {
      cell.winner = false
    }
  }

  let col

  if (options[0].length > 0) {
    col = options[0][Math.floor(Math.random() * options[0].length)]
  } else if (options[1].length > 0) {
    col = options[1][Math.floor(Math.random() * options[1].length)]
  } else if (options[2].length > 0) {
    col = options[2][Math.floor(Math.random() * options[2].length)]
  } if (options[3].length > 0) {
    col = options[3][Math.floor(Math.random() * options[3].length)]
  }

  highlightCell(grid[0][col].centreX, grid[0][col].centreY)
  timeAI = DELAY_AI
}

function highlightCell(x, y) {
  let col = null

  for (let row of grid) {
    for (let cell of row) {
      cell.highlight = null

      if (cell.contains(x, y)) {
        col = cell.col
      }
    }
  }

  if (col == null) {
    return
  }

  for (let i = GRID_ROWS - 1; i >= 0; i--) {
    if (grid[i][col].owner == null) {
      grid[i][col].highlight = playersTurn
      return grid[i][col]
    }
  } 
  return null
}

function highlightGrid(e) {
  if (!playersTurn || gameOver) {
    return
  }

  highlightCell(e.clientX, e.clientY)
}

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




