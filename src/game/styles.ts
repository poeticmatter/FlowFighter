import { BASIC_MOVE_IDS } from './moves'
import type { BasicMoveId, StyleId } from './types'

export const BOTTOM_STEP = 1
export const TOP_STEP = 5
export const START_STEP = 2
/** A destination past the top step: the trophy. Reaching it wins. */
export const WIN_STEP = TOP_STEP + 1

export interface SpecialStep {
  step: number
  beats: BasicMoveId[]
  losesTo: BasicMoveId[]
  /** Where the purple arrow leads; WIN_STEP means the trophy. */
  destination: number
}

export interface Style {
  id: StyleId
  name: string
  emoji: string
  accentColor: string
  /** Indexed by step - 1, bottom step first. */
  specialSteps: SpecialStep[]
}

interface SpecialStepDefinition {
  beats: BasicMoveId[]
  destination: number
}

/**
 * Bottom step first, as printed on the boards. The top step beats no basic move: its
 * Special only wins the Special mirror against a lower opponent.
 */
const SPECIAL_STEPS_BY_STYLE: Record<StyleId, SpecialStepDefinition[]> = {
  crane: [
    { beats: ['block'], destination: 3 },
    { beats: ['attack', 'throw'], destination: 3 },
    { beats: ['throw'], destination: 5 },
    { beats: ['attack', 'block'], destination: 5 },
    { beats: [], destination: WIN_STEP },
  ],
  tiger: [
    { beats: ['attack', 'block'], destination: 2 },
    { beats: ['throw'], destination: 4 },
    { beats: ['block', 'throw'], destination: 4 },
    { beats: ['attack'], destination: WIN_STEP },
    { beats: [], destination: WIN_STEP },
  ],
}

function buildStyle(id: StyleId, name: string, emoji: string, accentColor: string): Style {
  const specialSteps = SPECIAL_STEPS_BY_STYLE[id].map(({ beats, destination }, index) => ({
    step: index + 1,
    beats,
    losesTo: BASIC_MOVE_IDS.filter(move => !beats.includes(move)),
    destination,
  }))
  return { id, name, emoji, accentColor, specialSteps }
}

export const STYLES: Record<StyleId, Style> = {
  crane: buildStyle('crane', 'Crane', '🕊️', '#475569'),
  tiger: buildStyle('tiger', 'Tiger', '🐯', '#ca8a04'),
}

export const STYLE_IDS: StyleId[] = ['crane', 'tiger']

export function getSpecialStep(styleId: StyleId, step: number): SpecialStep {
  const specialStep = STYLES[styleId].specialSteps[step - 1]
  if (!specialStep) throw new Error(`${styleId} has no step ${step}`)
  return specialStep
}
