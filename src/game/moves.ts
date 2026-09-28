import type { BasicMoveId, MoveId } from './types'

interface MoveInfo {
  label: string
  color: string
  /** The printed card's effect text, word for word from the board game's cards.json. */
  cardText: string
  /** The basic move this one beats; Special's matchups depend on the step instead. */
  stops: BasicMoveId | null
  /** Printed under the effect when the card has its own mirror rule. */
  mirrorRule?: string
}

export const MOVES: Record<MoveId, MoveInfo> = {
  attack: {
    label: 'Attack',
    color: '#dc2626',
    cardText: 'If you are at the top, you win. Otherwise, go up 1 step.',
    stops: 'throw',
  },
  block: {
    label: 'Block',
    color: '#2563eb',
    cardText: 'Opponent goes down 1 step.',
    stops: 'attack',
  },
  throw: {
    label: 'Throw',
    color: '#16a34a',
    cardText: 'If your opponent is at the bottom, you win. Otherwise, opponent goes down to step 1.',
    stops: 'block',
  },
  special: {
    label: 'Special',
    color: '#7c3aed',
    cardText: 'Follow the purple arrows.',
    stops: null,
    mirrorRule: 'Higher step wins. Same step: nothing happens.',
  },
}

export const MOVE_IDS: MoveId[] = ['attack', 'block', 'throw', 'special']

export const BASIC_MOVE_IDS: BasicMoveId[] = ['attack', 'block', 'throw']

export function doesBasicMoveBeat(move: BasicMoveId, opponentMove: BasicMoveId): boolean {
  return MOVES[move].stops === opponentMove
}
