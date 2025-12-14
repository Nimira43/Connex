import { GRID_ROWS } from './constants.js'
import { state } from './state.js'
import { checkWin } from './winLogic.js'

export function click() {
  const { gameOver, playersTurn } = state

  if (gameOver) {
    return
  }

  if (!playersTurn) {
    return
  }

  selectCell()
}

export function highlightGrid(e) {
  const { playersTurn, gameOver } = state
  if (!playersTurn || gameOver) {
    return
  }

  highlightCell(e.clientX, e.clientY)
}

export function highlightCell(x, y) {
  const { grid, playersTurn } = state
  let col = null

  for (const row of grid) {
    for (const cell of row) {
      cell.highlight = null
      if (cell.contains(x, y)) {
        col = cell.col
      }
    }
  }

  if (col == null) {
    return null
  }

  for (let i = GRID_ROWS - 1; i >= 0; i--) {
    if (grid[i][col].owner == null) {
      grid[i][col].highlight = playersTurn
      return grid[i][col]
    }
  }

  return null
}

export function selectCell() {
  const { grid } = state
  let highlighting = false

  OUTER: for (const row of grid) {
    for (const cell of row) {
      if (cell.highlight != null) {
        highlighting = true
        cell.highlight = null
        cell.owner = state.playersTurn

        if (checkWin(cell.row, cell.col)) {
          state.gameOver = true
        }
        break OUTER
      }
    }
  }

  if (!highlighting) {
    return
  }

  if (!state.gameOver) {
    state.gameTied = true
    OUTER: for (const row of grid) {
      for (const cell of row) {
        if (cell.owner == null) {
          state.gameTied = false
          break OUTER
        }
      }
    }

    if (state.gameTied) {
      state.gameOver = true
    }
  }

  if (!state.gameOver) {
    state.playersTurn = !state.playersTurn
  }
}
