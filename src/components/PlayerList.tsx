import type { Player } from '../types/protocol';

interface PlayerListProps {
  players: Player[];
  highlightId?: string;
  className?: string;
}

export function PlayerList({ players, highlightId, className = '' }: PlayerListProps) {
  const nonHostPlayers = players.filter(p => !p.isHost);

  return (
    <div className={`flex flex-wrap justify-center gap-3 ${className}`}>
      {nonHostPlayers.map(p => (
        <div
          key={p.id}
          className={`px-5 py-2 border-[3px] border-black font-black uppercase text-sm transition-all duration-300 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${
            p.id === highlightId
              ? 'bg-[#fbfb62] text-black scale-110'
              : 'bg-white text-black'
          }`}
        >
          {p.name}
        </div>
      ))}
    </div>
  );
}
