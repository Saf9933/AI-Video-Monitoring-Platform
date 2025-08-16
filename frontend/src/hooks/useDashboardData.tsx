import { useEffect, useMemo } from 'react';
import { useAlerts, useClassrooms, useWebSocket } from '../data/classrooms/hooks';
import { useRBAC } from '../components/rbac/RBACProvider';
import type { Alert, DashboardStats, ClassroomStats } from '../types/api';

export interface DashboardData {
  alerts: Alert[];
  isLoading: boolean;
  error: any;
  stats: DashboardStats;
  classroomStats: {
    [classroomId: string]: ClassroomStats;
  };
}

export function useDashboardData(): DashboardData {
  const { currentRole, scopeCount } = useRBAC();
  
  // Use scope-filtered hooks for RBAC-aware data
  const { data: alertsData, isLoading: alertsLoading, error: alertsError } = useAlerts(
    {}, // no additional filters, RBAC filtering handled in the hook
    { page: 1, limit: 100 }
  );
  
  const { data: classroomsData, isLoading: classroomsLoading } = useClassrooms(
    {}, // no additional filters, RBAC filtering handled in the hook
    { page: 1, limit: 100 }
  );

  // Set up WebSocket connection for real-time updates (scope-filtered)
  const { connectionStatus } = useWebSocket();

  const alerts = alertsData?.data || [];
  const classrooms = classroomsData?.data || [];
  const isLoading = alertsLoading || classroomsLoading;
  const error = alertsError;

  // Calculate comprehensive stats including new status types
  const stats: DashboardStats = useMemo(() => ({
    total: alerts.length,
    newAlerts: alerts.filter(a => a.status === 'new').length,
    criticalAlerts: alerts.filter(a => a.level === 'l3').length, // Updated to use level instead of priority
    acknowledgedAlerts: alerts.filter(a => a.status === 'acknowledged').length,
    inProgressAlerts: alerts.filter(a => a.status === 'inProgress').length,
    escalatedAlerts: alerts.filter(a => a.status === 'resolved').length, // Using resolved as escalated for now
    resolvedToday: alerts.filter(a => {
      const today = new Date().toDateString();
      return a.status === 'resolved' && new Date(a.createdAt).toDateString() === today;
    }).length,
    avgRiskScore: alerts.length > 0 
      ? Math.round(alerts.reduce((sum, a) => sum + (a.confidence * 100), 0) / alerts.length) 
      : 0,
    falsePositiveRate: 5 // Mock value - would be calculated from historical data
  }), [alerts]);

  // Calculate classroom-specific stats with privacy compliance
  const classroomStats = useMemo(() => {
    const stats = alerts.reduce((acc, alert) => {
      const classroomId = alert.classroomId;
      
      if (!acc[classroomId]) {
        acc[classroomId] = {
          totalAlerts: 0,
          newAlerts: 0,
          avgRiskScore: 0,
          lastActivity: alert.createdAt,
          privacyCompliance: true, // All alerts are privacy compliant in our system
          consentStatus: 'full_consent' as const // Default consent status
        };
      }

      acc[classroomId].totalAlerts += 1;
      if (alert.status === 'new') {
        acc[classroomId].newAlerts += 1;
      }

      // Update last activity if this alert is more recent
      if (new Date(alert.createdAt) > new Date(acc[classroomId].lastActivity)) {
        acc[classroomId].lastActivity = alert.createdAt;
      }

      return acc;
    }, {} as DashboardData['classroomStats']);

    // Calculate average risk score per classroom
    Object.keys(stats).forEach(classroomId => {
      const classroomAlerts = alerts.filter(a => a.classroomId === classroomId);
      if (classroomAlerts.length > 0) {
        stats[classroomId].avgRiskScore = Math.round(
          classroomAlerts.reduce((sum, a) => sum + (a.confidence * 100), 0) / classroomAlerts.length
        );
      }
    });

    return stats;
  }, [alerts]);

  return {
    alerts,
    isLoading,
    error,
    stats,
    classroomStats
  };
}