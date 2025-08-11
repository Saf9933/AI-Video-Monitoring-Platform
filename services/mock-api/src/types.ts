export type AlertStatus = 'new' | 'acknowledged' | 'resolved' | 'false_positive';
export type AlertPriority = 'low' | 'medium' | 'high' | 'critical';
export type AlertType = 'bullying' | 'violence' | 'distress' | 'medical_emergency';

export interface Alert {
  alert_id: string;  // Format: ALT-{classroom}-{timestamp}
  timestamp: string;
  classroom_id: string;
  alert_type: AlertType;
  priority: AlertPriority;
  risk_score: number; // 0.5 to 1.0
  status: AlertStatus;
  affected_students: Array<{
    student_id: string;
    role: 'target' | 'aggressor' | 'bystander';
    confidence: number;
  }>;
  evidence_package?: {
    primary_evidence?: string; // URL
    context_window?: number; // seconds
    redaction_applied?: boolean;
  };
  explanation?: {
    summary?: string;
    key_indicators?: string[];
  };
}