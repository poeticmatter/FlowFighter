import type { GameRules, PlayerSlot } from '../platform/types'
import { doesBasicMoveBeat } from './moves'
import { BOTTOM_STEP, START_STEP, TOP_STEP, WIN_STEP, getSpecialStep } from './styles'
import type { FlowPlan, FlowSettings, FlowState, MatchResult, MoveId, StyleId } from './types'

const PLAYERS: PlayerSlot[] = [1, 2]

function opponentOf(player: PlayerSlot): PlayerSlot {
  return player === 1 ? 2 : 1
}

/**
 * Whose card takes effect this round. Both basic moves the same is a mirror (both
 * resolve); Special vs Special goes to the higher step, with a tie resolving nothing.
 * Throw vs Throw is the one basic mirror with no effect.
 */
function findResolvingPlayers(moves: Record<PlayerSlot, MoveId>, state: FlowState): PlayerSlot[] {
  const [p1Move, p2Move] = [moves[1], moves[2]]

  if (p1Move === 'special' && p2Move === 'special') {
    if (state.steps[1] === state.steps[2]) return []
    return [state.steps[1] > state.steps[2] ? 1 : 2]
  }
  if (p1Move === p2Move) return p1Move === 'throw' ? [] : [1, 2]

  return PLAYERS.filter(player => doesMoveBeat(player, moves, state))
}

function doesMoveBeat(player: PlayerSlot, moves: Record<PlayerSlot, MoveId>, state: FlowState): boolean {
  const move = moves[player]
  const opponentMove = moves[opponentOf(player)]

  if (move === 'special') {
    if (opponentMove === 'special') return false
    return getSpecialStep(state.styles[player], state.steps[player]).beats.includes(opponentMove)
  }
  if (opponentMove === 'special') {
    const opponent = opponentOf(player)
    return !getSpecialStep(state.styles[opponent], state.steps[opponent]).beats.includes(move)
  }
  return doesBasicMoveBeat(move, opponentMove)
}

interface CardEffect {
  steps: Partial<Record<PlayerSlot, number>>
  isWin: boolean
}

/** What one resolving card does, read from the steps at the start of the round. */
function applyCard(player: PlayerSlot, move: MoveId, before: FlowState): CardEffect {
  const opponent = opponentOf(player)
  const ownStep = before.steps[player]
  const opponentStep = before.steps[opponent]

  switch (move) {
    case 'attack':
      return ownStep === TOP_STEP ? { steps: {}, isWin: true } : { steps: { [player]: ownStep + 1 }, isWin: false }
    case 'block':
      return { steps: { [opponent]: Math.max(BOTTOM_STEP, opponentStep - 1) }, isWin: false }
    case 'throw':
      return opponentStep === BOTTOM_STEP
        ? { steps: {}, isWin: true }
        : { steps: { [opponent]: BOTTOM_STEP }, isWin: false }
    case 'special': {
      const { destination } = getSpecialStep(before.styles[player], ownStep)
      return destination === WIN_STEP ? { steps: {}, isWin: true } : { steps: { [player]: destination }, isWin: false }
    }
  }
}

function decideMatchResult(winners: PlayerSlot[]): MatchResult | null {
  if (winners.length === 0) return null
  if (winners.length === 2) return { kind: 'draw' }
  return { kind: 'win', winner: winners[0] }
}

export function createInitialFlowState(styles: Record<PlayerSlot, StyleId>): FlowState {
  return {
    turn: 1,
    styles,
    steps: { 1: START_STEP, 2: START_STEP },
    lastRound: null,
    result: null,
  }
}

export const flowRules: GameRules<FlowSettings, FlowState, FlowPlan> = {
  createInitialState(settings) {
    return createInitialFlowState(settings.styles)
  },

  resolveTurn(state, p1Plan, p2Plan) {
    if (state.result !== null) return state

    const moves: Record<PlayerSlot, MoveId> = { 1: p1Plan.move, 2: p2Plan.move }
    const resolvedBy = findResolvingPlayers(moves, state)

    // Two cards resolve only in a mirror, where each touches a different step, so
    // applying both effects over the same starting state is order-independent.
    const effects = resolvedBy.map(player => ({ player, ...applyCard(player, moves[player], state) }))
    const steps = effects.reduce((current, effect) => ({ ...current, ...effect.steps }), state.steps)
    const winners = effects.filter(effect => effect.isWin).map(effect => effect.player)

    return {
      ...state,
      turn: state.turn + 1,
      steps,
      lastRound: { moves, stepsBefore: state.steps, resolvedBy },
      result: decideMatchResult(winners),
    }
  },
}
