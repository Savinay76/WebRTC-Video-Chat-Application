# MeshCall — WebRTC Video Chat Application

A production-ready, multi-peer video chat application built with **Next.js**, **TypeScript**, **Socket.IO**, and **WebRTC**. Supports up to 4 participants in a full mesh topology with real-time text chat, media controls, and Docker containerization.

![WebRTC](https://img.shields.io/badge/WebRTC-Enabled-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4-orange)

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Custom Next.js Server                 │
│  ┌───────────────────┐    ┌────────────────────────┐    │
│  │  Next.js Handler   │    │   Socket.IO Server     │    │
│  │  (Pages/API/SSR)   │    │   (WebSocket Signaling)│    │
│  └───────────────────┘    └────────────────────────┘    │
│           HTTP                     WebSocket             │
└──────────────┬──────────────────────┬───────────────────┘
               │                      │
    ┌──────────┴──────────┐  ┌───────┴────────┐
    │     Client App      │  │  Client App    │
    │  ┌────────────────┐ │  │ ┌────────────┐ │
    │  │ useUserMedia   │ │  │ │ useUserMedia│ │
    │  │ useSignaling   │ │  │ │ useSignaling│ │
    │  │ useWebRTC      │ │  │ │ useWebRTC   │ │
    │  └────────────────┘ │  │ └────────────┘ │
    │         P2P ◄───────┼──┼───► P2P        │
    │    (Audio/Video)    │  │  (Audio/Video)  │
    └─────────────────────┘  └────────────────┘
```

### Mesh Topology

Each participant establishes a direct peer-to-peer connection with every other participant:

- **2 peers** → 1 connection
- **3 peers** → 3 connections  
- **4 peers** → 6 connections

## Features

- 🎥 **Multi-peer Video Chat** — Up to 4 participants with full mesh topology
- 🔊 **Audio/Video Controls** — Mute microphone, toggle camera on/off
- 💬 **Real-time Text Chat** — Send and receive messages via WebSocket
- 🔗 **Room-based** — Create or join rooms with unique UUIDs
- 📋 **Copy Room Link** — One-click room link sharing
- 🟢 **Connection Status** — Visual indicators (Waiting → Connecting → Connected)
- 🐳 **Docker Ready** — Multi-stage Dockerfile with health checks
- 🎨 **Premium UI** — Dark theme with glassmorphism, animations, and responsive design
- 🧹 **Graceful Cleanup** — Proper resource cleanup on disconnect/hangup

## Tech Stack

| Layer      | Technology        |
| ---------- | ----------------- |
| Frontend   | Next.js 16, React 19 |
| Language   | TypeScript 5      |
| Styling    | Tailwind CSS 4    |
| Signaling  | Socket.IO 4       |
| Real-time  | WebRTC (native)   |
| Container  | Docker, Docker Compose |
| STUN       | Google STUN servers |

## Quick Start

### Prerequisites

- Node.js 18+
- npm 9+
- Docker & Docker Compose (for containerized deployment)

### Local Development

```bash
# 1. Clone the repository
git clone <repo-url>
cd WebRTC-Video-Chat-Application

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env.local

# 4. Start the development server
npm run dev

# 5. Open http://localhost:3000 in your browser
```

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build -d

# Check health
curl http://localhost:3000/api/health

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

## Project Structure

```
├── server.ts                    # Custom Next.js + Socket.IO server
├── tsconfig.server.json         # TypeScript config for server
├── next.config.ts               # Next.js configuration (standalone)
├── Dockerfile                   # Multi-stage Docker build
├── docker-compose.yml           # Docker Compose configuration
├── .env.example                 # Environment variable documentation
├── .env.local                   # Local environment variables
├── src/
│   ├── app/
│   │   ├── globals.css          # Global styles & design system
│   │   ├── layout.tsx           # Root layout with metadata
│   │   ├── page.tsx             # Landing page (create/join room)
│   │   ├── api/health/route.ts  # Health check API endpoint
│   │   └── room/[roomId]/
│   │       └── page.tsx         # Video chat room page
│   ├── components/
│   │   ├── VideoGrid.tsx        # Remote video grid layout
│   │   ├── LocalVideo.tsx       # Local video PiP overlay
│   │   ├── Controls.tsx         # Call control buttons
│   │   ├── ChatPanel.tsx        # Text chat panel
│   │   └── StatusIndicator.tsx  # Connection status display
│   └── hooks/
│       ├── useSignaling.ts      # Socket.IO connection & events
│       ├── useUserMedia.ts      # Camera/mic access & controls
│       └── useWebRTC.ts         # Peer connection management
└── package.json
```

## Environment Variables

| Variable                    | Description                          | Default                        |
| --------------------------- | ------------------------------------ | ------------------------------ |
| `PORT`                      | Server port                          | `3000`                         |
| `NEXT_PUBLIC_STUN_SERVER`   | STUN server URL for NAT traversal    | `stun:stun.l.google.com:19302` |

## WebRTC Signaling Flow

```
Peer A                    Server                    Peer B
  │                         │                         │
  │── join-room ──────────►│                         │
  │                         │──── user-joined ──────►│
  │                         │                         │
  │── offer ──────────────►│──── offer ─────────────►│
  │                         │                         │
  │◄──── answer ───────────│◄──── answer ────────────│
  │                         │                         │
  │── ice-candidate ──────►│──── ice-candidate ─────►│
  │◄──── ice-candidate ────│◄──── ice-candidate ─────│
  │                         │                         │
  │◄════════════ P2P Media Stream ═══════════════════►│
```

## Testing

### Multi-peer Testing

1. Start the application (`npm run dev`)
2. Open `http://localhost:3000` and create a new room
3. Copy the room URL
4. Open the URL in 1-3 additional browser tabs/windows
5. Each tab acts as a separate peer

### Verifying WebRTC Connection

1. Open Chrome DevTools → Network tab → Filter by "WS"
2. Verify WebSocket connection shows "101 Switching Protocols"
3. Navigate to `chrome://webrtc-internals` for detailed connection diagnostics

### Health Check

```bash
curl http://localhost:3000/api/health
# Returns: {"status":"ok","timestamp":"...","uptime":...}
```

## data-test-id Reference

| Element                    | `data-test-id`            |
| -------------------------- | ------------------------- |
| Local video                | `local-video`             |
| Remote video container     | `remote-video-container`  |
| Mute mic button            | `mute-mic-button`         |
| Toggle camera button       | `toggle-camera-button`    |
| Hangup button              | `hangup-button`           |
| Status: waiting            | `status-waiting`          |
| Status: connecting         | `status-connecting`       |
| Status: connected          | `status-connected`        |
| Chat input                 | `chat-input`              |
| Chat submit button         | `chat-submit`             |
| Chat log container         | `chat-log`                |
| Chat message               | `chat-message`            |

## Scalability Considerations

The **mesh topology** used in this application is ideal for small groups (2-4 participants) but has quadratic scaling:

| Participants | Connections per Client | Total Connections |
| ------------ | ---------------------- | ----------------- |
| 2            | 1                      | 1                 |
| 3            | 2                      | 3                 |
| 4            | 3                      | 6                 |
| N            | N-1                    | N(N-1)/2          |

For larger groups, consider:
- **SFU (Selective Forwarding Unit)** — Routes media through a central server
- **MCU (Multi-point Control Unit)** — Mixes media on the server

## License

MIT
