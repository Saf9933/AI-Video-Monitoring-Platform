// Classroom Directory - Virtualized grid/table for 1000+ classrooms
// Features: search, filters, batch operations, RBAC integration

import React, { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useVirtualizer } from '@tanstack/react-virtual';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Monitor,
  Activity,
  AlertTriangle,
  Clock,
  Wifi,
  WifiOff,
  TrendingUp,
  TrendingDown,
  School,
  Users,
  ChevronDown,
  MoreHorizontal,
  CheckCircle
} from 'lucide-react';

import { useClassrooms } from '../../data/classrooms/hooks';
import { useRBAC, RoleGuard, useClassroomAccess } from '../../components/rbac/RBACProvider';
import { Classroom, ClassroomFilter } from '../../data/classrooms/types';
import { theme } from '../../styles/theme';

// Classroom status configuration
const statusConfig = {
  online: { 
    icon: Wifi, 
    color: 'text-emerald-400', 
    bgColor: 'bg-emerald-500/20',
    label: '在线'
  },
  offline: { 
    icon: WifiOff, 
    color: 'text-red-400', 
    bgColor: 'bg-red-500/20',
    label: '离线'
  },
  warning: { 
    icon: AlertTriangle, 
    color: 'text-yellow-400', 
    bgColor: 'bg-yellow-500/20',
    label: '警告'
  },
  error: { 
    icon: AlertTriangle, 
    color: 'text-red-400', 
    bgColor: 'bg-red-500/20',
    label: '错误'
  }
};

// Trend sparkline component
interface TrendSparklineProps {
  data: Array<{ timestamp: string; value: number; }>;
  color?: string;
  height?: number;
}

