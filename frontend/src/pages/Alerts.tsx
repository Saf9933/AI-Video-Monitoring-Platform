// src/pages/Alerts.tsx
import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listAlerts, acknowledgeAlert, resolveAlert, markFalsePositive, escalateAlert, type ActionRequest } from '../services/api/alerts';
import { websocketService } from '../services/websocket';
import type { Alert, AlertType, AlertPriority, AlertStatus } from '../types/api';

export default function Alerts() {
  const queryClient = useQueryClient();
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [actionType, setActionType] = useState<'resolve' | 'escalate' | 'false_positive'>('resolve');
  const [actionData, setActionData] = useState<ActionRequest>({});

  // Filter states
  const [statusFilter, setStatusFilter] = useState<AlertStatus | ''>('');
  const [priorityFilter, setPriorityFilter] = useState<AlertPriority | ''>('');
  const [typeFilter, setTypeFilter] = useState<AlertType | ''>('');
  
  const { data: alertsResponse, isLoading } = useQuery({ 
    queryKey: ['alerts', { status: statusFilter, priority: priorityFilter, alert_type: typeFilter }],
    queryFn: () => listAlerts({ 
      status: statusFilter || undefined,
      priority: priorityFilter || undefined,
      limit: 50 
    }),
  });

  const alerts = alertsResponse?.alerts || [];

  const acknowledgeMutation = useMutation({
    mutationFn: ({ alert_id, data }: { alert_id: string; data?: ActionRequest }) => acknowledgeAlert(alert_id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['alerts'] })
  });

  const resolveMutation = useMutation({
    mutationFn: ({ alert_id, data }: { alert_id: string; data: ActionRequest }) => resolveAlert(alert_id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      setActionModalOpen(false);
      setSelectedAlert(null);
    }
  });

  const falsePositiveMutation = useMutation({
    mutationFn: ({ alert_id, data }: { alert_id: string; data: ActionRequest }) => markFalsePositive(alert_id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      setActionModalOpen(false);
      setSelectedAlert(null);
    }
  });

  const escalateMutation = useMutation({
    mutationFn: ({ alert_id, data }: { alert_id: string; data?: ActionRequest }) => escalateAlert(alert_id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      setActionModalOpen(false);
      setSelectedAlert(null);
    }
  });

  useEffect(() => {
    websocketService.connect();

    websocketService.onNewAlert(() => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    });

    websocketService.onUpdatedAlert(() => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    });

    return () => {
      websocketService.disconnect();
    };
  }, [queryClient]);

  const handleActionSubmit = () => {
    if (!selectedAlert) return;

    switch (actionType) {
      case 'resolve':
        resolveMutation.mutate({ alert_id: selectedAlert.alert_id, data: actionData });
        break;
      case 'escalate':
        escalateMutation.mutate({ alert_id: selectedAlert.alert_id, data: actionData });
        break;
      case 'false_positive':
        falsePositiveMutation.mutate({ alert_id: selectedAlert.alert_id, data: actionData });
        break;
    }
  };

  const openActionModal = (alert: Alert, type: 'resolve' | 'escalate' | 'false_positive') => {
    setSelectedAlert(alert);
    setActionType(type);
    setActionData({});
    setActionModalOpen(true);
  };

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
        <p className="text-gray-600">Loading alerts...</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Enhanced Page Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Safety Alerts</h1>
            <p className="text-gray-600 mt-1">
              Comprehensive view of all student safety incidents and monitoring alerts
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              {alerts.length} alerts • {alertsResponse?.total_count || 0} total
            </div>
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live updates</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex flex-wrap gap-4">
          <div className="min-w-32">
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value as AlertStatus | '')}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="">All Statuses</option>
              <option value="new">New</option>
              <option value="acknowledged">Acknowledged</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="escalated">Escalated</option>
              <option value="false_positive">False Positive</option>
            </select>
          </div>
          
          <div className="min-w-32">
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select 
              value={priorityFilter} 
              onChange={(e) => setPriorityFilter(e.target.value as AlertPriority | '')}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div className="min-w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">Alert Type</label>
            <select 
              value={typeFilter} 
              onChange={(e) => setTypeFilter(e.target.value as AlertType | '')}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="">All Types</option>
              <optgroup label="Core Safety Scenarios">
                <option value="exam_pressure">Exam Pressure</option>
                <option value="isolation_bullying">Isolation Bullying</option>
                <option value="self_harm">Self Harm</option>
                <option value="teacher_verbal_abuse">Teacher Verbal Abuse</option>
                <option value="cyber_tracking">Cyber Tracking</option>
              </optgroup>
              <optgroup label="General Incidents">
                <option value="bullying">General Bullying</option>
                <option value="violence">Violence</option>
                <option value="distress">Student Distress</option>
                <option value="medical_emergency">Medical Emergency</option>
                <option value="weapon_detected">Weapon Detection</option>
              </optgroup>
            </select>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {alerts && alerts.length > 0 ? (
          alerts.map((alert: Alert) => (
            <div key={alert.alert_id} className="bg-white border rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl">
                      {getTypeIcon(alert.alert_type)}
                    </span>
                    <span className="font-medium capitalize text-lg">
                      {alert.alert_type.replace('_', ' ')}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(alert.priority)}`}>
                      {alert.priority.toUpperCase()}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(alert.status)}`}>
                      {alert.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="text-gray-600 mb-2">
                    <span className="font-medium">{alert.classroom_id}</span> • 
                    <span className="ml-1">Risk Score: {(alert.risk_score * 100).toFixed(1)}%</span> •
                    <span className="ml-1">Alert ID: {alert.alert_id}</span>
                  </div>
                  
                  <div className="text-sm text-gray-500 mb-3">
                    {new Date(alert.timestamp).toLocaleString()} • 
                    Deadline: {new Date(alert.acknowledgment_deadline).toLocaleString()}
                  </div>
                  
                  {/* Enhanced Affected Students with Privacy Indicators */}
                  <div className="mb-3">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Affected Students:</h4>
                    <div className="flex flex-wrap gap-2">
                      {alert.affected_students.map((student, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          <span className="font-medium">{student.student_id}</span>
                          <span className="mx-1">•</span>
                          <span className={getRoleColor(student.role)}>{student.role}</span>
                          <span className="mx-1">•</span>
                          <span>{(student.confidence * 100).toFixed(0)}%</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Assigned Staff */}
                  {(alert.assigned_staff?.teacher_id || alert.assigned_staff?.counselor_id) && (
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Assigned Staff:</h4>
                      <div className="flex gap-2 text-xs">
                        {alert.assigned_staff.teacher_id && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                            Teacher: {alert.assigned_staff.teacher_id}
                          </span>
                        )}
                        {alert.assigned_staff.counselor_id && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
                            Counselor: {alert.assigned_staff.counselor_id}
                          </span>
                        )}
                        {alert.assigned_staff.admin_id && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded">
                            Admin: {alert.assigned_staff.admin_id}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Enhanced Action Buttons */}
                {(alert.status === 'new' || alert.status === 'acknowledged') && (
                  <div className="flex flex-col gap-2">
                    {alert.status === 'new' && (
                      <button
                        onClick={() => acknowledgeMutation.mutate({ alert_id: alert.alert_id })}
                        className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-md text-sm font-medium hover:bg-yellow-200 transition-colors"
                        disabled={acknowledgeMutation.isPending}
                      >
                        {acknowledgeMutation.isPending ? 'Processing...' : 'Acknowledge'}
                      </button>
                    )}
                    
                    <button
                      onClick={() => openActionModal(alert, 'resolve')}
                      className="px-4 py-2 bg-green-100 text-green-800 rounded-md text-sm font-medium hover:bg-green-200 transition-colors"
                    >
                      Resolve
                    </button>
                    
                    <button
                      onClick={() => openActionModal(alert, 'escalate')}
                      className="px-4 py-2 bg-orange-100 text-orange-800 rounded-md text-sm font-medium hover:bg-orange-200 transition-colors"
                    >
                      Escalate
                    </button>
                    
                    <button
                      onClick={() => openActionModal(alert, 'false_positive')}
                      className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
                    >
                      False Positive
                    </button>
                  </div>
                )}
              </div>
              
              {/* Enhanced Evidence and Explanation */}
              {(alert.evidence_package || alert.explanation) && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  {alert.explanation?.summary && (
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Summary:</h4>
                      <p className="text-sm text-gray-600">{alert.explanation.summary}</p>
                    </div>
                  )}
                  
                  {/* Enhanced Confidence Breakdown for Core Scenarios */}
                  {alert.explanation?.confidence_breakdown && (
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Confidence Analysis:</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                        {Object.entries(alert.explanation.confidence_breakdown).map(([key, value]) => (
                          <div key={key} className="flex justify-between p-2 bg-white rounded border">
                            <span className="capitalize">{key.replace('_', ' ')}:</span>
                            <span className="font-medium">{((value || 0) * 100).toFixed(1)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {alert.explanation?.key_indicators && alert.explanation.key_indicators.length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Key Indicators:</h4>
                      <div className="flex flex-wrap gap-1">
                        {alert.explanation.key_indicators.map((indicator, index) => (
                          <span key={index} className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            {indicator}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {alert.evidence_package && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Evidence:</h4>
                      <p className="text-sm text-gray-600">
                        {alert.evidence_package.context_window}s evidence available
                        {alert.evidence_package.redaction_applied && ' (privacy redacted)'}
                        {alert.evidence_package.supporting_evidence && 
                          ` • ${alert.evidence_package.supporting_evidence.length} supporting files`}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Alerts Found</h3>
            <p className="text-gray-500">All systems are operating normally with no active alerts.</p>
          </div>
        )}
      </div>

      {/* Action Modal */}
      {actionModalOpen && selectedAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {actionType === 'resolve' && 'Resolve Alert'}
              {actionType === 'escalate' && 'Escalate Alert'}
              {actionType === 'false_positive' && 'Mark False Positive'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {actionType === 'resolve' ? 'Resolution Notes' : 
                   actionType === 'escalate' ? 'Escalation Reason' : 'Feedback Notes'}
                </label>
                <textarea
                  value={actionData.resolution_notes || actionData.feedback_notes || ''}
                  onChange={(e) => setActionData({
                    ...actionData,
                    [actionType === 'resolve' ? 'resolution_notes' : 
                     actionType === 'escalate' ? 'notes' : 'feedback_notes']: e.target.value
                  })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  rows={3}
                  placeholder={`Describe the ${actionType === 'resolve' ? 'resolution actions taken' : 
                                actionType === 'escalate' ? 'reason for escalation' : 
                                'why this is a false positive'}...`}
                />
              </div>
              
              {actionType === 'resolve' && (
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={actionData.follow_up_required || false}
                      onChange={(e) => setActionData({
                        ...actionData,
                        follow_up_required: e.target.checked
                      })}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Follow-up required</span>
                  </label>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setActionModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleActionSubmit}
                disabled={resolveMutation.isPending || escalateMutation.isPending || falsePositiveMutation.isPending}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md hover:opacity-90 ${
                  actionType === 'resolve' ? 'bg-green-600' :
                  actionType === 'escalate' ? 'bg-orange-600' : 'bg-gray-600'
                }`}
              >
                {(resolveMutation.isPending || escalateMutation.isPending || falsePositiveMutation.isPending) 
                  ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getTypeIcon(alertType: string): string {
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
    case 'new': return 'bg-red-50 text-red-700 border-red-200';
    case 'acknowledged': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    case 'in_progress': return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'escalated': return 'bg-orange-50 text-orange-700 border-orange-200';
    case 'resolved': return 'bg-green-50 text-green-700 border-green-200';
    case 'false_positive': return 'bg-gray-50 text-gray-700 border-gray-200';
    default: return 'bg-gray-50 text-gray-700 border-gray-200';
  }
}

function getRoleColor(role: string): string {
  switch (role) {
    case 'target': return 'text-red-600';
    case 'aggressor': return 'text-orange-600';
    case 'bystander': return 'text-blue-600';
    default: return 'text-gray-600';
  }
}
