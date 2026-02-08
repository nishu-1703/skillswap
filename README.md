# SkillSwap - Minimal Prototype

A credit-based peer-to-peer skill exchange platform. Users teach to earn credits, spend credits to learn.

## Quick Start

### Backend (Express + Node.js)

```powershell
cd backend
npm install
npm start
```

Server runs on `http://localhost:4000`

### Frontend (React + Vite)

```powershell
cd frontend
npm install
npm run dev
```

App runs on `http://localhost:5173`

## Architecture

- **Backend**: Express API with in-memory demo data (replace with DB later)
- **Frontend**: Vite + React with landing page, dashboard, and health check
- **Credits**: Teaching earns 5 credits, learning costs 5 credits

## API Endpoints

- `GET /health` - Backend health check
- `GET /api/skills` - All available skills
- `GET /api/user/:id` - User profile and credits
- `POST /api/session/complete` - Complete session, transfer credits
