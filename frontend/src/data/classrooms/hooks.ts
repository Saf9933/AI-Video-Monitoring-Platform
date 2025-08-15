// Data provider hooks for the classroom management system
// Supports both Mock and Live providers via environment flag

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Classroom,
  Alert,
  ClassroomMetrics,
  AnalyticsData,
  Intervention,
  InterventionTemplate,
  ClassroomSettings,
  AuditEntry,
  ClassroomFilter,
  AlertFilter,
  AuditFilter,
  PaginationParams,
  PaginatedResponse,
  ApiResponse,
  Role,
  TimeRange,
  WSConnectionStatus,
  WebSocketMessage
} from './types';

import {
  mockClassrooms,
  mockAlerts,
  mockInterventionTemplates,
  mockAuditEntries,
  mockWebSocket,
  MockWebSocketService
} from './mockData';

// Environment flag to switch between Mock and Live providers
const USE_LIVE_API = import.meta.env.VITE_API_MODE === 'live';

// Query key factories
export const queryKeys = {
  classrooms: {
    all: ['classrooms'] as const,
    lists: () => [...queryKeys.classrooms.all, 'list'] as const,
    list: (filters: ClassroomFilter) => [...queryKeys.classrooms.lists(), filters] as const,
    details: () => [...queryKeys.classrooms.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.classrooms.details(), id] as const,
  },
  alerts: {
    all: ['alerts'] as const,
    lists: () => [...queryKeys.alerts.all, 'list'] as const,
    list: (filters: AlertFilter) => [...queryKeys.alerts.lists(), filters] as const,
    details: () => [...queryKeys.alerts.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.alerts.details(), id] as const,
  },
  analytics: {
    all: ['analytics'] as const,
    classroom: (id: string, timeRange: TimeRange) => [...queryKeys.analytics.all, id, timeRange] as const,
  },
  interventions: {
    all: ['interventions'] as const,
    templates: ['interventions', 'templates'] as const,
    classroom: (classroomId: string) => [...queryKeys.interventions.all, classroomId] as const,
  },
  audit: {
    all: ['audit'] as const,
    list: (filters: AuditFilter) => [...queryKeys.audit.all, filters] as const,
  }
};

// Mock API delay simulation
const simulateApiDelay = <T>(data: T, delay: number = 200): Promise<T> => {
  return new Promise(resolve => {
    setTimeout(() => resolve(data), Math.random() * delay + 100);
  });
};

// Classrooms Hooks
export const useClassrooms = (filters: ClassroomFilter = {}, pagination: PaginationParams = { page: 1, limit: 50 }) => {
  return useQuery({
    queryKey: queryKeys.classrooms.list(filters),
    queryFn: async (): Promise<PaginatedResponse<Classroom>> => {
      if (USE_LIVE_API) {
        // Live API implementation would go here
        throw new Error('Live API not implemented yet');
      } else {
        // Mock implementation with filtering and pagination
        let filteredClassrooms = [...mockClassrooms];
        
        // Apply search filter
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filteredClassrooms = filteredClassrooms.filter(classroom =>
            classroom.name.toLowerCase().includes(searchLower) ||
            classroom.school.toLowerCase().includes(searchLower) ||
            classroom.department.toLowerCase().includes(searchLower) ||
            classroom.instructor.toLowerCase().includes(searchLower)
          );
        }
        
        // Apply status filter
        if (filters.statuses?.length) {
          filteredClassrooms = filteredClassrooms.filter(classroom =>
            filters.statuses!.includes(classroom.status)
          );
        }
        
        // Apply school filter
        if (filters.schools?.length) {
          filteredClassrooms = filteredClassrooms.filter(classroom =>
            filters.schools!.includes(classroom.school)
          );
        }
        
        // Apply department filter
        if (filters.departments?.length) {
          filteredClassrooms = filteredClassrooms.filter(classroom =>
            filters.departments!.includes(classroom.department)
          );
        }
        
        // Pagination
        const startIndex = (pagination.page - 1) * pagination.limit;
        const endIndex = startIndex + pagination.limit;
        const paginatedData = filteredClassrooms.slice(startIndex, endIndex);
        
        const result: PaginatedResponse<Classroom> = {
          data: paginatedData,
          total: filteredClassrooms.length,
          page: pagination.page,
          limit: pagination.limit,
          totalPages: Math.ceil(filteredClassrooms.length / pagination.limit),
          hasNext: endIndex < filteredClassrooms.length,
          hasPrevious: pagination.page > 1
        };
        
        return simulateApiDelay(result);
      }
    },
    staleTime: 30000, // 30 seconds
    gcTime: 300000, // 5 minutes
  });
};

