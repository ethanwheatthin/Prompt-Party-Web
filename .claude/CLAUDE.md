# Prompt Party

A multiplayer party game (think Quiplash meets Make Some Noise). Players join from their phones, everyone answers a prompt, votes pick the winner, and points are awarded.

## Architecture

**Two separate apps in one repo:**

- **Frontend (root `/`)** — React + Vite + Tailwind CSS host display (runs on the big screen or in Electron)
- **Backend (`/backend`)** — Fastify + WebSocket game server, also serves the player-facing `public/player.html`

They communicate via WebSocket. The host display connects as a privileged "host" client; phone players connect through the backend's vanilla HTML page.

## Quick Start

```bash
# Terminal 1: Backend
cd backend && npm run dev    # starts on :3000

# Terminal 2: Frontend (Vite dev server)
npm run dev                  # starts on :5173

# Or Electron:
npm run electron:dev
```

## Project Structure

```
src/
  App.tsx                  # Phase router — maps GamePhase enum to phase components
  main.tsx                 # React entry point
  index.css                # Tailwind directives + global body styles
  context/
    GameStateContext.tsx    # ALL client-side game state, WebSocket handling, phase timers, scoring
  phases/                  # One component per game phase (LobbyPhase, PromptPhase, VotingPhase, etc.)
  components/              # Shared UI (PlayerList, Timer, HostControls, PhaseTransition)
  hooks/
    useTimer.ts            # Countdown hook
  types/
    protocol.ts            # Shared types, message shapes, GamePhase enum, PlayerScore

backend/
  src/
    lib/roomManager.ts     # Room/round/scoring state — the source of truth
    controllers/           # REST endpoints (rooms, join, qr)
  public/
    player.html            # Standalone vanilla HTML/CSS/JS player client (no build step)
```

## Game Flow

`LOBBY → PROMPT_SUBMISSION → VOTING → PERFORMANCE → LEADERBOARD → ACTOR_REVEAL → (next round)`

Phase transitions are driven **client-side** via timers in `GameStateContext.tsx`. The backend sends events (`round_started`, `voting_started`, `prompt_selected`, etc.) and the host client manages phase progression timing.

### Scoring (client-side in GameStateContext)
- **Prompt winner**: 50 points
- **Actor** (performer): 100 points

### Phase durations (constants in GameStateContext)
- Performance: 60s
- Leaderboard: 8s
- Actor Reveal: 5s

## Design System: "Neographic Maximalist"

A '90s-inspired, high-energy aesthetic. **No rounded corners. No soft shadows. No minimalism.**

### Color Palette
| Token | Hex | Usage |
|-------|-----|-------|
| Pink (Primary) | `#ff66b2` | Brand, headings, high-impact actions, urgent states |
| Teal (Secondary) | `#5ef8f8` | Secondary actions, info boxes, timer default |
| Yellow (Accent) | `#fbfb62` | Room codes, highlights, card headers, badges |
| Background | `#f6f6f6` | Base surface with dotted pattern overlay |
| Ink/Borders | `#000000` | All borders (3-4px), text, hard shadows |

Tailwind tokens: `party-pink`, `party-teal`, `party-yellow`, `party-bg` (defined in `tailwind.config.ts`). Most colors are used as arbitrary values (`bg-[#ff66b2]`) throughout.

### Typography
- **Font**: Space Grotesk (loaded via Google Fonts in `index.html` and `player.html`)
- **Headings**: `font-black uppercase tracking-[-0.05em]` (sometimes italic)
- **Body**: `font-bold`

### Core Patterns

**Sticker containers** — White bg, 3px black border, hard black shadow (8px offset), subtle rotation:
```
bg-white border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
```

**Tactile buttons** — Press-down effect on every clickable element:
```
shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
active:translate-x-[0px] active:translate-y-[0px] active:shadow-none
transition-all duration-75
```

**Inputs** — Stark, no border-radius:
```
border-[3px] border-black p-3 font-bold focus:outline-none focus:ring-4 focus:ring-[#5ef8f8]/30
```

**Background** — Dotted radial pattern (applied in `index.css` and `player.html`):
```css
background-image: radial-gradient(#e5e5e5 1px, transparent 1px);
background-size: 20px 20px;
```

**Decorative shapes** — Absolute-positioned pink/teal/yellow squares, triangles, circles with rotation, placed at `-z-10`.

### Rules
- **Never** use `rounded-*` classes (0px border-radius everywhere)
- **Never** use soft/ambient shadows — only hard-offset black shadows
- **Always** use 3px+ borders on containers and interactive elements
- **Always** implement the press-down tactile interaction on buttons
- Subtle rotation (`-1deg` to `2deg`) on cards for "sticker" energy
- Room code must always be the largest, most vibrant element on screen (yellow bg, massive font)

## Important Notes

- `player.html` is a **standalone file** with inline CSS/JS — no Tailwind, no React. It must be styled to match the Remix design system manually.
- Room codes are 4 uppercase alphanumeric characters (generated in `backend/src/lib/roomManager.ts`).
- The host display never shows input fields for players — all player interaction happens on phones via `player.html`.
- Reference designs live in `/remix images/` with screen mockups and HTML prototypes per screen.
