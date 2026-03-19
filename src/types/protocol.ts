// ── Types mirroring the backend exactly ──

export type Player = {
  id: string;
  name: string;
  isHost?: boolean;
};

export type PromptEntry = {
  playerId: string;
  text: string;
  playerName: string;
  revealed: boolean;
};

export type VoteResult = {
  playerId: string;
  count: number;
};

export type RoundData = {
  roundId: string;
  actorId: string;
  topic: string;
  startedAt: number;
  minCutoffAt: number;
  maxEndAt: number;
  prompts: PromptEntry[];
  allPromptsSubmitted: boolean;
  voteResults: VoteResult[];
  selectedPromptPlayerId?: string;
};

export type RoomState = {
  roomId: string;
  joinCode: string;
  players: Player[];
  currentRound?: RoundData | null;
};

// ── Inbound (server -> client) message types ──

export type AuthOkMessage = {
  type: 'auth_ok';
  payload: { playerId: string; roomState: RoomState };
};

export type AuthErrorMessage = {
  type: 'auth_error';
  payload: { error: string };
};

export type RoomStateMessage = {
  type: 'room_state';
  payload: RoomState;
};

export type RoundStartedMessage = {
  type: 'round_started';
  payload: {
    roundId: string;
    actorId: string;
    topic: string;
    startedAt: number;
    minCutoffAt: number;
    maxEndAt: number;
  };
};

export type PromptsUpdateMessage = {
  type: 'prompts_update';
  payload: RoundData;
};

export type VotingStartedMessage = {
  type: 'voting_started';
  payload: RoundData;
};

export type VoteUpdateMessage = {
  type: 'vote_update';
  payload: RoundData;
};

export type PromptSelectedMessage = {
  type: 'prompt_selected';
  payload: {
    promptPlayerId: string;
    promptText: string;
    votes: number;
    playerName: string;
    actorId: string;
    actorName: string;
    topic: string;
  };
};

export type ErrorMessage = {
  type: 'error';
  payload: { error: string };
};

export type ServerMessage =
  | AuthOkMessage
  | AuthErrorMessage
  | RoomStateMessage
  | RoundStartedMessage
  | PromptsUpdateMessage
  | VotingStartedMessage
  | VoteUpdateMessage
  | PromptSelectedMessage
  | ErrorMessage;

// ── Outbound (client -> server) message types ──

export type AuthOutbound = {
  type: 'auth';
  payload: { token: string };
};

export type HostActionOutbound = {
  type: 'host_action';
  payload: { action: 'start_round' };
};

// ── Client-side game phases ──

export enum GamePhase {
  CONNECTING = 'connecting',
  LOBBY = 'lobby',
  PROMPT_SUBMISSION = 'prompt_submission',
  VOTING = 'voting',
  PERFORMANCE = 'performance',
  LEADERBOARD = 'leaderboard',
  ACTOR_REVEAL = 'actor_reveal',
}

// ── Client-side score tracking ──

export type PlayerScore = {
  playerId: string;
  name: string;
  score: number;
  delta: number;
};
