# AI Video Monitoring Platform

A student safety monitoring system that detects emotional distress and bullying incidents in real-time using the AlertRaised schema from the API contracts specification. The system now features a comprehensive **Scenarios Hub** with five distinct monitoring scenarios for different school areas.

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
- **Scenarios Hub**: Centralized monitoring across 5 different school environments
- **Camera Management**: Real-time camera feeds with metadata and fallback support

## Scenarios Hub

The monitoring system now includes five specialized scenarios, each with dedicated camera monitoring and AI-powered analysis:

### 🎓 Scenarios Overview

| Scenario | Chinese | Cameras | Primary Focus |
|----------|---------|---------|---------------|
| **Classrooms** | 教室 | 15 | Emotion detection, bullying prevention, behavioral analysis |
| **Hallways & Commons** | 走廊 / 公共区域 | 12 | Conflict monitoring, crowd density, safety alerts |
| **Sports Grounds** | 操场 | 8 | Large gatherings, fights, crowd motion analysis |
| **Cafeteria** | 食堂 | 10 | Bullying detection, food fights, emotional distress |
| **Dormitories** | 宿舍 | 6 | Safety monitoring, nighttime anomalies (entry points only) |

### 🔧 Scenarios Architecture

#### Navigation Structure
```
/scenarios                    → Scenarios hub (main entry)
├── /scenarios/classrooms     → Classroom monitoring
├── /scenarios/hallways       → Hallway & commons monitoring  
├── /scenarios/playground     → Sports grounds monitoring
├── /scenarios/cafeteria      → Cafeteria monitoring
└── /scenarios/dormitories    → Dormitory monitoring
```

#### Components Architecture
```
src/
├── components/scenarios/
│   ├── ScenarioCard.tsx      → Reusable animated scenario cards
│   └── CameraCard.tsx        → Reusable camera tiles with actions
├── pages/scenarios/
│   ├── ScenariosHub.tsx      → Main scenarios overview page
│   └── ScenarioPage.tsx      → Generic scenario detail page
├── hooks/scenarios/
│   └── useScenarioCameras.ts → Data fetching with timeout/fallback
└── public/data/cameras/
    ├── classrooms.json       → Fallback data for classrooms
    ├── hallways.json         → Fallback data for hallways
    ├── playground.json       → Fallback data for playground
    ├── cafeteria.json        → Fallback data for cafeteria
    └── dormitories.json      → Fallback data for dormitories
```

### 📡 Data Fetching & Fallback Logic

The system implements a robust data fetching strategy:

1. **Primary Source**: API endpoint `/api/cameras/{scenario}` (3-second timeout)
2. **Fallback Source**: Static JSON files in `/public/data/cameras/{scenario}.json`
3. **Graceful Degradation**: Never shows endless loading spinners

#### API Integration
```typescript
// Primary API call (with timeout)
GET /api/cameras/classrooms
GET /api/cameras/hallways  
GET /api/cameras/playground
GET /api/cameras/cafeteria
GET /api/cameras/dormitories

// Fallback static files
GET /data/cameras/classrooms.json
GET /data/cameras/hallways.json
GET /data/cameras/playground.json
GET /data/cameras/cafeteria.json  
GET /data/cameras/dormitories.json
```

### 🎥 Camera Features

Each camera tile includes:

- **Live Stream**: Real-time video feeds with play/pause controls
- **Metadata**: Name, location, zone, resolution, storage duration
- **Status Indicators**: Online, offline, warning, error states  
- **Technical Specs**: WDR support, night vision, installation notes
- **Actions**: Detail view, retry stream, report issues
- **Accessibility**: Full keyboard navigation and screen reader support

### 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Dark Theme**: Consistent with existing platform design
- **Animations**: Framer Motion for smooth transitions and interactions
- **Accessibility**: ARIA labels, keyboard navigation, focus management
- **Bilingual Support**: Chinese/English labels and descriptions
- **Toast Notifications**: Non-blocking feedback for user actions

### 🔧 How to Add New Scenarios

1. **Add scenario configuration** in `ScenariosHub.tsx`
2. **Create fallback JSON file** in `/public/data/cameras/{scenario}.json`
3. **Update routing** if custom page needed
4. **Add translations** in i18n files
5. **Test fallback behavior** by simulating API failures

Example scenario configuration:
```typescript
{
  id: 'library',
  title: '图书馆',
  titleEn: 'Library', 
  description: '监控学习环境，防范噪音干扰',
  descriptionEn: 'Monitor study environment, prevent noise disturbances',
  icon: BookOpen,
  color: 'from-teal-500 to-cyan-500',
  bgPattern: 'bg-teal-500/10',
  borderColor: 'border-teal-500/30',
  features: ['安静监控', '座位管理', '设备保护'],
  cameraCount: 8,
  isActive: true
}
```

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

### Alerts
- `GET /api/alerts` - List all alerts
- `GET /api/alerts/:alert_id` - Get specific alert
- `POST /api/alerts/:alert_id/acknowledge` - Acknowledge alert
- `POST /api/alerts/:alert_id/resolve` - Resolve alert
- `POST /api/alerts/:alert_id/false-positive` - Mark as false positive

### Scenarios (New)
- `GET /api/cameras/classrooms` - Get classroom cameras
- `GET /api/cameras/hallways` - Get hallway cameras
- `GET /api/cameras/playground` - Get playground cameras
- `GET /api/cameras/cafeteria` - Get cafeteria cameras
- `GET /api/cameras/dormitories` - Get dormitory cameras

### Health
- `GET /healthz` - Health check

## Development

```bash
# Backend development
cd services/mock-api
npm run dev

# Frontend development  
cd frontend
npm run dev

# Build and test
cd frontend
npm run build
npm run lint
```

## Privacy & Compliance

The monitoring system adheres to strict privacy guidelines:

- **Dormitory Monitoring**: Limited to entrance/exit points only
- **Data Encryption**: All video streams are encrypted
- **Access Control**: Role-based permissions for camera access
- **Retention Policies**: Configurable storage duration (15-90 days)
- **Privacy Masking**: Automatic redaction for sensitive areas