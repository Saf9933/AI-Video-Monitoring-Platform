import { Server } from 'socket.io';
import { Alert, AlertType, AlertSeverity } from './types';

export class AlertGenerator {
  private interval: NodeJS.Timeout | null = null;
  private readonly alertTypes: AlertType[] = ['emotional_distress', 'bullying_incident', 'pattern_detected'];
  private readonly severities: AlertSeverity[] = ['low', 'medium', 'high', 'critical'];
  private readonly studentIds = ['STU001', 'STU002', 'STU003', 'STU004', 'STU005', 'STU006', 'STU007'];

  private readonly transcripts = [
    "I don't want to go to school anymore, everyone makes fun of me",
    "Stop pushing me around, leave me alone",
    "Nobody likes me here, I feel so alone",
    "This happens every day, I can't take it anymore",
    "They took my lunch money again",
    "I'm scared to walk home alone"
  ];

  private readonly snippets = [
    "Student showing signs of withdrawal during recess",
    "Aggressive behavior observed in hallway",
    "Student isolated from peer group",
    "Repeated verbal confrontations detected",
    "Physical altercation in cafeteria area",
    "Student expressing distress in counselor meeting"
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
      const hasEvidence = Math.random() > 0.3;
      
      const randomAlert: Omit<Alert, 'id' | 'createdAt'> = {
        studentId: this.studentIds[Math.floor(Math.random() * this.studentIds.length)],
        type: this.alertTypes[Math.floor(Math.random() * this.alertTypes.length)],
        severity: this.severities[Math.floor(Math.random() * this.severities.length)],
        confidence: Math.round((Math.random() * 0.4 + 0.6) * 100) / 100,
        status: 'open',
        evidence: hasEvidence ? {
          thumbUrl: `https://picsum.photos/200/150?random=${Date.now()}`,
          transcript: Math.random() > 0.5 ? this.transcripts[Math.floor(Math.random() * this.transcripts.length)] : undefined,
          snippet: this.snippets[Math.floor(Math.random() * this.snippets.length)]
        } : undefined
      };

      const newAlert = this.dataStore.addAlert(randomAlert);
      console.log(`Generated new alert: ${newAlert.id} - ${newAlert.type} (${newAlert.severity})`);
      
      this.io.emit('alert.new', newAlert);

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