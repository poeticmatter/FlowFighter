import { useCallback, useState } from 'react'
import { game, type GamePlan, type GameSettings, type GameState } from './game'
import { Lobby } from './platform/Lobby'
import { buildRoomUrl, generateRoomCode, readRoomLinkFromUrl, recallRole, rememberRoomCreator, type RoomLink } from './platform/roomLink'
import { ProgressScreen, StatusScreen, WaitingForPartnerScreen } from './platform/StatusScreens'
import type { MatchConnection, Transport } from './platform/types'
import { useAsyncMatch } from './platform/useAsyncMatch'
import { usePeerGuest } from './platform/usePeerGuest'
import { usePeerHost } from './platform/usePeerHost'

type Connection = MatchConnection<GameState, GamePlan>

/** Maps any transport's connection to the right screen, ending at the game's Board. */
function MatchScreen({ room, connection }: { room: RoomLink; connection: Connection }) {
  const { state, status, errorMessage } = connection

  if (status === 'error') return <StatusScreen message={errorMessage ?? 'Connection error.'} />
  if (status === 'disconnected') return <StatusScreen message="Lost connection to the host." />
  if (status === 'reconnecting') return <ProgressScreen title="Connection lost" detail="Reconnecting…" />
  if (status === 'waiting_for_partner') return <WaitingForPartnerScreen room={room} />
  if (!state) return <ProgressScreen title="Connecting…" />

  return (
    <game.Board
      state={state}
      role={connection.role}
      hasCommitted={connection.hasCommitted}
      onSubmitPlan={connection.submitPlan}
    />
  )
}

function LiveHostMatch({ room, settings }: { room: RoomLink; settings: GameSettings }) {
  return <MatchScreen room={room} connection={usePeerHost(room.code, game.rules, settings)} />
}

function LiveGuestMatch({ room }: { room: RoomLink }) {
  return <MatchScreen room={room} connection={usePeerGuest<GameState, GamePlan>(room.code)} />
}

function AsyncMatch({ room, settings }: { room: RoomLink; settings: GameSettings | null }) {
  const slot = recallRole(room.code) === 1 ? 1 : 2
  return <MatchScreen room={room} connection={useAsyncMatch(room.code, slot, game.rules, settings)} />
}

interface ActiveRoom {
  link: RoomLink
  /** Present only in the tab that created the room. */
  settings: GameSettings | null
}

export default function App() {
  const [room, setRoom] = useState<ActiveRoom | null>(() => {
    const link = readRoomLinkFromUrl()
    return link ? { link, settings: null } : null
  })

  const createMatch = useCallback((settings: GameSettings, transport: Transport) => {
    const link: RoomLink = { code: generateRoomCode(), transport }
    rememberRoomCreator(link.code)
    history.replaceState(null, '', buildRoomUrl(link))
    setRoom({ link, settings })
  }, [])

  if (!room) {
    return <Lobby defaultSettings={game.defaultSettings} SettingsForm={game.SettingsForm} onCreateMatch={createMatch} />
  }

  if (room.link.transport === 'async') return <AsyncMatch room={room.link} settings={room.settings} />
  if (room.settings) return <LiveHostMatch room={room.link} settings={room.settings} />
  return <LiveGuestMatch room={room.link} />
}