function TrendSparkline({ data, color = '#4ade80', height = 24 }: TrendSparklineProps) {
  if (!data || data.length === 0) return null;

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;

  const points = data.map((point, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = ((maxValue - point.value) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width="60" height={height} className="opacity-80">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

// Classroom row component
interface ClassroomRowProps {
  classroom: Classroom;
  index: number;
  onSelect: (classroom: Classroom) => void;
  isSelected: boolean;
  canAccess: boolean;
}

function ClassroomRow({ classroom, index, onSelect, isSelected, canAccess }: ClassroomRowProps) {
  const { t } = useTranslation();
  const status = statusConfig[classroom.status];
  const StatusIcon = status.icon;

  const handleRowClick = () => {
    if (canAccess) {
      onSelect(classroom);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2, delay: index * 0.02 }}
      className={`grid grid-cols-12 gap-4 p-4 border-b border-slate-700/50 hover:bg-slate-800/30 transition-all duration-200 cursor-pointer group ${
        isSelected ? 'bg-blue-500/10 border-blue-500/30' : ''
      } ${canAccess ? '' : 'opacity-50'}`}
      onClick={handleRowClick}
    >
      {/* Selection Checkbox */}
      <div className="col-span-1 flex items-center">
        <div className={`w-4 h-4 rounded border-2 transition-colors ${
          isSelected 
            ? 'bg-blue-500 border-blue-500' 
            : 'border-slate-500 group-hover:border-slate-400'
        }`}>
          {isSelected && (
            <CheckCircle className="w-4 h-4 text-white" />
          )}
        </div>
      </div>

      {/* Name & Location */}
      <div className="col-span-3 min-w-0">
        <div className="flex items-center space-x-2">
          <School className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <div className="min-w-0">
            <div className="font-medium text-white truncate">{classroom.name}</div>
            <div className="text-xs text-slate-400 truncate">{classroom.location}</div>
          </div>
        </div>
      </div>

      {/* School & Department */}
      <div className="col-span-2 min-w-0">
        <div className="text-sm text-white truncate">{classroom.school}</div>
        <div className="text-xs text-slate-400 truncate">{classroom.department}</div>
      </div>

      {/* Instructor */}
      <div className="col-span-2 min-w-0">
        <div className="flex items-center space-x-2">
          <Users className="w-3 h-3 text-slate-400" />
          <span className="text-sm text-white truncate">{classroom.instructor}</span>
        </div>
      </div>

      {/* Status */}
      <div className="col-span-1 flex items-center">
        <div className={`flex items-center space-x-2 px-2 py-1 rounded-lg ${status.bgColor}`}>
          <StatusIcon className={`w-3 h-3 ${status.color}`} />
          <span className={`text-xs font-medium ${status.color}`}>
            {status.label}
          </span>
        </div>
      </div>

      {/* Last Event */}
      <div className="col-span-1 flex items-center">
        <div className="flex items-center space-x-1 text-xs text-slate-400">
          <Clock className="w-3 h-3" />
          <span>
            {new Date(classroom.lastEventTime).toLocaleTimeString('zh-CN', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        </div>
      </div>

      {/* Trends */}
      <div className="col-span-1 flex items-center">
        <div className="space-y-1">
          <TrendSparkline 
            data={classroom.recentTrends.stress} 
            color="#f87171" 
            height={16}
          />
          <TrendSparkline 
            data={classroom.recentTrends.isolation} 
            color="#60a5fa" 
            height={16}
          />
        </div>
      </div>

      {/* Device Health */}
      <div className="col-span-1 flex items-center justify-center">
        <div className="text-center">
          <div className={`w-2 h-2 rounded-full mb-1 ${
            classroom.deviceHealth.heartbeat === 'healthy' 
              ? 'bg-emerald-400' 
              : classroom.deviceHealth.heartbeat === 'degraded'
              ? 'bg-yellow-400'
              : 'bg-red-400'
          }`} />
          <div className="text-xs text-slate-400">
            {classroom.deviceHealth.streamLatency}ms
          </div>
        </div>
      </div>

      {/* 24h Alert Count */}
      <div className="col-span-1 flex items-center justify-center">
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
          classroom.alert24hCount > 10 
            ? 'bg-red-500/20 text-red-400'
            : classroom.alert24hCount > 5
            ? 'bg-yellow-500/20 text-yellow-400'
            : 'bg-slate-700 text-slate-300'
        }`}>
          {classroom.alert24hCount}
        </div>
      </div>
    </motion.div>
  );
}

// Main Classroom Directory component
export default function ClassroomDirectory() {
  const { t } = useTranslation();
  const { currentRole } = useRBAC();
  const { canAccessClassroom, getAccessibleClassrooms } = useClassroomAccess();
  
  // State
  const [filters, setFilters] = useState<ClassroomFilter>({});
  const [selectedClassrooms, setSelectedClassrooms] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  // Apply RBAC filtering to base filter
  const rbacFilters = useMemo(() => {
    const accessibleClassrooms = getAccessibleClassrooms();
    if (accessibleClassrooms === 'all') {
      return filters;
    } else {
      return {
        ...filters,
        // Add classroom ID filter for professors
        search: searchTerm || undefined
      };
    }
  }, [filters, searchTerm, getAccessibleClassrooms]);

  // Fetch classrooms data
  const { data: classroomsResponse, isLoading, error } = useClassrooms(
    rbacFilters, 
    { page: 1, limit: 1500 } // Load more for demo
  );

  // Filter classrooms based on RBAC
  const accessibleClassrooms = useMemo(() => {
    if (!classroomsResponse?.data) return [];
    
    return classroomsResponse.data.filter(classroom => {
      const hasAccess = canAccessClassroom(classroom.id);
      
      // Apply search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          classroom.name.toLowerCase().includes(searchLower) ||
          classroom.school.toLowerCase().includes(searchLower) ||
          classroom.department.toLowerCase().includes(searchLower) ||
          classroom.instructor.toLowerCase().includes(searchLower);
        
        return hasAccess && matchesSearch;
      }
      
      return hasAccess;
    });
  }, [classroomsResponse?.data, canAccessClassroom, searchTerm]);

  // Virtual scrolling setup
  const parentRef = React.useRef<HTMLDivElement>(null);
  
  const virtualizer = useVirtualizer({
    count: accessibleClassrooms.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80,
    overscan: 10,
  });

  // Handlers
  const handleSelectClassroom = useCallback((classroom: Classroom) => {
    // Navigate to classroom detail
    console.log('Navigate to classroom:', classroom.id);
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedClassrooms.length === accessibleClassrooms.length) {
      setSelectedClassrooms([]);
    } else {
      setSelectedClassrooms(accessibleClassrooms.map(c => c.id));
    }
  }, [selectedClassrooms.length, accessibleClassrooms]);

  const handleClassroomSelection = useCallback((classroomId: string) => {
    setSelectedClassrooms(prev => 
      prev.includes(classroomId)
        ? prev.filter(id => id !== classroomId)
        : [...prev, classroomId]
    );
  }, []);

  // Batch operations
  const handleBatchOperation = useCallback((operation: string) => {
    console.log(`Batch operation: ${operation} on`, selectedClassrooms);
    // Implement batch operations
  }, [selectedClassrooms]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-emerald-400 border-t-transparent mb-4" />
          <div className="text-white font-medium">{t('common.loading')}</div>
          <div className="text-slate-400 text-sm">正在加载教室数据...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-white font-medium">{t('classrooms.directory.title')}</div>
          <div className="text-slate-400 mt-1">{t('classrooms.directory.subtitle')}</div>
        </div>
        <div className="flex items-center space-x-3">
          <RoleGuard permission="exportAuditLogs">
            <button className="flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              <span>{t('common.export')}</span>
            </button>
          </RoleGuard>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('classrooms.directory.searchPlaceholder')}
            className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20 transition-all"
          />
        </div>

        {/* Quick Filters & Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-sm text-slate-300">
              显示 <span className="font-medium text-white">{accessibleClassrooms.length}</span> 个教室
              {currentRole === 'professor' && (
                <span className="text-slate-400 ml-1">(您的分配教室)</span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Batch Operations */}
            {selectedClassrooms.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center space-x-2"
              >
                <span className="text-sm text-slate-300">
                  已选择 {selectedClassrooms.length} 个
                </span>
                <div className="flex items-center space-x-1">
                  <button 
                    onClick={() => handleBatchOperation('subscribe')}
                    className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                  >
                    订阅告警
                  </button>
                  <button 
                    onClick={() => handleBatchOperation('monitor')}
                    className="px-3 py-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors"
                  >
                    监控墙
                  </button>
                </div>
              </motion.div>
            )}

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${
                showFilters 
                  ? 'bg-slate-700 border-slate-600 text-white' 
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>{t('common.filter')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table Header */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-slate-700/50 text-sm font-medium text-slate-300">
          <div className="col-span-1 flex items-center">
            <input
              type="checkbox"
              checked={selectedClassrooms.length === accessibleClassrooms.length && accessibleClassrooms.length > 0}
              onChange={handleSelectAll}
              className="w-4 h-4 rounded border-slate-500 bg-slate-700 text-blue-500 focus:ring-blue-500/20"
            />
          </div>
          <div className="col-span-3">教室名称</div>
          <div className="col-span-2">学校/院系</div>
          <div className="col-span-2">主讲教师</div>
          <div className="col-span-1">状态</div>
          <div className="col-span-1">最近事件</div>
          <div className="col-span-1">趋势图</div>
          <div className="col-span-1">设备健康</div>
          <div className="col-span-1 text-center">24h告警</div>
        </div>

        {/* Virtual Scrolling Container */}
        <div 
          ref={parentRef}
          style={{ height: '600px', overflow: 'auto' }}
          className="relative"
        >
          <div 
            style={{ 
              height: `${virtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {virtualizer.getVirtualItems().map((virtualItem) => {
              const classroom = accessibleClassrooms[virtualItem.index];
              return (
                <div
                  key={virtualItem.key}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${virtualItem.size}px`,
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                >
                  <ClassroomRow
                    classroom={classroom}
                    index={virtualItem.index}
                    onSelect={handleSelectClassroom}
                    isSelected={selectedClassrooms.includes(classroom.id)}
                    canAccess={canAccessClassroom(classroom.id)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Empty State */}
      {accessibleClassrooms.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-700 rounded-xl flex items-center justify-center mx-auto mb-4">
            <School className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">未找到教室</h3>
          <p className="text-slate-400">
            {searchTerm 
              ? '请尝试调整搜索条件'
              : currentRole === 'professor'
              ? '您暂无分配的教室'
              : '系统中暂无教室数据'
            }
          </p>
        </div>
      )}

      {/* Performance Note */}
      <div className="text-xs text-slate-500 text-center">
        虚拟化渲染支持 1000+ 教室流畅滚动 • Virtualized rendering supports 1000+ classrooms
      </div>
    </div>
  );
}