export const useClassroom = (id: string) => {
  return useQuery({
    queryKey: queryKeys.classrooms.detail(id),
    queryFn: async (): Promise<Classroom | null> => {
      if (USE_LIVE_API) {
        throw new Error('Live API not implemented yet');
      } else {
        const classroom = mockClassrooms.find(c => c.id === id);
        return simulateApiDelay(classroom || null);
      }
    },
    enabled: !!id,
    staleTime: 60000, // 1 minute
  });
};

// Alerts Hooks
export const useAlerts = (filters: AlertFilter = {}, pagination: PaginationParams = { page: 1, limit: 20 }) => {
  return useQuery({
    queryKey: queryKeys.alerts.list(filters),
    queryFn: async (): Promise<PaginatedResponse<Alert>> => {
      if (USE_LIVE_API) {
        throw new Error('Live API not implemented yet');
      } else {
        let filteredAlerts = [...mockAlerts];
        
        // Apply classroom filter
        if (filters.classroomIds?.length) {
          filteredAlerts = filteredAlerts.filter(alert =>
            filters.classroomIds!.includes(alert.classroomId)
          );
        }
        
        // Apply type filter
        if (filters.types?.length) {
          filteredAlerts = filteredAlerts.filter(alert =>
            filters.types!.includes(alert.type)
          );
        }
        
        // Apply level filter
        if (filters.levels?.length) {
          filteredAlerts = filteredAlerts.filter(alert =>
            filters.levels!.includes(alert.level)
          );
        }
        
        // Apply status filter
        if (filters.statuses?.length) {
          filteredAlerts = filteredAlerts.filter(alert =>
            filters.statuses!.includes(alert.status)
          );
        }
        
        // Sort by creation date (newest first)
        filteredAlerts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        // Pagination
        const startIndex = (pagination.page - 1) * pagination.limit;
        const endIndex = startIndex + pagination.limit;
        const paginatedData = filteredAlerts.slice(startIndex, endIndex);
        
        const result: PaginatedResponse<Alert> = {
          data: paginatedData,
          total: filteredAlerts.length,
          page: pagination.page,
          limit: pagination.limit,
          totalPages: Math.ceil(filteredAlerts.length / pagination.limit),
          hasNext: endIndex < filteredAlerts.length,
          hasPrevious: pagination.page > 1
        };
        
        return simulateApiDelay(result);
      }
    },
    staleTime: 10000, // 10 seconds
  });
};

export const useAlert = (id: string) => {
  return useQuery({
    queryKey: queryKeys.alerts.detail(id),
    queryFn: async (): Promise<Alert | null> => {
      if (USE_LIVE_API) {
        throw new Error('Live API not implemented yet');
      } else {
        const alert = mockAlerts.find(a => a.id === id);
        return simulateApiDelay(alert || null);
      }
    },
    enabled: !!id,
    staleTime: 30000,
  });
};

