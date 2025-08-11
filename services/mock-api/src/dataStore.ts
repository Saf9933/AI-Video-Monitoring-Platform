import { v4 as uuidv4 } from 'uuid';
import { Alert, AlertType, AlertPriority, AlertStatus } from './types';

class DataStore {
  private alerts: Alert[] = [];

  constructor() {
    this.initializeAlerts();
  }

  private generateAlertId(classroomId: string): string {
    const timestamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0];
    return `ALT-${classroomId}-${timestamp}`;
  }

  private initializeAlerts(): void {
    const alertTypes: AlertType[] = ['bullying', 'violence', 'distress', 'medical_emergency'];
    const priorities: AlertPriority[] = ['low', 'medium', 'high', 'critical'];
    const statuses: AlertStatus[] = ['new', 'acknowledged', 'resolved'];
    const classrooms = ['ROOM-205A', 'ROOM-106B', 'ROOM-301C', 'ROOM-208A', 'ROOM-155B'];
    const studentIds = ['STU001', 'STU002', 'STU003', 'STU004', 'STU005', 'STU006', 'STU007'];

    const summaries = [
      "Student showing signs of emotional distress during class discussion",
      "Verbal confrontation detected between students",
      "Pattern of exclusion behavior observed in group activities", 
      "Physical altercation detected in common area",
      "Student expressing distress in counselor interaction",
      "Aggressive behavior patterns detected over multiple sessions"
    ];

    const keyIndicators = [
      ["withdrawal from peer group", "decreased participation", "emotional expressions"],
      ["raised voices", "aggressive posturing", "confrontational language"],
      ["exclusion patterns", "social isolation", "peer rejection"],
      ["physical contact", "aggressive movement", "confrontational positioning"],
      ["distress vocalizations", "help-seeking behavior", "emotional dysregulation"]
    ];

    for (let i = 0; i < 25; i++) {
      const createdAt = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
      const classroomId = classrooms[Math.floor(Math.random() * classrooms.length)];
      const hasEvidence = Math.random() > 0.3;
      const alertType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
      
      // Generate affected students (1-3 students)
      const numStudents = Math.floor(Math.random() * 3) + 1;
      const selectedStudents = studentIds.sort(() => 0.5 - Math.random()).slice(0, numStudents);
      const roles: ('target' | 'aggressor' | 'bystander')[] = ['target', 'aggressor', 'bystander'];
      
      this.alerts.push({
        alert_id: this.generateAlertId(classroomId) + `-${String(i).padStart(3, '0')}`,
        timestamp: createdAt.toISOString(),
        classroom_id: classroomId,
        alert_type: alertType,
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        risk_score: Math.round((Math.random() * 0.5 + 0.5) * 100) / 100, // 0.5 to 1.0
        status: statuses[Math.floor(Math.random() * statuses.length)],
        affected_students: selectedStudents.map((studentId, index) => ({
          student_id: studentId,
          role: roles[index % roles.length],
          confidence: Math.round((Math.random() * 0.4 + 0.6) * 100) / 100
        })),
        evidence_package: hasEvidence ? {
          primary_evidence: `https://secure-evidence.edu/video/${uuidv4()}.mp4`,
          context_window: Math.floor(Math.random() * 120) + 30, // 30-150 seconds
          redaction_applied: Math.random() > 0.5
        } : undefined,
        explanation: {
          summary: summaries[Math.floor(Math.random() * summaries.length)],
          key_indicators: keyIndicators[Math.floor(Math.random() * keyIndicators.length)]
        }
      });
    }

    this.alerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  getAlerts(status?: AlertStatus): Alert[] {
    if (status) {
      return this.alerts.filter(alert => alert.status === status);
    }
    return [...this.alerts];
  }

  getAlert(alertId: string): Alert | undefined {
    return this.alerts.find(alert => alert.alert_id === alertId);
  }

  updateAlertStatus(alertId: string, status: AlertStatus): Alert | null {
    const alertIndex = this.alerts.findIndex(alert => alert.alert_id === alertId);
    if (alertIndex === -1) return null;

    this.alerts[alertIndex] = {
      ...this.alerts[alertIndex],
      status
    };

    return this.alerts[alertIndex];
  }

  addAlert(alert: Omit<Alert, 'alert_id' | 'timestamp'>): Alert {
    const newAlert: Alert = {
      alert_id: this.generateAlertId(alert.classroom_id),
      timestamp: new Date().toISOString(),
      ...alert
    };

    this.alerts.unshift(newAlert);
    return newAlert;
  }
}

export const dataStore = new DataStore();