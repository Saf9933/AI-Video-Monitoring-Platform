import React, { useState } from 'react';
import { 
  Bell, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  Clock, 
  CheckSquare,
  Archive,
  Trash2,
  Settings,
  Volume2,
  VolumeX
} from 'lucide-react';
import { notificationLabels } from '../i18n/notifications';

interface Notification {
  id: string;
  type: 'alert' | 'info' | 'warning' | 'success';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  source: string;
  actionRequired: boolean;
  escalationLevel: number;
}

export default function NotificationsCenter() {
  const [filter, setFilter] = useState('all');
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Mock notifications data with Chinese content
  const notifications: Notification[] = [
    {
      id: 'notif-001',
      type: 'alert',
      title: '紧急安全警报 - 教室3A',
      message: '检测到学生STU-001存在自伤风险。需要立即干预。',
      timestamp: '2024-01-15T14:30:00Z',
      read: false,
      priority: 'urgent',
      source: 'AI监控系统',
      actionRequired: true,
      escalationLevel: 3
    },
    {
      id: 'notif-002',
      type: 'warning',
      title: '升级通知 - 警报ALT-456',
      message: '警报ALT-456因15分钟内无响应已被升级。',
      timestamp: '2024-01-15T14:15:00Z',
      read: false,
      priority: 'high',
      source: '升级系统',
      actionRequired: true,
      escalationLevel: 2
    },
    {
      id: 'notif-003',
      type: 'info',
      title: '系统维护计划',
      message: '计划维护时间：今晚2:00 AM - 4:00 AM。监控将继续使用备用系统。',
      timestamp: '2024-01-15T13:45:00Z',
      read: true,
      priority: 'medium',
      source: '系统管理员',
      actionRequired: false,
      escalationLevel: 0
    },
    {
      id: 'notif-004',
      type: 'success',
      title: '隐私合规更新',
      message: '所有教室现已完全符合FERPA要求。数据编辑策略已成功更新。',
      timestamp: '2024-01-15T12:20:00Z',
      read: true,
      priority: 'low',
      source: '隐私系统',
      actionRequired: false,
      escalationLevel: 0
    },
    {
      id: 'notif-005',
      type: 'alert',
      title: '多个警报 - 计算机室B',
      message: '检测到3名学生存在网络跟踪问题。需要审查。',
      timestamp: '2024-01-15T11:55:00Z',
      read: false,
      priority: 'high',
      source: 'AI监控系统',
      actionRequired: true,
      escalationLevel: 1
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'alert': return <AlertTriangle className="w-5 h-5 text-red-400" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-orange-400" />;
      case 'info': return <Info className="w-5 h-5 text-blue-400" />;
      case 'success': return <CheckCircle className="w-5 h-5 text-green-400" />;
      default: return <Bell className="w-5 h-5 text-slate-400" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return (
          <span className="px-2 py-1 bg-red-900/30 text-red-400 border border-red-700/50 rounded-full text-xs font-medium animate-pulse">
            {notificationLabels.urgent}
          </span>
        );
      case 'high':
        return (
          <span className="px-2 py-1 bg-orange-900/30 text-orange-400 border border-orange-700/50 rounded-full text-xs font-medium">
            {notificationLabels.high}
          </span>
        );
      case 'medium':
        return (
          <span className="px-2 py-1 bg-yellow-900/30 text-yellow-400 border border-yellow-700/50 rounded-full text-xs font-medium">
            {notificationLabels.medium}
          </span>
        );
      case 'low':
        return (
          <span className="px-2 py-1 bg-slate-700/30 text-slate-400 border border-slate-600/50 rounded-full text-xs font-medium">
            {notificationLabels.low}
          </span>
        );
      default:
        return null;
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread': return !notification.read;
      case 'urgent': return notification.priority === 'urgent';
      case 'action_required': return notification.actionRequired;
      default: return true;
    }
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const urgentCount = notifications.filter(n => n.priority === 'urgent').length;
  const actionRequiredCount = notifications.filter(n => n.actionRequired).length;

  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map(n => n.id));
    }
  };

  const handleMarkAsRead = () => {
    console.log('Marking as read:', selectedNotifications);
    setSelectedNotifications([]);
  };

  const handleArchive = () => {
    console.log('Archiving:', selectedNotifications);
    setSelectedNotifications([]);
  };

  const handleDelete = () => {
    console.log('Deleting:', selectedNotifications);
    setSelectedNotifications([]);
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:gap-8">
      {/* Page Header */}
      <div className="rounded-xl bg-slate-800/60 border border-slate-700 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-white">
              {notificationLabels.pageTitle}
              <span className="text-white/60 ml-2 text-lg font-normal">{notificationLabels.pageSubtitle}</span>
            </h1>
            <p className="text-slate-300 mt-1">
              {notificationLabels.pageDescription}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`inline-flex items-center px-3 py-2 border rounded-md text-sm font-medium transition-colors ${
                soundEnabled 
                  ? 'border-blue-700/50 text-blue-400 bg-blue-900/30 hover:bg-blue-900/50' 
                  : 'border-slate-700 text-slate-300 bg-slate-800/60 hover:bg-slate-800'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 mr-2" /> : <VolumeX className="w-4 h-4 mr-2" />}
              {soundEnabled ? notificationLabels.soundOn : notificationLabels.soundOff}
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-slate-700 rounded-md text-sm font-medium text-slate-300 bg-slate-800/60 hover:bg-slate-800 transition-colors">
              <Settings className="w-4 h-4 mr-2" />
              {notificationLabels.settings}
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="rounded-xl bg-slate-800/60 border border-slate-700 p-6">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-blue-900/30 rounded-lg flex items-center justify-center border border-blue-700/50">
              <Bell className="h-6 w-6 text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-100">{notificationLabels.totalNotifications}</p>
              <p className="text-xs text-slate-400">{notificationLabels.totalNotificationsEn}</p>
              <p className="text-2xl font-bold text-white">{notifications.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-slate-800/60 border border-slate-700 p-6">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-red-900/30 rounded-lg flex items-center justify-center border border-red-700/50">
              <AlertTriangle className="h-6 w-6 text-red-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-100">{notificationLabels.unreadNotifications}</p>
              <p className="text-xs text-slate-400">{notificationLabels.unreadNotificationsEn}</p>
              <p className="text-2xl font-bold text-white">{unreadCount}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-slate-800/60 border border-slate-700 p-6">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-orange-900/30 rounded-lg flex items-center justify-center border border-orange-700/50">
              <Clock className="h-6 w-6 text-orange-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-100">{notificationLabels.urgentNotifications}</p>
              <p className="text-xs text-slate-400">{notificationLabels.urgentNotificationsEn}</p>
              <p className="text-2xl font-bold text-white">{urgentCount}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-slate-800/60 border border-slate-700 p-6">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-purple-900/30 rounded-lg flex items-center justify-center border border-purple-700/50">
              <CheckCircle className="h-6 w-6 text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-100">{notificationLabels.actionRequired}</p>
              <p className="text-xs text-slate-400">{notificationLabels.actionRequiredEn}</p>
              <p className="text-2xl font-bold text-white">{actionRequiredCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="rounded-xl bg-slate-800/60 border border-slate-700 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">{notificationLabels.allNotifications}</option>
              <option value="unread">{notificationLabels.unreadOnly}</option>
              <option value="urgent">{notificationLabels.urgentOnly}</option>
              <option value="action_required">{notificationLabels.actionRequiredOnly}</option>
            </select>
            
            {selectedNotifications.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-400">
                  {selectedNotifications.length} {notificationLabels.selected}
                </span>
                <button
                  onClick={handleMarkAsRead}
                  className="inline-flex items-center px-3 py-1 border border-slate-700 rounded text-xs font-medium text-slate-300 bg-slate-800/60 hover:bg-slate-800 transition-colors"
                >
                  <CheckSquare className="w-3 h-3 mr-1" />
                  {notificationLabels.markAsRead}
                </button>
                <button
                  onClick={handleArchive}
                  className="inline-flex items-center px-3 py-1 border border-slate-700 rounded text-xs font-medium text-slate-300 bg-slate-800/60 hover:bg-slate-800 transition-colors"
                >
                  <Archive className="w-3 h-3 mr-1" />
                  {notificationLabels.archive}
                </button>
                <button
                  onClick={handleDelete}
                  className="inline-flex items-center px-3 py-1 border border-red-700/50 rounded text-xs font-medium text-red-400 bg-red-900/30 hover:bg-red-900/50 transition-colors"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  {notificationLabels.delete}
                </button>
              </div>
            )}
          </div>
          
          <button
            onClick={handleSelectAll}
            className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            {selectedNotifications.length === filteredNotifications.length ? notificationLabels.deselectAll : notificationLabels.selectAll}
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="rounded-xl bg-slate-800/60 border border-slate-700 overflow-hidden">
        <div className="divide-y divide-slate-600">
          {filteredNotifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`p-6 hover:bg-slate-800/60 transition-colors ${
                !notification.read ? 'bg-slate-800/30 border-l-4 border-l-emerald-400' : ''
              }`}
            >
              <div className="flex items-start space-x-4">
                <input
                  type="checkbox"
                  checked={selectedNotifications.includes(notification.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedNotifications([...selectedNotifications, notification.id]);
                    } else {
                      setSelectedNotifications(selectedNotifications.filter(id => id !== notification.id));
                    }
                  }}
                  className="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-600 rounded bg-slate-900 accent-emerald-600"
                />
                
                <div className="mt-1">
                  {getTypeIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <h3 className={`text-sm font-medium ${!notification.read ? 'text-white' : 'text-slate-100'}`}>
                        {notification.title}
                      </h3>
                      {getPriorityBadge(notification.priority)}
                      {notification.actionRequired && (
                        <span className="px-2 py-1 bg-purple-900/30 text-purple-400 border border-purple-700/50 rounded-full text-xs font-medium">
                          {notificationLabels.actionRequired}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400">
                      {new Date(notification.timestamp).toLocaleString('zh-CN')}
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-300 mb-3">{notification.message}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs text-slate-400">
                      <span>{notificationLabels.source}: {notification.source}</span>
                      {notification.escalationLevel > 0 && (
                        <span className="text-orange-400 font-medium">
                          {notificationLabels.escalationLevel}: {notification.escalationLevel}
                        </span>
                      )}
                    </div>
                    
                    {notification.actionRequired && (
                      <button className="inline-flex items-center px-3 py-1 border border-emerald-700/50 rounded text-xs font-medium text-emerald-400 bg-emerald-900/30 hover:bg-emerald-900/50 transition-colors">
                        {notificationLabels.takeAction}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredNotifications.length === 0 && (
          <div className="text-center py-12">
            <Bell className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-2 text-sm font-medium text-white">{notificationLabels.noNotificationsFound}</h3>
            <p className="mt-1 text-sm text-slate-400">
              {filter === 'all' 
                ? notificationLabels.allCaughtUp
                : notificationLabels.noMatchingFilter}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}