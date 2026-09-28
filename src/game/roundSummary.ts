import { MOVES } from './moves'
import type { RoundResult } from './types'

/** One line saying which card won the exchange, e.g. "Attack beats Throw". */
export function describeExchange({ moves, resolvedBy }: RoundResult): string {
  const [p1Label, p2Label] = [MOVES[moves[1]].label, MOVES[moves[2]].label]

  if (resolvedBy.length === 0) {
    return moves[1] === 'special' ? 'Specials on the same step: nothing happens' : 'Throw meets Throw: nothing happens'
  }
  if (resolvedBy.length === 2) {
    return moves[1] === 'attack' ? 'Attack meets Attack: both climb' : 'Block meets Block: both drop'
  }
  if (moves[1] === 'special' && moves[2] === 'special') return 'The higher Special wins'
  return resolvedBy[0] === 1 ? `${p1Label} beats ${p2Label}` : `${p2Label} beats ${p1Label}`
}
