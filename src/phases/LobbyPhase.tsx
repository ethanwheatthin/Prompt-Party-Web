import { useState } from 'react';
import { useGameState } from '../context/GameStateContext';
import { PlayerList } from '../components/PlayerList';

const DEFAULT_SERVER = 'http://localhost:3000';

export function LobbyPhase() {
  const { state, createAndJoinRoom, startGame } = useGameState();
  const [isCreating, setIsCreating] = useState(false);

  const hasRoom = !!state.roomState;
  const players = state.roomState?.players ?? [];
  const nonHostCount = players.filter(p => !p.isHost).length;
  const canStart = nonHostCount >= 2;

  async function handleCreate() {
    setIsCreating(true);
    try {
      await createAndJoinRoom(DEFAULT_SERVER, 'Host');
    } finally {
      setIsCreating(false);
    }
  }

  // Pre-room: hero start screen
  if (!hasRoom) {
    return (
      <div className="flex items-center justify-center h-full animate-fade-in px-6 relative overflow-hidden">
        {/* Background decorative shapes */}
        <div className="absolute top-12 left-8 w-32 h-32 bg-[#ff66b2]/20 rotate-12 -z-10" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
        <div className="absolute bottom-32 right-16 w-48 h-12 bg-[#5ef8f8]/20 -rotate-12 -z-10" />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 border-[6px] border-[#fbfb62]/30 rounded-full -z-10" />

        <div className="flex flex-col lg:flex-row gap-12 items-center max-w-6xl w-full">
          {/* Hero text */}
          <div className="flex-1 text-center lg:text-left">
<h1 className="font-black leading-[0.9] tracking-[-0.05em] text-black uppercase mb-8" style={{ fontSize: 'clamp(3rem, 8vw, 7rem)' }}>
              The Party{' '}
              <br />
              <span className="text-[#ff66b2] underline decoration-[6px] decoration-black underline-offset-4">Starts</span>
              <br />
              Here.
            </h1>
            <p className="text-lg md:text-xl font-bold text-black/50 max-w-lg mx-auto lg:mx-0">
              Host the ultimate prompt party showdown! Invite friends, act out prompts, and claim the crown!
            </p>
          </div>

          {/* Create room card */}
          <div className="flex-1 w-full max-w-md">
            <div className="bg-white border-[4px] border-black p-8 md:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rotate-[1deg] relative">
              <h2 className="text-3xl font-black text-black mb-8 border-b-4 border-black inline-block uppercase tracking-tight">
                New Room
              </h2>

              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 border-[3px] border-dashed border-black bg-[#f0f1f1]">
                  <span className="font-black text-[#ff66b2] text-xl">i</span>
                  <p className="text-xs font-bold text-black/60 uppercase">
                    Private rooms allow up to 12 players per session.
                  </p>
                </div>

                <button
                  onClick={handleCreate}
                  disabled={isCreating}
                  className="w-full h-16 bg-[#5ef8f8] text-black font-black uppercase tracking-tighter text-2xl border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-75 disabled:opacity-50"
                >
                  {isCreating ? 'Creating...' : 'CREATE ROOM'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {state.error && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-red-100 border-[3px] border-black text-red-700 font-bold px-6 py-3">
            {state.error}
          </div>
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
