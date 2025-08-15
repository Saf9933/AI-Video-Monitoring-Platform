import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Users, 
  Heart, 
  MessageSquare, 
  Monitor,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  MoreVertical,
  Filter,
  Download,
  Clock,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { text, colors, transitions } from '../../styles/tokens';
import { useScenarioCounts } from '../../hooks/useScenarioCounts';
import type { AlertType } from '../../types/api';

interface Scenario {
  id: AlertType;
  name_cn: string;
  name_en: string;
  icon: string;
  count: number;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

interface ScenarioCardsProps {
  scenarios?: Scenario[];
  density?: 'normal' | 'compact';
}

interface QuickFilter {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  action: (scenarioId: AlertType) => void;
}

const scenarioIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  exam_pressure: BookOpen,
  isolation_bullying: Users,
  self_harm: Heart,
  teacher_verbal_abuse: MessageSquare,
  cyber_tracking: Monitor,
};

const scenarioLabels: Record<AlertType, { name_cn: string; name_en: string }> = {
  exam_pressure: { name_cn: '考试压力', name_en: 'Exam Pressure' },
  isolation_bullying: { name_cn: '孤立霸凌', name_en: 'Isolation Bullying' },
  self_harm: { name_cn: '自伤行为', name_en: 'Self Harm' },
  teacher_verbal_abuse: { name_cn: '教师言语暴力', name_en: 'Teacher Verbal Abuse' },
  cyber_tracking: { name_cn: '网络跟踪', name_en: 'Cyber Tracking' },
};

const riskLevels: Record<AlertType, 'low' | 'medium' | 'high' | 'critical'> = {
  exam_pressure: 'medium',
  isolation_bullying: 'high',
  self_harm: 'critical',
  teacher_verbal_abuse: 'high',
  cyber_tracking: 'medium',
};

