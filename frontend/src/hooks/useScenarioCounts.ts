// src/hooks/useScenarioCounts.ts
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { listAlerts, type AlertsResponse } from '../services/api/alerts';
import { websocketService } from '../services/websocket';
import { mockHomeData } from '../data/mockHomeData';
import type { AlertType } from '../types/api';

interface ScenarioCount {
  id: AlertType;
  count: number;
  unresolved_count: number;
  recent_7d_count: number;
}

export interface UseScenarioCountsReturn {
  scenarioCounts: ScenarioCount[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

const CORE_SCENARIOS: AlertType[] = [
  'exam_pressure',
  'isolation_bullying', 
  'self_harm',
  'teacher_verbal_abuse',
  'cyber_tracking'
];

// Check if we're in development mode and should use mock data
const isDevelopment = import.meta.env.MODE === 'development';
const apiBaseUrl = import.meta.env.VITE_API_BASE;
const shouldUseMockData = isDevelopment && (!apiBaseUrl || apiBaseUrl.includes('api.safety-platform.edu'));

export function useScenarioCounts(): UseScenarioCountsReturn {
  const queryClient = useQueryClient();
  
  // If we should use mock data, return it directly
  if (shouldUseMockData) {
    console.info('📊 Using mock data for scenario counts (development mode)');
    
    const mockScenarioCounts: ScenarioCount[] = CORE_SCENARIOS.map(scenarioId => {
      const mockScenario = mockHomeData.scenarios.find(s => s.id === scenarioId);
      return {
        id: scenarioId,
        count: mockScenario?.count || 0,
        unresolved_count: Math.floor((mockScenario?.count || 0) * 0.3), // 30% unresolved
        recent_7d_count: Math.floor((mockScenario?.count || 0) * 0.6), // 60% recent
      };
    });

    return {
      scenarioCounts: mockScenarioCounts,
      isLoading: false,
      error: null,
      refetch: () => {}
    };
  }
  
  // Fetch all alerts to calculate scenario counts
  const { data: alertsData, isLoading, error, refetch } = useQuery({
    queryKey: ['scenario-counts'],
    queryFn: async (): Promise<ScenarioCount[]> => {
      try {
        // Fetch all alerts without filters to get total counts
        const allAlertsPromise = listAlerts({ limit: 1000 });
        
        // Fetch unresolved alerts (new, acknowledged, in_progress)
        const unresolvedAlertsPromise = listAlerts({ 
          limit: 1000,
          status: 'new' // We'll filter client-side for multiple statuses
        });
        
        // Fetch recent alerts (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentAlertsPromise = listAlerts({
          limit: 1000,
          start_date: sevenDaysAgo.toISOString()
        });
        
        const [allAlerts, unresolvedAlerts, recentAlerts] = await Promise.all([
          allAlertsPromise,
          unresolvedAlertsPromise, 
          recentAlertsPromise
        ]);
        
        // Calculate counts for each scenario
        return CORE_SCENARIOS.map(scenarioId => {
          const totalCount = allAlerts.alerts.filter(alert => 
            alert.alert_type === scenarioId
          ).length;
          
          const unresolvedCount = allAlerts.alerts.filter(alert => 
            alert.alert_type === scenarioId && 
            ['new', 'acknowledged', 'in_progress'].includes(alert.status)
          ).length;
          
          const recentCount = recentAlerts.alerts.filter(alert =>
            alert.alert_type === scenarioId
          ).length;
          
          return {
            id: scenarioId,
            count: totalCount,
            unresolved_count: unresolvedCount,
            recent_7d_count: recentCount
          };
        });
      } catch (error) {
        console.warn('Failed to fetch scenario counts from API, falling back to mock data:', error);
        
        // Fall back to mock data if API fails
        return CORE_SCENARIOS.map(scenarioId => {
          const mockScenario = mockHomeData.scenarios.find(s => s.id === scenarioId);
          return {
            id: scenarioId,
            count: mockScenario?.count || 0,
            unresolved_count: Math.floor((mockScenario?.count || 0) * 0.3),
            recent_7d_count: Math.floor((mockScenario?.count || 0) * 0.6),
          };
        });
      }
    },
    staleTime: 30000, // 30 seconds
    refetchInterval: shouldUseMockData ? false : 60000, // Don't refetch mock data
    retry: (failureCount, error) => {
      // Don't retry if we're using mock data or if we've failed 3 times
      if (shouldUseMockData || failureCount >= 3) return false;
      return true;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
  
  // WebSocket subscription for real-time updates (only if not using mock data)
  useEffect(() => {
    if (shouldUseMockData) return;
    
    websocketService.connect();
    
    const handleNewAlert = () => {
      // Invalidate scenario counts when new alerts arrive
      queryClient.invalidateQueries({ queryKey: ['scenario-counts'] });
    };
    
    const handleUpdatedAlert = () => {
      // Invalidate scenario counts when alerts are updated
      queryClient.invalidateQueries({ queryKey: ['scenario-counts'] });
    };
    
    websocketService.onNewAlert(handleNewAlert);
    websocketService.onUpdatedAlert(handleUpdatedAlert);
    
    return () => {
      websocketService.disconnect();
    };
  }, [queryClient]);
  
  return {
    scenarioCounts: alertsData || [],
    isLoading: shouldUseMockData ? false : isLoading,
    error: shouldUseMockData ? null : (error as Error | null),
    refetch: shouldUseMockData ? () => {} : refetch
  };
}