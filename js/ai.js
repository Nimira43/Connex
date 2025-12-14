import { GRID_COLS, GRID_ROWS, DELAY_AI } from './constants.js'
import { state } from './state.js'
import { checkWin } from './winLogic.js'
import { highlightCell } from './input.js'

export function AI(diff) {
  const { playersTurn, gameOver, grid } = state

  if (playersTurn || gameOver) {
    return
  }

  if (state.timeAI > 0) {
    state.timeAI -= diff
    if (state.timeAI <= 0) {
      selectCurrentHighlight()
    }
    return
  }

  const options = [[], [], [], []]

  let cell

  for (let i = 0; i < GRID_COLS; i++) {
    cell = highlightCell(
      grid[0][i].centreX,
      grid[0][i].centreY
    )

    if (cell == null) {
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
          } else {
            options[2].push(i)
          }

          grid[cell.row - 1][cell.col].owner = null
        } else {
          options[2].push(i)
        }
      }
    }

    cell.highlight = null
    cell.owner = null
  }

  for (const row of grid) {
    for (const c of row) {
      c.winner = false
    }
  }

  let col = null

  if (options[0].length > 0) {
    col = randomFrom(options[0])
  } else if (options[1].length > 0) {
    col = randomFrom(options[1])
  } else if (options[2].length > 0) {
    col = randomFrom(options[2])
  } else if (options[3].length > 0) {
    col = randomFrom(options[3])
  }

  if (col != null) {
    highlightCell(grid[0][col].centreX, grid[0][col].centreY)
    state.timeAI = DELAY_AI
  }
}

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

import { selectCell } from './input.js'
function selectCurrentHighlight() {
  selectCell()
}
