// Real-time Classroom Monitoring Dashboard
// Features: video preview, live alerts, metrics, operations, device health, audit trail

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  AlertTriangle,
  CheckCircle,
  UserPlus,
  ArrowUp,
  StickyNote,
  PlayCircle,
  Activity,
  Wifi,
  Zap,
  Clock,
  Eye,
  EyeOff,
  TrendingUp,
  TrendingDown,
  RefreshCcw,
  Settings,
  ArrowLeft
} from 'lucide-react';

import { useClassroom, useRealtimeMetrics, useWebSocket } from '../../data/classrooms/hooks';
import { useRBAC, RoleGuard } from '../../components/rbac/RBACProvider';
import { Alert, ClassroomMetrics, DeviceHealth } from '../../data/classrooms/types';
import { theme } from '../../styles/theme';

interface MetricCardProps {
  title: string;
  titleEn: string;
  value: number;
  threshold: number;
  trend: 'up' | 'down' | 'stable';
  change: number;
  color: 'red' | 'blue' | 'yellow';
  isAboveThreshold: boolean;
}

function MetricCard({ title, titleEn, value, threshold, trend, change, color, isAboveThreshold }: MetricCardProps) {
  const colorConfig = {
    red: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
      text: 'text-red-400',
      accent: 'text-red-300'
    },
    blue: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20', 
      text: 'text-blue-400',
      accent: 'text-blue-300'
    },
    yellow: {
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/20',
      text: 'text-yellow-400',
      accent: 'text-yellow-300'
    }
  };

  const config = colorConfig[color];
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Activity;

  return (
    <motion.div
      layout
      className={`p-4 rounded-xl border ${config.bg} ${config.border} ${
        isAboveThreshold ? 'ring-2 ring-red-500/20' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-sm font-medium text-white">{title}</div>
          <div className="text-xs text-slate-400">{titleEn}</div>
        </div>
        <div className={`flex items-center space-x-1 ${config.text}`}>
          <TrendIcon className="w-4 h-4" />
          <span className="text-xs">
            {change > 0 ? '+' : ''}{change.toFixed(1)}%
          </span>
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <div className={`text-2xl font-bold ${config.text}`}>
            {value.toFixed(1)}
          </div>
          <div className="text-xs text-slate-500">
            阈值: {threshold}
          </div>
        </div>
        
        {isAboveThreshold && (
          <div className="flex items-center space-x-1 text-red-400">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-xs">超阈值</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Video preview component with RBAC-based blurring
interface VideoPreviewProps {
  classroomId: string;
  isPlaying: boolean;
  onTogglePlay: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onFullscreen: () => void;
}

function VideoPreview({ 
  classroomId, 
  isPlaying, 
  onTogglePlay, 
  isMuted, 
  onToggleMute, 
  onFullscreen 
}: VideoPreviewProps) {
  const { hasPermission } = useRBAC();
  const canViewOriginal = hasPermission('viewOriginalVideo');
  
  return (
    <div className="relative bg-slate-900 rounded-xl overflow-hidden aspect-video">
      {/* Mock video preview */}
      <div className={`w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center ${
        !canViewOriginal ? 'blur-sm' : ''
      }`}>
        <div className="text-center">
          <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mb-4 mx-auto">
            <Eye className="w-8 h-8 text-slate-400" />
          </div>
          <div className="text-white font-medium">教室监控视频流</div>
          <div className="text-slate-400 text-sm">Classroom Video Stream</div>
          {!canViewOriginal && (
            <div className="text-yellow-400 text-xs mt-2 flex items-center justify-center space-x-1">
              <EyeOff className="w-3 h-3" />
              <span>受权限保护</span>
            </div>
          )}
        </div>
      </div>

      {/* Video Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={onTogglePlay}
              className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-white" />
              ) : (
                <Play className="w-5 h-5 text-white" />
              )}
            </button>
            
            <button
              onClick={onToggleMute}
              className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-white" />
              ) : (
                <Volume2 className="w-5 h-5 text-white" />
              )}
            </button>

            <div className="text-white text-sm">
              实时流 • {new Date().toLocaleTimeString('zh-CN')}
            </div>
          </div>

          <button
            onClick={onFullscreen}
            className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
          >
            <Maximize className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Privacy overlay for professors */}
      {!canViewOriginal && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-3 text-center">
            <EyeOff className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <div className="text-yellow-300 text-sm font-medium">隐私保护模式</div>
            <div className="text-yellow-400 text-xs">视频流已模糊处理</div>
          </div>
        </div>
      )}
    </div>
  );
}

// Live alerts feed
interface LiveAlertsFeedProps {
  classroomId: string;
}

function LiveAlertsFeed({ classroomId }: LiveAlertsFeedProps) {
  const { t } = useTranslation(['alerts', 'common']);
  const { messages } = useWebSocket();
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    // Filter messages for new alerts in this classroom
    const newAlerts = messages
      .filter(msg => 
        msg.type === 'alert.new' && 
        msg.payload.classroomId === classroomId
      )
      .slice(-5); // Keep last 5 alerts

    setAlerts(newAlerts);
  }, [messages, classroomId]);

  const getAlertColor = (level: string) => {
    switch (level) {
      case 'l3': return 'border-red-500/30 bg-red-500/10 text-red-400';
      case 'l2': return 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400';
      case 'l1': return 'border-blue-500/30 bg-blue-500/10 text-blue-400';
      default: return 'border-slate-600 bg-slate-800 text-slate-300';
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">实时告警</h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-sm text-slate-400">实时监控</span>
        </div>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {alerts.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <div className="text-slate-400">暂无实时告警</div>
            <div className="text-slate-500 text-sm">系统正常运行中</div>
          </div>
        ) : (
          alerts.map((alert, index) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-3 rounded-lg border ${getAlertColor(alert.payload.level)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span className="font-medium truncate">{alert.payload.title}</span>
                  </div>
                  <div className="text-sm opacity-80 mb-2">
                    置信度: {(alert.payload.confidence * 100).toFixed(1)}%
                  </div>
                  <div className="flex items-center space-x-4 text-xs opacity-60">
                    <span>{new Date(alert.timestamp).toLocaleTimeString('zh-CN')}</span>
                    <span>{alert.payload.type}</span>
                  </div>
                </div>
                <div className="flex space-x-1 ml-3">
                  <RoleGuard permission="acknowledgeAlerts">
                    <button className="p-1 hover:bg-white/10 rounded text-xs">
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  </RoleGuard>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

// Device health panel
interface DeviceHealthPanelProps {
  deviceHealth: DeviceHealth;
}

function DeviceHealthPanel({ deviceHealth }: DeviceHealthPanelProps) {
  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'normal':
      case 'idle':
        return 'text-emerald-400';
      case 'degraded':
      case 'high':
        return 'text-yellow-400';
      case 'offline':
      case 'overload':
        return 'text-red-400';
      default:
        return 'text-slate-400';
    }
  };

  const getHealthBg = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'normal':
      case 'idle':
        return 'bg-emerald-500/20';
      case 'degraded':
      case 'high':
        return 'bg-yellow-500/20';
      case 'offline':
      case 'overload':
        return 'bg-red-500/20';
      default:
        return 'bg-slate-500/20';
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-white">设备运维</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Heartbeat */}
        <div className={`p-3 rounded-lg ${getHealthBg(deviceHealth.heartbeat)}`}>
          <div className="flex items-center justify-between mb-2">
            <Wifi className={`w-5 h-5 ${getHealthColor(deviceHealth.heartbeat)}`} />
            <span className={`text-xs px-2 py-1 rounded ${getHealthColor(deviceHealth.heartbeat)}`}>
              {deviceHealth.heartbeat}
            </span>
          </div>
          <div className="text-white font-medium">心跳状态</div>
          <div className="text-xs text-slate-400">
            {new Date(deviceHealth.lastHeartbeat).toLocaleTimeString('zh-CN')}
          </div>
        </div>

        {/* GPU Status */}
        <div className={`p-3 rounded-lg ${getHealthBg(deviceHealth.gpu)}`}>
          <div className="flex items-center justify-between mb-2">
            <Zap className={`w-5 h-5 ${getHealthColor(deviceHealth.gpu)}`} />
            <span className={`text-xs px-2 py-1 rounded ${getHealthColor(deviceHealth.gpu)}`}>
              {deviceHealth.gpu}
            </span>
          </div>
          <div className="text-white font-medium">GPU状态</div>
          <div className="text-xs text-slate-400">计算负载</div>
        </div>

        {/* Stream Latency */}
        <div className="p-3 rounded-lg bg-slate-800">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 text-blue-400" />
            <span className="text-blue-400 font-mono">
              {deviceHealth.streamLatency}ms
            </span>
          </div>
          <div className="text-white font-medium">流延迟</div>
          <div className="text-xs text-slate-400">端到端延迟</div>
        </div>

        {/* FPS */}
        <div className="p-3 rounded-lg bg-slate-800">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <span className="text-emerald-400 font-mono">
              {deviceHealth.fps} FPS
            </span>
          </div>
          <div className="text-white font-medium">帧率</div>
          <div className="text-xs text-slate-400">视频帧率</div>
        </div>
      </div>
    </div>
  );
}

// Main classroom monitoring component
export default function ClassroomMonitoring() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { canAccessClassroom } = useRBAC();
  
  // State
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isVideoMuted, setIsVideoMuted] = useState(false);

  // Data hooks
  const { data: classroom, isLoading } = useClassroom(id!);
  const metrics = useRealtimeMetrics(id!);
  const { connectionStatus } = useWebSocket();

  // Access control
  if (!canAccessClassroom(id!)) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">访问被拒绝</h3>
          <p className="text-slate-400 mb-4">您没有权限访问此教室</p>
          <button
            onClick={() => navigate('/classrooms')}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            返回教室列表
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-emerald-400 border-t-transparent mb-4" />
          <div className="text-white font-medium">加载教室监控数据...</div>
        </div>
      </div>
    );
  }

  if (!classroom) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 mb-4">教室不存在</div>
        <button
          onClick={() => navigate('/classrooms')}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg"
        >
          返回教室列表
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with connection status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/classrooms')}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">{classroom.name}</h1>
            <p className="text-slate-400">{classroom.school} • {classroom.department}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Connection Status */}
          <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
            connectionStatus.connected 
              ? 'bg-emerald-500/20 text-emerald-400' 
              : 'bg-red-500/20 text-red-400'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              connectionStatus.connected ? 'bg-emerald-400' : 'bg-red-400'
            } ${connectionStatus.connected ? 'animate-pulse' : ''}`} />
            <span className="text-sm font-medium">
              {connectionStatus.connected ? '实时连接' : '连接断开'}
            </span>
          </div>

          <RoleGuard permission="modifySettings">
            <button className="flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
              <Settings className="w-4 h-4" />
              <span>设置</span>
            </button>
          </RoleGuard>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Video & Metrics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Preview */}
          <VideoPreview
            classroomId={id!}
            isPlaying={isVideoPlaying}
            onTogglePlay={() => setIsVideoPlaying(!isVideoPlaying)}
            isMuted={isVideoMuted}
            onToggleMute={() => setIsVideoMuted(!isVideoMuted)}
            onFullscreen={() => console.log('Fullscreen')}
          />

          {/* Real-time Metrics */}
          {metrics && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">关键指标</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MetricCard
                  title="压力水平"
                  titleEn="Stress Level"
                  value={metrics.stress.current}
                  threshold={metrics.stress.threshold}
                  trend={metrics.stress.trend}
                  change={metrics.stress.change}
                  color="red"
                  isAboveThreshold={metrics.stress.isAboveThreshold}
                />
                <MetricCard
                  title="排斥指数"
                  titleEn="Isolation Index"
                  value={metrics.isolation.current}
                  threshold={metrics.isolation.threshold}
                  trend={metrics.isolation.trend}
                  change={metrics.isolation.change}
                  color="blue"
                  isAboveThreshold={metrics.isolation.isAboveThreshold}
                />
                <MetricCard
                  title="压迫行为"
                  titleEn="Aggression"
                  value={metrics.aggression.current}
                  threshold={metrics.aggression.threshold}
                  trend={metrics.aggression.trend}
                  change={metrics.aggression.change}
                  color="yellow"
                  isAboveThreshold={metrics.aggression.isAboveThreshold}
                />
              </div>
            </div>
          )}

          {/* Quick Operations */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-white mb-4">快速操作</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <RoleGuard permission="acknowledgeAlerts">
                <button className="flex items-center space-x-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">
                  <CheckCircle className="w-4 h-4" />
                  <span>确认告警</span>
                </button>
              </RoleGuard>
              
              <RoleGuard permission="assignAlerts">
                <button className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                  <UserPlus className="w-4 h-4" />
                  <span>分配处理</span>
                </button>
              </RoleGuard>
              
              <RoleGuard permission="escalateAlerts">
                <button className="flex items-center space-x-2 px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors">
                  <ArrowUp className="w-4 h-4" />
                  <span>升级告警</span>
                </button>
              </RoleGuard>
              
              <button className="flex items-center space-x-2 px-3 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors">
                <StickyNote className="w-4 h-4" />
                <span>添加备注</span>
              </button>
              
              <button className="flex items-center space-x-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                <PlayCircle className="w-4 h-4" />
                <span>启动作业</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Alerts & Device Health */}
        <div className="space-y-6">
          {/* Live Alerts */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
            <LiveAlertsFeed classroomId={id!} />
          </div>

          {/* Device Health */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
            <DeviceHealthPanel deviceHealth={classroom.deviceHealth} />
          </div>

          {/* Audit Trail Preview */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-white">操作审计</h3>
              <button className="text-blue-400 hover:text-blue-300 text-sm">
                查看全部
              </button>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-slate-700">
                <div>
                  <div className="text-white">告警确认</div>
                  <div className="text-slate-400 text-xs">张教授</div>
                </div>
                <div className="text-slate-400 text-xs">
                  {new Date(Date.now() - 300000).toLocaleTimeString('zh-CN')}
                </div>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-700">
                <div>
                  <div className="text-white">设备状态更新</div>
                  <div className="text-slate-400 text-xs">系统</div>
                </div>
                <div className="text-slate-400 text-xs">
                  {new Date(Date.now() - 600000).toLocaleTimeString('zh-CN')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}