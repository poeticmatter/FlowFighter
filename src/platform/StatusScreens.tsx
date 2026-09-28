import { buildRoomUrl, type RoomLink } from './roomLink'

function returnToLobby() {
  window.location.href = window.location.pathname
}

export function StatusScreen({ message }: { message: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center">
      <p className="text-neutral-400 text-lg">{message}</p>
      <button
        onClick={returnToLobby}
        className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm text-neutral-300 transition-colors"
      >
        Back to Lobby
      </button>
    </div>
  )
}

export function ProgressScreen({ title, detail }: { title: string; detail?: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 p-6 text-center">
      <p className="text-neutral-200 text-lg font-semibold">{title}</p>
      {detail && <p className="text-neutral-500 text-sm animate-pulse">{detail}</p>}
    </div>
  )
}

export function WaitingForPartnerScreen({ room }: { room: RoomLink }) {
  const shareUrl = buildRoomUrl(room)
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-6">
      <h2 className="text-2xl font-semibold">Waiting for an opponent…</h2>
      <p className="text-neutral-400 text-sm">Share this link:</p>
      <div className="flex gap-2 items-center max-w-full">
        <code className="bg-neutral-800 px-4 py-2 rounded-lg text-neutral-200 text-sm select-all break-all">
          {shareUrl}
        </code>
        <button
          onClick={() => navigator.clipboard.writeText(shareUrl)}
          className="px-3 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-sm transition-colors"
        >
          Copy
        </button>
      </div>
      {room.transport === 'live' && (
        <p className="text-neutral-500 text-xs">Anyone else who opens the link watches as a spectator.</p>
      )}
      <p className="text-neutral-600 text-xs font-mono">Room: {room.code}</p>
    </div>
  )
}
