// src/pages/settings/OverviewTab.tsx
import { useTranslation } from 'react-i18next';
import { 
  Server, 
  Wifi, 
  Clock, 
  Database, 
  Activity,
  RefreshCw,
  Trash2
} from 'lucide-react';
import { 
  useSystemInfo, 
  useReloadConfig, 
  useClearCache 
} from '../../data/system/settings.hooks';
import type { SystemSettings } from '../../data/system/settings.types';

interface OverviewTabProps {
  data: SystemSettings;
  canEdit: boolean;
  onChange: (patch: Partial<SystemSettings>) => void;
}

export default function OverviewTab({ canEdit }: OverviewTabProps) {
  const { t } = useTranslation();
  const { data: systemInfo, isLoading: infoLoading } = useSystemInfo();
  const reloadConfigMutation = useReloadConfig();
  const clearCacheMutation = useClearCache();

  const handleReloadConfig = async () => {
    if (!canEdit) return;
    try {
      await reloadConfigMutation.mutateAsync();
      // Toast success is handled by the hook
    } catch (error) {
      console.error('Failed to reload config:', error);
    }
  };

  const handleClearCache = async () => {
    if (!canEdit) return;
    try {
      await clearCacheMutation.mutateAsync();
      // Toast success is handled by the hook
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'disconnected':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'reconnecting':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      default:
        return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">{t('systemSettings.overview.title')}</h2>
        <p className="text-slate-400 mt-1">{t('systemSettings.overview.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Information */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Server className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">
              {t('systemSettings.overview.systemInfo.title')}
            </h3>
          </div>

          {infoLoading ? (
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : systemInfo ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">{t('systemSettings.overview.systemInfo.version')}</span>
                <span className="text-white font-mono">{systemInfo.version}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-300">{t('systemSettings.overview.systemInfo.buildHash')}</span>
                <span className="text-white font-mono text-sm">{systemInfo.buildHash}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-300">{t('systemSettings.overview.systemInfo.uptime')}</span>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span className="text-white">{systemInfo.uptime}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-300">{t('systemSettings.overview.systemInfo.wsStatus')}</span>
                <div className="flex items-center space-x-2">
                  <Wifi className="w-4 h-4" />
                  <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(systemInfo.wsStatus)}`}>
                    {t(`systemSettings.overview.status.${systemInfo.wsStatus}`)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-300">{t('systemSettings.overview.systemInfo.queueLag')}</span>
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-slate-400" />
                  <span className="text-white">{systemInfo.queueLag}ms</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-300">{t('systemSettings.overview.systemInfo.dataMode')}</span>
                <div className="flex items-center space-x-2">
                  <Database className="w-4 h-4 text-slate-400" />
                  <span className={`px-2 py-1 rounded text-xs font-medium border ${
                    systemInfo.dataMode === 'live' 
                      ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
                      : 'text-blue-400 bg-blue-400/10 border-blue-400/20'
                  }`}>
                    {t(`systemSettings.overview.status.${systemInfo.dataMode}`)}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-slate-400 text-center py-4">
              {t('common.error')}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <RefreshCw className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-semibold text-white">
              {t('systemSettings.overview.quickActions.title')}
            </h3>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleReloadConfig}
              disabled={!canEdit || reloadConfigMutation.isPending}
              className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                canEdit
                  ? 'bg-slate-700/50 border-slate-600 hover:bg-slate-700 text-white'
                  : 'bg-slate-800 border-slate-700 text-slate-400 cursor-not-allowed'
              }`}
              title={!canEdit ? t('systemSettings.restrictedByRole') : undefined}
            >
              <div className="flex items-center space-x-3">
                <RefreshCw className={`w-4 h-4 ${reloadConfigMutation.isPending ? 'animate-spin' : ''}`} />
                <span className="font-medium">{t('systemSettings.overview.quickActions.reloadConfig')}</span>
              </div>
              {reloadConfigMutation.isPending && (
                <div className="text-xs text-slate-400">{t('common.loading')}</div>
              )}
            </button>

            <button
              onClick={handleClearCache}
              disabled={!canEdit || clearCacheMutation.isPending}
              className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                canEdit
                  ? 'bg-slate-700/50 border-slate-600 hover:bg-slate-700 text-white'
                  : 'bg-slate-800 border-slate-700 text-slate-400 cursor-not-allowed'
              }`}
              title={!canEdit ? t('systemSettings.restrictedByRole') : undefined}
            >
              <div className="flex items-center space-x-3">
                <Trash2 className="w-4 h-4" />
                <span className="font-medium">{t('systemSettings.overview.quickActions.clearCache')}</span>
              </div>
              {clearCacheMutation.isPending && (
                <div className="text-xs text-slate-400">{t('common.loading')}</div>
              )}
            </button>
          </div>

          {!canEdit && (
            <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <div className="text-yellow-300 text-sm">
                {t('systemSettings.restrictedByRole')}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}