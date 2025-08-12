// src/types/api.ts
export type AlertStatus = 'new' | 'acknowledged' | 'in_progress' | 'resolved' | 'escalated' | 'false_positive';
export type AlertPriority = 'low' | 'medium' | 'high' | 'critical';
export type AlertType = 'bullying' | 'violence' | 'distress' | 'medical_emergency' | 'weapon_detected' | 'exam_pressure' | 'isolation_bullying' | 'self_harm' | 'teacher_verbal_abuse' | 'cyber_tracking';

export interface Alert {
  alert_id: string;  // Format: ALT-{classroom}-{timestamp}
  timestamp: string;
  classroom_id: string;
  alert_type: AlertType;
  priority: AlertPriority;
  risk_score: number; // 0.5 to 1.0
  status: AlertStatus;
  triggering_events: string[];
  affected_students: Array<{
    student_id: string;
    role: 'target' | 'aggressor' | 'bystander';
    confidence: number;
  }>;
  assigned_staff: {
    teacher_id?: string;
    counselor_id?: string;
    admin_id?: string;
  };
  evidence_package?: {
    primary_evidence?: string; // URL
    supporting_evidence?: string[]; // Array of URLs
    context_window?: number; // seconds
    redaction_applied?: boolean;
  };
  acknowledgment_deadline: string;
  auto_escalate: boolean;
  explanation?: {
    summary?: string;
    key_indicators?: string[];
    confidence_breakdown?: {
      vision_confidence?: number;
      audio_confidence?: number;
      text_confidence?: number;
      fusion_confidence?: number;
      pressure_index?: number; // 0-1 for exam pressure scenarios
      exclusion_rate?: number; // 0-1 for isolation bullying
      oppression_index?: number; // 0-1 for teacher verbal abuse
    };
  };
}

// Privacy and consent types
export type ConsentStatus = 'full_consent' | 'partial_redacted' | 'fully_redacted';
export type PrivacyLevel = 'full_consent' | 'partial_redacted' | 'fully_redacted';

export interface EmotionEvent {
  event_id: string;
  timestamp: string;
  classroom_id: string;
  source: 'audio' | 'vision';
  emotions: {
    distress?: number;
    anger?: number;
    fear?: number;
    sadness?: number;
    happiness?: number;
    neutral?: number;
  };
  confidence: number;
  student_ids: string[];
  evidence_url?: string;
  privacy_level: PrivacyLevel;
  metadata?: {
    duration_seconds?: number;
    location_in_room?: string;
    audio_quality_score?: number;
  };
}

export interface BullyingEvent {
  event_id: string;
  timestamp: string;
  classroom_id: string;
  incident_type: 'verbal' | 'physical' | 'cyberbullying' | 'exclusion' | 'relational';
  severity: 'low' | 'medium' | 'high' | 'critical';
  participants: {
    aggressors: string[];
    targets: string[];
    bystanders: string[];
  };
  detection_sources: ('vision' | 'audio' | 'text')[];
  risk_score: number;
  evidence?: {
    video_clip?: string;
    audio_clip?: string;
    transcript?: string;
    chat_messages?: Array<{
      sender_id: string;
      content: string;
      timestamp: string;
    }>;
    context_window_seconds?: number;
  };
  explanation?: {
    feature_importance?: Record<string, number>;
    key_phrases?: string[];
    visual_cues?: string[];
  };
}

// Dashboard data types
export interface DashboardStats {
  total: number;
  newAlerts: number;
  criticalAlerts: number;
  acknowledgedAlerts: number;
  inProgressAlerts: number;
  escalatedAlerts: number;
  resolvedToday: number;
  avgRiskScore: number;
  falsePositiveRate: number;
}

export interface ClassroomStats {
  totalAlerts: number;
  newAlerts: number;
  avgRiskScore: number;
  lastActivity: string;
  privacyCompliance: boolean;
  consentStatus: ConsentStatus;
}
  