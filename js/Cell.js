import {
  GRID_CIRCLE,
  COLOUR_BG,
  COLOUR_FRAME,
  COLOUR_FRAME_BOTTOM,
  COLOUR_RI,
  COLOUR_RI_DARK,
  COLOUR_AI,
  COLOUR_AI_DARK,
  COLOUR_WIN,
} from './constants.js'

export class Cell {
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


