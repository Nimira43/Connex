import { GRID_ROWS, GRID_COLS } from './constants.js'
import { state } from './state.js'

export function checkWin(row, col) {
  const { grid } = state

  const diagonalLeft = []
  const diagonalRight = []
  const horizontal = []
  const vertical = []

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
    } else if (cells[i].owner == lastOwner) {
      count++
      winningCells.push(cells[i])
    } else {
      count = 1
      winningCells = [cells[i]]
    }

    lastOwner = cells[i].owner

    if (count == 4) {
      for (const cell of winningCells) {
        cell.winner = true
      }
      return true
    }
  }
  return false
}
