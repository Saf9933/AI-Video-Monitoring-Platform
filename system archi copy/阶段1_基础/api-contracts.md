# API Contracts & Event Schemas

## Event Schemas

### EmotionEvent

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "title": "EmotionEvent",
  "description": "Event representing emotional analysis from audio/visual inputs",
  "properties": {
    "event_id": {
      "type": "string", 
      "format": "uuid",
      "description": "Unique identifier for this emotion event"
    },
    "timestamp": {
      "type": "string", 
      "format": "date-time",
      "description": "ISO 8601 timestamp when event occurred"
    },
    "classroom_id": {
      "type": "string", 
      "pattern": "^[A-Z0-9-]+$",
      "description": "Classroom identifier (e.g., 'ROOM-205A')"
    },
    "source": {
      "enum": ["audio", "vision"],
      "description": "Source modality that detected the emotion"
    },
    "emotions": {
      "type": "object",
      "description": "Emotion confidence scores (0.0-1.0)",
      "properties": {
        "distress": {"type": "number", "minimum": 0, "maximum": 1},
        "anger": {"type": "number", "minimum": 0, "maximum": 1},
        "fear": {"type": "number", "minimum": 0, "maximum": 1},
        "sadness": {"type": "number", "minimum": 0, "maximum": 1},
        "happiness": {"type": "number", "minimum": 0, "maximum": 1},
        "neutral": {"type": "number", "minimum": 0, "maximum": 1}
      },
      "additionalProperties": false
    },
    "confidence": {
      "type": "number", 
      "minimum": 0, 
      "maximum": 1,
      "description": "Overall confidence in emotion detection"
    },
    "student_ids": {
      "type": "array",
      "items": {"type": "string"},
      "description": "List of affected student identifiers (may be empty for privacy)"
    },
    "evidence_url": {
      "type": "string", 
      "format": "uri",
      "description": "Encrypted URL to evidence clip (expires in 30 days)"
    },
    "privacy_level": {
      "enum": ["full_consent", "partial_redacted", "fully_redacted"],
      "description": "Privacy redaction level applied"
    },
    "metadata": {
      "type": "object",
      "properties": {
        "duration_seconds": {"type": "number", "minimum": 0},
        "location_in_room": {"type": "string"},
        "audio_quality_score": {"type": "number", "minimum": 0, "maximum": 1}
      }
    }
  },
  "required": [
    "event_id", 
    "timestamp", 
    "classroom_id", 
    "source", 
    "emotions", 
    "confidence"
  ],
  "additionalProperties": false
}
```

### BullyingEvent

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "title": "BullyingEvent", 
  "description": "Event representing detected bullying behavior",
  "properties": {
    "event_id": {
      "type": "string", 
      "format": "uuid"
    },
    "timestamp": {
      "type": "string", 
      "format": "date-time"
    },
    "classroom_id": {
      "type": "string",
      "pattern": "^[A-Z0-9-]+$"
    },
    "incident_type": {
      "enum": ["verbal", "physical", "cyberbullying", "exclusion", "relational"],
      "description": "Type of bullying behavior detected"
    },
    "severity": {
      "enum": ["low", "medium", "high", "critical"],
      "description": "Assessed severity level"
    },
    "participants": {
      "type": "object",
      "properties": {
        "aggressors": {
          "type": "array",
          "items": {"type": "string"},
          "description": "Student IDs of those exhibiting aggressive behavior"
        },
        "targets": {
          "type": "array", 
          "items": {"type": "string"},
          "description": "Student IDs of those being targeted"
        },
        "bystanders": {
          "type": "array",
          "items": {"type": "string"}, 
          "description": "Student IDs of witnesses"
        }
      }
    },
    "detection_sources": {
      "type": "array",
      "items": {"enum": ["vision", "audio", "text"]},
      "description": "Modalities that contributed to detection"
    },
    "risk_score": {
      "type": "number", 
      "minimum": 0, 
      "maximum": 1,
      "description": "Computed risk score for this incident"
    },
    "evidence": {
      "type": "object",
      "properties": {
        "video_clip": {
          "type": "string", 
          "format": "uri",
          "description": "URL to encrypted video evidence"
        },
        "audio_clip": {
          "type": "string", 
          "format": "uri",
          "description": "URL to encrypted audio evidence"
        },
        "transcript": {
          "type": "string",
          "description": "Speech-to-text transcript (may be redacted)"
        },
        "chat_messages": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "sender_id": {"type": "string"},
              "content": {"type": "string"},
              "timestamp": {"type": "string", "format": "date-time"}
            }
          }
        },
        "context_window_seconds": {
          "type": "integer",
          "minimum": 30,
          "maximum": 300,
          "description": "Duration of evidence clip"
        }
      }
    },
    "explanation": {
      "type": "object",
      "description": "SHAP-based explanation of detection",
      "properties": {
        "feature_importance": {
          "type": "object",
          "description": "Feature importance scores"
        },
        "key_phrases": {
          "type": "array",
          "items": {"type": "string"}
        },
        "visual_cues": {
          "type": "array", 
          "items": {"type": "string"}
        }
      }
    }
  },
  "required": [
    "event_id", 
    "timestamp", 
    "classroom_id", 
    "incident_type", 
    "severity", 
    "risk_score"
  ],
  "additionalProperties": false
}
```

