// src/services/api/alerts.ts
import { http } from '../http';
import type { Alert, AlertStatus } from '../../types/api';

export const listAlerts = async (status?: AlertStatus): Promise<Alert[]> =>
  (await http.get('/alerts', { params: { status } })).data;

export const acknowledgeAlert = async (alert_id: string): Promise<Alert> => 
  (await http.post(`/alerts/${alert_id}/acknowledge`)).data;

export const resolveAlert = async (alert_id: string): Promise<Alert> => 
  (await http.post(`/alerts/${alert_id}/resolve`)).data;

export const markFalsePositive = async (alert_id: string): Promise<Alert> => 
  (await http.post(`/alerts/${alert_id}/false-positive`)).data;
