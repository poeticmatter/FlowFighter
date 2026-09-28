import { useState } from 'react'
import type { BoardProps, PlayerSlot, UserRole } from '../platform/types'
import { MoveChip } from './glyphs'
import { MoveHand } from './MoveHand'
import { describeExchange } from './roundSummary'
import { RulesButton } from './RulesButton'
import { StyleBoard } from './StyleBoard'
import type { FlowPlan, FlowState, MatchResult, MoveId, RoundResult } from './types'

function playerLabel(slot: PlayerSlot, role: UserRole): string {
  if (role === 'spectator') return `Player ${slot}`
  return role === slot ? 'You' : 'Opponent'
}

/** Players see themselves first; spectators see player 1 first. */
function seatingOrder(role: UserRole): [PlayerSlot, PlayerSlot] {
  return role === 2 ? [2, 1] : [1, 2]
}

function describeStepChange(before: number, after: number): string {
  if (before === after) return `stays on ${after}`
  return `${before} → ${after}`
}

interface LastRoundProps {
  round: RoundResult
  steps: FlowState['steps']
  role: UserRole
}

function LastRound({ round, steps, role }: LastRoundProps) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl bg-neutral-800 px-4 py-3 text-sm">
      <div className="flex items-center gap-3">
        {seatingOrder(role).map((slot, index) => (
          <div key={slot} className="flex items-center gap-2">
            {index === 1 && <span className="text-xs font-bold uppercase text-neutral-500">vs</span>}
            <span className="text-neutral-400">{playerLabel(slot, role)}</span>
            <MoveChip move={round.moves[slot]} size={24} />
          </div>
        ))}
      </div>
      <p className="font-semibold">{describeExchange(round)}</p>
      <p className="text-xs text-neutral-400">
        {seatingOrder(role)
          .map(slot => `${playerLabel(slot, role)}: ${describeStepChange(round.stepsBefore[slot], steps[slot])}`)
          .join(' · ')}
      </p>
    </div>
  )
}

function describeResult(result: MatchResult, role: UserRole): string {
  if (result.kind === 'draw') return 'Both reached the trophy: draw!'
  if (role === result.winner) return 'You win!'
  return `${playerLabel(result.winner, role)} wins!`
}

function GameOver({ result, role }: { result: MatchResult; role: UserRole }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-3xl font-black">{describeResult(result, role)}</p>
      <a href={window.location.pathname} className="text-sm text-blue-400 hover:text-blue-300">
        Back to lobby
      </a>
    </div>
  )
}

interface ChosenMove {
  turn: number
  move: MoveId
}

export function FlowBoard({ state, role, hasCommitted, onSubmitPlan }: BoardProps<FlowState, FlowPlan>) {
  // Remembered per turn, so the card highlight clears by itself when the round resolves.
  const [chosen, setChosen] = useState<ChosenMove | null>(null)
  const chosenMove = chosen?.turn === state.turn ? chosen.move : null
  const isPlayer = role !== 'spectator'
  const canPlay = isPlayer && !hasCommitted && state.result === null

  function chooseMove(move: MoveId) {
    setChosen({ turn: state.turn, move })
    onSubmitPlan({ turn: state.turn, move })
  }

  return (
    <div className="flex min-h-screen flex-col items-center gap-6 p-4 sm:p-6">
      <div className="flex items-center gap-4">
        <p className="text-sm text-neutral-500">
          Round {state.turn}
          {role === 'spectator' && <span className="ml-2 text-purple-400">· Spectating</span>}
        </p>
        <RulesButton />
      </div>

      <div className="flex w-full flex-col items-center gap-4 md:flex-row md:items-start md:justify-center">
        {seatingOrder(role).map(slot => (
          <StyleBoard key={slot} styleId={state.styles[slot]} step={state.steps[slot]} playerLabel={playerLabel(slot, role)} />
        ))}
      </div>

      {state.lastRound && <LastRound round={state.lastRound} steps={state.steps} role={role} />}

      {state.result !== null ? (
        <GameOver result={state.result} role={role} />
      ) : (
        isPlayer && (
          <>
            <MoveHand chosenMove={chosenMove} isDisabled={!canPlay} onChoose={chooseMove} />
            <p className="h-5 text-sm text-neutral-500">
              {hasCommitted ? <span className="animate-pulse">Waiting for your opponent…</span> : 'Pick a card. Both reveal at once.'}
            </p>
          </>
        )
      )}
    </div>
  )
}
