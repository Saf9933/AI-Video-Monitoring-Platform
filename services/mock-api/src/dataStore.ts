import { v4 as uuidv4 } from 'uuid';
import { Alert, AlertType, AlertSeverity, AlertStatus } from './types';

class DataStore {
  private alerts: Alert[] = [];

  constructor() {
    this.initializeAlerts();
  }

  private initializeAlerts(): void {
    const alertTypes: AlertType[] = ['emotional_distress', 'bullying_incident', 'pattern_detected'];
    const severities: AlertSeverity[] = ['low', 'medium', 'high', 'critical'];
    const statuses: AlertStatus[] = ['open', 'acknowledged', 'resolved'];
    const studentIds = ['STU001', 'STU002', 'STU003', 'STU004', 'STU005', 'STU006', 'STU007'];

    const transcripts = [
      "I don't want to go to school anymore, everyone makes fun of me",
      "Stop pushing me around, leave me alone",
      "Nobody likes me here, I feel so alone",
      "This happens every day, I can't take it anymore",
      "They took my lunch money again",
      "I'm scared to walk home alone"
    ];

    const snippets = [
      "Student showing signs of withdrawal during recess",
      "Aggressive behavior observed in hallway",
      "Student isolated from peer group",
      "Repeated verbal confrontations detected",
      "Physical altercation in cafeteria area",
      "Student expressing distress in counselor meeting"
    ];

    for (let i = 0; i < 25; i++) {
      const createdAt = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
      const hasEvidence = Math.random() > 0.3;
      
      this.alerts.push({
        id: uuidv4(),
        studentId: studentIds[Math.floor(Math.random() * studentIds.length)],
        type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
        severity: severities[Math.floor(Math.random() * severities.length)],
        confidence: Math.round((Math.random() * 0.4 + 0.6) * 100) / 100, // 0.6 to 1.0
        createdAt: createdAt.toISOString(),
        status: statuses[Math.floor(Math.random() * statuses.length)],
        evidence: hasEvidence ? {
          thumbUrl: `https://picsum.photos/200/150?random=${i + 1}`,
          transcript: Math.random() > 0.5 ? transcripts[Math.floor(Math.random() * transcripts.length)] : undefined,
          snippet: snippets[Math.floor(Math.random() * snippets.length)]
        } : undefined
      });
    }

    this.alerts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getAlerts(status?: AlertStatus): Alert[] {
    if (status) {
      return this.alerts.filter(alert => alert.status === status);
    }
    return [...this.alerts];
  }

  getAlert(id: string): Alert | undefined {
    return this.alerts.find(alert => alert.id === id);
  }

  updateAlertStatus(id: string, status: AlertStatus): Alert | null {
    const alertIndex = this.alerts.findIndex(alert => alert.id === id);
    if (alertIndex === -1) return null;

    this.alerts[alertIndex] = {
      ...this.alerts[alertIndex],
      status
    };

    return this.alerts[alertIndex];
  }

  addAlert(alert: Omit<Alert, 'id' | 'createdAt'>): Alert {
    const newAlert: Alert = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      ...alert
    };

    this.alerts.unshift(newAlert);
    return newAlert;
  }
}

export const dataStore = new DataStore();