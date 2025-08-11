import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { listAlerts } from '../services/api/alerts';
import { websocketService } from '../services/websocket';
import type { Alert } from '../types/api';

export interface DashboardData {
  alerts: Alert[];
  isLoading: boolean;
  error: any;
  stats: {
    total: number;
    newAlerts: number;
    criticalAlerts: number;
    acknowledgedAlerts: number;
    resolvedToday: number;
    avgRiskScore: number;
  };
  classroomStats: {
    [classroomId: string]: {
      totalAlerts: number;
      newAlerts: number;
      avgRiskScore: number;
      lastActivity: string;
    };
  };
}

export function useDashboardData(): DashboardData {
  const { data: alerts = [], isLoading, error, refetch } = useQuery({
    queryKey: ['alerts'],
    queryFn: () => listAlerts(),
    refetchInterval: 30000, // Refetch every 30 seconds as fallback
  });

  // Set up WebSocket connection for real-time updates
  useEffect(() => {
    websocketService.connect();

    websocketService.onNewAlert(() => {
      refetch();
    });

    websocketService.onUpdatedAlert(() => {
      refetch();
    });

    return () => {
      websocketService.disconnect();
    };
  }, [refetch]);

  // Calculate stats
  const stats = {
    total: alerts.length,
    newAlerts: alerts.filter(a => a.status === 'new').length,
    criticalAlerts: alerts.filter(a => a.priority === 'critical').length,
    acknowledgedAlerts: alerts.filter(a => a.status === 'acknowledged').length,
    resolvedToday: alerts.filter(a => {
      const today = new Date().toDateString();
      return a.status === 'resolved' && new Date(a.timestamp).toDateString() === today;
    }).length,
    avgRiskScore: alerts.length > 0 
      ? Math.round(alerts.reduce((sum, a) => sum + a.risk_score, 0) / alerts.length * 100) 
      : 0
  };

  // Calculate classroom-specific stats
  const classroomStats = alerts.reduce((acc, alert) => {
    const classroomId = alert.classroom_id;
    
    if (!acc[classroomId]) {
      acc[classroomId] = {
        totalAlerts: 0,
        newAlerts: 0,
        avgRiskScore: 0,
        lastActivity: alert.timestamp
      };
    }

    acc[classroomId].totalAlerts += 1;
    if (alert.status === 'new') {
      acc[classroomId].newAlerts += 1;
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