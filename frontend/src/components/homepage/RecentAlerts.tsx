import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { text, cardBase, sectionTitle, iconSizes, layouts } from '../../styles/tokens';

interface AlertItem {
  id: string;
  type: string;
  type_cn: string;
  icon: string;
  classroom: string;
  timestamp: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'new' | 'acknowledged' | 'resolved';
  riskScore: number;
}

interface RecentAlertsProps {
  alerts?: AlertItem[];
  density?: 'normal' | 'compact';
}

export default function RecentAlerts({ alerts = [], density = 'normal' }: RecentAlertsProps) {
  // Compact density styles
  const isCompact = density === 'compact';
  const containerPadding = isCompact ? 'p-4 md:p-5' : layouts.tightPadding;
  const titleSize = isCompact ? 'text-lg md:text-xl font-semibold' : sectionTitle;
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-200 bg-red-800/80 border-red-600';
      case 'high': return 'text-orange-200 bg-orange-800/80 border-orange-600';
      case 'medium': return 'text-yellow-200 bg-yellow-800/80 border-yellow-600';
      case 'low': return 'text-blue-200 bg-blue-800/80 border-blue-600';
      default: return 'text-gray-200 bg-gray-800/80 border-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'text-red-200 bg-red-800/80 border-red-600';
      case 'acknowledged': return 'text-yellow-200 bg-yellow-800/80 border-yellow-600';
      case 'resolved': return 'text-green-200 bg-green-800/80 border-green-600';
      default: return 'text-gray-200 bg-gray-800/80 border-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'new': return '新建';
      case 'acknowledged': return '已确认';
      case 'resolved': return '已解决';
      default: return status;
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const alertTime = new Date(timestamp);
    const diffMs = now.getTime() - alertTime.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return '刚刚';
    if (diffMinutes < 60) return `${diffMinutes}分钟前`;
    if (diffHours < 24) return `${diffHours}小时前`;
    return `${diffDays}天前`;
  };

  // Limit to 5 alerts for homepage
  const displayAlerts = alerts.slice(0, 5);

  return (
    <div className={`${cardBase} h-full flex flex-col`}>
      <div className={`${containerPadding} border-b border-gray-600`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg md:text-xl font-semibold text-white">最新预警</h3>
            <p className="text-xs md:text-sm text-slate-300">Latest Security Alerts</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs md:text-sm text-slate-300 font-medium">实时</span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto max-h-[520px] divide-y divide-gray-600">
        {Array.isArray(displayAlerts) && displayAlerts.length > 0 ? (
          displayAlerts.map((alert) => (
            <div key={alert.id} className={`${layouts.tightPadding} hover:bg-gray-700/30 transition-all duration-300`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  {/* Icon - replaced emoji with Lucide icon */}
                  <div className="text-slate-400 mt-1">
                    <AlertTriangle className={iconSizes.sm} />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className={`${text.h4} font-medium`}>{alert.type_cn}</h4>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${getPriorityColor(alert.priority)}`}>
                        {alert.priority.toUpperCase()}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${getStatusColor(alert.status)}`}>
                        {getStatusText(alert.status)}
                      </span>
                    </div>
                    
                    <div className={`${text.body} mb-1`}>
                      <span className="font-medium text-gray-200">{alert.classroom}</span>
                      <span className="mx-2 text-gray-500">•</span>
                      <span>风险: <span className="font-semibold text-orange-300">{(alert.riskScore * 100).toFixed(1)}%</span></span>
                    </div>
                    
                    <div className="text-xs md:text-sm text-gray-400">
                      {formatTimeAgo(alert.timestamp)}
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                {alert.status === 'new' && (
                  <div className="flex space-x-2 ml-3">
                    <button className="px-2 py-1 bg-yellow-600 text-yellow-100 rounded text-xs font-medium hover:bg-yellow-500 transition-colors">
                      确认
                    </button>
                    <button className="px-2 py-1 bg-green-600 text-green-100 rounded text-xs font-medium hover:bg-green-500 transition-colors">
                      解决
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center flex-1 flex flex-col items-center justify-center">
            <AlertTriangle className={`${iconSizes.xl} text-gray-500 mb-3`} />
            <h3 className={`${text.h3} mb-2`}>暂无预警</h3>
            <p className="text-sm text-slate-300">系统运行正常</p>
          </div>
        )}
      </div>
      
      {alerts.length > 5 && (
        <div className="px-3 py-2 border-t border-gray-600 text-center bg-gray-700/30">
          <button className="text-blue-300 hover:text-blue-200 text-sm font-medium transition-colors">
            查看全部 {alerts.length} 条预警 →
          </button>
        </div>
      )}
    </div>
  );
}