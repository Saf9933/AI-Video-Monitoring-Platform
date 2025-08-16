// src/data/system/settings.hooks.ts
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSystemSettingsClient } from './settings.client';
import type { SystemSettings, MaintenanceIssue, TestResult, AuditEntry, SystemInfo } from './settings.types';

const client = getSystemSettingsClient();

export function useSystemSettings() {
  return useQuery({
    queryKey: ['systemSettings'],
    queryFn: () => client.getSystemSettings(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useSystemInfo() {
  return useQuery({
    queryKey: ['systemInfo'],
    queryFn: () => client.getSystemInfo(),
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}

export function useAuditLog() {
  return useQuery({
    queryKey: ['auditLog'],
    queryFn: () => client.getAuditLog(),
  });
}

export function useUpdateSystemSettings() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (patch: Partial<SystemSettings>) => client.updateSystemSettings(patch),
    onMutate: async (patch) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['systemSettings'] });
      
      // Snapshot the previous value
      const previousSettings = queryClient.getQueryData<SystemSettings>(['systemSettings']);
      
      // Optimistically update to the new value
      if (previousSettings) {
        queryClient.setQueryData(['systemSettings'], {
          ...previousSettings,
          ...patch,
          updatedAt: new Date().toISOString(),
        });
      }
      
      return { previousSettings };
    },
    onError: (err, patch, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousSettings) {
        queryClient.setQueryData(['systemSettings'], context.previousSettings);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['systemSettings'] });
      queryClient.invalidateQueries({ queryKey: ['auditLog'] });
    },
  });
}

export function useGenerateOneTimeCode() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (role: 'professor' | 'director') => client.generateOneTimeCode(role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['systemSettings'] });
      queryClient.invalidateQueries({ queryKey: ['auditLog'] });
    },
  });
}

export function useRevokeOneTimeCode() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => client.revokeOneTimeCode(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['systemSettings'] });
      queryClient.invalidateQueries({ queryKey: ['auditLog'] });
    },
  });
}

export function useTestNotification() {
  return useMutation({
    mutationFn: (channel: 'sms' | 'email' | 'wecom') => client.testNotification(channel),
  });
}

export function useTestIntegration() {
  return useMutation({
    mutationFn: (kind: 'api' | 'ws' | 'lms' | 'kafka') => client.testIntegration(kind),
  });
}

export function useSystemCheck() {
  return useMutation({
    mutationFn: () => client.systemCheck(),
  });
}

export function useReloadConfig() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => client.reloadConfig(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['systemSettings'] });
      queryClient.invalidateQueries({ queryKey: ['systemInfo'] });
      queryClient.invalidateQueries({ queryKey: ['auditLog'] });
    },
  });
}

export function useClearCache() {
  return useMutation({
    mutationFn: () => client.clearCache(),
  });
}

export function useExportConfig() {
  return () => {
    const blob = client.exportConfig();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system-config-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
}

// Hook for managing unsaved changes state
export function useUnsavedChanges() {
  const [hasChanges, setHasChanges] = useState(false);
  const [originalData, setOriginalData] = useState<SystemSettings | null>(null);
  const [currentData, setCurrentData] = useState<SystemSettings | null>(null);

  const markDirty = (data: SystemSettings) => {
    if (!originalData) {
      setOriginalData(data);
    }
    setCurrentData(data);
    setHasChanges(true);
  };

  const markClean = (data?: SystemSettings) => {
    if (data) {
      setOriginalData(data);
      setCurrentData(data);
    }
    setHasChanges(false);
  };

  const revert = () => {
    if (originalData) {
      setCurrentData(originalData);
      setHasChanges(false);
      return originalData;
    }
    return null;
  };

  return {
    hasChanges,
    originalData,
    currentData,
    markDirty,
    markClean,
    revert,
  };
}