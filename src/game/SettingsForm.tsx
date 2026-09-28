import type { PlayerSlot, SettingsFormProps } from '../platform/types'
import { RulesButton } from './RulesButton'
import { STYLE_IDS, STYLES } from './styles'
import type { FlowSettings, StyleId } from './types'

const SLOT_LABELS: Record<PlayerSlot, string> = {
  1: 'Your style',
  2: "Opponent's style",
}

interface StylePickerProps {
  label: string
  selected: StyleId
  onSelect: (styleId: StyleId) => void
}

function StylePicker({ label, selected, onSelect }: StylePickerProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">{label}</span>
      <div className="flex overflow-hidden rounded-lg border border-neutral-700">
        {STYLE_IDS.map(styleId => (
          <button
            key={styleId}
            onClick={() => onSelect(styleId)}
            className={`flex-1 py-2 text-sm font-semibold transition-colors ${
              selected === styleId ? 'bg-neutral-600 text-white' : 'bg-neutral-800 text-neutral-400 hover:text-neutral-200'
            }`}
          >
            {STYLES[styleId].emoji} {STYLES[styleId].name}
          </button>
        ))}
      </div>
    </div>
  )
}

/** The room creator is always player 1, so they pick both fighters' styles. */
export function FlowSettingsForm({ settings, onChange }: SettingsFormProps<FlowSettings>) {
  return (
    <>
      <div className="flex justify-center">
        <RulesButton />
      </div>
      {([1, 2] as const).map(slot => (
        <StylePicker
          key={slot}
          label={SLOT_LABELS[slot]}
          selected={settings.styles[slot]}
          onSelect={styleId => onChange({ ...settings, styles: { ...settings.styles, [slot]: styleId } })}
        />
      ))}
    </>
  )
}