### AlertRaised

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "title": "AlertRaised",
  "description": "Alert generated when risk threshold exceeded",
  "properties": {
    "alert_id": {
      "type": "string", 
      "pattern": "^ALT-[A-Z0-9-]+$",
      "description": "Unique alert identifier (e.g., 'ALT-205A-20240315-1432')"
    },
    "timestamp": {
      "type": "string", 
      "format": "date-time"
    },
    "classroom_id": {
      "type": "string"
    },
    "alert_type": {
      "enum": ["bullying", "violence", "distress", "medical_emergency", "weapon_detected", "exam_pressure", "isolation_bullying", "self_harm", "teacher_verbal_abuse", "cyber_tracking"],
      "description": "Primary classification of safety concern covering 5 core scenarios"
    },
    "priority": {
      "enum": ["low", "medium", "high", "critical"],
      "description": "Alert priority level for response teams"
    },
    "risk_score": {
      "type": "number", 
      "minimum": 0.5, 
      "maximum": 1,
      "description": "Must be >= 0.5 to generate alert"
    },
    "triggering_events": {
      "type": "array",
      "items": {"type": "string"},
      "description": "Event IDs that contributed to this alert"
    },
    "affected_students": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "student_id": {"type": "string"},
          "role": {"enum": ["target", "aggressor", "bystander"]},
          "confidence": {"type": "number", "minimum": 0, "maximum": 1}
        }
      }
    },
    "assigned_staff": {
      "type": "object",
      "properties": {
        "teacher_id": {"type": "string"},
        "counselor_id": {"type": "string"},
        "admin_id": {"type": "string"}
      }
    },
    "evidence_package": {
      "type": "object",
      "properties": {
        "primary_evidence": {
          "type": "string", 
          "format": "uri",
          "description": "Main evidence file (video/audio clip)"
        },
        "supporting_evidence": {
          "type": "array",
          "items": {"type": "string", "format": "uri"},
          "description": "Additional evidence files"
        },
        "context_window": {
          "type": "integer", 
          "minimum": 30, 
          "maximum": 300,
          "description": "Seconds of context around incident"
        },
        "redaction_applied": {"type": "boolean"}
      }
    },
    "status": {
      "enum": ["new", "acknowledged", "in_progress", "resolved", "escalated", "false_positive"],
      "description": "Current alert status"
    },
    "acknowledgment_deadline": {
      "type": "string", 
      "format": "date-time",
      "description": "When alert auto-escalates if unacknowledged"
    },
    "auto_escalate": {
      "type": "boolean", 
      "default": true,
      "description": "Whether to auto-escalate on deadline"
    },
    "explanation": {
      "type": "object",
      "description": "Human-readable explanation of alert",
      "properties": {
        "summary": {"type": "string"},
        "key_indicators": {"type": "array", "items": {"type": "string"}},
        "confidence_breakdown": {
          "type": "object",
          "properties": {
            "vision_confidence": {"type": "number"},
            "audio_confidence": {"type": "number"}, 
            "text_confidence": {"type": "number"},
            "fusion_confidence": {"type": "number"},
            "pressure_index": {"type": "number", "minimum": 0, "maximum": 1, "description": "Based on heart rate variability and micro-expression intensity"},
            "exclusion_rate": {"type": "number", "minimum": 0, "maximum": 1, "description": "Empty seats within 2m around target student"},
            "oppression_index": {"type": "number", "minimum": 0, "maximum": 1, "description": "Legal-BERT contextual analysis, >0.85 indicates psychological oppression"}
          }
        }
      }
    }
  },
  "required": [
    "alert_id", 
    "timestamp", 
    "classroom_id", 
    "alert_type", 
    "priority", 
    "risk_score"
  ],
  "additionalProperties": false
}
```

## REST API Endpoints

### Base URL
```
https://api.safety-platform.edu/v1
```

### Authentication
All API endpoints require Bearer token authentication:
```http
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

### Alerts API

#### List Alerts
```http
GET /alerts

Query Parameters:
- classroom_id (optional): Filter by classroom
- status (optional): Filter by alert status 
- priority (optional): Filter by priority level
- start_date (optional): ISO 8601 date
- end_date (optional): ISO 8601 date  
- limit (optional): Max results (default: 50, max: 200)
- offset (optional): Pagination offset

Response: 200 OK
{
  "alerts": [AlertRaised],
  "total_count": 1234,
  "has_more": true
}
```

#### Get Alert Details
```http
GET /alerts/{alert_id}

Response: 200 OK
AlertRaised object with full details

Errors:
- 404: Alert not found
- 403: Insufficient permissions
```

#### Acknowledge Alert  
```http
POST /alerts/{alert_id}/acknowledge

Request Body:
{
  "acknowledged_by": "teacher_id",
  "notes": "Optional acknowledgment notes"
}

Response: 200 OK
{
  "status": "acknowledged", 
  "acknowledged_at": "2024-03-15T14:32:15Z"
}
```

