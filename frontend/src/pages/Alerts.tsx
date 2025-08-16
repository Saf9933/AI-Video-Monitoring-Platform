// src/pages/Alerts.tsx
import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { listAlerts, acknowledgeAlert, resolveAlert, markFalsePositive, escalateAlert, type ActionRequest } from '../services/api/alerts';
import { websocketService } from '../services/websocket';
import type { Alert, AlertType, AlertPriority, AlertStatus } from '../types/api';

export default function Alerts() {
  const { t } = useTranslation();
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
    <div className="flex items-center justify-center min-h-[600px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-emerald-400 border-t-transparent mb-4" />
        <div className="text-white font-medium">{t('common.loading')}</div>
        <div className="text-slate-400 text-sm">正在加载预警数据...</div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Enhanced Page Header */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">预警管理中心</h1>
            <p className="text-slate-400 mt-1">
              学生安全事件与监控告警的综合管理平台
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-slate-300">
              {alerts.length} 条预警 • 总计 {alertsResponse?.total_count || 0} 条
            </div>
            <div className="flex items-center space-x-1 text-sm text-slate-300">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span>实时更新</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Filters */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
        <div className="flex flex-wrap gap-4">
          <div className="min-w-32">
            <label className="block text-sm font-medium text-slate-300 mb-1">状态筛选</label>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value as AlertStatus | '')}
              className="bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-sm text-white focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20"
            >
              <option value="">全部状态</option>
              <option value="new">新告警</option>
              <option value="acknowledged">已确认</option>
              <option value="in_progress">处理中</option>
              <option value="resolved">已解决</option>
              <option value="escalated">已升级</option>
              <option value="false_positive">误报</option>
            </select>
          </div>
          
          <div className="min-w-32">
            <label className="block text-sm font-medium text-slate-300 mb-1">优先级</label>
            <select 
              value={priorityFilter} 
              onChange={(e) => setPriorityFilter(e.target.value as AlertPriority | '')}
              className="bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-sm text-white focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20"
            >
              <option value="">全部优先级</option>
              <option value="low">低风险</option>
              <option value="medium">中风险</option>
              <option value="high">高风险</option>
              <option value="critical">紧急</option>
            </select>
          </div>

          <div className="min-w-48">
            <label className="block text-sm font-medium text-slate-300 mb-1">告警类型</label>
            <select 
              value={typeFilter} 
              onChange={(e) => setTypeFilter(e.target.value as AlertType | '')}
              className="bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-sm text-white focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20"
            >
              <option value="">全部类型</option>
              <optgroup label="核心安全场景">
                <option value="exam_pressure">考试压力</option>
                <option value="isolation_bullying">孤立霸凌</option>
                <option value="self_harm">自伤风险</option>
                <option value="teacher_verbal_abuse">师生冲突</option>
                <option value="cyber_tracking">网络跟踪</option>
              </optgroup>
              <optgroup label="一般事件">
                <option value="bullying">一般霸凌</option>
                <option value="violence">暴力行为</option>
                <option value="distress">学生困扰</option>
                <option value="medical_emergency">医疗紧急</option>
                <option value="weapon_detected">危险物品</option>
              </optgroup>
            </select>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {alerts && alerts.length > 0 ? (
          alerts.map((alert: Alert) => (
            <div key={alert.alert_id} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:bg-slate-800/70 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl">
                      {getTypeIcon(alert.alert_type)}
                    </span>
                    <span className="font-medium text-white text-lg">
                      {getTypeLabel(alert.alert_type)}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(alert.priority)}`}>
                      {getPriorityLabel(alert.priority)}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(alert.status)}`}>
                      {getStatusLabel(alert.status)}
                    </span>
                  </div>
                  
                  <div className="text-slate-300 mb-2">
                    <span className="font-medium">{alert.classroom_id}</span> • 
                    <span className="ml-1">风险评分: {(alert.risk_score * 100).toFixed(1)}%</span> •
                    <span className="ml-1">告警ID: {alert.alert_id}</span>
                  </div>
                  
                  <div className="text-sm text-slate-400 mb-3">
                    {new Date(alert.timestamp).toLocaleString('zh-CN')} • 
                    处理期限: {new Date(alert.acknowledgment_deadline).toLocaleString('zh-CN')}
                  </div>
                  
                  {/* Enhanced Affected Students with Privacy Indicators */}
                  <div className="mb-3">
                    <h4 className="text-sm font-medium text-slate-300 mb-1">涉及学生:</h4>
                    <div className="flex flex-wrap gap-2">
                      {alert.affected_students.map((student, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded border border-slate-600">
                          <span className="font-medium">{student.student_id}</span>
                          <span className="mx-1">•</span>
                          <span className={getRoleColor(student.role)}>{getRoleLabel(student.role)}</span>
                          <span className="mx-1">•</span>
                          <span>{(student.confidence * 100).toFixed(0)}%</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Assigned Staff */}
                  {(alert.assigned_staff?.teacher_id || alert.assigned_staff?.counselor_id) && (
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-slate-300 mb-1">分配负责人:</h4>
                      <div className="flex gap-2 text-xs">
                        {alert.assigned_staff.teacher_id && (
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded border border-blue-500/30">
                            教师: {alert.assigned_staff.teacher_id}
                          </span>
                        )}
                        {alert.assigned_staff.counselor_id && (
                          <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                            辅导员: {alert.assigned_staff.counselor_id}
                          </span>
                        )}
                        {alert.assigned_staff.admin_id && (
                          <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded border border-purple-500/30">
                            管理员: {alert.assigned_staff.admin_id}
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
                        className="px-4 py-2 bg-yellow-500/20 text-yellow-300 rounded-md text-sm font-medium hover:bg-yellow-500/30 transition-colors border border-yellow-500/30"
                        disabled={acknowledgeMutation.isPending}
                      >
                        {acknowledgeMutation.isPending ? '处理中...' : '确认告警'}
                      </button>
                    )}
                    
                    <button
                      onClick={() => openActionModal(alert, 'resolve')}
                      className="px-4 py-2 bg-emerald-500/20 text-emerald-300 rounded-md text-sm font-medium hover:bg-emerald-500/30 transition-colors border border-emerald-500/30"
                    >
                      标记解决
                    </button>
                    
                    <button
                      onClick={() => openActionModal(alert, 'escalate')}
                      className="px-4 py-2 bg-orange-500/20 text-orange-300 rounded-md text-sm font-medium hover:bg-orange-500/30 transition-colors border border-orange-500/30"
                    >
                      升级处理
                    </button>
                    
                    <button
                      onClick={() => openActionModal(alert, 'false_positive')}
                      className="px-4 py-2 bg-slate-600/50 text-slate-300 rounded-md text-sm font-medium hover:bg-slate-600/70 transition-colors border border-slate-600"
                    >
                      标记误报
                    </button>
                  </div>
                )}
              </div>
              
              {/* Enhanced Evidence and Explanation */}
              {(alert.evidence_package || alert.explanation) && (
                <div className="mt-4 p-4 bg-slate-900/50 rounded-lg border border-slate-600">
                  {alert.explanation?.summary && (
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-slate-300 mb-1">事件摘要:</h4>
                      <p className="text-sm text-slate-400">{alert.explanation.summary}</p>
                    </div>
                  )}
                  
                  {/* Enhanced Confidence Breakdown for Core Scenarios */}
                  {alert.explanation?.confidence_breakdown && (
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-slate-300 mb-1">置信度分析:</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                        {Object.entries(alert.explanation.confidence_breakdown).map(([key, value]) => (
                          <div key={key} className="flex justify-between p-2 bg-slate-800 rounded border border-slate-600">
                            <span className="capitalize text-slate-300">{key.replace('_', ' ')}:</span>
                            <span className="font-medium text-white">{((value || 0) * 100).toFixed(1)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {alert.explanation?.key_indicators && alert.explanation.key_indicators.length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-slate-300 mb-1">关键指标:</h4>
                      <div className="flex flex-wrap gap-1">
                        {alert.explanation.key_indicators.map((indicator, index) => (
                          <span key={index} className="inline-block px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded border border-blue-500/30">
                            {indicator}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {alert.evidence_package && (
                    <div>
                      <h4 className="text-sm font-medium text-slate-300 mb-1">证据包:</h4>
                      <p className="text-sm text-slate-400">
                        {alert.evidence_package.context_window}秒证据可用
                        {alert.evidence_package.redaction_applied && ' (已隐私脱敏)'}
                        {alert.evidence_package.supporting_evidence && 
                          ` • ${alert.evidence_package.supporting_evidence.length} 个支持文件`}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-12 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-xl font-medium text-white mb-2">暂无预警</h3>
            <p className="text-slate-400">所有系统运行正常，无活跃告警信息。</p>
          </div>
        )}
      </div>

      {/* Action Modal */}
      {actionModalOpen && selectedAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-white mb-4">
              {actionType === 'resolve' && '解决告警'}
              {actionType === 'escalate' && '升级告警'}
              {actionType === 'false_positive' && '标记误报'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  {actionType === 'resolve' ? '解决方案说明' : 
                   actionType === 'escalate' ? '升级原因' : '误报反馈'}
                </label>
                <textarea
                  value={actionData.resolution_notes || actionData.feedback_notes || ''}
                  onChange={(e) => setActionData({
                    ...actionData,
                    [actionType === 'resolve' ? 'resolution_notes' : 
                     actionType === 'escalate' ? 'notes' : 'feedback_notes']: e.target.value
                  })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-sm text-white placeholder-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20"
                  rows={3}
                  placeholder={`请描述${actionType === 'resolve' ? '已采取的解决措施' : 
                                actionType === 'escalate' ? '升级的具体原因' : 
                                '为什么这是误报'}...`}
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
                      className="mr-2 rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500/20"
                    />
                    <span className="text-sm text-slate-300">需要后续跟进</span>
                  </label>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setActionModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-700 rounded-md hover:bg-slate-600 border border-slate-600"
              >
                取消
              </button>
              <button
                onClick={handleActionSubmit}
                disabled={resolveMutation.isPending || escalateMutation.isPending || falsePositiveMutation.isPending}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md hover:opacity-90 ${
                  actionType === 'resolve' ? 'bg-emerald-600 hover:bg-emerald-700' :
                  actionType === 'escalate' ? 'bg-orange-600 hover:bg-orange-700' : 'bg-slate-600 hover:bg-slate-700'
                }`}
              >
                {(resolveMutation.isPending || escalateMutation.isPending || falsePositiveMutation.isPending) 
                  ? '处理中...' : '确认'}
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

function getTypeLabel(alertType: string): string {
  switch (alertType) {
    case 'exam_pressure': return '考试压力';
    case 'isolation_bullying': return '孤立霸凌';
    case 'self_harm': return '自伤风险';
    case 'teacher_verbal_abuse': return '师生冲突';
    case 'cyber_tracking': return '网络跟踪';
    case 'bullying': return '一般霸凌';
    case 'violence': return '暴力行为';
    case 'distress': return '学生困扰';
    case 'medical_emergency': return '医疗紧急';
    case 'weapon_detected': return '危险物品';
    default: return '未知类型';
  }
}

function getPriorityLabel(priority: string): string {
  switch (priority) {
    case 'critical': return '紧急';
    case 'high': return '高风险';
    case 'medium': return '中风险';
    case 'low': return '低风险';
    default: return '未知';
  }
}

function getStatusLabel(status: string): string {
  switch (status) {
    case 'new': return '新告警';
    case 'acknowledged': return '已确认';
    case 'in_progress': return '处理中';
    case 'escalated': return '已升级';
    case 'resolved': return '已解决';
    case 'false_positive': return '误报';
    default: return '未知状态';
  }
}

function getRoleLabel(role: string): string {
  switch (role) {
    case 'target': return '受害者';
    case 'aggressor': return '施害者';
    case 'bystander': return '旁观者';
    default: return '未知角色';
  }
}

function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'critical': return 'bg-red-500/20 text-red-300 border border-red-500/30';
    case 'high': return 'bg-orange-500/20 text-orange-300 border border-orange-500/30';
    case 'medium': return 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30';
    case 'low': return 'bg-blue-500/20 text-blue-300 border border-blue-500/30';
    default: return 'bg-slate-500/20 text-slate-300 border border-slate-500/30';
  }
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'new': return 'bg-red-500/20 text-red-300 border border-red-500/30';
    case 'acknowledged': return 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30';
    case 'in_progress': return 'bg-blue-500/20 text-blue-300 border border-blue-500/30';
    case 'escalated': return 'bg-orange-500/20 text-orange-300 border border-orange-500/30';
    case 'resolved': return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
    case 'false_positive': return 'bg-slate-500/20 text-slate-300 border border-slate-500/30';
    default: return 'bg-slate-500/20 text-slate-300 border border-slate-500/30';
  }
}

function getRoleColor(role: string): string {
  switch (role) {
    case 'target': return 'text-red-400';
    case 'aggressor': return 'text-orange-400';
    case 'bystander': return 'text-blue-400';
    default: return 'text-slate-400';
  }
}
