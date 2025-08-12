# AI Video Monitoring Platform

A student safety monitoring system that detects emotional distress and bullying incidents in real-time using the AlertRaised schema from the API contracts specification.

## Quick Start

```bash
docker compose up --build
```

Then open http://localhost:8080

## Services

- **Frontend** (React + TypeScript): http://localhost:8080
- **Mock API** (Express + Socket.IO): http://localhost:8000

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE` | `http://mock-api:8000/api` | Backend API URL for frontend |
| `PORT` | `8000` | Mock API service port |

## Features

- **Real-time Alerts**: 25 seeded student safety alerts aligned with AlertRaised schema
- **Alert Management**: Acknowledge, resolve, and mark false positive alerts
- **WebSocket Updates**: Live alert notifications via Socket.IO every 15-30s
- **Student Context**: Evidence packages with video clips, risk scoring, and multi-student incidents
- **Classroom Monitoring**: Alerts across 5 classrooms with priority-based risk assessment

## Alert Schema

Alerts follow the simplified AlertRaised schema for prototype use:

```typescript
interface Alert {
  alert_id: string;        // Format: ALT-{classroom}-{timestamp}
  timestamp: string;
  classroom_id: string;    // e.g., "ROOM-205A"
  alert_type: 'bullying' | 'violence' | 'distress' | 'medical_emergency';
  priority: 'low' | 'medium' | 'high' | 'critical';
  risk_score: number;      // 0.5 to 1.0
  status: 'new' | 'acknowledged' | 'resolved' | 'false_positive';
  affected_students: Array<{
    student_id: string;
    role: 'target' | 'aggressor' | 'bystander';
    confidence: number;
  }>;
  evidence_package?: {
    primary_evidence?: string;
    context_window?: number;
    redaction_applied?: boolean;
  };
  explanation?: {
    summary?: string;
    key_indicators?: string[];
  };
}
```

## API Endpoints

- `GET /api/alerts` - List all alerts
- `GET /api/alerts/:alert_id` - Get specific alert
- `POST /api/alerts/:alert_id/acknowledge` - Acknowledge alert
- `POST /api/alerts/:alert_id/resolve` - Resolve alert
- `POST /api/alerts/:alert_id/false-positive` - Mark as false positive
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