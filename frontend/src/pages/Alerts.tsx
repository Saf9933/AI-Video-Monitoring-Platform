// src/pages/Alerts.tsx
import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listAlerts, acknowledgeAlert, resolveAlert } from '../services/api/alerts';
import { websocketService } from '../services/websocket';
import type { Alert } from '../types/api';

export default function Alerts() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['alerts'], queryFn: () => listAlerts() });

  const acknowledgeMutation = useMutation({
    mutationFn: acknowledgeAlert,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['alerts'] })
  });

  const resolveMutation = useMutation({
    mutationFn: resolveAlert,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['alerts'] })
  });

  useEffect(() => {
    // Connect to WebSocket for real-time updates
    websocketService.connect();

    websocketService.onNewAlert(() => {
      // Refresh alerts when a new alert is received
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    });

    websocketService.onUpdatedAlert(() => {
      // Refresh alerts when an alert is updated
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    });

    return () => {
      websocketService.disconnect();
    };
  }, [queryClient]);

  if (isLoading) return <p>Loading alerts...</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Student Safety Alerts</h1>
      <div className="space-y-3">
        {data!.map((alert: Alert) => (
          <div key={alert.id} className="border rounded-lg p-4 bg-white shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium capitalize">{alert.type.replace('_', ' ')}</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                    {alert.severity.toUpperCase()}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs ${getStatusColor(alert.status)}`}>
                    {alert.status.toUpperCase()}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-1">
                  Student: {alert.studentId} • Confidence: {(alert.confidence * 100).toFixed(1)}%
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(alert.createdAt).toLocaleString()}
                </div>
              </div>
              
              {alert.status === 'open' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => acknowledgeMutation.mutate(alert.id)}
                    className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-sm hover:bg-yellow-200"
                    disabled={acknowledgeMutation.isPending}
                  >
                    Acknowledge
                  </button>
                  <button
                    onClick={() => resolveMutation.mutate(alert.id)}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm hover:bg-green-200"
                    disabled={resolveMutation.isPending}
                  >
                    Resolve
                  </button>
                </div>
              )}
            </div>
            
            {alert.evidence && (
              <div className="mt-3 p-3 bg-gray-50 rounded">
                {alert.evidence.snippet && (
                  <div className="text-sm text-gray-700 mb-2">
                    <strong>Context:</strong> {alert.evidence.snippet}
                  </div>
                )}
                {alert.evidence.transcript && (
                  <div className="text-sm text-gray-700 mb-2">
                    <strong>Transcript:</strong> "{alert.evidence.transcript}"
                  </div>
                )}
                {alert.evidence.thumbUrl && (
                  <img 
                    src={alert.evidence.thumbUrl} 
                    alt="Evidence" 
                    className="w-20 h-15 object-cover rounded"
                  />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'critical': return 'bg-red-100 text-red-800';
    case 'high': return 'bg-orange-100 text-orange-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'low': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'open': return 'bg-red-50 text-red-700';
    case 'acknowledged': return 'bg-yellow-50 text-yellow-700';
    case 'resolved': return 'bg-green-50 text-green-700';
    default: return 'bg-gray-50 text-gray-700';
  }
}
