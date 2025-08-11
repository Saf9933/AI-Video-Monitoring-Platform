// src/services/api/dashboard.ts
import { http } from '../http';
import type { DashboardSummary } from '../../types/api';
export const getDashboardSummary = async (): Promise<DashboardSummary> =>
  (await http.get('/dashboard/summary')).data;
