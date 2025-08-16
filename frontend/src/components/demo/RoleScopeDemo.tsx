// Demo component to showcase role-scoped access control
// Shows real-time filtering behavior and role switching

import React, { useState } from 'react';
import { useRBAC } from '../rbac/RBACProvider';
import { useClassrooms, useAlerts, useWebSocket } from '../../data/classrooms/hooks';
import { Shield, User, Eye, EyeOff, Wifi, WifiOff } from 'lucide-react';

export function RoleScopeDemo() {
  const { 
    currentRole, 
    roleScope, 
    allowedRoomIds, 
    scopeCount, 
    loginCode,
    switchRole 
  } = useRBAC();
  
  const { data: classroomsData, isLoading: classroomsLoading } = useClassrooms();
  const { data: alertsData, isLoading: alertsLoading } = useAlerts();
  const { connectionStatus, messages } = useWebSocket();
  
  const [showDetails, setShowDetails] = useState(false);
  const [pin, setPin] = useState('');
  const [switchingRole, setSwitchingRole] = useState(false);

  const classrooms = classroomsData?.data || [];
  const alerts = alertsData?.data || [];
  const isDirector = currentRole === 'director';
  const recentMessages = messages.slice(-5);

  const handleRoleSwitch = async () => {
    setSwitchingRole(true);
    const targetRole = isDirector ? 'professor' : 'director';
    const targetPin = targetRole === 'director' ? '0303' : '0000';
    
    const success = await switchRole(targetRole, targetPin);
    if (success) {
      setPin('');
    }
    setSwitchingRole(false);
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">🔐 Role-Scoped Access Control Demo</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center space-x-1 px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs text-slate-300"
          >
            {showDetails ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            <span>{showDetails ? 'Hide' : 'Show'} Details</span>
          </button>
        </div>
      </div>

      {/* Current Role Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-4 rounded-lg border ${
          isDirector 
            ? 'bg-purple-900/20 border-purple-700' 
            : 'bg-blue-900/20 border-blue-700'
        }`}>
          <div className="flex items-center space-x-2 mb-2">
            {isDirector ? (
              <Shield className="w-5 h-5 text-purple-400" />
            ) : (
              <User className="w-5 h-5 text-blue-400" />
            )}
            <h3 className="font-medium text-white">当前角色 / Current Role</h3>
          </div>
          <div className="text-lg font-bold text-white mb-1">
            {isDirector ? '主任 / Director' : '教授 / Professor'}
          </div>
          <div className="text-sm text-slate-400">
            {roleScope.description.zh}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {roleScope.description.en}
          </div>
        </div>

        <div className="p-4 rounded-lg border border-slate-600 bg-slate-700/20">
          <div className="flex items-center space-x-2 mb-2">
            <Eye className="w-5 h-5 text-green-400" />
            <h3 className="font-medium text-white">访问范围 / Access Scope</h3>
          </div>
          <div className="text-lg font-bold text-white mb-1">
            {scopeCount} 个教室
          </div>
          <div className="text-sm text-slate-400">
            {allowedRoomIds === '*' ? '全部教室访问权限' : '受限教室访问'}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {allowedRoomIds === '*' ? 'All classrooms accessible' : 'Limited classroom access'}
          </div>
        </div>

        <div className="p-4 rounded-lg border border-slate-600 bg-slate-700/20">
          <div className="flex items-center space-x-2 mb-2">
            {connectionStatus.connected ? (
              <Wifi className="w-5 h-5 text-green-400" />
            ) : (
              <WifiOff className="w-5 h-5 text-red-400" />
            )}
            <h3 className="font-medium text-white">WebSocket 状态</h3>
          </div>
          <div className="text-lg font-bold text-white mb-1">
            {connectionStatus.connected ? '已连接' : '未连接'}
          </div>
          <div className="text-sm text-slate-400">
            {messages.length} 消息接收
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Scope-filtered real-time updates
          </div>
        </div>
      </div>

      {/* Quick Role Switch */}
      <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600">
        <div>
          <h3 className="text-white font-medium">快速角色切换 / Quick Role Switch</h3>
          <p className="text-sm text-slate-400 mt-1">
            Demo: Switch to {isDirector ? 'Professor (PIN: 0000)' : 'Director (PIN: 0303)'} role
          </p>
        </div>
        <button
          onClick={handleRoleSwitch}
          disabled={switchingRole}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            isDirector
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-purple-600 hover:bg-purple-700 text-white'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {switchingRole ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              <span>切换中...</span>
            </div>
          ) : (
            <>切换到 {isDirector ? '教授' : '主任'}</>
          )}
        </button>
      </div>

      {/* Data Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-slate-700/20 rounded-lg border border-slate-600">
          <h3 className="text-white font-medium mb-3">📚 可访问教室 / Accessible Classrooms</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">总数:</span>
              <span className="text-white font-medium">{classrooms.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">范围:</span>
              <span className="text-white font-medium">
                {allowedRoomIds === '*' ? '无限制' : '受限制'}
              </span>
            </div>
            {!isDirector && (
              <div className="text-xs text-yellow-400 mt-2">
                🔒 教授只能看到分配的教室
              </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-slate-700/20 rounded-lg border border-slate-600">
          <h3 className="text-white font-medium mb-3">🚨 可见告警 / Visible Alerts</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">总数:</span>
              <span className="text-white font-medium">{alerts.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">新告警:</span>
              <span className="text-white font-medium">
                {alerts.filter(a => a.status === 'new').length}
              </span>
            </div>
            {!isDirector && (
              <div className="text-xs text-yellow-400 mt-2">
                🔒 仅显示可访问教室的告警
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detailed Info */}
      {showDetails && (
        <div className="space-y-4 border-t border-slate-600 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-700/20 rounded-lg border border-slate-600">
              <h4 className="text-white font-medium mb-2">🔑 登录码信息</h4>
              <div className="font-mono text-sm text-slate-300 mb-2">{loginCode}</div>
              <div className="text-xs text-slate-400">
                用于演示的模拟登录码 / Demo login code
              </div>
            </div>

            <div className="p-4 bg-slate-700/20 rounded-lg border border-slate-600">
              <h4 className="text-white font-medium mb-2">📡 最近WebSocket消息</h4>
              <div className="space-y-1 max-h-20 overflow-y-auto">
                {recentMessages.length > 0 ? (
                  recentMessages.map(msg => (
                    <div key={msg.id} className="text-xs text-slate-400">
                      {msg.type}: {msg.payload.classroomId || 'system'}
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-slate-500">No recent messages</div>
                )}
              </div>
            </div>
          </div>

          {allowedRoomIds !== '*' && (
            <div className="p-4 bg-yellow-900/20 border border-yellow-700 rounded-lg">
              <h4 className="text-yellow-200 font-medium mb-2">🔍 RBAC Scope Details</h4>
              <div className="text-sm text-yellow-300">
                Allowed Room IDs: {Array.isArray(allowedRoomIds) ? allowedRoomIds.join(', ') : 'All'}
              </div>
              <div className="text-xs text-yellow-400 mt-1">
                WebSocket events and API calls are filtered by this scope
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}