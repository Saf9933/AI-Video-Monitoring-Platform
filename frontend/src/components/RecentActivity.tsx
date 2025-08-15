import { useMutation, useQueryClient } from '@tanstack/react-query';
import { acknowledgeAlert, resolveAlert, markFalsePositive } from '../services/api/alerts';
import type { Alert } from '../types/api';

interface RecentActivityProps {
  alerts: Alert[];
  limit?: number;
}

export default function RecentActivity({ alerts, limit = 10 }: RecentActivityProps) {
  const queryClient = useQueryClient();

  const acknowledgeMutation = useMutation({
    mutationFn: ({ alert_id }: { alert_id: string }) => acknowledgeAlert(alert_id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['alerts'] })
  });

  const resolveMutation = useMutation({
    mutationFn: ({ alert_id }: { alert_id: string }) => resolveAlert(alert_id, { resolution_notes: 'Quick resolution from dashboard' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['alerts'] })
  });

  const falsePositiveMutation = useMutation({
    mutationFn: ({ alert_id }: { alert_id: string }) => markFalsePositive(alert_id, { feedback_notes: 'Marked as false positive from dashboard' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['alerts'] })
  });

  // Sort by timestamp and limit
  const recentAlerts = alerts
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'critical': return 'bg-red-900/50 text-red-200';
      case 'high': return 'bg-orange-900/50 text-orange-200';
      case 'medium': return 'bg-yellow-900/50 text-yellow-200';
      case 'low': return 'bg-blue-900/50 text-blue-200';
      default: return 'bg-slate-700/50 text-slate-300';
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'new': return 'bg-red-900/30 text-red-300 border-red-700';
      case 'acknowledged': return 'bg-yellow-900/30 text-yellow-300 border-yellow-700';
      case 'in_progress': return 'bg-blue-900/30 text-blue-300 border-blue-700';
      case 'escalated': return 'bg-orange-900/30 text-orange-300 border-orange-700';
      case 'resolved': return 'bg-green-900/30 text-green-300 border-green-700';
      case 'false_positive': return 'bg-slate-700/30 text-slate-300 border-slate-600';
      default: return 'bg-slate-700/30 text-slate-300 border-slate-600';
    }
  };

  const getTypeIcon = (alertType: string): string => {
    switch (alertType) {
      case 'exam_pressure': return '📚';
      case 'isolation_bullying': return '👥';
      case 'self_harm': return '🆘';
      case 'teacher_verbal_abuse': return '🗣️';
      case 'cyber_tracking': return '💻';
      case 'bullying': return '👫';
      case 'violence': return '⚡';
      case 'distress': return '😰';
      case 'medical_emergency': return '🚑';
      case 'weapon_detected': return '🔫';
      default: return '⚠️';
    }
  };

  const formatTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const alertTime = new Date(timestamp);
    const diffMs = now.getTime() - alertTime.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const getScenarioDescription = (alertType: string): string => {
    switch (alertType) {
      case 'exam_pressure': return 'Academic stress detection';
      case 'isolation_bullying': return 'Social exclusion patterns';
      case 'self_harm': return 'Crisis intervention needed';
      case 'teacher_verbal_abuse': return 'Authority misconduct';
      case 'cyber_tracking': return 'Digital harassment';
      case 'bullying': return 'General bullying incident';
      case 'violence': return 'Physical altercation';
      case 'distress': return 'Student emotional distress';
      case 'medical_emergency': return 'Medical attention required';
      case 'weapon_detected': return 'Potential weapon sighted';
      default: return 'Safety incident detected';
    }
  };

  if (recentAlerts.length === 0) {
    return (
      <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6 text-center">
        <div className="text-4xl mb-2">🎉</div>
        <h3 className="text-lg font-medium text-white mb-1">All Clear!</h3>
        <p className="text-slate-400">No recent alerts to display.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 rounded-lg border border-slate-700">
      <div className="px-6 py-4 border-b border-slate-700">
        <h3 className="text-lg font-medium text-white">最近活动</h3>
        <p className="text-sm text-slate-400">Latest {limit} safety alerts across all monitored classrooms</p>
      </div>
      
      <div className="divide-y divide-slate-700 max-h-96 overflow-y-auto">
        {recentAlerts.map((alert) => (
          <div key={alert.alert_id} className="p-4 hover:bg-slate-700/50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className="text-xl mt-0.5">
                  {getTypeIcon(alert.alert_type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-white capitalize">
                      {alert.alert_type.replace('_', ' ')}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(alert.priority)}`}>
                      {alert.priority.toUpperCase()}
                    </span>
                    {alert.auto_escalate && new Date(alert.acknowledgment_deadline) < new Date() && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
                        OVERDUE
                      </span>
                    )}
                  </div>
                  
                  <div className="text-sm text-slate-300 mb-1">
                    {alert.classroom_id} • Risk: {(alert.risk_score * 100).toFixed(1)}%
                    {alert.assigned_staff?.teacher_id && (
                      <span className="ml-2 text-blue-400">
                        → {alert.assigned_staff.teacher_id}
                      </span>
                    )}
                  </div>
                  
                  <div className="text-xs text-slate-400 mb-2">
                    {formatTimeAgo(alert.timestamp)} • {getScenarioDescription(alert.alert_type)}
                  </div>
                  
                  {alert.explanation?.summary && (
                    <p className="text-xs text-gray-600 truncate">
                      {alert.explanation.summary}
                    </p>
                  )}

                  {/* Core Scenario Indicators */}
                  {alert.explanation?.confidence_breakdown && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {Object.entries(alert.explanation.confidence_breakdown).map(([key, value]) => {
                        if (!value || value < 0.5) return null; // Only show significant indicators
                        return (
                          <span key={key} className="inline-block px-1 py-0.5 bg-blue-50 text-blue-700 text-xs rounded">
                            {key.replace('_', ' ')}: {((value || 0) * 100).toFixed(0)}%
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end space-y-2 ml-4">
                <span className={`px-2 py-1 rounded text-xs border ${getStatusColor(alert.status)}`}>
                  {alert.status.replace('_', ' ').toUpperCase()}
                </span>
                
                {alert.status === 'new' && (
                  <div className="flex space-x-1">
                    <button
                      onClick={() => acknowledgeMutation.mutate({ alert_id: alert.alert_id })}
                      className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs hover:bg-yellow-200 disabled:opacity-50"
                      disabled={acknowledgeMutation.isPending}
                      title="Acknowledge"
                    >
                      ✓
                    </button>
                    <button
                      onClick={() => resolveMutation.mutate({ alert_id: alert.alert_id })}
                      className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs hover:bg-green-200 disabled:opacity-50"
                      disabled={resolveMutation.isPending}
                      title="Quick Resolve"
                    >
                      ✅
                    </button>
                    <button
                      onClick={() => falsePositiveMutation.mutate({ alert_id: alert.alert_id })}
                      className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs hover:bg-gray-200 disabled:opacity-50"
                      disabled={falsePositiveMutation.isPending}
                      title="False Positive"
                    >
                      ✕
                    </button>
                  </div>
                )}

                {/* Privacy Compliance Indicator */}
                {alert.evidence_package && (
                  <div className="text-xs">
                    <span className={`inline-block w-2 h-2 rounded-full ${
                      alert.evidence_package.redaction_applied ? 'bg-green-500' : 'bg-yellow-500'
                    }`} title={alert.evidence_package.redaction_applied ? 'Privacy compliant' : 'Review needed'}></span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {alerts.length > limit && (
        <div className="px-6 py-3 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            Showing {limit} of {alerts.length} alerts •{' '}
            <button 
              className="text-blue-600 hover:text-blue-800"
              onClick={() => window.location.hash = '#alerts'}
            >
              View all alerts
            </button>
          </p>
        </div>
      )}
    </div>
  );
}