import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Camera, 
  Play, 
  Pause, 
  RotateCcw, 
  AlertTriangle, 
  Maximize, 
  Settings, 
  Wifi, 
  WifiOff,
  Clock,
  MapPin,
  HardDrive,
  Eye,
  Sun,
  Moon
} from 'lucide-react';

export interface CameraData {
  id: string;
  name: string;
  location: string;
  zone: string;
  status: 'online' | 'offline' | 'warning' | 'error';
  resolution: string;
  wdrSupport: boolean;
  nightVision: boolean;
  storageDuration: string;
  installNotes: string;
  streamUrl?: string;
  lastSeen: string;
  batteryLevel?: number;
}

interface CameraCardProps {
  camera: CameraData;
  onOpenDetail: (camera: CameraData) => void;
  onRetryStream: (cameraId: string) => void;
  onReportIssue: (cameraId: string) => void;
}

const statusConfig = {
  online: { 
    icon: Wifi, 
    color: 'text-emerald-400', 
    bgColor: 'bg-emerald-500/20',
    borderColor: 'border-emerald-500/30',
    label: '在线'
  },
  offline: { 
    icon: WifiOff, 
    color: 'text-red-400', 
    bgColor: 'bg-red-500/20',
    borderColor: 'border-red-500/30',
    label: '离线'
  },
  warning: { 
    icon: AlertTriangle, 
    color: 'text-yellow-400', 
    bgColor: 'bg-yellow-500/20',
    borderColor: 'border-yellow-500/30',
    label: '警告'
  },
  error: { 
    icon: AlertTriangle, 
    color: 'text-red-400', 
    bgColor: 'bg-red-500/20',
    borderColor: 'border-red-500/30',
    label: '错误'
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4 }
  }
};

export default function CameraCard({ 
  camera, 
  onOpenDetail, 
  onRetryStream, 
  onReportIssue 
}: CameraCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const status = statusConfig[camera.status];
  const StatusIcon = status.icon;

  const handlePlayToggle = () => {
    setIsLoading(true);
    // Simulate loading delay
    setTimeout(() => {
      setIsPlaying(!isPlaying);
      setIsLoading(false);
    }, 500);
  };

  const handleRetry = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRetryStream(camera.id);
  };

  const handleReportIssue = (e: React.MouseEvent) => {
    e.stopPropagation();
    onReportIssue(camera.id);
  };

  const handleCardClick = () => {
    onOpenDetail(camera);
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -2, scale: 1.02 }}
      className={`bg-slate-800/50 border ${status.borderColor} rounded-lg overflow-hidden cursor-pointer group transition-all duration-200`}
      onClick={handleCardClick}
    >
      {/* Video/Stream Area */}
      <div className="relative aspect-video bg-slate-900 border-b border-slate-700/50">
        {camera.status === 'online' && camera.streamUrl ? (
          <div className="relative w-full h-full">
            {/* Placeholder for actual video stream */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
              <div className="text-center space-y-2">
                {isLoading ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-400 border-t-transparent mx-auto" />
                ) : isPlaying ? (
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                    <Play className="w-6 h-6 text-green-400" />
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center">
                    <Camera className="w-6 h-6 text-slate-400" />
                  </div>
                )}
                <p className="text-xs text-slate-400">
                  {isLoading ? '加载中...' : isPlaying ? '实时流' : '点击播放'}
                </p>
              </div>
            </div>

            {/* Play/Pause Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePlayToggle();
              }}
              className="absolute bottom-2 left-2 p-2 bg-black/50 rounded-lg backdrop-blur-sm hover:bg-black/70 transition-colors"
              aria-label={isPlaying ? '暂停' : '播放'}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              ) : isPlaying ? (
                <Pause className="w-4 h-4 text-white" />
              ) : (
                <Play className="w-4 h-4 text-white" />
              )}
            </button>

            {/* Fullscreen Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenDetail(camera);
              }}
              className="absolute bottom-2 right-2 p-2 bg-black/50 rounded-lg backdrop-blur-sm hover:bg-black/70 transition-colors"
              aria-label="全屏查看"
            >
              <Maximize className="w-4 h-4 text-white" />
            </button>

            {/* Status Indicator */}
            <div className={`absolute top-2 left-2 px-2 py-1 rounded-md ${status.bgColor} backdrop-blur-sm`}>
              <div className="flex items-center space-x-1">
                <StatusIcon className={`w-3 h-3 ${status.color}`} />
                <span className={`text-xs font-medium ${status.color}`}>
                  {status.label}
                </span>
              </div>
            </div>

            {/* Live Indicator */}
            {isPlaying && (
              <div className="absolute top-2 right-2 px-2 py-1 bg-red-500 rounded-md">
                <span className="text-xs font-bold text-white">LIVE</span>
              </div>
            )}
          </div>
        ) : (
          /* Offline/Error State */
          <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
            <div className="text-center space-y-3">
              <div className={`w-12 h-12 ${status.bgColor} rounded-full flex items-center justify-center`}>
                <StatusIcon className={`w-6 h-6 ${status.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-300">摄像头{status.label}</p>
                <p className="text-xs text-slate-500">无法获取视频流</p>
              </div>
              {camera.status !== 'offline' && (
                <button
                  onClick={handleRetry}
                  className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                >
                  重试连接
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Camera Info */}
      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="space-y-1">
          <h3 className="font-medium text-white truncate">{camera.name}</h3>
          <div className="flex items-center space-x-1 text-xs text-slate-400">
            <MapPin className="w-3 h-3" />
            <span>{camera.location}</span>
            <span>·</span>
            <span>{camera.zone}</span>
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="space-y-1">
            <div className="text-slate-500">分辨率</div>
            <div className="text-slate-300">{camera.resolution}</div>
          </div>
          <div className="space-y-1">
            <div className="text-slate-500">最后在线</div>
            <div className="text-slate-300 flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{new Date(camera.lastSeen).toLocaleTimeString('zh-CN', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}</span>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="flex items-center space-x-2">
          <div className={`p-1 rounded ${camera.wdrSupport ? 'bg-green-500/20' : 'bg-slate-700'}`}>
            <Eye className={`w-3 h-3 ${camera.wdrSupport ? 'text-green-400' : 'text-slate-500'}`} />
          </div>
          <div className={`p-1 rounded ${camera.nightVision ? 'bg-purple-500/20' : 'bg-slate-700'}`}>
            <Moon className={`w-3 h-3 ${camera.nightVision ? 'text-purple-400' : 'text-slate-500'}`} />
          </div>
          <div className="flex items-center space-x-1 text-xs text-slate-400">
            <HardDrive className="w-3 h-3" />
            <span>{camera.storageDuration}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-700/30">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleRetry}
              disabled={camera.status === 'online'}
              className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="重试连接"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenDetail(camera);
              }}
              className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              aria-label="设置"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={handleReportIssue}
            className="text-xs text-red-400 hover:text-red-300 transition-colors"
          >
            报告问题
          </button>
        </div>

        {/* Install Notes (if any) */}
        {camera.installNotes && (
          <div className="text-xs text-slate-500 border-t border-slate-700/30 pt-2">
            <span className="font-medium">安装备注: </span>
            {camera.installNotes}
          </div>
        )}
      </div>
    </motion.div>
  );
}