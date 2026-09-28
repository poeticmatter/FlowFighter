import { MoveGlyph } from './glyphs'
import { MOVE_IDS, MOVES } from './moves'
import type { MoveId } from './types'

interface MoveCardProps {
  move: MoveId
  isChosen: boolean
  isDisabled: boolean
  onChoose: (move: MoveId) => void
}

function MoveCard({ move, isChosen, isDisabled, onChoose }: MoveCardProps) {
  const { label, color, effect } = MOVES[move]
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
      <span className="flex flex-1 flex-col items-center gap-1 rounded-lg bg-white p-2">
        <MoveGlyph move={move} size={40} color={color} />
        <span className="text-center text-[11px] font-semibold leading-snug text-slate-700">{effect}</span>
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
