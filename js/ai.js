import { GRID_COLS, GRID_ROWS, DELAY_AI } from './constants.js'
import { state } from './state.js'
import { checkWin } from './winLogic.js'
import { highlightCell, selectCell } from './input.js'

export function AI(diff) {
  const { playersTurn, gameOver, grid } = state

  if (playersTurn || gameOver) return

  if (state.timeAI > 0) {
    state.timeAI -= diff
    if (state.timeAI <= 0) selectCell()
    return
  }

  const options = {
    winNow: [],
    blockWin: [],
    safe: [],
    risky: []
  }

  for (let col = 0; col < GRID_COLS; col++) {
    const cell = highlightCell(grid[0][col].centreX, grid[0][col].centreY)
    if (!cell) continue

    cell.owner = playersTurn
    if (checkWin(cell.row, cell.col)) {
      options.winNow.push(col)
      resetCell(cell)
      continue
    }

    cell.owner = !playersTurn
    if (checkWin(cell.row, cell.col)) {
      options.blockWin.push(col)
      resetCell(cell)
      continue
    }

    cell.owner = playersTurn

    if (cell.row > 0) {
      const below = grid[cell.row - 1][cell.col]
      below.owner = !playersTurn

      if (checkWin(below.row, below.col)) {
        options.risky.push(col)
      } else {
        options.safe.push(col)
      }

      below.owner = null
    } else {
      options.safe.push(col)
    }

    resetCell(cell)
  }

  for (const row of grid) {
    for (const c of row) c.winner = false
  }

  const chosenCol =
    pick(options.winNow) ??
    pick(options.blockWin) ??
    pick(options.safe) ??
    pick(options.risky)

  if (chosenCol != null) {
    highlightCell(grid[0][chosenCol].centreX, grid[0][chosenCol].centreY)
    state.timeAI = DELAY_AI
  }
}

function pick(arr) {
  return arr.length ? arr[Math.floor(Math.random() * arr.length)] : null
}

function resetCell(cell) {
  cell.owner = null
  cell.highlight = null
}

