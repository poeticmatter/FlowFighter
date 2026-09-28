import { useState, type ComponentType } from 'react'
import { GAME_CONFIG } from '../game.config'
import { isSupabaseConfigured } from './supabaseClient'
import type { SettingsFormProps, Transport } from './types'

const TRANSPORTS: Transport[] = ['live', 'async']

const TRANSPORT_TEXT: Record<Transport, { label: string; description: string }> = {
  live: {
    label: 'Live (P2P)',
    description: 'Both players are online at the same time over a direct peer-to-peer link.',
  },
  async: {
    label: 'Async (Supabase)',
    description: 'Take turns whenever you like. The game is saved online.',
  },
}

interface LobbyProps<Settings> {
  defaultSettings: Settings
  SettingsForm: ComponentType<SettingsFormProps<Settings>>
  onCreateMatch: (settings: Settings, transport: Transport) => void
}

export function Lobby<Settings>({ defaultSettings, SettingsForm, onCreateMatch }: LobbyProps<Settings>) {
  const [settings, setSettings] = useState(defaultSettings)
  const [transport, setTransport] = useState<Transport>('live')
  const isAsyncUnavailable = transport === 'async' && !isSupabaseConfigured()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-5xl font-bold tracking-tight">{GAME_CONFIG.title}</h1>
        <p className="text-neutral-400 max-w-sm text-sm leading-relaxed">{GAME_CONFIG.tagline}</p>
      </div>

      <div className="w-full max-w-sm flex flex-col gap-4">
        <SettingsForm settings={settings} onChange={setSettings} />

        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Play Mode</span>
          <div className="flex rounded-lg overflow-hidden border border-neutral-700">
            {TRANSPORTS.map(option => (
              <button
                key={option}
                onClick={() => setTransport(option)}
                className={`flex-1 py-2 text-sm font-semibold transition-colors ${
                  transport === option
                    ? 'bg-neutral-600 text-white'
                    : 'bg-neutral-800 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {TRANSPORT_TEXT[option].label}
              </button>
            ))}
          </div>
          <p className="text-xs text-neutral-500 leading-relaxed">{TRANSPORT_TEXT[transport].description}</p>
          {isAsyncUnavailable && (
            <p className="text-xs text-amber-400 leading-relaxed">
              Async play needs VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local.
            </p>
          )}
        </div>
      </div>

      <button
        onClick={() => onCreateMatch(settings, transport)}
        disabled={isAsyncUnavailable}
        className="px-8 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-neutral-700 disabled:text-neutral-500 rounded-xl text-white font-semibold text-lg transition-colors"
      >
        Create Game
      </button>
    </div>
  )
}