export default function ScenarioCards({ scenarios = [], density = 'normal' }: ScenarioCardsProps) {
  const { scenarioCounts, isLoading, error, refetch } = useScenarioCounts();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const menuRefs = useRef<Record<string, HTMLDivElement | null>>({});
  
  // Compact density styles
  const isCompact = density === 'compact';
  const containerPadding = isCompact ? 'p-4 md:p-5' : 'p-6';
  const titleSize = isCompact ? 'text-lg md:text-xl font-semibold' : text.h2;
  const cardPadding = isCompact ? 'p-4' : 'p-6';
  
  // Quick filter actions
  const handleUnresolvedFilter = (scenarioId: AlertType) => {
    // Navigate to alerts page with unresolved filter
    window.location.href = `/alerts?scenario=${scenarioId}&status=new,acknowledged,in_progress`;
    setOpenMenuId(null);
  };
  
  const handleRecentFilter = (scenarioId: AlertType) => {
    // Navigate to alerts page with 7-day filter
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    window.location.href = `/alerts?scenario=${scenarioId}&start_date=${sevenDaysAgo.toISOString()}`;
    setOpenMenuId(null);
  };
  
  const handleExport = (scenarioId: AlertType) => {
    // For now, show alert - in real implementation would trigger export
    alert(`导出 ${scenarioLabels[scenarioId].name_cn} 数据功能开发中...`);
    setOpenMenuId(null);
  };
  
  const quickFilters: QuickFilter[] = [
    {
      id: 'unresolved',
      label: '未处理',
      icon: Filter,
      action: handleUnresolvedFilter,
    },
    {
      id: 'recent',
      label: '最近7天',
      icon: Clock,
      action: handleRecentFilter,
    },
    {
      id: 'export',
      label: '导出',
      icon: Download,
      action: handleExport,
    },
  ];
  
  // Merge API data with fallback scenario data
  const displayScenarios = scenarioCounts.length > 0 
    ? scenarioCounts.map(apiData => ({
        id: apiData.id,
        name_cn: scenarioLabels[apiData.id].name_cn,
        name_en: scenarioLabels[apiData.id].name_en,
        icon: apiData.id,
        count: apiData.count,
        trend: 'stable' as const,
        trendValue: 0,
        riskLevel: riskLevels[apiData.id],
      }))
    : scenarios.length > 0 
      ? scenarios.filter(scenario => 
          ['exam_pressure', 'isolation_bullying', 'self_harm', 'teacher_verbal_abuse', 'cyber_tracking']
            .includes(scenario.id as AlertType)
        )
      : // If no data from either source, show loading or empty state
        [];
  
  // Handle click outside to close menus
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenuId && menuRefs.current[openMenuId] && 
          !menuRefs.current[openMenuId]?.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenuId]);
  
  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent, scenario: Scenario) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      window.location.href = `/alerts?scenario=${scenario.id}`;
    }
  };
  
  const toggleMenu = (scenarioId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setOpenMenuId(openMenuId === scenarioId ? null : scenarioId);
  };
  const getRiskBackground = (level: string) => {
    switch (level) {
      case 'critical': return 'border-red-500/40 bg-red-500/10';
      case 'high': return 'border-orange-400/40 bg-orange-400/10';
      case 'medium': return 'border-yellow-400/30 bg-yellow-400/10';
      case 'low': return 'border-green-400/30 bg-green-400/10';
      default: return 'border-slate-700 bg-slate-800/50';
    }
  };

  const getRiskDotColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-400 shadow-lg shadow-red-400/50 animate-pulse';
      case 'high': return 'bg-orange-400 shadow-lg shadow-orange-400/50';
      case 'medium': return 'bg-yellow-400 shadow-lg shadow-yellow-400/50';
      case 'low': return 'bg-green-400 shadow-lg shadow-green-400/50';
      default: return 'bg-gray-400 shadow-lg shadow-gray-400/50';
    }
  };

  const getRiskTextColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-300 font-bold';
      case 'high': return 'text-orange-300 font-semibold';
      case 'medium': return 'text-yellow-300 font-semibold';
      case 'low': return 'text-green-300 font-semibold';
      default: return 'text-gray-300 font-semibold';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return TrendingUp;
      case 'down': return TrendingDown;
      case 'stable': return ArrowRight;
      default: return ArrowRight;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-red-400/80';
      case 'down': return 'text-green-400/80';
      case 'stable': return 'text-gray-400/80';
      default: return 'text-gray-400/80';
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div>
        <div className="mb-4">
          <h2 className={text.h2}>核心安全场景监控</h2>
          <p className={text.bodyMuted}>Core Safety Scenario Monitoring</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 lg:gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`rounded-lg border ${colors.borderCard} ${colors.bgCard} p-3 h-full`}>
              <div className="flex items-center justify-between mb-3">
                <div className="w-5 h-5 bg-slate-600 animate-pulse rounded"></div>
                <div className="w-2.5 h-2.5 bg-slate-600 animate-pulse rounded-full"></div>
              </div>
              <div className="mb-3 space-y-2">
                <div className="w-20 h-4 bg-slate-600 animate-pulse rounded"></div>
                <div className="w-16 h-3 bg-slate-700 animate-pulse rounded"></div>
              </div>
              <div className="flex items-end justify-between">
                <div className="w-8 h-6 bg-slate-600 animate-pulse rounded"></div>
                <div className="w-12 h-4 bg-slate-700 animate-pulse rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div>
        <div className="mb-4">
          <h2 className={text.h2}>核心安全场景监控</h2>
          <p className={text.bodyMuted}>Core Safety Scenario Monitoring</p>
        </div>
        <div className={`rounded-lg border border-red-500/40 bg-red-500/10 p-6 text-center`}>
          <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <h3 className="text-red-300 font-semibold mb-1">加载失败</h3>
          <p className="text-red-400 text-sm mb-3">无法加载场景数据</p>
          <button
            onClick={() => refetch()}
            className={`inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 ${transitions.default}`}
          >
            <RefreshCw className="w-4 h-4" />
            重试
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-full">
      <div className={`mb-4 md:mb-5`}>
        <h2 className="text-lg md:text-xl font-semibold text-white">核心安全场景监控</h2>
        <p className="text-xs md:text-sm text-slate-300">Core Safety Scenario Monitoring</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 lg:gap-4">
        {Array.isArray(displayScenarios) && displayScenarios.map((scenario) => {
          const IconComponent = scenarioIcons[scenario.id] || BookOpen;
          const TrendIconComponent = getTrendIcon(scenario.trend);
          
          return (
            <Link
              key={scenario.id}
              to={`/alerts?scenario=${scenario.id}`}
              className={`group block rounded-lg border ${transitions.default} hover:shadow-md hover:scale-[1.01] transform focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-950 relative ${getRiskBackground(scenario.riskLevel)}`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => handleKeyDown(e, scenario)}
              onMouseEnter={() => setShowTooltip(scenario.id)}
              onMouseLeave={() => setShowTooltip(null)}
              onFocus={() => setShowTooltip(scenario.id)}
              onBlur={() => setShowTooltip(null)}
              aria-label={`查看 ${scenario.name_cn} 相关预警，当前有 ${scenario.count} 条记录`}
            >
              {/* Tooltip */}
              {showTooltip === scenario.id && (
                <div className="absolute z-50 px-3 py-2 -mt-12 ml-4 text-sm bg-slate-800 text-slate-100 rounded-lg shadow-lg border border-slate-600 whitespace-nowrap pointer-events-none">
                  点击查看 {scenario.name_cn} 预警详情
                  <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800"></div>
                </div>
              )}
              <div className={`${cardPadding} h-full flex flex-col relative`}>
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className={colors.textSecondary}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getRiskDotColor(scenario.riskLevel)}`}></div>
                    {/* Kebab menu */}
                    <div className="relative" ref={(el) => menuRefs.current[scenario.id] = el}>
                      <button
                        onClick={(e) => toggleMenu(scenario.id, e)}
                        className={`p-1 rounded hover:bg-slate-700/30 ${transitions.default} opacity-0 group-hover:opacity-100 focus:opacity-100`}
                        aria-label="快速操作"
                        tabIndex={0}
                      >
                        <MoreVertical className="w-3 h-3 text-slate-400" />
                      </button>
                      
                      {/* Dropdown menu */}
                      {openMenuId === scenario.id && (
                        <div className="absolute right-0 top-8 z-10 w-28 bg-slate-800 border border-slate-600 rounded-lg shadow-lg py-1">
                          {quickFilters.map((filter) => {
                            const FilterIcon = filter.icon;
                            return (
                              <button
                                key={filter.id}
                                onClick={() => filter.action(scenario.id as AlertType)}
                                className="w-full px-3 py-2 text-left text-xs text-slate-200 hover:bg-slate-700 flex items-center gap-2 transition-colors"
                              >
                                <FilterIcon className="w-3 h-3" />
                                {filter.label}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Title */}
                <div className="mb-2">
                  <h3 className={isCompact ? 'text-sm font-semibold text-slate-200' : text.h4}>{scenario.name_cn}</h3>
                  <p className={isCompact ? 'text-xs text-slate-400' : text.labelMuted}>{scenario.name_en}</p>
                </div>
                
                {/* Count */}
                <div className="flex items-end justify-between flex-1">
                  <div className="flex-1">
                    <div className={isCompact ? 'text-2xl md:text-3xl font-bold text-slate-100' : text.metric}>{scenario.count}</div>
                    <div className={`${isCompact ? 'text-xs text-slate-400' : text.labelMuted} font-bold tracking-wider uppercase ${getRiskTextColor(scenario.riskLevel)}`}>
                      {scenario.riskLevel}
                    </div>
                  </div>
                  
                  {/* Trend */}
                  <div className="text-right flex-shrink-0">
                    <div className={`flex items-center justify-end ${getTrendColor(scenario.trend)}`}>
                      <TrendIconComponent className="w-4 h-4" />
                      <span className="text-xs font-bold ml-1">{scenario.trendValue}%</span>
                    </div>
                    <div className="text-gray-400 text-[10px] mt-1 font-medium">vs 上月</div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}