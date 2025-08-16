// src/pages/settings/MaintenanceTab.tsx
import { useTranslation } from 'react-i18next';
import { FileText, Download, Search, Clock } from 'lucide-react';
import { 
  useAuditLog, 
  useSystemCheck, 
  useExportConfig 
} from '../../data/system/settings.hooks';
import type { SystemSettings } from '../../data/system/settings.types';

interface MaintenanceTabProps {
  data: SystemSettings;
  canEdit: boolean;
  onChange: (patch: Partial<SystemSettings>) => void;
}

export default function MaintenanceTab({ canEdit }: MaintenanceTabProps) {
  const { t } = useTranslation();
  const { data: auditLog, isLoading: auditLoading } = useAuditLog();
  const systemCheckMutation = useSystemCheck();
  const exportConfig = useExportConfig();

  const handleSystemCheck = async () => {
    if (!canEdit) return;
    try {
      await systemCheckMutation.mutateAsync();
    } catch (error) {
      console.error('Failed to run system check:', error);
    }
  };

  const handleExportConfig = () => {
    exportConfig();
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'warn':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'info':
      default:
        return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">{t('systemSettings.maintenance.title')}</h2>
        <p className="text-slate-400 mt-1">{t('systemSettings.maintenance.subtitle')}</p>
      </div>

      <div className="space-y-6">
        {/* Audit Log */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <FileText className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">
              {t('systemSettings.maintenance.auditLog.title')}
            </h3>
          </div>

          {auditLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-slate-700 rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : auditLog && auditLog.length > 0 ? (
            <div className="overflow-hidden rounded-lg border border-slate-700">
              <table className="w-full text-sm">
                <thead className="bg-slate-700/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-slate-300">{t('systemSettings.maintenance.auditLog.time')}</th>
                    <th className="px-4 py-3 text-left text-slate-300">{t('systemSettings.maintenance.auditLog.actor')}</th>
                    <th className="px-4 py-3 text-left text-slate-300">{t('systemSettings.maintenance.auditLog.action')}</th>
                    <th className="px-4 py-3 text-left text-slate-300">{t('systemSettings.maintenance.auditLog.details')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {auditLog.slice(0, 10).map((entry) => (
                    <tr key={entry.id} className="bg-slate-800/30">
                      <td className="px-4 py-3 text-slate-400 font-mono text-xs">
                        {new Date(entry.timestamp).toLocaleString('zh-CN')}
                      </td>
                      <td className="px-4 py-3 text-slate-300">{entry.actor}</td>
                      <td className="px-4 py-3">
                        <code className="text-blue-300 bg-slate-700 px-2 py-1 rounded text-xs">
                          {entry.action}
                        </code>
                      </td>
                      <td className="px-4 py-3 text-slate-400">{entry.details || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center text-slate-400 py-8">
              {t('common.none')}
            </div>
          )}
        </div>

        {/* Maintenance Tools */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Search className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-semibold text-white">
              {t('systemSettings.maintenance.tools.title')}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleExportConfig}
              className="flex items-center space-x-3 p-4 bg-slate-700/50 border border-slate-600 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <Download className="w-5 h-5 text-blue-400" />
              <div className="text-left">
                <div className="text-white font-medium">
                  {t('systemSettings.maintenance.tools.exportConfig')}
                </div>
                <div className="text-slate-400 text-sm">JSON format</div>
              </div>
            </button>

            <button
              onClick={handleSystemCheck}
              disabled={!canEdit || systemCheckMutation.isPending}
              className={`flex items-center space-x-3 p-4 border rounded-lg transition-colors ${
                canEdit
                  ? 'bg-slate-700/50 border-slate-600 hover:bg-slate-700 text-white'
                  : 'bg-slate-800 border-slate-700 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Search className={`w-5 h-5 text-emerald-400 ${systemCheckMutation.isPending ? 'animate-spin' : ''}`} />
              <div className="text-left">
                <div className="font-medium">
                  {systemCheckMutation.isPending
                    ? t('systemSettings.maintenance.tools.checking')
                    : t('systemSettings.maintenance.tools.runCheck')
                  }
                </div>
                <div className="text-slate-400 text-sm">
                  {t('systemSettings.maintenance.tools.systemCheck')}
                </div>
              </div>
            </button>
          </div>

          {/* System Check Results */}
          {systemCheckMutation.data && (
            <div className="mt-6">
              <div className="flex items-center space-x-2 mb-4">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-400">
                  {t('systemSettings.maintenance.tools.lastCheck')}: {new Date().toLocaleString('zh-CN')}
                </span>
              </div>
              
              <div className="space-y-2">
                {systemCheckMutation.data.map((issue, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg border ${getLevelColor(issue.level)}`}
                  >
                    <span className="text-xs font-medium uppercase">
                      {t(`systemSettings.maintenance.diagnostics.${issue.level}`)}
                    </span>
                    <span className="text-sm">{issue.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {!canEdit && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
            <div className="text-yellow-300 text-sm">
              {t('systemSettings.restrictedByRole')}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}