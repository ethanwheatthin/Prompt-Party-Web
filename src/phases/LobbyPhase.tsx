import { useState } from 'react';
import { useGameState } from '../context/GameStateContext';
import { PlayerList } from '../components/PlayerList';

const DEFAULT_SERVER = 'http://localhost:3000';

export function LobbyPhase() {
  const { state, createAndJoinRoom, startGame } = useGameState();
  const [serverUrl, setServerUrl] = useState(DEFAULT_SERVER);
  const [hostName, setHostName] = useState('Host');
  const [isCreating, setIsCreating] = useState(false);

  const hasRoom = !!state.roomState;
  const players = state.roomState?.players ?? [];
  const nonHostCount = players.filter(p => !p.isHost).length;
  const canStart = nonHostCount >= 2;

  async function handleCreate() {
    setIsCreating(true);
    try {
      await createAndJoinRoom(serverUrl, hostName);
    } finally {
      setIsCreating(false);
    }
  }

  // Pre-room: show create form
  if (!hasRoom) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-8 animate-fade-in">
        <h1
          className="font-display font-bold text-primary-400"
          style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}
        >
          Prompt Party
        </h1>

        <div className="flex flex-col gap-4 w-full max-w-md">
          <input
            type="text"
            value={serverUrl}
            onChange={e => setServerUrl(e.target.value)}
            placeholder="Server URL"
            className="px-4 py-3 rounded-xl bg-white/10 text-white text-lg font-body placeholder-white/40 outline-none focus:ring-2 focus:ring-primary-400"
          />
          <input
            type="text"
            value={hostName}
            onChange={e => setHostName(e.target.value)}
            placeholder="Host Name"
            className="px-4 py-3 rounded-xl bg-white/10 text-white text-lg font-body placeholder-white/40 outline-none focus:ring-2 focus:ring-primary-400"
          />
          <button
            onClick={handleCreate}
            disabled={isCreating}
            className="px-8 py-4 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white rounded-xl font-display font-bold text-2xl transition-colors"
          >
            {isCreating ? 'Creating...' : 'Create Room'}
          </button>
        </div>

        {state.error && (
          <div className="text-red-400 text-lg font-body">{state.error}</div>
        )}
      </div>
    );
  }

  // Build QR code URL — the backend's /qr endpoint generates a PNG
  const joinCode = state.roomState!.joinCode;
  const serverBase = state.serverUrl.replace(/\/+$/, '');
  const qrUrl = `${serverBase}/qr?room=${encodeURIComponent(joinCode)}`;
  const playerUrl = `${serverBase}/player.html`;

  // Post-room: show lobby
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 animate-fade-in">
      <h1
        className="font-display font-bold text-primary-400"
        style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}
      >
        Prompt Party
      </h1>

      <div className="flex items-center gap-12">
        {/* QR Code */}
        <div className="flex flex-col items-center gap-3">
          <div className="bg-white p-3 rounded-2xl">
            <img
              src={qrUrl}
              alt="Scan to join"
              className="w-48 h-48"
            />
          </div>
          <div className="text-white/50 text-base font-body text-center max-w-[14rem]">
            Scan with your phone camera to join
          </div>
        </div>

        {/* Room code + instructions */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-white/60 text-xl font-body">Room Code</div>
          <div
            className="font-display font-bold text-accent-400 tracking-widest"
            style={{ fontSize: 'clamp(3rem, 8vw, 7rem)' }}
          >
            {joinCode}
          </div>
          <div className="text-white/40 text-lg font-body text-center">
            or go to <span className="text-white/70 font-semibold">{playerUrl}</span>
          </div>
        </div>
      </div>

      <div className="w-full max-w-2xl">
        <div className="text-white/60 text-center text-xl font-body mb-4">
          Players ({nonHostCount})
        </div>
        <PlayerList players={players} />
      </div>

      <button
        onClick={startGame}
        disabled={!canStart}
        className="px-12 py-5 bg-green-600 hover:bg-green-500 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-2xl font-display font-bold transition-colors"
        style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}
      >
        Start Game
      </button>

      {state.error && (
        <div className="text-red-400 text-lg font-body">{state.error}</div>
      )}
    </div>
  );
}
