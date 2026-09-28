import { TOP_STEP, WIN_STEP } from './styles'

/**
 * Fixed geometry shared by the ladder rows and the SVG arrow overlays, so arrows land
 * exactly on the rows they point to. Scaled down from the printed board to fit a phone.
 */
export const ATTACK_LANE_WIDTH = 26
export const LADDER_WIDTH = 236
export const ARROW_AREA_WIDTH = 62
export const LADDER_RIGHT = ATTACK_LANE_WIDTH + LADDER_WIDTH
export const LADDER_TOTAL_WIDTH = LADDER_RIGHT + ARROW_AREA_WIDTH
export const WIN_ROW_HEIGHT = 40
export const STEP_ROW_HEIGHT = 56
export const ROW_GAP = 6
export const LADDER_HEIGHT = WIN_ROW_HEIGHT + TOP_STEP * (STEP_ROW_HEIGHT + ROW_GAP)

/**
 * Every arrow climbs, leaving from the top half of its row and arriving in the bottom
 * half of a higher row. That keeps a row's incoming and outgoing arrows apart.
 */
const ARROW_OUT_OFFSET = -12
const ARROW_IN_OFFSET = 12

function getStepRowTop(step: number): number {
  if (step === WIN_STEP) return 0
  return WIN_ROW_HEIGHT + ROW_GAP + (TOP_STEP - step) * (STEP_ROW_HEIGHT + ROW_GAP)
}

function getStepRowCenter(step: number): number {
  const rowHeight = step === WIN_STEP ? WIN_ROW_HEIGHT : STEP_ROW_HEIGHT
  return getStepRowTop(step) + rowHeight / 2
}

export function getDepartureY(step: number): number {
  return getStepRowCenter(step) + ARROW_OUT_OFFSET
}

/** Arrows into the trophy row hit its middle; it has no outgoing arrow to avoid. */
export function getArrivalY(destination: number): number {
  const offset = destination === WIN_STEP ? 0 : ARROW_IN_OFFSET
  return getStepRowCenter(destination) + offset
}
