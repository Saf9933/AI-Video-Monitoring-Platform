// src/pages/Alerts.tsx
import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listAlerts, acknowledgeAlert, resolveAlert, markFalsePositive } from '../services/api/alerts';
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

  const falsePositiveMutation = useMutation({
    mutationFn: markFalsePositive,
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
          <div key={alert.alert_id} className="border rounded-lg p-4 bg-white shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium capitalize">{alert.alert_type}</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(alert.priority)}`}>
                    {alert.priority.toUpperCase()}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs ${getStatusColor(alert.status)}`}>
                    {alert.status.toUpperCase()}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-1">
                  {alert.classroom_id} • Risk: {(alert.risk_score * 100).toFixed(1)}%
                </div>
                <div className="text-xs text-gray-500 mb-2">
                  {new Date(alert.timestamp).toLocaleString()}
                </div>
                
                {/* Affected Students */}
                <div className="text-sm text-gray-600 mb-1">
                  Students: {alert.affected_students.map(s => 
                    `${s.student_id}(${s.role})`
                  ).join(', ')}
                </div>
              </div>
              
              {alert.status === 'new' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => acknowledgeMutation.mutate(alert.alert_id)}
                    className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-sm hover:bg-yellow-200"
                    disabled={acknowledgeMutation.isPending}
                  >
                    Acknowledge
                  </button>
                  <button
                    onClick={() => resolveMutation.mutate(alert.alert_id)}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm hover:bg-green-200"
                    disabled={resolveMutation.isPending}
                  >
                    Resolve
                  </button>
                  <button
                    onClick={() => falsePositiveMutation.mutate(alert.alert_id)}
                    className="px-3 py-1 bg-gray-100 text-gray-800 rounded text-sm hover:bg-gray-200"
                    disabled={falsePositiveMutation.isPending}
                  >
                    False Positive
                  </button>
                </div>
              )}
            </div>
            
            {/* Evidence and Explanation */}
            {(alert.evidence_package || alert.explanation) && (
              <div className="mt-3 p-3 bg-gray-50 rounded">
                {alert.explanation?.summary && (
                  <div className="text-sm text-gray-700 mb-2">
                    <strong>Summary:</strong> {alert.explanation.summary}
                  </div>
                )}
                {alert.explanation?.key_indicators && (
                  <div className="text-sm text-gray-700 mb-2">
                    <strong>Indicators:</strong> {alert.explanation.key_indicators.join(', ')}
                  </div>
                )}
                {alert.evidence_package?.primary_evidence && (
                  <div className="text-sm text-gray-700">
                    <strong>Evidence:</strong> {alert.evidence_package.context_window}s clip available
                    {alert.evidence_package.redaction_applied && ' (redacted)'}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'critical': return 'bg-red-100 text-red-800';
    case 'high': return 'bg-orange-100 text-orange-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'low': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'new': return 'bg-red-50 text-red-700';
    case 'acknowledged': return 'bg-yellow-50 text-yellow-700';
    case 'resolved': return 'bg-green-50 text-green-700';
    case 'false_positive': return 'bg-gray-50 text-gray-700';
    default: return 'bg-gray-50 text-gray-700';
  }
}
