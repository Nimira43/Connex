import {
  COLOUR_TIE,
  COLOUR_TIE_DARK,
  COLOUR_RI_DARK,
  COLOUR_AI_DARK,
  TEXT_TIE,
  TEXT_RI,
  TEXT_AI,
  TEXT_WIN,
} from './constants.js'
import { state } from './state.js'

export function drawText() {
  const { gameOver, gameTied, playersTurn, grid, ctx, width, height } = state

  if (!gameOver) {
    return
  }

  const size = grid[0][0].h

  ctx.font = size + 'px sans-serif'
  ctx.lineJoin = 'round'
  ctx.lineWidth = size / 10
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  ctx.fillStyle = gameTied
    ? COLOUR_TIE_DARK
    : playersTurn
      ? COLOUR_RI_DARK
      : COLOUR_AI_DARK

  const offset = size * 0.6
  const text = gameTied
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
