import {
  ATTACK_LANE_WIDTH,
  LADDER_HEIGHT,
  LADDER_TOTAL_WIDTH,
  LADDER_WIDTH,
  ROW_GAP,
  STEP_ROW_HEIGHT,
  WIN_ROW_HEIGHT,
} from './boardLayout'
import { FighterToken, MoveChip, TrophyGlyph } from './glyphs'
import { AttackArrows, SpecialArrows } from './LadderArrows'
import { START_STEP, STYLES, WIN_STEP, type SpecialStep } from './styles'
import type { StyleId } from './types'

const CHIP_SIZE = 24
const TOKEN_SPOT_SIZE = 40
const TOKEN_SIZE = 32
const BOARD_PADDING = 8
// Muted Special purple from the printed boards, so the move chips on it stand out.
const SPECIAL_PANEL_COLOR = '#7453ac'

function MatchupColumn({ label, moves }: { label: string; moves: SpecialStep['beats'] }) {
  return (
    <div className="flex flex-1 flex-col items-center gap-0.5">
      <span className="text-[9px] font-black uppercase tracking-widest text-white/90">{label}</span>
      <div className="flex items-center justify-center gap-1">
        {moves.length === 0 ? (
          <MoveChip move="special" size={CHIP_SIZE} />
        ) : (
          moves.map(move => (
            <div key={move} className="rounded-[8px] bg-white p-0.5">
              <MoveChip move={move} size={CHIP_SIZE} />
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function describeArrow(destination: number): string {
  return destination === WIN_STEP ? 'Special arrow leads to the trophy' : `Special arrow leads to step ${destination}`
}

interface StepRowProps {
  specialStep: SpecialStep
  accentColor: string
  isCurrent: boolean
}

function StepRow({ specialStep, accentColor, isCurrent }: StepRowProps) {
  const isStart = specialStep.step === START_STEP
  return (
    <div
      className="flex items-center gap-1.5 rounded-xl border-2 bg-white pl-1.5"
      style={{
        width: LADDER_WIDTH,
        height: STEP_ROW_HEIGHT,
        borderColor: isCurrent ? accentColor : `${accentColor}40`,
        boxShadow: isCurrent ? `0 0 0 2px ${accentColor}` : undefined,
      }}
      title={describeArrow(specialStep.destination)}
    >
      <span className="w-3 text-center text-xs font-black text-slate-400">{specialStep.step}</span>
      <div
        className={`flex shrink-0 items-center justify-center rounded-full border-[3px] ${isStart ? 'border-solid' : 'border-dashed'}`}
        style={{
          width: TOKEN_SPOT_SIZE,
          height: TOKEN_SPOT_SIZE,
          borderColor: accentColor,
          backgroundColor: `${accentColor}${isStart ? '33' : '14'}`,
        }}
      >
        {isCurrent && <FighterToken size={TOKEN_SIZE} accentColor={accentColor} />}
      </div>
      <div className="flex flex-1 items-center self-stretch rounded-r-[10px]" style={{ backgroundColor: SPECIAL_PANEL_COLOR }}>
        <MatchupColumn label="Beats" moves={specialStep.beats} />
        <div className="h-3/4 border-l-2 border-white/40" />
        <MatchupColumn label="Loses to" moves={specialStep.losesTo} />
      </div>
    </div>
  )
}

function WinRow() {
  return (
    <div className="flex items-center justify-center rounded-xl bg-slate-900" style={{ width: LADDER_WIDTH, height: WIN_ROW_HEIGHT }}>
      <TrophyGlyph size={WIN_ROW_HEIGHT - 10} />
    </div>
  )
}

interface StyleBoardProps {
  styleId: StyleId
  step: number
  playerLabel: string
}

/** One player's Style board: the ladder, their token, and what their Special does on each step. */
export function StyleBoard({ styleId, step, playerLabel }: StyleBoardProps) {
  const style = STYLES[styleId]
  const topDownSteps = [...style.specialSteps].reverse()

  return (
    <section
      className="flex shrink-0 flex-col gap-2 rounded-2xl text-slate-800"
      style={{ width: LADDER_TOTAL_WIDTH + BOARD_PADDING * 2, padding: BOARD_PADDING, backgroundColor: '#faf7f2' }}
    >
      <header className="flex items-center gap-2">
        <FighterToken size={28} accentColor={style.accentColor} />
        <h2 className="text-lg font-black uppercase tracking-widest" style={{ color: style.accentColor }}>
          {style.emoji} {style.name}
        </h2>
        <span className="ml-auto text-xs font-bold uppercase tracking-wider text-slate-500">{playerLabel}</span>
      </header>
      <div className="relative" style={{ height: LADDER_HEIGHT }}>
        <div className="flex flex-col" style={{ gap: ROW_GAP, paddingLeft: ATTACK_LANE_WIDTH }}>
          <WinRow />
          {topDownSteps.map(specialStep => (
            <StepRow
              key={specialStep.step}
              specialStep={specialStep}
              accentColor={style.accentColor}
              isCurrent={specialStep.step === step}
            />
          ))}
        </div>
        <AttackArrows />
        <SpecialArrows specialSteps={style.specialSteps} />
      </div>
    </section>
  )
}
