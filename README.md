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

## GitHub Pages Deployment (Frontend)

This repo uses a workflow at `.github/workflows/deploy-frontend-pages.yml` to deploy `frontend/` to GitHub Pages.

- Repository page (source view): `https://github.com/nishu-1703/skillswap`
- Live app URL (after Pages deploy): `https://nishu-1703.github.io/skillswap/`

If you open the repository URL, you will always see files and `README.md`.  
Use the GitHub Pages URL to open the app.

### Required GitHub setting

In the GitHub repository:
1. Go to `Settings` -> `Pages`
2. Set `Source` to `GitHub Actions`

### Optional API variable

The frontend reads `VITE_API_BASE_URL` during build.

If your backend is deployed, add repository variable:
1. `Settings` -> `Secrets and variables` -> `Actions` -> `Variables`
2. Add `VITE_API_BASE_URL` (example: `https://your-backend.onrender.com`)

## Architecture

- **Backend**: Express API with in-memory demo data (replace with DB later)
- **Frontend**: Vite + React with landing page, dashboard, and health check
- **Credits**: Teaching earns 5 credits, learning costs 5 credits

## API Endpoints

- `GET /health` - Backend health check
- `GET /api/skills` - All available skills
- `GET /api/user/:id` - User profile and credits
- `POST /api/session/complete` - Complete session, transfer credits
