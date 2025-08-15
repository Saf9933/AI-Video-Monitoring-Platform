// Types for Classroom Management System
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// User and Role Types
export type Role = 'professor' | 'director';

export interface User extends BaseEntity {
  name: string;
  email: string;
  role: Role;
  assignedClassrooms?: string[]; // Classroom IDs for professors
}

export interface RoleContext {
  currentRole: Role;
  user: User;
  permissions: Permission[];
}

export type Permission = 
  | 'viewAllClassrooms'
  | 'viewAssignedClassrooms'
  | 'viewOriginalVideo'
  | 'viewBlurredVideo'
  | 'exportAuditLogs'
  | 'modifySettings'
  | 'acknowledgeAlerts'
  | 'assignAlerts'
  | 'escalateAlerts';

// Classroom Types
export interface Classroom extends BaseEntity {
  name: string;
  school: string;
  department: string;
  instructor: string;
  instructorId: string;
  status: ClassroomStatus;
  deviceHealth: DeviceHealth;
  lastEventTime: string;
  recentTrends: TrendData;
  alert24hCount: number;
  location: string;
  capacity: number;
  currentOccupancy: number;
}

export type ClassroomStatus = 'online' | 'offline' | 'warning' | 'error';

export interface DeviceHealth {
  heartbeat: 'healthy' | 'degraded' | 'offline';
  gpu: 'idle' | 'normal' | 'high' | 'overload';
  streamLatency: number; // milliseconds
  fps: number;
  lastHeartbeat: string;
}

export interface TrendData {
  stress: TrendPoint[];
  isolation: TrendPoint[];
  aggression: TrendPoint[];
  timeRange: '15m' | '1h' | '24h';
}

export interface TrendPoint {
  timestamp: string;
  value: number;
}

// Alert Types
export interface Alert extends BaseEntity {
  classroomId: string;
  type: AlertType;
  level: AlertLevel;
  title: string;
  description: string;
  confidence: number;
  status: AlertStatus;
  assignedTo?: string;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
  priority: AlertPriority;
  source: AlertSource;
  evidence: Evidence[];
  shap: ShapExplanation;
  metadata: Record<string, any>;
  tags: string[];
}

export type AlertType = 'stress' | 'isolation' | 'aggression' | 'disruption' | 'anomaly';
export type AlertLevel = 'l0' | 'l1' | 'l2' | 'l3';
export type AlertStatus = 'new' | 'acknowledged' | 'assigned' | 'inProgress' | 'resolved' | 'closed' | 'falsePositive';
export type AlertPriority = 'low' | 'medium' | 'high' | 'critical';
export type AlertSource = 'video' | 'audio' | 'text' | 'behavioral' | 'environmental';

export interface Evidence {
  id: string;
  type: 'image' | 'video' | 'audio' | 'text';
  url: string;
  thumbnail?: string;
  duration?: number; // for video/audio
  isBlurred: boolean; // privacy protection
  timestamp: string;
}

export interface ShapExplanation {
  topFactors: ShapFactor[];
  confidence: number;
  modelVersion: string;
  explanation: string;
}

export interface ShapFactor {
  feature: string;
  importance: number;
  description: string;
}

// Metrics and Analytics Types
export interface ClassroomMetrics {
  classroomId: string;
  timestamp: string;
  stress: MetricValue;
  isolation: MetricValue;
  aggression: MetricValue;
  overall: MetricValue;
}

export interface MetricValue {
  current: number;
  trend: 'up' | 'down' | 'stable';
  change: number; // percentage change
  threshold: number;
  isAboveThreshold: boolean;
}

export interface AnalyticsData {
  classroomId: string;
  timeRange: TimeRange;
  timeSeries: TimeSeriesData;
  heatmap: HeatmapData;
  comparison: ComparisonData;
  summary: AnalyticsSummary;
}

export type TimeRange = '1h' | '24h' | '7d' | '30d' | '90d';

export interface TimeSeriesData {
  stress: TimeSeriesPoint[];
  isolation: TimeSeriesPoint[];
  aggression: TimeSeriesPoint[];
  alerts: TimeSeriesPoint[];
}

export interface TimeSeriesPoint {
  timestamp: string;
  value: number;
  events?: string[]; // Associated event IDs
}

export interface HeatmapData {
  grid: HeatmapCell[][];
  maxValue: number;
  timeLabels: string[];
  metricLabels: string[];
}

export interface HeatmapCell {
  value: number;
  timestamp: string;
  metric: string;
  normalized: number; // 0-1
}

export interface ComparisonData {
  classroom: ComparisonMetrics;
  department: ComparisonMetrics;
  school: ComparisonMetrics;
  anonymizedCount: number; // K-anonymity protection
}

export interface ComparisonMetrics {
  alertCount: number;
  avgStress: number;
  avgIsolation: number;
  avgAggression: number;
  resolutionTime: number;
}

export interface AnalyticsSummary {
  totalAlerts: number;
  resolutionRate: number;
  avgResponseTime: number; // milliseconds
  falsePositiveRate: number;
  biasMetric: number; // percentage
  isBiasWarning: boolean;
}

// Intervention Types
export interface Intervention extends BaseEntity {
  templateId: string;
  classroomId: string;
  alertId?: string;
  title: string;
  description: string;
  type: InterventionType;
  status: InterventionStatus;
  assignedTo: string;
  checklist: ChecklistItem[];
  slaMinutes: number;
  startedAt?: string;
  completedAt?: string;
  notes: InterventionNote[];
}

