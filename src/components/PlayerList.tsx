import type { Player } from '../types/protocol';

interface PlayerListProps {
  players: Player[];
  highlightId?: string;
  className?: string;
}

export function PlayerList({ players, highlightId, className = '' }: PlayerListProps) {
  const nonHostPlayers = players.filter(p => !p.isHost);

  return (
    <div className={`flex flex-wrap justify-center gap-4 ${className}`}>
      {nonHostPlayers.map(p => (
        <div
          key={p.id}
          className={`px-6 py-3 rounded-xl text-xl font-display font-semibold transition-all duration-300 ${
            p.id === highlightId
              ? 'bg-accent-400 text-gray-900 scale-110'
              : 'bg-white/10 text-white'
          }`}
        >
          {p.name}
        </div>
      ))}
    </div>
  );
}
