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
      <div className="flex flex-col items-center justify-center h-full gap-8 animate-fade-in px-4">
        <h1 className="font-black italic uppercase tracking-[-0.05em] text-[#ff66b2]" style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}>
          Prompt Party
        </h1>

        <div className="bg-white border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 w-full max-w-md rotate-[-1deg]">
          <div className="bg-[#fbfb62] border-b-[3px] border-black -m-6 mb-6 p-4">
            <h2 className="font-black italic text-xl uppercase">Ready to Play?</h2>
          </div>
          <p className="font-bold text-sm text-black/60 mb-4">Enter the chaos below.</p>

          <div className="flex flex-col gap-4">
            <div>
              <label className="font-black text-xs uppercase tracking-wide mb-1 block">Server URL</label>
              <input
                type="text"
                value={serverUrl}
                onChange={e => setServerUrl(e.target.value)}
                placeholder="http://localhost:3000"
                className="w-full bg-white border-[3px] border-black p-3 font-bold text-lg placeholder:text-zinc-400 focus:outline-none focus:ring-4 focus:ring-[#5ef8f8]/30"
              />
            </div>
            <div>
              <label className="font-black text-xs uppercase tracking-wide mb-1 block">Host Name</label>
              <input
                type="text"
                value={hostName}
                onChange={e => setHostName(e.target.value)}
                placeholder="Your name"
                className="w-full bg-white border-[3px] border-black p-3 font-bold text-lg placeholder:text-zinc-400 focus:outline-none focus:ring-4 focus:ring-[#5ef8f8]/30"
              />
            </div>
            <button
              onClick={handleCreate}
              disabled={isCreating}
              className="bg-[#fbfb62] text-black font-black uppercase tracking-tighter text-xl px-8 py-3 border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-[0px] active:translate-y-[0px] active:shadow-none transition-all duration-75 disabled:opacity-50"
            >
              {isCreating ? 'Creating...' : 'JOIN GAME'}
            </button>
          </div>
        </div>

        {state.error && (
          <div className="bg-red-100 border-[3px] border-black text-red-700 font-bold px-4 py-2">{state.error}</div>
        )}
      </div>
    );
  }

  // Build QR code URL
  const joinCode = state.roomState!.joinCode;
  const serverBase = state.serverUrl.replace(/\/+$/, '');
  const qrUrl = `${serverBase}/qr?room=${encodeURIComponent(joinCode)}`;
  const playerUrl = `${serverBase}/player.html`;

  // Post-room: show lobby
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 animate-fade-in px-4">
      <h2 className="font-black italic uppercase tracking-[-0.05em] text-3xl">
        LOBBY IS OPEN!
      </h2>

      {/* Room code - the biggest, most vibrant element */}
      <div className="bg-[#fbfb62] border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] px-12 py-6 rotate-[-1deg]">
        <div className="font-black uppercase text-sm tracking-widest text-center mb-1">Room Code</div>
        <div className="font-black italic tracking-widest text-center" style={{ fontSize: 'clamp(3rem, 8vw, 7rem)' }}>
          {joinCode}
        </div>
      </div>

      <div className="flex items-start gap-8 flex-wrap justify-center">
        {/* QR Code */}
        <div className="flex flex-col items-center gap-2">
          <div className="bg-white border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-3 rotate-[1deg]">
            <img src={qrUrl} alt="Scan to join" className="w-40 h-40" />
          </div>
          <div className="bg-[#ff66b2] border-[3px] border-black px-4 py-1 font-black text-sm uppercase text-black">
            Scan to Join
          </div>
          <div className="text-black/50 text-sm font-bold text-center max-w-[14rem]">
            Join at <span className="font-black text-black/70">{playerUrl}</span>
          </div>
        </div>

        {/* Player list */}
        <div className="bg-white border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 rotate-[0.5deg] min-w-[300px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black italic text-xl uppercase">The Party Goers</h3>
            <div className="bg-[#5ef8f8] border-[3px] border-black px-3 py-1 font-black text-sm uppercase">
              Players: {nonHostCount}
            </div>
          </div>
          <PlayerList players={players} />
        </div>
      </div>

      <button
        onClick={startGame}
        disabled={!canStart}
        className="bg-green-500 text-black font-black uppercase tracking-tighter px-12 py-4 border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-x-[0px] active:translate-y-[0px] active:shadow-none transition-all duration-75 disabled:opacity-30 disabled:cursor-not-allowed"
        style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}
      >
        START GAME &rarr;
      </button>

      {state.error && (
        <div className="bg-red-100 border-[3px] border-black text-red-700 font-bold px-4 py-2">{state.error}</div>
      )}
    </div>
  );
}
