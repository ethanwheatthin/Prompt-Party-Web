# Prompt Party

A party game where one player performs and everyone else writes the prompts. Originally built in Unity, now rebuilt as a web app using Electron and Vite.

Players join from their phones by scanning a QR code or entering a room code. The host display runs on a big screen (TV, monitor, or projector). Each round, one player is the "actor" and everyone else submits a creative prompt for them to perform. Players vote on their favorite prompt, and the winning prompter scores points.

## Tech Stack

**Host Display** — React 19, TypeScript, Vite 6, Tailwind CSS, Electron 35

**Backend** — Fastify 4, WebSocket, JWT auth, in-memory room state

**Player UI** — Vanilla JS served as a static HTML page from the backend

## Getting Started

### Prerequisites

- Node.js (v18+)

### Install

```bash
# Install host UI dependencies
npm install

# Install backend dependencies
cd backend
npm install
```

### Configure

Copy `backend/.env.example` to `backend/.env`:

```
PORT=3000
JWT_SECRET=dev-secret
HOST_URL=http://localhost:3000
```

### Run

The easiest way to start is with the included batch file:

```bash
start.bat
```

Or start each process manually:

```bash
# Terminal 1 — backend
cd backend && npm run dev

# Terminal 2 — host UI (browser)
npm run dev

# Terminal 2 — host UI (Electron window)
npm run electron:dev
```

- Host display: `http://localhost:5173`
- Player join page: `http://localhost:3000/player.html`

### Build for Distribution

```bash
npm run electron:build
```

Produces platform-specific installers in `release/` (NSIS on Windows, DMG on Mac, AppImage on Linux).

## How to Play

1. **Create a room** — The host enters their name on the host display. A room code and QR code appear on screen.
2. **Players join** — Players open `player.html` on their phones (or scan the QR code), enter the room code and their name.
3. **Prompt submission** — Each round, one player is chosen as the actor and a topic is revealed. All other players have 90 seconds to submit a creative prompt for the actor to perform.
4. **Voting** — Players vote on their favorite prompt.
5. **Performance** — The winning prompt is displayed on the big screen. The actor has 60 seconds to perform it live.
6. **Leaderboard** — Scores are shown. The winning prompter earns 100 points.
7. **Repeat** — The actor rotates each round. Play as many rounds as you want.

## Project Structure

```
├── backend/                # Fastify backend server
│   ├── src/
│   │   ├── server.ts       # Server entry point
│   │   ├── controllers/    # REST routes (create room, join, QR code)
│   │   ├── lib/            # Game logic (room/round/vote management)
│   │   └── ws/             # WebSocket message handling
│   └── public/
│       └── player.html     # Phone player UI
├── src/                    # React host display app
│   ├── context/            # Game state + WebSocket management
│   ├── phases/             # Phase-specific display components
│   ├── components/         # Shared UI components
│   ├── hooks/              # Timer hooks
│   └── types/              # Shared protocol types
├── electron/
│   └── main.ts             # Electron main process
├── start.bat               # One-click dev launcher
└── electron-builder.yml    # Distribution build config
```
