import type { PlayerSlot } from '../platform/types'

export type BasicMoveId = 'attack' | 'block' | 'throw'

export type MoveId = BasicMoveId | 'special'

export type StyleId = 'crane' | 'tiger'

export interface FlowSettings {
  styles: Record<PlayerSlot, StyleId>
}

export interface FlowPlan {
  turn: number
  move: MoveId
}

export interface RoundResult {
  moves: Record<PlayerSlot, MoveId>
  /** Steps at the start of the round, before any card resolved. */
  stepsBefore: Record<PlayerSlot, number>
  /** Players whose card took effect: none, one (it beat the other) or both (a mirror). */
  resolvedBy: PlayerSlot[]
}

export type MatchResult = { kind: 'win'; winner: PlayerSlot } | { kind: 'draw' }

export interface FlowState {
  turn: number
  styles: Record<PlayerSlot, StyleId>
  steps: Record<PlayerSlot, number>
  lastRound: RoundResult | null
  result: MatchResult | null
}
