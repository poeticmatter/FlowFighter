import { describe, expect, it } from 'vitest'
import { createInitialFlowState, flowRules } from './rules'
import type { FlowState, MoveId, StyleId } from './types'

interface Scenario {
  steps?: [number, number]
  styles?: [StyleId, StyleId]
}

function stateWith({ steps = [2, 2], styles = ['crane', 'tiger'] }: Scenario = {}): FlowState {
  const initial = createInitialFlowState({ 1: styles[0], 2: styles[1] })
  return { ...initial, steps: { 1: steps[0], 2: steps[1] } }
}

function play(state: FlowState, p1Move: MoveId, p2Move: MoveId): FlowState {
  return flowRules.resolveTurn(state, { turn: state.turn, move: p1Move }, { turn: state.turn, move: p2Move })
}

describe('setup', () => {
  it('starts both players on step 2 with no result', () => {
    const state = flowRules.createInitialState({ styles: { 1: 'crane', 2: 'tiger' } })
    expect(state).toMatchObject({ turn: 1, steps: { 1: 2, 2: 2 }, result: null })
  })
})

describe('basic moves', () => {
  it('Attack beats Throw and climbs one step', () => {
    expect(play(stateWith(), 'attack', 'throw').steps).toEqual({ 1: 3, 2: 2 })
  })

  it('Attack from the top step wins', () => {
    expect(play(stateWith({ steps: [5, 3] }), 'attack', 'throw').result).toEqual({ kind: 'win', winner: 1 })
  })

  it('Block beats Attack and knocks the attacker down one step', () => {
    expect(play(stateWith({ steps: [3, 4] }), 'attack', 'block').steps).toEqual({ 1: 2, 2: 4 })
  })

  it('Block against an opponent on step 1 is wasted', () => {
    expect(play(stateWith({ steps: [1, 3] }), 'attack', 'block').steps).toEqual({ 1: 1, 2: 3 })
  })

  it('Throw beats Block and drops the opponent to step 1', () => {
    expect(play(stateWith({ steps: [4, 4] }), 'throw', 'block').steps).toEqual({ 1: 4, 2: 1 })
  })

  it('Throw against an opponent on step 1 wins', () => {
    expect(play(stateWith({ steps: [3, 1] }), 'throw', 'block').result).toEqual({ kind: 'win', winner: 1 })
  })
})

describe('mirror matches', () => {
  it('Attack vs Attack moves both players up', () => {
    expect(play(stateWith({ steps: [2, 4] }), 'attack', 'attack').steps).toEqual({ 1: 3, 2: 5 })
  })

  it('Attack vs Attack wins for a player on the top step', () => {
    expect(play(stateWith({ steps: [3, 5] }), 'attack', 'attack').result).toEqual({ kind: 'win', winner: 2 })
  })

  it('Attack vs Attack with both players on the top step is a draw', () => {
    expect(play(stateWith({ steps: [5, 5] }), 'attack', 'attack').result).toEqual({ kind: 'draw' })
  })

  it('Block vs Block moves both players down, not below step 1', () => {
    expect(play(stateWith({ steps: [1, 3] }), 'block', 'block').steps).toEqual({ 1: 1, 2: 2 })
  })

  it('Throw vs Throw changes nothing', () => {
    const next = play(stateWith({ steps: [1, 1] }), 'throw', 'throw')
    expect(next).toMatchObject({ steps: { 1: 1, 2: 1 }, result: null })
  })
})

describe('Special vs basic moves', () => {
  it('a winning Special follows its purple arrow', () => {
    // Crane step 2 beats Throw; arrow leads to step 3.
    expect(play(stateWith({ steps: [2, 2] }), 'special', 'throw').steps).toEqual({ 1: 3, 2: 2 })
  })

  it('a winning Special whose arrow leads to the trophy wins', () => {
    // Tiger step 4 beats Attack; arrow leads to the trophy.
    expect(play(stateWith({ steps: [3, 4] }), 'attack', 'special').result).toEqual({ kind: 'win', winner: 2 })
  })

  it('a losing Special lets the opponent card resolve normally', () => {
    // Crane step 2 loses to Block, so Block knocks Crane down.
    expect(play(stateWith({ steps: [2, 3] }), 'special', 'block').steps).toEqual({ 1: 1, 2: 3 })
  })

  it('a Special on the top step loses to every basic move', () => {
    const next = play(stateWith({ steps: [5, 3] }), 'special', 'throw')
    expect(next.steps).toEqual({ 1: 1, 2: 3 })
  })
})

describe('Special vs Special', () => {
  it('the player on the higher step wins and follows their arrow', () => {
    // Tiger step 3 arrow leads to step 4.
    expect(play(stateWith({ steps: [2, 3] }), 'special', 'special').steps).toEqual({ 1: 2, 2: 4 })
  })

  it('on the same step nothing happens', () => {
    expect(play(stateWith({ steps: [3, 3] }), 'special', 'special').steps).toEqual({ 1: 3, 2: 3 })
  })

  it('winning from the top step takes the trophy', () => {
    expect(play(stateWith({ steps: [5, 4] }), 'special', 'special').result).toEqual({ kind: 'win', winner: 1 })
  })
})

describe('turn bookkeeping', () => {
  it('records the round and advances the turn', () => {
    const next = play(stateWith({ steps: [2, 2] }), 'attack', 'throw')
    expect(next.turn).toBe(2)
    expect(next.lastRound).toEqual({
      moves: { 1: 'attack', 2: 'throw' },
      stepsBefore: { 1: 2, 2: 2 },
      resolvedBy: [1],
    })
  })

  it('ignores further turns once the match is decided', () => {
    const finished = play(stateWith({ steps: [5, 2] }), 'attack', 'throw')
    expect(play(finished, 'attack', 'attack')).toBe(finished)
  })
})