// Analytics Hook
export const useAnalytics = (classroomId: string, timeRange: TimeRange = '24h') => {
  return useQuery({
    queryKey: queryKeys.analytics.classroom(classroomId, timeRange),
    queryFn: async (): Promise<AnalyticsData | null> => {
      if (USE_LIVE_API) {
        throw new Error('Live API not implemented yet');
      } else {
        // Generate mock analytics data
        const generateTimeSeriesData = (points: number) => {
          const data = [];
          const now = new Date();
          const interval = timeRange === '1h' ? 2 * 60 * 1000 : // 2 minutes
                          timeRange === '24h' ? 60 * 60 * 1000 : // 1 hour
                          timeRange === '7d' ? 6 * 60 * 60 * 1000 : // 6 hours
                          24 * 60 * 60 * 1000; // 1 day
                          
          for (let i = points - 1; i >= 0; i--) {
            const timestamp = new Date(now.getTime() - i * interval).toISOString();
            data.push({
              timestamp,
              value: Math.random() * 100,
              events: Math.random() > 0.8 ? [`event_${Math.random().toString(36).substring(7)}`] : []
            });
          }
          return data;
        };

        const analytics: AnalyticsData = {
          classroomId,
          timeRange,
          timeSeries: {
            stress: generateTimeSeriesData(24),
            isolation: generateTimeSeriesData(24),
            aggression: generateTimeSeriesData(24),
            alerts: generateTimeSeriesData(24)
          },
          heatmap: {
            grid: Array(24).fill(null).map(() => 
              Array(7).fill(null).map(() => ({
                value: Math.random() * 100,
                timestamp: new Date().toISOString(),
                metric: 'stress',
                normalized: Math.random()
              }))
            ),
            maxValue: 100,
            timeLabels: Array(24).fill(null).map((_, i) => `${i}:00`),
            metricLabels: ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
          },
          comparison: {
            classroom: {
              alertCount: Math.floor(Math.random() * 50),
              avgStress: Math.random() * 100,
              avgIsolation: Math.random() * 100,
              avgAggression: Math.random() * 100,
              resolutionTime: Math.random() * 1000 + 500
            },
            department: {
              alertCount: Math.floor(Math.random() * 200),
              avgStress: Math.random() * 100,
              avgIsolation: Math.random() * 100,
              avgAggression: Math.random() * 100,
              resolutionTime: Math.random() * 1000 + 500
            },
            school: {
              alertCount: Math.floor(Math.random() * 1000),
              avgStress: Math.random() * 100,
              avgIsolation: Math.random() * 100,
              avgAggression: Math.random() * 100,
              resolutionTime: Math.random() * 1000 + 500
            },
            anonymizedCount: Math.floor(Math.random() * 10) + 5
          },
          summary: {
            totalAlerts: Math.floor(Math.random() * 100),
            resolutionRate: Math.random() * 0.3 + 0.7,
            avgResponseTime: Math.random() * 1000 + 500,
            falsePositiveRate: Math.random() * 0.1 + 0.02,
            biasMetric: Math.random() * 0.08,
            isBiasWarning: Math.random() * 0.08 > 0.05
          }
        };
        
        return simulateApiDelay(analytics, 500);
      }
    },
    enabled: !!classroomId,
    staleTime: 60000, // 1 minute
  });
};

// Interventions Hooks
export const useInterventionTemplates = () => {
  return useQuery({
    queryKey: queryKeys.interventions.templates,
    queryFn: async (): Promise<InterventionTemplate[]> => {
      if (USE_LIVE_API) {
        throw new Error('Live API not implemented yet');
      } else {
        return simulateApiDelay(mockInterventionTemplates);
      }
    },
    staleTime: 300000, // 5 minutes
  });
};

export const useClassroomInterventions = (classroomId: string) => {
  return useQuery({
    queryKey: queryKeys.interventions.classroom(classroomId),
    queryFn: async (): Promise<Intervention[]> => {
      if (USE_LIVE_API) {
        throw new Error('Live API not implemented yet');
      } else {
        // Generate mock interventions for this classroom
        const interventions: Intervention[] = Array.from({ length: Math.floor(Math.random() * 10) + 2 }, (_, i) => ({
          id: `intervention_${classroomId}_${i}`,
          templateId: mockInterventionTemplates[Math.floor(Math.random() * mockInterventionTemplates.length)].id,
          classroomId,
          alertId: Math.random() > 0.5 ? `alert_${Math.floor(Math.random() * 1000)}` : undefined,
          title: `干预处理 ${i + 1}`,
          description: '基于告警触发的标准化干预流程',
          type: mockInterventionTemplates[Math.floor(Math.random() * mockInterventionTemplates.length)].type,
          status: Math.random() > 0.3 ? 'completed' : Math.random() > 0.5 ? 'active' : 'pending',
          assignedTo: `user_${Math.floor(Math.random() * 3) + 1}`,
          checklist: [],
          slaMinutes: 15,
          startedAt: new Date(Date.now() - Math.random() * 86400000).toISOString(),
          completedAt: Math.random() > 0.7 ? new Date(Date.now() - Math.random() * 43200000).toISOString() : undefined,
          notes: [],
          createdAt: new Date(Date.now() - Math.random() * 86400000).toISOString(),
          updatedAt: new Date(Date.now() - Math.random() * 43200000).toISOString()
        }));
        
        return simulateApiDelay(interventions);
      }
    },
    enabled: !!classroomId,
    staleTime: 30000,
  });
};

