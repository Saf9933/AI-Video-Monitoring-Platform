import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { listAlerts, type AlertsResponse } from '../services/api/alerts';
import { websocketService } from '../services/websocket';
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
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['alerts'],
    queryFn: () => listAlerts({ limit: 100 }),
    refetchInterval: 30000, // Refetch every 30 seconds as fallback
  });

  const alerts = data?.alerts || [];

  // Set up WebSocket connection for real-time updates
  useEffect(() => {
    websocketService.connect();

    websocketService.onNewAlert(() => {
      refetch();
    });

    websocketService.onUpdatedAlert(() => {
      refetch();
    });

    websocketService.onAlertEscalated(() => {
      refetch();
    });

    websocketService.onAlertResolved(() => {
      refetch();
    });

    return () => {
      websocketService.disconnect();
    };
  }, [refetch]);

  // Calculate comprehensive stats including new status types
  const stats: DashboardStats = {
    total: alerts.length,
    newAlerts: alerts.filter(a => a.status === 'new').length,
    criticalAlerts: alerts.filter(a => a.priority === 'critical').length,
    acknowledgedAlerts: alerts.filter(a => a.status === 'acknowledged').length,
    inProgressAlerts: alerts.filter(a => a.status === 'in_progress').length,
    escalatedAlerts: alerts.filter(a => a.status === 'escalated').length,
    resolvedToday: alerts.filter(a => {
      const today = new Date().toDateString();
      return a.status === 'resolved' && new Date(a.timestamp).toDateString() === today;
    }).length,
    avgRiskScore: alerts.length > 0 
      ? Math.round(alerts.reduce((sum, a) => sum + a.risk_score, 0) / alerts.length * 100) 
      : 0,
    falsePositiveRate: alerts.length > 0 
      ? Math.round(alerts.filter(a => a.status === 'false_positive').length / alerts.length * 100) 
      : 0
  };

  // Calculate classroom-specific stats with privacy compliance
  const classroomStats = alerts.reduce((acc, alert) => {
    const classroomId = alert.classroom_id;
    
    if (!acc[classroomId]) {
      acc[classroomId] = {
        totalAlerts: 0,
        newAlerts: 0,
        avgRiskScore: 0,
        lastActivity: alert.timestamp,
        privacyCompliance: true, // Default to compliant
        consentStatus: 'full_consent' // Default consent status
      };
    }

    acc[classroomId].totalAlerts += 1;
    if (alert.status === 'new') {
      acc[classroomId].newAlerts += 1;
    }

    // Check privacy compliance based on evidence package
    if (alert.evidence_package && !alert.evidence_package.redaction_applied) {
      // This might indicate a privacy issue - should have redaction for student privacy
      acc[classroomId].privacyCompliance = false;
    }

    // Update last activity if this alert is more recent
    if (new Date(alert.timestamp) > new Date(acc[classroomId].lastActivity)) {
      acc[classroomId].lastActivity = alert.timestamp;
    }

    return acc;
  }, {} as DashboardData['classroomStats']);

  // Calculate average risk score per classroom
  Object.keys(classroomStats).forEach(classroomId => {
    const classroomAlerts = alerts.filter(a => a.classroom_id === classroomId);
    if (classroomAlerts.length > 0) {
      classroomStats[classroomId].avgRiskScore = Math.round(
        classroomAlerts.reduce((sum, a) => sum + a.risk_score, 0) / classroomAlerts.length * 100
      );
    }
  });

  return {
    alerts,
    isLoading,
    error,
    stats,
    classroomStats
  };
}