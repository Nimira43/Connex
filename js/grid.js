import { Cell } from './Cell.js'
import {
  GRID_ROWS,
  GRID_COLS,
  MARGIN,
  COLOUR_BG,
  COLOUR_FRAME,
  COLOUR_FRAME_BOTTOM,
} from './constants.js'
import { state } from './state.js'

export function createGrid() {
  const { width, height } = state
  state.grid = []

  let cellSize, marginX, marginY

  if (((
    width - MARGIN * 2 * Math.min(width, height)) * GRID_ROWS) / GRID_COLS <
    height - MARGIN * 2 * Math.min(width, height)
  ) {
    cellSize = (width - MARGIN * 2 * Math.min(width, height)) / GRID_COLS
    marginX = MARGIN * Math.min(width, height)
    marginY = (height - cellSize * GRID_ROWS) / 2
  } else {
    cellSize = (height - MARGIN * 2 * Math.min(width, height)) / GRID_ROWS
    marginY = MARGIN * Math.min(width, height)
    marginX = (width - cellSize * GRID_COLS) / 2
  }

  for (let i = 0; i < GRID_ROWS; i++) {
    state.grid[i] = []
    for (let j = 0; j < GRID_COLS; j++) {
      const left = marginX + j * cellSize
      const top = marginY + i * cellSize
      state.grid[i][j] = new Cell(left, top, cellSize, cellSize, i, j)
    }
  }
}

export function drawBackground() {
  const { ctx, width, height } = state
  ctx.fillStyle = COLOUR_BG
  ctx.fillRect(0, 0, width, height)
}

export function drawGrid() {
  const { ctx, grid } = state
  const cell = grid[0][0]
  const frameHeight = cell.h * grid.length
  const frameWidth = cell.w * grid[0].length

  ctx.fillStyle = COLOUR_FRAME
  ctx.fillRect(
    cell.left,
    cell.top,
    frameWidth,
    frameHeight
  )

  const margin = cell.w * 0.5
  ctx.fillStyle = COLOUR_FRAME_BOTTOM
  ctx.fillRect(
    cell.left - margin,
    cell.top + frameHeight - margin,
    frameWidth + margin * 2,
    margin
  )

  for (const row of grid) {
    for (const c of row) {
      c.draw(ctx)
    }
  }
}