// Audit Hook
export const useAuditEntries = (filters: AuditFilter = {}, pagination: PaginationParams = { page: 1, limit: 50 }) => {
  return useQuery({
    queryKey: queryKeys.audit.list(filters),
    queryFn: async (): Promise<PaginatedResponse<AuditEntry>> => {
      if (USE_LIVE_API) {
        throw new Error('Live API not implemented yet');
      } else {
        let filteredEntries = [...mockAuditEntries];
        
        // Apply filters
        if (filters.users?.length) {
          filteredEntries = filteredEntries.filter(entry =>
            filters.users!.includes(entry.userId)
          );
        }
        
        if (filters.actions?.length) {
          filteredEntries = filteredEntries.filter(entry =>
            filters.actions!.includes(entry.action)
          );
        }
        
        if (filters.targets?.length) {
          filteredEntries = filteredEntries.filter(entry =>
            filters.targets!.includes(entry.target)
          );
        }
        
        // Sort by timestamp (newest first)
        filteredEntries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        // Pagination
        const startIndex = (pagination.page - 1) * pagination.limit;
        const endIndex = startIndex + pagination.limit;
        const paginatedData = filteredEntries.slice(startIndex, endIndex);
        
        const result: PaginatedResponse<AuditEntry> = {
          data: paginatedData,
          total: filteredEntries.length,
          page: pagination.page,
          limit: pagination.limit,
          totalPages: Math.ceil(filteredEntries.length / pagination.limit),
          hasNext: endIndex < filteredEntries.length,
          hasPrevious: pagination.page > 1
        };
        
        return simulateApiDelay(result);
      }
    },
    staleTime: 60000,
  });
};

// Mutation Hooks
export const useAcknowledgeAlert = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ alertId, userId }: { alertId: string; userId: string }): Promise<Alert> => {
      if (USE_LIVE_API) {
        throw new Error('Live API not implemented yet');
      } else {
        // Mock acknowledgment
        const alert = mockAlerts.find(a => a.id === alertId);
        if (!alert) throw new Error('Alert not found');
        
        const updatedAlert = {
          ...alert,
          status: 'acknowledged' as const,
          acknowledgedBy: userId,
          acknowledgedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        // Update mock data
        const index = mockAlerts.findIndex(a => a.id === alertId);
        if (index !== -1) {
          mockAlerts[index] = updatedAlert;
        }
        
        return simulateApiDelay(updatedAlert);
      }
    },
    onSuccess: (updatedAlert) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.alerts.all });
      queryClient.setQueryData(queryKeys.alerts.detail(updatedAlert.id), updatedAlert);
    }
  });
};

export const useAssignAlert = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ alertId, assigneeId }: { alertId: string; assigneeId: string }): Promise<Alert> => {
      if (USE_LIVE_API) {
        throw new Error('Live API not implemented yet');
      } else {
        const alert = mockAlerts.find(a => a.id === alertId);
        if (!alert) throw new Error('Alert not found');
        
        const updatedAlert = {
          ...alert,
          status: 'assigned' as const,
          assignedTo: assigneeId,
          updatedAt: new Date().toISOString()
        };
        
        // Update mock data
        const index = mockAlerts.findIndex(a => a.id === alertId);
        if (index !== -1) {
          mockAlerts[index] = updatedAlert;
        }
        
        return simulateApiDelay(updatedAlert);
      }
    },
    onSuccess: (updatedAlert) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.alerts.all });
      queryClient.setQueryData(queryKeys.alerts.detail(updatedAlert.id), updatedAlert);
    }
  });
};

