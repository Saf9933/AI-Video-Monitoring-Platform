import { Server } from 'socket.io';
import { Alert, AlertType, AlertPriority } from './types';

export class AlertGenerator {
  private interval: NodeJS.Timeout | null = null;
  private readonly alertTypes: AlertType[] = ['bullying', 'violence', 'distress', 'medical_emergency'];
  private readonly priorities: AlertPriority[] = ['low', 'medium', 'high', 'critical'];
  private readonly classrooms = ['ROOM-205A', 'ROOM-106B', 'ROOM-301C', 'ROOM-208A', 'ROOM-155B'];
  private readonly studentIds = ['STU001', 'STU002', 'STU003', 'STU004', 'STU005', 'STU006', 'STU007'];

  private readonly summaries = [
    "Real-time detected emotional distress pattern",
    "Verbal confrontation escalating between students",
    "Physical altercation detected in progress",
    "Student requesting immediate assistance",
    "Aggressive behavior pattern requiring intervention"
  ];

  private readonly keyIndicators = [
    ["emotional distress", "help-seeking behavior", "peer conflict"],
    ["verbal aggression", "confrontational posture", "escalating tension"],
    ["physical contact", "aggressive movement", "immediate threat"],
    ["distress signals", "withdrawal behavior", "social isolation"],
    ["pattern recognition", "repeated incidents", "risk escalation"]
  ];

  constructor(
    private dataStore: any,
    private io: Server
  ) {}

  start(): void {
    if (this.interval) {
      return;
    }

    const generateAlert = () => {
      const classroomId = this.classrooms[Math.floor(Math.random() * this.classrooms.length)];
      const hasEvidence = Math.random() > 0.3;
      const alertType = this.alertTypes[Math.floor(Math.random() * this.alertTypes.length)];
      
      // Generate affected students (1-2 for real-time alerts)
      const numStudents = Math.floor(Math.random() * 2) + 1;
      const selectedStudents = this.studentIds.sort(() => 0.5 - Math.random()).slice(0, numStudents);
      const roles: ('target' | 'aggressor' | 'bystander')[] = ['target', 'aggressor'];
      
      const randomAlert: Omit<Alert, 'alert_id' | 'timestamp'> = {
        classroom_id: classroomId,
        alert_type: alertType,
        priority: this.priorities[Math.floor(Math.random() * this.priorities.length)],
        risk_score: Math.round((Math.random() * 0.4 + 0.6) * 100) / 100, // 0.6 to 1.0 for generated alerts
        status: 'new',
        affected_students: selectedStudents.map((studentId, index) => ({
          student_id: studentId,
          role: roles[index % roles.length],
          confidence: Math.round((Math.random() * 0.3 + 0.7) * 100) / 100 // Higher confidence for real-time
        })),
        evidence_package: hasEvidence ? {
          primary_evidence: `https://secure-evidence.edu/live/${Date.now()}.mp4`,
          context_window: Math.floor(Math.random() * 60) + 30, // 30-90 seconds
          redaction_applied: false // Live alerts typically not pre-redacted
        } : undefined,
        explanation: {
          summary: this.summaries[Math.floor(Math.random() * this.summaries.length)],
          key_indicators: this.keyIndicators[Math.floor(Math.random() * this.keyIndicators.length)]
        }
      };

      const newAlert = this.dataStore.addAlert(randomAlert);
      console.log(`Generated new alert: ${newAlert.alert_id} - ${newAlert.alert_type} (${newAlert.priority})`);
      
      // Emit to specific classroom and general topics
      this.io.emit('alert.new', newAlert);
      this.io.emit(`alert.new.${newAlert.classroom_id}`, newAlert);

      const nextInterval = Math.random() * (30000 - 15000) + 15000;
      this.interval = setTimeout(generateAlert, nextInterval);
    };

    const initialDelay = Math.random() * (30000 - 15000) + 15000;
    this.interval = setTimeout(generateAlert, initialDelay);
  }

  stop(): void {
    if (this.interval) {
      clearTimeout(this.interval);
      this.interval = null;
    }
  }
}