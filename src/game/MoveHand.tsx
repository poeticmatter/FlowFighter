import { MoveChip, MoveGlyph } from './glyphs'
import { MOVE_IDS, MOVES } from './moves'
import type { MoveId } from './types'

function StopsLine({ move }: { move: MoveId }) {
  const { stops, color } = MOVES[move]
  if (stops === null) {
    return (
      <span className="text-center text-[10px] font-bold uppercase tracking-wide" style={{ color }}>
        Stops: depends on your step
      </span>
    )
  }
  return (
    <span className="flex items-center gap-1.5">
      <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Stops</span>
      <MoveChip move={stops} size={18} />
      <span className="text-xs font-bold" style={{ color: MOVES[stops].color }}>
        {MOVES[stops].label}
      </span>
    </span>
  )
}

function MirrorRule({ move, rule }: { move: MoveId; rule: string }) {
  return (
    <span className="flex flex-col items-center gap-0.5">
      <span className="flex items-center gap-1">
        <MoveChip move={move} size={16} />
        <span className="text-[10px] font-bold uppercase text-slate-500">vs</span>
        <MoveChip move={move} size={16} />
      </span>
      <span className="text-center text-[11px] font-semibold leading-snug text-slate-600">{rule}</span>
    </span>
  )
}

interface MoveCardProps {
  move: MoveId
  isChosen: boolean
  isDisabled: boolean
  onChoose: (move: MoveId) => void
}

function MoveCard({ move, isChosen, isDisabled, onChoose }: MoveCardProps) {
  const { label, color, cardText, mirrorRule } = MOVES[move]
  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={() => onChoose(move)}
      aria-pressed={isChosen}
      className="flex w-full flex-col overflow-hidden rounded-xl p-1 text-left transition-transform enabled:hover:-translate-y-1 disabled:cursor-not-allowed"
      style={{
        backgroundColor: color,
        opacity: isDisabled && !isChosen ? 0.4 : 1,
        outline: isChosen ? '3px solid #ffffff' : undefined,
        outlineOffset: 2,
      }}
    >
      <span className="py-0.5 text-center text-sm font-black uppercase tracking-widest text-white">{label}</span>
      <span className="flex flex-1 flex-col items-center gap-1.5 rounded-lg bg-white p-2">
        <MoveGlyph move={move} size={40} color={color} />
        <StopsLine move={move} />
        <span className="h-px w-full bg-slate-200" />
        <span className="text-center text-xs font-semibold leading-snug text-slate-800">{cardText}</span>
        {mirrorRule && <MirrorRule move={move} rule={mirrorRule} />}
      </span>
    </button>
  )
}

interface MoveHandProps {
  chosenMove: MoveId | null
  isDisabled: boolean
  onChoose: (move: MoveId) => void
}

/** The four cards every fighter holds. Picking one commits it for the round. */
export function MoveHand({ chosenMove, isDisabled, onChoose }: MoveHandProps) {
  return (
    <div className="grid w-full max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
      {MOVE_IDS.map(move => (
        <MoveCard key={move} move={move} isChosen={chosenMove === move} isDisabled={isDisabled} onChoose={onChoose} />
      ))}
    </div>
  )
}
