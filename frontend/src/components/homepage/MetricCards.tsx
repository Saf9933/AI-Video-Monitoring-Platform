import React from 'react';
import { 
  Clock, 
  Activity, 
  Target, 
  Zap,
  FileText,
  Bell,
  Shield,
  Settings,
  TrendingUp,
  TrendingDown,
  ArrowRight
} from 'lucide-react';
import { text, cardBase, sectionTitle, kpiNumber, iconSizes, layouts } from '../../styles/tokens';

interface Metric {
  id: string;
  title: string;
  title_cn: string;
  value: string;
  change: number;
  changeType: 'increase' | 'decrease' | 'stable';
  icon: string;
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
}

interface MetricCardsProps {
  metrics?: Metric[];
  density?: 'normal' | 'compact';
}

const metricIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  response_time: Clock,
  accuracy: Target,
  processing: Activity,
  throughput: Zap,
};

export default function MetricCards({ metrics = [], density = 'normal' }: MetricCardsProps) {
  // Compact density styles
  const isCompact = density === 'compact';
  const containerPadding = isCompact ? 'p-4 md:p-5' : layouts.tightPadding;
  const titleSize = isCompact ? 'text-lg md:text-xl font-semibold' : sectionTitle;
  const cardHeight = isCompact ? 'h-[180px] md:h-[200px]' : 'h-auto';
  
  const getIconBackgroundColor = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-500/10';
      case 'green': return 'bg-green-500/10';
      case 'yellow': return 'bg-yellow-500/10';
      case 'red': return 'bg-red-500/10';
      case 'purple': return 'bg-purple-500/10';
      default: return 'bg-gray-500/10';
    }
  };

  const getBorderColor = (color: string) => {
    switch (color) {
      case 'blue': return 'border-blue-500/20';
      case 'green': return 'border-green-500/20';
      case 'yellow': return 'border-yellow-500/20';
      case 'red': return 'border-red-500/20';
      case 'purple': return 'border-purple-500/20';
      default: return 'border-gray-500/20';
    }
  };

  const getIconColor = (color: string) => {
    switch (color) {
      case 'blue': return 'text-blue-400/80';
      case 'green': return 'text-green-400/80';
      case 'yellow': return 'text-yellow-400/80';
      case 'red': return 'text-red-400/80';
      case 'purple': return 'text-purple-400/80';
      default: return 'text-gray-400/80';
    }
  };

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'increase': return 'text-red-400/80';
      case 'decrease': return 'text-green-400/80';
      case 'stable': return 'text-gray-400/80';
      default: return 'text-gray-400/80';
    }
  };

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'increase': return TrendingUp;
      case 'decrease': return TrendingDown;
      case 'stable': return ArrowRight;
      default: return ArrowRight;
    }
  };

  return (
    <div className="h-full flex flex-col gap-6">
      {/* Key Metrics */}
      <div className={`${cardBase} ${cardHeight} flex flex-col`}>
        <div className={containerPadding}>
          <div className="mb-4 md:mb-5">
            <h3 className="text-lg md:text-xl font-semibold text-white">关键指标</h3>
            <p className="text-xs md:text-sm text-slate-300">Key Performance Metrics</p>
          </div>
          
          <div className="flex-1 overflow-hidden">
            <div className={layouts.compactSpacing}>
              {Array.isArray(metrics) && metrics.map((metric) => {
                const IconComponent = metricIcons[metric.id] || Activity;
                const ChangeIconComponent = getChangeIcon(metric.changeType);
                
                return (
                  <div key={metric.id} className={`${cardBase} border ${layouts.tightPadding} hover:bg-slate-900/70 transition-all duration-300 ${getBorderColor(metric.color)}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className={`w-8 h-8 rounded-lg ${getIconBackgroundColor(metric.color)} flex items-center justify-center`}>
                        <IconComponent className={`${iconSizes.sm} ${getIconColor(metric.color)}`} />
                      </div>
                      <div className={`text-xs ${getChangeColor(metric.changeType)} flex items-center bg-gray-700/50 rounded px-2 py-1`}>
                        <ChangeIconComponent className={iconSizes.xs} />
                        <span className="ml-1 font-bold">{Math.abs(metric.change)}%</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className={isCompact ? 'text-2xl md:text-3xl font-bold text-slate-100' : kpiNumber}>{metric.value}</div>
                      <div className={text.h4}>{metric.title_cn}</div>
                      <div className="text-xs md:text-sm text-slate-300">{metric.title}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
        
      {/* System Status Card */}
      <div className={`${cardBase} ${cardHeight} flex flex-col`}>
        <div className={containerPadding}>
          <h4 className="text-lg md:text-xl font-semibold text-white">系统状态</h4>
          <div className={`${layouts.compactSpacing} mt-4 flex-1`}>
            <div className="flex items-center justify-between py-1">
              <span className={text.body}>API 响应</span>
              <span className="text-green-300 font-semibold text-sm">2.3s</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className={text.body}>系统可用性</span>
              <span className="text-green-300 font-semibold text-sm">94.2%</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className={text.body}>隐私合规</span>
              <span className="text-green-300 font-semibold text-sm">100%</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className={text.body}>在线教室</span>
              <span className="text-blue-300 font-semibold text-sm">24/25</span>
            </div>
          </div>
        </div>
      </div>
        
      {/* Quick Actions */}
      <div className={`${cardBase} ${cardHeight} flex flex-col`}>
        <div className={containerPadding}>
          <h4 className="text-lg md:text-xl font-semibold text-white">快速操作</h4>
          <div className="space-y-1 mt-4 flex-1 overflow-hidden">
            <button className="w-full text-left px-3 py-2 text-sm text-gray-200 hover:bg-gray-600/50 hover:text-white rounded-md transition-all duration-200 flex items-center group">
              <FileText className={`${iconSizes.sm} mr-2 group-hover:scale-105 transition-transform`} />
              <span className="font-medium">生成报告</span>
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-gray-200 hover:bg-gray-600/50 hover:text-white rounded-md transition-all duration-200 flex items-center group">
              <Bell className={`${iconSizes.sm} mr-2 group-hover:scale-105 transition-transform`} />
              <span className="font-medium">设置预警</span>
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-gray-200 hover:bg-gray-600/50 hover:text-white rounded-md transition-all duration-200 flex items-center group">
              <Shield className={`${iconSizes.sm} mr-2 group-hover:scale-105 transition-transform`} />
              <span className="font-medium">隐私审查</span>
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-gray-200 hover:bg-gray-600/50 hover:text-white rounded-md transition-all duration-200 flex items-center group">
              <Settings className={`${iconSizes.sm} mr-2 group-hover:scale-105 transition-transform`} />
              <span className="font-medium">系统设置</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}