import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Grid, 
  List, 
  Filter, 
  Search, 
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  EyeOff
} from 'lucide-react';
import { useScenarioCameras, useCameraActions } from '../../hooks/scenarios/useScenarioCameras';
import CameraCard from '../../components/scenarios/CameraCard';

const scenarioConfig = {
  classrooms: {
    title: '教室监控',
    titleEn: 'Classrooms',
    description: '监测情绪变化，防范校园霸凌，标记异常学生行为',
    color: 'from-blue-500 to-cyan-500'
  },
  hallways: {
    title: '走廊 / 公共区域',
    titleEn: 'Hallways & Commons',
    description: '监控冲突事件，人群密度，不安全行为预警',
    color: 'from-emerald-500 to-teal-500'
  },
  playground: {
    title: '操场监控',
    titleEn: 'Sports Grounds',
    description: '监控大型聚集，斗争事件，异常人群运动',
    color: 'from-orange-500 to-red-500'
  },
  cafeteria: {
    title: '食堂监控',
    titleEn: 'Cafeteria',
    description: '监控霸凌行为，食物争斗，情绪困扰学生',
    color: 'from-purple-500 to-pink-500'
  },
  dormitories: {
    title: '宿舍监控',
    titleEn: 'Dormitories',
    description: '安全监控，夜间异常(仅出入口，保护隐私)',
    color: 'from-indigo-500 to-purple-500'
  }
};

type ViewMode = 'grid' | 'list';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function ScenarioPage() {
  const { scenarioId } = useParams<{ scenarioId: string }>();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const scenario = scenarioId ? scenarioConfig[scenarioId as keyof typeof scenarioConfig] : null;
  
  const { cameras, isLoading, error, retry, isUsingFallback } = useScenarioCameras(
    scenarioId || '',
    { timeout: 3000, enableFallback: true }
  );

  const { retryStream, reportIssue, openCameraDetail, toastMessage, clearToast } = useCameraActions();

  // Filter cameras based on search and status
  const filteredCameras = cameras.filter(camera => {
    const matchesSearch = camera.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         camera.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         camera.zone.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || camera.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Camera statistics
  const stats = {
    total: cameras.length,
    online: cameras.filter(c => c.status === 'online').length,
    offline: cameras.filter(c => c.status === 'offline').length,
    warning: cameras.filter(c => c.status === 'warning').length,
    error: cameras.filter(c => c.status === 'error').length
  };

  if (!scenario) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">场景未找到</h2>
          <p className="text-slate-400 mb-4">请检查URL或返回场景列表</p>
          <Link to="/scenarios" className="text-blue-400 hover:text-blue-300">
            返回场景中心
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Message */}
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 right-4 z-50 bg-slate-800 border border-slate-700 rounded-lg p-4 shadow-lg"
        >
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-white text-sm">{toastMessage}</span>
            <button
              onClick={clearToast}
              className="text-slate-400 hover:text-white ml-2"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link 
            to="/scenarios"
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            aria-label="返回场景中心"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">{scenario.title}</h1>
            <p className="text-slate-400">{scenario.titleEn} • {scenario.description}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {isUsingFallback && (
            <div className="flex items-center space-x-1 text-xs text-yellow-400 bg-yellow-500/10 px-2 py-1 rounded">
              <AlertTriangle className="w-3 h-3" />
              <span>使用离线数据</span>
            </div>
          )}
          <button
            onClick={retry}
            disabled={isLoading}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors disabled:opacity-50"
            aria-label="刷新数据"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 md:grid-cols-5 gap-4"
      >
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 text-center">
          <div className="text-xl font-bold text-white">{stats.total}</div>
          <div className="text-xs text-slate-400">总摄像头</div>
        </div>
        <div className="bg-slate-800/50 border border-emerald-500/30 rounded-lg p-4 text-center">
          <div className="text-xl font-bold text-emerald-400">{stats.online}</div>
          <div className="text-xs text-slate-400">在线</div>
        </div>
        <div className="bg-slate-800/50 border border-red-500/30 rounded-lg p-4 text-center">
          <div className="text-xl font-bold text-red-400">{stats.offline}</div>
          <div className="text-xs text-slate-400">离线</div>
        </div>
        <div className="bg-slate-800/50 border border-yellow-500/30 rounded-lg p-4 text-center">
          <div className="text-xl font-bold text-yellow-400">{stats.warning}</div>
          <div className="text-xs text-slate-400">警告</div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 text-center">
          <div className="text-xl font-bold text-slate-400">{stats.error}</div>
          <div className="text-xs text-slate-400">错误</div>
        </div>
      </motion.div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        {/* Search and Filter */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索摄像头..."
              className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-slate-500 w-64"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-slate-500"
          >
            <option value="all">全部状态</option>
            <option value="online">在线</option>
            <option value="offline">离线</option>
            <option value="warning">警告</option>
            <option value="error">错误</option>
          </select>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-400">视图:</span>
          <div className="flex bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
              aria-label="网格视图"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
              aria-label="列表视图"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-400 border-t-transparent mb-4" />
            <div className="text-white font-medium">加载摄像头数据...</div>
            <div className="text-slate-400 text-sm">请稍候，正在获取实时信息</div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="text-center py-12">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">加载失败</h3>
          <p className="text-slate-400 mb-4">{error}</p>
          <button
            onClick={retry}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            重试加载
          </button>
        </div>
      )}

      {/* Camera Grid/List */}
      {!isLoading && !error && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }
        >
          {filteredCameras.length > 0 ? (
            filteredCameras.map((camera) => (
              <CameraCard
                key={camera.id}
                camera={camera}
                onOpenDetail={openCameraDetail}
                onRetryStream={retryStream}
                onReportIssue={reportIssue}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <EyeOff className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">未找到摄像头</h3>
              <p className="text-slate-400">
                {searchTerm || statusFilter !== 'all' 
                  ? '请尝试调整搜索条件或过滤器'
                  : '该场景暂无可用的摄像头设备'
                }
              </p>
            </div>
          )}
        </motion.div>
      )}

      {/* Footer Info */}
      {!isLoading && !error && cameras.length > 0 && (
        <div className="text-center pt-8 border-t border-slate-700/30">
          <p className="text-xs text-slate-500">
            显示 {filteredCameras.length} / {cameras.length} 个摄像头
            {isUsingFallback && ' • 当前使用离线数据，请检查网络连接'}
          </p>
        </div>
      )}
    </div>
  );
}