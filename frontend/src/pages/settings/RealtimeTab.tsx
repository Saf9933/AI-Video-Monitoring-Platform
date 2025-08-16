// src/pages/settings/RealtimeTab.tsx
import { useTranslation } from 'react-i18next';
import { Wifi, Zap } from 'lucide-react';
import type { SystemSettings } from '../../data/system/settings.types';

interface RealtimeTabProps {
  data: SystemSettings;
  canEdit: boolean;
  onChange: (patch: Partial<SystemSettings>) => void;
}

export default function RealtimeTab({ data, canEdit, onChange }: RealtimeTabProps) {
  const { t } = useTranslation();

  const handleRealtimeChange = (field: keyof SystemSettings['realtime'], value: any) => {
    if (!canEdit) return;
    onChange({
      realtime: {
        ...data.realtime,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">{t('systemSettings.realtime.title')}</h2>
        <p className="text-slate-400 mt-1">{t('systemSettings.realtime.subtitle')}</p>
      </div>

      <div className="space-y-6">
        {/* WebSocket Settings */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Wifi className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">
              {t('systemSettings.realtime.websocket.title')}
            </h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              {t('systemSettings.realtime.websocket.reconnectBackoff')}
            </label>
            <select
              value={data.realtime.wsBackoff}
              onChange={(e) => handleRealtimeChange('wsBackoff', e.target.value)}
              disabled={!canEdit}
              className={`w-full px-3 py-2 rounded-lg border text-white ${
                canEdit
                  ? 'bg-slate-700 border-slate-600 focus:border-blue-500'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              <option value="none">{t('systemSettings.realtime.websocket.none')}</option>
              <option value="linear">{t('systemSettings.realtime.websocket.linear')}</option>
              <option value="expo">{t('systemSettings.realtime.websocket.expo')}</option>
            </select>
          </div>
        </div>

        {/* Performance Settings */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Zap className="w-5 h-5 text-yellow-400" />
            <h3 className="text-lg font-semibold text-white">
              {t('systemSettings.realtime.performance.title')}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t('systemSettings.realtime.performance.pollingSec')}
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={data.realtime.pollSec}
                onChange={(e) => handleRealtimeChange('pollSec', parseInt(e.target.value))}
                disabled={!canEdit}
                className={`w-full px-3 py-2 rounded-lg border text-white ${
                  canEdit
                    ? 'bg-slate-700 border-slate-600 focus:border-blue-500'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t('systemSettings.realtime.performance.targetP95Ms')}
              </label>
              <input
                type="number"
                min="100"
                max="5000"
                step="50"
                value={data.realtime.targetP95Ms}
                onChange={(e) => handleRealtimeChange('targetP95Ms', parseInt(e.target.value))}
                disabled={!canEdit}
                className={`w-full px-3 py-2 rounded-lg border text-white ${
                  canEdit
                    ? 'bg-slate-700 border-slate-600 focus:border-blue-500'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={data.realtime.virtualization}
                onChange={(e) => handleRealtimeChange('virtualization', e.target.checked)}
                disabled={!canEdit}
                className="rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500/20"
              />
              <span className="text-slate-300">
                {t('systemSettings.realtime.performance.virtualization')}
              </span>
            </label>
          </div>
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