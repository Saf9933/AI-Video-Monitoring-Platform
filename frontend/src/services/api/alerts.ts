// src/services/api/alerts.ts
import { http } from '../http';
import type { Alert, AlertStatus, AlertPriority } from '../../types/api';

export interface AlertsResponse {
  alerts: Alert[];
  total_count: number;
  has_more: boolean;
}

export interface ListAlertsParams {
  classroom_id?: string;
  status?: AlertStatus;
  priority?: AlertPriority;
  start_date?: string;
  end_date?: string;
  limit?: number;
  offset?: number;
}

export interface ActionRequest {
  acknowledged_by?: string;
  resolved_by?: string;
  marked_by?: string;
  notes?: string;
  resolution_notes?: string;
  reason?: string;
  feedback_notes?: string;
  actions_taken?: string[];
  follow_up_required?: boolean;
  follow_up_date?: string;
}

export const listAlerts = async (params?: ListAlertsParams): Promise<AlertsResponse> =>
  (await http.get('/alerts', { params })).data;

export const getAlert = async (alert_id: string): Promise<Alert> =>
  (await http.get(`/alerts/${alert_id}`)).data;

export const acknowledgeAlert = async (alert_id: string, data?: ActionRequest): Promise<Alert> => 
  (await http.post(`/alerts/${alert_id}/acknowledge`, data)).data;

export const resolveAlert = async (alert_id: string, data: ActionRequest): Promise<Alert> => 
  (await http.post(`/alerts/${alert_id}/resolve`, data)).data;

export const markFalsePositive = async (alert_id: string, data: ActionRequest): Promise<Alert> => 
  (await http.post(`/alerts/${alert_id}/false-positive`, data)).data;

export const escalateAlert = async (alert_id: string, data?: ActionRequest): Promise<Alert> => 
  (await http.post(`/alerts/${alert_id}/escalate`, data)).data;

// Dashboard APIs
export const getTeacherDashboard = async () => 
  (await http.get('/dashboard/teacher')).data;

export const getCounselorDashboard = async () => 
  (await http.get('/dashboard/counselor')).data;

export const getAdminDashboard = async () => 
  (await http.get('/dashboard/admin')).data;

// Evidence APIs
export const getEvidenceFile = async (alert_id: string, evidence_id: string): Promise<Blob> =>
  (await http.get(`/alerts/${alert_id}/evidence/${evidence_id}`, { responseType: 'blob' })).data;
