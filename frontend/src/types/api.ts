// src/types/api.ts
export type AlertStatus = 'open' | 'acknowledged' | 'resolved';
export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';
export type AlertType = 'emotional_distress' | 'bullying_incident' | 'pattern_detected';

export interface Alert {
  id: string;
  studentId: string;
  type: AlertType;
  severity: AlertSeverity;
  confidence: number;
  createdAt: string;
  status: AlertStatus;
  evidence?: {
    thumbUrl?: string;
    transcript?: string;
    snippet?: string;
  };
}
  