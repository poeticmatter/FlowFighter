import type { BasicMoveId, MoveId } from './types'

interface MoveInfo {
  label: string
  color: string
  /** Shown on the move card, matching the board game's card text. */
  effect: string
}

export const MOVES: Record<MoveId, MoveInfo> = {
  attack: { label: 'Attack', color: '#dc2626', effect: 'At the top, you win. Otherwise go up 1.' },
  block: { label: 'Block', color: '#2563eb', effect: 'Opponent goes down 1.' },
  throw: { label: 'Throw', color: '#16a34a', effect: 'Opponent at the bottom? You win. Otherwise they drop to 1.' },
  special: { label: 'Special', color: '#7c3aed', effect: 'Depends on your step. Win it and follow the purple arrow.' },
}

export const MOVE_IDS: MoveId[] = ['attack', 'block', 'throw', 'special']

export const BASIC_MOVE_IDS: BasicMoveId[] = ['attack', 'block', 'throw']

/** The rock-paper-scissors triangle: each basic move beats exactly one other. */
const BEATS: Record<BasicMoveId, BasicMoveId> = {
  attack: 'throw',
  block: 'attack',
  throw: 'block',
}

export function doesBasicMoveBeat(move: BasicMoveId, opponentMove: BasicMoveId): boolean {
  return BEATS[move] === opponentMove
}
