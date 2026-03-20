import { useGameState } from './context/GameStateContext';
import { GamePhase } from './types/protocol';
import { PhaseTransition } from './components/PhaseTransition';
import { HostControls } from './components/HostControls';
import { LobbyPhase } from './phases/LobbyPhase';
import { PromptPhase } from './phases/PromptPhase';
import { VotingPhase } from './phases/VotingPhase';
import { PerformancePhase } from './phases/PerformancePhase';
import { LeaderboardPhase } from './phases/LeaderboardPhase';
import { ActorRevealPhase } from './phases/ActorRevealPhase';

const phaseComponents: Record<GamePhase, React.FC> = {
  [GamePhase.CONNECTING]: LobbyPhase,
  [GamePhase.LOBBY]: LobbyPhase,
  [GamePhase.PROMPT_SUBMISSION]: PromptPhase,
  [GamePhase.VOTING]: VotingPhase,
  [GamePhase.PERFORMANCE]: PerformancePhase,
  [GamePhase.LEADERBOARD]: LeaderboardPhase,
  [GamePhase.ACTOR_REVEAL]: ActorRevealPhase,
};

export default function App() {
  const { state } = useGameState();
  const PhaseComponent = phaseComponents[state.phase];

  return (
    <div className="h-screen w-screen flex flex-col relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-8 right-12 w-16 h-16 bg-[#ff66b2] border-[3px] border-black rotate-12 -z-10" />
      <div className="absolute top-32 left-8 w-10 h-10 rounded-full bg-[#ff66b2]/30 -z-10" />
      <div className="absolute bottom-20 right-20 w-20 h-20 rounded-full bg-[#5ef8f8]/20 -z-10" />
      <div className="absolute bottom-40 left-16 w-8 h-8 bg-[#fbfb62] border-[3px] border-black -rotate-6 -z-10" />

      {/* Top bar */}
      <div className="w-full bg-white border-b-[3px] border-black px-8 py-3 flex items-center justify-between shrink-0">
        <h1 className="font-black italic text-2xl uppercase tracking-[-0.05em] text-[#ff66b2]">
          Prompt Party
        </h1>
      </div>

      {/* Main content */}
      <PhaseTransition phaseKey={state.phase}>
        <PhaseComponent />
      </PhaseTransition>
      <HostControls />
    </div>
  );
}
