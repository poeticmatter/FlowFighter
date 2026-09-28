import type { ReactNode } from 'react'
import { MOVES } from './moves'
import type { MoveId } from './types'

/** Glyphs are ported from the board game's asset kit: one 48x48 viewBox, sized by `size`. */
function Glyph({ size, children }: { size: number; children: ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      {children}
    </svg>
  )
}

const MOVE_SHAPES: Record<MoveId, (color: string) => ReactNode> = {
  attack: color => (
    <polygon points="24,3 29,16 43,11 34,23 45,31 31,31 30,45 22,34 12,43 15,29 3,25 16,20 10,7 22,13" fill={color} />
  ),
  block: color => <path d="M24 4 L41 10 V23 C41 34 33 41 24 45 C15 41 7 34 7 23 V10 Z" fill={color} />,
  throw: color => (
    <g>
      <path d="M9 38 C7 18 22 7 36 15" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" />
      <polygon points="44,21 30,24 36,9" fill={color} />
      <circle cx="11" cy="38" r="5" fill={color} />
    </g>
  ),
  special: color => <path d="M29 3 L10 27 H22 L18 45 L38 19 H26 Z" fill={color} />,
}

export function MoveGlyph({ move, size, color }: { move: MoveId; size: number; color: string }) {
  return <Glyph size={size}>{MOVE_SHAPES[move](color)}</Glyph>
}

/** A move's glyph in white on a rounded square of the move's color. */
export function MoveChip({ move, size }: { move: MoveId; size: number }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-md"
      style={{ width: size, height: size, backgroundColor: MOVES[move].color }}
      title={MOVES[move].label}
    >
      <MoveGlyph move={move} size={size * 0.7} color="#ffffff" />
    </div>
  )
}

export const TROPHY_COLOR = '#facc15'

export function TrophyGlyph({ size, color = TROPHY_COLOR }: { size: number; color?: string }) {
  return (
    <Glyph size={size}>
      <path d="M14 6 H34 V18 C34 25 30 29 24 29 C18 29 14 25 14 18 Z" fill={color} />
      <path
        d="M14 10 H8 V14 C8 19 11 22 15 22 M34 10 H40 V14 C40 19 37 22 33 22"
        fill="none"
        stroke={color}
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <rect x="21" y="28" width="6" height="8" fill={color} />
      <rect x="14" y="36" width="20" height="6" rx="1.5" fill={color} />
    </Glyph>
  )
}

/** Double chevron: "climbing the steps". */
export function FighterToken({ size, accentColor }: { size: number; accentColor: string }) {
  return (
    <Glyph size={size}>
      <circle cx="24" cy="24" r="23" fill="#0f172a" />
      <circle cx="24" cy="24" r="20" fill={accentColor} />
      <circle cx="24" cy="24" r="14" fill="#ffffff" />
      <path
        d="M16 23 L24 15 L32 23 M16 32 L24 24 L32 32"
        fill="none"
        stroke={accentColor}
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Glyph>
  )
}
