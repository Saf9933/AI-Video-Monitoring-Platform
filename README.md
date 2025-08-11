# AI Video Monitoring Platform

A student safety monitoring system that detects emotional distress and bullying incidents in real-time.

## Quick Start

```bash
docker compose up --build
```

Then open http://localhost:8080

## Services

- **Frontend** (Vue.js): http://localhost:8080
- **Mock API** (Express + Socket.IO): http://localhost:8000

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE` | `http://mock-api:8000/api` | Backend API URL for frontend |
| `PORT` | `8000` | Mock API service port |

## Features

- **Real-time Alerts**: 25 seeded student safety alerts with live updates every 15-30s
- **Alert Management**: Acknowledge and resolve alerts with immediate UI updates
- **WebSocket Updates**: Live alert notifications via Socket.IO
- **Student Context**: Evidence includes transcripts, thumbnails, and behavioral snippets

## API Endpoints

- `GET /api/alerts` - List all alerts
- `POST /api/alerts/:id/ack` - Acknowledge alert
- `POST /api/alerts/:id/resolve` - Resolve alert
- `GET /healthz` - Health check

## Development

```bash
# Backend development
cd services/mock-api
npm run dev

# Frontend development  
cd frontend
npm run dev
```