#### Resolve Alert
```http
POST /alerts/{alert_id}/resolve

Request Body:
{
  "resolved_by": "teacher_id",
  "resolution_notes": "Description of resolution actions",
  "actions_taken": ["contacted_parents", "counselor_referral"],
  "follow_up_required": true,
  "follow_up_date": "2024-03-16T10:00:00Z"
}

Response: 200 OK
{
  "status": "resolved",
  "resolved_at": "2024-03-15T14:45:22Z"
}
```

#### Mark False Positive
```http
POST /alerts/{alert_id}/false-positive

Request Body:
{
  "marked_by": "teacher_id",
  "reason": "normal_playground_activity",
  "feedback_notes": "Students were playing tag during recess"
}

Response: 200 OK
{
  "status": "false_positive",
  "marked_at": "2024-03-15T14:30:11Z"
}
```

### Dashboard APIs

#### Teacher Dashboard
```http
GET /dashboard/teacher

Response: 200 OK
{
  "active_alerts": [AlertRaised],
  "recent_activity": [ActivityEvent],
  "classroom_stats": {
    "total_alerts_today": 3,
    "resolved_alerts_today": 2,
    "avg_response_time_minutes": 8.5
  },
  "pending_actions": [ActionItem]
}
```

#### Counselor Dashboard  
```http
GET /dashboard/counselor

Response: 200 OK
{
  "escalated_alerts": [AlertRaised],
  "high_priority_alerts": [AlertRaised],
  "student_trends": [TrendData],
  "follow_up_required": [FollowUpItem]
}
```

#### Admin Analytics
```http
GET /dashboard/admin

Response: 200 OK  
{
  "school_overview": SchoolStats,
  "alert_trends": [TrendData],
  "system_health": HealthMetrics,
  "compliance_status": ComplianceReport
}
```

### Evidence API

#### Get Evidence File
```http
GET /alerts/{alert_id}/evidence/{evidence_id}

Headers:
- Range: bytes=0-1024 (optional, for streaming)

Response: 200 OK
- Content-Type: video/mp4 | audio/wav | application/json
- Content-Length: file size
- Content-Disposition: attachment; filename="evidence.mp4"

Security:
- URLs expire after 24 hours
- Rate limited to prevent bulk download
- Audit logged for compliance
```

## WebSocket Topics

### Connection
```javascript
const ws = new WebSocket('wss://api.safety-platform.edu/ws');

// Authentication
ws.send(JSON.stringify({
  type: 'authenticate',
  token: '<JWT_TOKEN>'
}));
```

### Subscribe to Topics
```javascript
// Subscribe to classroom alerts
ws.send(JSON.stringify({
  type: 'subscribe',
  topic: 'alert.new.ROOM-205A'
}));

// Subscribe to personal notifications  
ws.send(JSON.stringify({
  type: 'subscribe', 
  topic: 'dashboard.teacher.teacher_123'
}));
```

### Available Topics

#### Alert Topics
- `alert.new.{classroom_id}` - New alerts for specific classroom
- `alert.updated.{alert_id}` - Status updates for specific alert  
- `alert.escalated.{alert_id}` - Escalation notifications
- `alert.resolved.{alert_id}` - Resolution notifications

#### Dashboard Topics
- `dashboard.teacher.{teacher_id}` - Teacher dashboard updates
- `dashboard.counselor.{counselor_id}` - Counselor dashboard updates
- `dashboard.admin.{admin_id}` - Admin dashboard updates

#### System Topics
- `system.status` - System health and maintenance updates
- `system.emergency` - Emergency broadcasts (rare)

### Message Format
```javascript
// Incoming message structure
{
  "topic": "alert.new.ROOM-205A",
  "timestamp": "2024-03-15T14:32:15Z",
  "data": AlertRaised | DashboardUpdate | SystemStatus,
  "message_id": "msg_12345"
}
```

## Rate Limiting

| Endpoint Category | Rate Limit | Window |
|------------------|------------|--------|
| Authentication | 10 requests | 1 minute |
| Alert queries | 100 requests | 1 minute |  
| Alert actions | 50 requests | 1 minute |
| Evidence access | 20 requests | 1 minute |
| WebSocket connections | 5 connections | Per user |

Rate limit headers:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1710508860
```

## Error Response Format

```json
{
  "error": {
    "code": "ALERT_NOT_FOUND",
    "message": "Alert with ID 'ALT-123' not found",
    "details": {
      "alert_id": "ALT-123",
      "timestamp": "2024-03-15T14:32:15Z"
    },
    "request_id": "req_12345"
  }
}
```

Common error codes:
- `AUTHENTICATION_REQUIRED` - Missing or invalid token
- `INSUFFICIENT_PERMISSIONS` - User lacks required permissions
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `VALIDATION_ERROR` - Invalid request data
- `RESOURCE_NOT_FOUND` - Requested resource doesn't exist
- `SYSTEM_MAINTENANCE` - System temporarily unavailable