// WebSocket Hook
export const useWebSocket = () => {
  const [connectionStatus, setConnectionStatus] = useState<WSConnectionStatus>({
    connected: false,
    reconnectAttempts: 0
  });
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const queryClient = useQueryClient();

  const connect = useCallback(async () => {
    try {
      await mockWebSocket.connect();
      setConnectionStatus({
        connected: true,
        reconnectAttempts: 0,
        lastConnected: new Date().toISOString()
      });
    } catch (error) {
      setConnectionStatus(prev => ({
        ...prev,
        connected: false,
        reconnectAttempts: prev.reconnectAttempts + 1
      }));
    }
  }, []);

  const disconnect = useCallback(() => {
    mockWebSocket.disconnect();
    setConnectionStatus(prev => ({ ...prev, connected: false }));
  }, []);

  useEffect(() => {
    // Set up message listeners
    const handleNewAlert = (data: any) => {
      const message: WebSocketMessage = {
        type: 'alert.new',
        payload: data,
        timestamp: new Date().toISOString(),
        id: `msg_${Date.now()}`
      };
      setMessages(prev => [...prev.slice(-99), message]); // Keep last 100 messages
      
      // Invalidate alerts queries to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.alerts.all });
    };

    const handleMetricsUpdate = (data: any) => {
      const message: WebSocketMessage = {
        type: 'metrics.update',
        payload: data,
        timestamp: new Date().toISOString(),
        id: `msg_${Date.now()}`
      };
      setMessages(prev => [...prev.slice(-99), message]);
      
      // Update classroom data if it's in the cache
      queryClient.setQueryData(
        queryKeys.classrooms.detail(data.classroomId),
        (oldData: Classroom | undefined) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            recentTrends: {
              ...oldData.recentTrends,
              stress: [...oldData.recentTrends.stress.slice(1), {
                timestamp: data.timestamp,
                value: data.stress
              }]
            },
            updatedAt: data.timestamp
          };
        }
      );
    };

    const handleDeviceStatus = (data: any) => {
      const message: WebSocketMessage = {
        type: 'device.status',
        payload: data,
        timestamp: new Date().toISOString(),
        id: `msg_${Date.now()}`
      };
      setMessages(prev => [...prev.slice(-99), message]);
      
      // Update device health in classroom data
      queryClient.setQueryData(
        queryKeys.classrooms.detail(data.classroomId),
        (oldData: Classroom | undefined) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            deviceHealth: {
              ...oldData.deviceHealth,
              heartbeat: data.heartbeat,
              streamLatency: data.latency,
              fps: data.fps,
              lastHeartbeat: data.timestamp
            },
            updatedAt: data.timestamp
          };
        }
      );
    };

    mockWebSocket.on('alert.new', handleNewAlert);
    mockWebSocket.on('metrics.update', handleMetricsUpdate);
    mockWebSocket.on('device.status', handleDeviceStatus);

    // Auto-connect
    connect();

    return () => {
      mockWebSocket.off('alert.new', handleNewAlert);
      mockWebSocket.off('metrics.update', handleMetricsUpdate);
      mockWebSocket.off('device.status', handleDeviceStatus);
      disconnect();
    };
  }, [connect, disconnect, queryClient]);

  return {
    connectionStatus,
    messages,
    connect,
    disconnect
  };
};

// Real-time metrics hook
export const useRealtimeMetrics = (classroomId: string) => {
  const [metrics, setMetrics] = useState<ClassroomMetrics | null>(null);
  const { messages } = useWebSocket();

  useEffect(() => {
    // Filter messages for this classroom
    const latestMetrics = messages
      .filter(msg => msg.type === 'metrics.update' && msg.payload.classroomId === classroomId)
      .pop();

    if (latestMetrics) {
      setMetrics({
        classroomId,
        timestamp: latestMetrics.timestamp,
        stress: {
          current: latestMetrics.payload.stress,
          trend: Math.random() > 0.5 ? 'up' : 'down',
          change: Math.random() * 10 - 5,
          threshold: 70,
          isAboveThreshold: latestMetrics.payload.stress > 70
        },
        isolation: {
          current: latestMetrics.payload.isolation,
          trend: Math.random() > 0.5 ? 'up' : 'down',
          change: Math.random() * 10 - 5,
          threshold: 60,
          isAboveThreshold: latestMetrics.payload.isolation > 60
        },
        aggression: {
          current: latestMetrics.payload.aggression,
          trend: Math.random() > 0.5 ? 'up' : 'down',
          change: Math.random() * 10 - 5,
          threshold: 50,
          isAboveThreshold: latestMetrics.payload.aggression > 50
        },
        overall: {
          current: (latestMetrics.payload.stress + latestMetrics.payload.isolation + latestMetrics.payload.aggression) / 3,
          trend: Math.random() > 0.5 ? 'up' : 'down',
          change: Math.random() * 10 - 5,
          threshold: 60,
          isAboveThreshold: ((latestMetrics.payload.stress + latestMetrics.payload.isolation + latestMetrics.payload.aggression) / 3) > 60
        }
      });
    }
  }, [classroomId, messages]);

  return metrics;
};