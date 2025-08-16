// src/data/system/settings.types.ts

export interface OneTimeCode {
  id: string;
  role: 'professor' | 'director';
  masked: string;
  createdAt: string;
  revoked?: boolean;
}

export interface OrganizationSettings {
  name: string;
  logoUrl?: string;
  primaryColor?: string;
  faviconUrl?: string;
}

export interface AuthSettings {
  defaultRole: 'professor' | 'director';
  sessionMinutes: number;
  idleTimeoutMinutes: number;
  codes: OneTimeCode[];
}

export interface AlertSettings {
  okMax: number;
  l1Min: number;
  l2Min: number;
  l3Min: number;
  minConfidence: number;
  debounceMs: number;
}

export interface Recipient {
  id: string;
  name: string;
  role: 'counselor' | 'director';
}

export interface NotificationSettings {
  recipients: Recipient[];
  channels: {
    sms: boolean;
    email: boolean;
    wecom: boolean;
  };
  retryPolicy: 'none' | 'simple' | 'exponential';
  rateLimitPerMin: number;
}

export interface RealtimeSettings {
  wsBackoff: 'none' | 'linear' | 'expo';
  pollSec: number;
  targetP95Ms: number;
  virtualization: boolean;
}

export interface IntegrationSettings {
  apiBase?: string;
  wsBase?: string;
  lmsBase?: string;
  kafkaBrokers?: string;
}

export interface FeatureFlags {
  classrooms: boolean;
  alerts: boolean;
  analytics: boolean;
  monitorWall: boolean;
  shapExplanations: boolean;
  shortcuts: boolean;
}

export interface MaintenanceIssue {
  level: 'info' | 'warn' | 'error';
  message: string;
}

export interface MaintenanceSettings {
  lastCheckAt?: string;
  issues?: MaintenanceIssue[];
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  details?: string;
  hash?: string;
}

export interface SystemSettings {
  org: OrganizationSettings;
  auth: AuthSettings;
  alerts: AlertSettings;
  notify: NotificationSettings;
  realtime: RealtimeSettings;
  integrations: IntegrationSettings;
  flags: FeatureFlags;
  maintenance: MaintenanceSettings;
  updatedAt: string;
  updatedBy: string;
}

export interface SystemInfo {
  version: string;
  buildHash: string;
  uptime: string;
  wsStatus: 'connected' | 'disconnected' | 'reconnecting';
  queueLag: number;
  dataMode: 'mock' | 'live';
}

export interface TestResult {
  ok: boolean;
  detail?: string;
}

export interface SystemSettingsClient {
  getSystemSettings(): Promise<SystemSettings>;
  getSystemInfo(): Promise<SystemInfo>;
  getAuditLog(): Promise<AuditEntry[]>;
  updateSystemSettings(patch: Partial<SystemSettings>): Promise<void>;
  generateOneTimeCode(role: 'professor' | 'director'): Promise<{ id: string; masked: string; code: string }>;
  revokeOneTimeCode(id: string): Promise<void>;
  testNotification(channel: 'sms' | 'email' | 'wecom'): Promise<'ok'>;
  testIntegration(kind: 'api' | 'ws' | 'lms' | 'kafka'): Promise<TestResult>;
  exportConfig(): Blob;
  systemCheck(): Promise<MaintenanceIssue[]>;
  reloadConfig(): Promise<void>;
  clearCache(): Promise<void>;
}