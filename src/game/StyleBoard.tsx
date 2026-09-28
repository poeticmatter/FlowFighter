import { FighterToken, MoveChip, TrophyGlyph } from './glyphs'
import { MOVES } from './moves'
import { START_STEP, STYLES, WIN_STEP, type SpecialStep } from './styles'
import type { StyleId } from './types'

const CHIP_SIZE = 26
const TOKEN_SPOT_SIZE = 44
const TOKEN_SIZE = 36
// Muted Special purple from the printed boards, so the move chips on it stand out.
const SPECIAL_PANEL_COLOR = '#7453ac'

function MatchupColumn({ label, moves }: { label: string; moves: SpecialStep['beats'] }) {
  return (
    <div className="flex flex-1 flex-col items-center gap-1">
      <span className="text-[9px] font-black uppercase tracking-widest text-white/90">{label}</span>
      <div className="flex min-h-[30px] items-center justify-center gap-1">
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

function ArrowBadge({ destination }: { destination: number }) {
  const isTrophy = destination === WIN_STEP
  return (
    <div
      className="flex w-11 shrink-0 flex-col items-center justify-center self-stretch rounded-r-[10px] text-white"
      style={{ backgroundColor: MOVES.special.color }}
      title={isTrophy ? 'Special arrow leads to the trophy' : `Special arrow leads to step ${destination}`}
    >
      <span className="text-lg font-black leading-none">↑</span>
      {isTrophy ? <TrophyGlyph size={20} /> : <span className="text-base font-black leading-tight">{destination}</span>}
    </div>
  )
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
      className="flex items-center gap-2 rounded-xl border-2 bg-white pl-2"
      style={{
        borderColor: isCurrent ? accentColor : `${accentColor}40`,
        boxShadow: isCurrent ? `0 0 0 2px ${accentColor}` : undefined,
      }}
    >
      <span className="w-3 text-center text-sm font-black text-slate-400">{specialStep.step}</span>
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
      <div className="flex flex-1 self-stretch" style={{ backgroundColor: SPECIAL_PANEL_COLOR }}>
        <div className="flex flex-1 items-center py-1.5">
          <MatchupColumn label="Beats" moves={specialStep.beats} />
          <div className="self-stretch border-l-2 border-white/40" />
          <MatchupColumn label="Loses to" moves={specialStep.losesTo} />
        </div>
      </div>
      <ArrowBadge destination={specialStep.destination} />
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
    <section className="flex w-full max-w-sm flex-col gap-2 rounded-2xl p-3 text-slate-800" style={{ backgroundColor: '#faf7f2' }}>
      <header className="flex items-center gap-2">
        <FighterToken size={32} accentColor={style.accentColor} />
        <h2 className="text-xl font-black uppercase tracking-widest" style={{ color: style.accentColor }}>
          {style.emoji} {style.name}
        </h2>
        <span className="ml-auto text-xs font-bold uppercase tracking-wider text-slate-500">{playerLabel}</span>
      </header>
      <div className="flex h-10 items-center justify-center rounded-xl bg-slate-900">
        <TrophyGlyph size={30} />
      </div>
      {topDownSteps.map(specialStep => (
        <StepRow
          key={specialStep.step}
          specialStep={specialStep}
          accentColor={style.accentColor}
          isCurrent={specialStep.step === step}
        />
      ))}
    </section>
  )
}