export type InterventionType = 'emotional' | 'disruption' | 'selfHarm' | 'bullying' | 'custom';
export type InterventionStatus = 'pending' | 'active' | 'completed' | 'cancelled' | 'overdue';

export interface InterventionTemplate extends BaseEntity {
  name: string;
  type: InterventionType;
  description: string;
  checklist: ChecklistTemplate[];
  slaMinutes: number;
  requiredRole?: Role;
  isActive: boolean;
}

export interface ChecklistItem {
  id: string;
  description: string;
  completed: boolean;
  completedBy?: string;
  completedAt?: string;
  required: boolean;
}

export interface ChecklistTemplate {
  description: string;
  required: boolean;
  estimatedMinutes: number;
}

export interface InterventionNote extends BaseEntity {
  interventionId: string;
  authorId: string;
  authorName: string;
  content: string;
  isPrivate: boolean;
}

// Settings Types
export interface ClassroomSettings extends BaseEntity {
  classroomId: string;
  thresholds: AlertThresholds;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  schedule: ScheduleSettings;
  devices: DeviceSettings;
  features: FeatureToggles;
}

export interface AlertThresholds {
  stress: ThresholdConfig;
  isolation: ThresholdConfig;
  aggression: ThresholdConfig;
}

export interface ThresholdConfig {
  low: number;
  medium: number;
  high: number;
  critical: number;
  enabled: boolean;
}

export interface NotificationSettings {
  email: ContactConfig;
  sms: ContactConfig;
  webhook: WebhookConfig;
  quietHours: QuietHoursConfig[];
}

export interface ContactConfig {
  enabled: boolean;
  recipients: string[];
  alertLevels: AlertLevel[];
}

export interface WebhookConfig {
  enabled: boolean;
  url: string;
  secret: string;
  events: string[];
}

export interface QuietHoursConfig {
  id: string;
  name: string;
  start: string; // HH:MM format
  end: string;   // HH:MM format
  days: number[]; // 0-6 (Sunday-Saturday)
  enabled: boolean;
}

export interface PrivacySettings {
  videoBlurring: boolean;
  audioMuting: boolean;
  dataRetentionDays: number;
  anonymizeReports: boolean;
  consentRequired: boolean;
}

export interface ScheduleSettings {
  classSchedule: ClassSchedule[];
  monitoringHours: MonitoringHours;
  timezone: string;
}

export interface ClassSchedule {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  days: number[];
  isActive: boolean;
}

export interface MonitoringHours {
  enabled: boolean;
  start: string;
  end: string;
  days: number[];
}

export interface DeviceSettings {
  cameras: DeviceConfig[];
  microphones: DeviceConfig[];
  sensors: DeviceConfig[];
}

export interface DeviceConfig {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'inactive' | 'error';
  lastSeen: string;
  settings: Record<string, any>;
}

export interface FeatureToggles {
  realtimeAnalysis: boolean;
  videoRecording: boolean;
  audioRecording: boolean;
  behavioralAnalysis: boolean;
  biometricTracking: boolean;
  automaticInterventions: boolean;
}

// Audit Types
export interface AuditEntry extends BaseEntity {
  userId: string;
  userName: string;
  action: AuditAction;
  target: AuditTarget;
  targetId: string;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  result: 'success' | 'failure' | 'partial';
  payloadHash: string; // For integrity verification
  sessionId: string;
}

export type AuditAction = 
  | 'create' | 'update' | 'delete' | 'view' | 'export' 
  | 'login' | 'logout' | 'acknowledge' | 'assign' 
  | 'escalate' | 'resolve' | 'configure';

export type AuditTarget = 
  | 'classroom' | 'alert' | 'user' | 'setting' 
  | 'intervention' | 'report' | 'system';

// WebSocket Types
export interface WebSocketMessage {
  type: WSMessageType;
  payload: any;
  timestamp: string;
  id: string;
}

export type WSMessageType = 
  | 'alert.new'
  | 'alert.updated' 
  | 'metrics.update'
  | 'device.status'
  | 'system.notification'
  | 'connection.status';

export interface WSConnectionStatus {
  connected: boolean;
  reconnectAttempts: number;
  lastConnected?: string;
  latency?: number;
}

// Filter and Search Types
export interface ClassroomFilter {
  search?: string;
  schools?: string[];
  departments?: string[];
  statuses?: ClassroomStatus[];
  alertLevels?: AlertLevel[];
  instructors?: string[];
  timeRange?: TimeRange;
}

export interface AlertFilter {
  classroomIds?: string[];
  types?: AlertType[];
  levels?: AlertLevel[];
  statuses?: AlertStatus[];
  priorities?: AlertPriority[];
  assignees?: string[];
  timeRange?: TimeRange;
  dateFrom?: string;
  dateTo?: string;
}

export interface AuditFilter {
  users?: string[];
  actions?: AuditAction[];
  targets?: AuditTarget[];
  results?: ('success' | 'failure' | 'partial')[];
  timeRange?: TimeRange;
  dateFrom?: string;
  dateTo?: string;
}

// Pagination Types
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface ErrorResponse {
  success: false;
  error: string;
  details?: Record<string, any>;
  code?: string;
  timestamp: string;
}

// Utility Types
export type Partial<T> = {
  [P in keyof T]?: T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};