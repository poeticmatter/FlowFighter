import { useRef, type ReactNode } from 'react'
import { MoveChip, TrophyGlyph } from './glyphs'
import { MOVES } from './moves'
import type { MoveId } from './types'

function Move({ move }: { move: MoveId }) {
  return (
    <span className="inline-flex items-center gap-1 align-middle font-bold" style={{ color: MOVES[move].color }}>
      <MoveChip move={move} size={16} />
      {MOVES[move].label}
    </span>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-1.5">
      <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400">{title}</h3>
      {children}
    </section>
  )
}

function RulesText() {
  return (
    <div className="flex flex-col gap-4 text-sm leading-relaxed text-neutral-200">
      <Section title="Goal">
        <p>
          Climb the 5-step ladder and reach the trophy <TrophyGlyph size={16} />. Both fighters start on step 2.
        </p>
        <p>You win by landing Attack on the top step, Throwing an opponent on step 1, or following a purple arrow to the trophy.</p>
      </Section>

      <Section title="Each round">
        <p>Both players pick a card in secret. The cards are revealed together.</p>
      </Section>

      <Section title="Basic cards">
        <ul className="flex flex-col gap-1">
          <li>
            <Move move="attack" /> beats <Move move="throw" />. {MOVES.attack.cardText}
          </li>
          <li>
            <Move move="block" /> beats <Move move="attack" />. {MOVES.block.cardText}
          </li>
          <li>
            <Move move="throw" /> beats <Move move="block" />. {MOVES.throw.cardText}
          </li>
        </ul>
        <p className="text-neutral-400">Nobody can go below step 1.</p>
      </Section>

      <Section title="Same card">
        <ul className="flex flex-col gap-1">
          <li>
            <Move move="attack" /> vs <Move move="attack" />: both go up 1. On the top step, that's a win. If both win, it's a draw.
          </li>
          <li>
            <Move move="block" /> vs <Move move="block" />: both go down 1.
          </li>
          <li>
            <Move move="throw" /> vs <Move move="throw" />: nothing happens.
          </li>
        </ul>
      </Section>

      <Section title="Special">
        <p>
          What <Move move="special" /> does depends on your step. Check the Beats and Loses to lists on your board for the step you're on.
        </p>
        <ul className="flex list-disc flex-col gap-1 pl-5">
          <li>If your Special wins, follow the purple arrow from your step.</li>
          <li>If your Special loses, your opponent's card resolves normally.</li>
          <li>Special vs Special: {MOVES.special.mirrorRule}</li>
        </ul>
        <p className="text-neutral-400">Red arrows on the left of each board show Attack's climb. Special has no cooldown.</p>
      </Section>
    </div>
  )
}

/** A "Rules" button that opens the full rules in a modal dialog. */
export function RulesButton() {
  const dialogRef = useRef<HTMLDialogElement>(null)

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="rounded-full border border-neutral-600 px-3 py-1 text-xs font-semibold text-neutral-300 hover:border-neutral-400 hover:text-white"
      >
        ? Rules
      </button>
      <dialog
        ref={dialogRef}
        // Clicking the backdrop lands on the dialog element itself, so this closes on outside clicks.
        onClick={event => event.target === dialogRef.current && dialogRef.current.close()}
        className="m-auto max-h-[85vh] w-[min(32rem,calc(100vw-2rem))] rounded-2xl bg-neutral-900 p-0 text-white backdrop:bg-black/70"
      >
        <div className="flex flex-col gap-4 p-5">
          <header className="flex items-center justify-between">
            <h2 className="text-xl font-black uppercase tracking-widest">How to play</h2>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="rounded-full px-2 text-2xl leading-none text-neutral-400 hover:text-white"
              aria-label="Close rules"
            >
              ×
            </button>
          </header>
          <RulesText />
        </div>
      </dialog>
    </>
  )
}
