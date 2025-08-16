// src/pages/settings/AlertsTab.tsx
import { useTranslation } from 'react-i18next';
import { AlertTriangle, TrendingUp } from 'lucide-react';
import type { SystemSettings } from '../../data/system/settings.types';

interface AlertsTabProps {
  data: SystemSettings;
  canEdit: boolean;
  onChange: (patch: Partial<SystemSettings>) => void;
}

export default function AlertsTab({ data, canEdit, onChange }: AlertsTabProps) {
  const { t } = useTranslation();

  const handleAlertsChange = (field: keyof SystemSettings['alerts'], value: number) => {
    if (!canEdit) return;
    onChange({
      alerts: {
        ...data.alerts,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">{t('systemSettings.alerts.title')}</h2>
        <p className="text-slate-400 mt-1">{t('systemSettings.alerts.subtitle')}</p>
      </div>

      <div className="space-y-6">
        {/* Global Thresholds */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <h3 className="text-lg font-semibold text-white">
              {t('systemSettings.alerts.thresholds.title')}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t('systemSettings.alerts.thresholds.okMax')}
              </label>
              <input
                type="number"
                min="0"
                max="1"
                step="0.01"
                value={data.alerts.okMax}
                onChange={(e) => handleAlertsChange('okMax', parseFloat(e.target.value))}
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
                {t('systemSettings.alerts.thresholds.l1Min')}
              </label>
              <input
                type="number"
                min="0"
                max="1"
                step="0.01"
                value={data.alerts.l1Min}
                onChange={(e) => handleAlertsChange('l1Min', parseFloat(e.target.value))}
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
                {t('systemSettings.alerts.thresholds.l2Min')}
              </label>
              <input
                type="number"
                min="0"
                max="1"
                step="0.01"
                value={data.alerts.l2Min}
                onChange={(e) => handleAlertsChange('l2Min', parseFloat(e.target.value))}
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
                {t('systemSettings.alerts.thresholds.l3Min')}
              </label>
              <input
                type="number"
                min="0"
                max="1"
                step="0.01"
                value={data.alerts.l3Min}
                onChange={(e) => handleAlertsChange('l3Min', parseFloat(e.target.value))}
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
                {t('systemSettings.alerts.thresholds.minConfidence')}
              </label>
              <input
                type="number"
                min="0"
                max="1"
                step="0.01"
                value={data.alerts.minConfidence}
                onChange={(e) => handleAlertsChange('minConfidence', parseFloat(e.target.value))}
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
                {t('systemSettings.alerts.thresholds.debounceMs')}
              </label>
              <input
                type="number"
                min="100"
                max="10000"
                step="100"
                value={data.alerts.debounceMs}
                onChange={(e) => handleAlertsChange('debounceMs', parseInt(e.target.value))}
                disabled={!canEdit}
                className={`w-full px-3 py-2 rounded-lg border text-white ${
                  canEdit
                    ? 'bg-slate-700 border-slate-600 focus:border-blue-500'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              />
              <p className="text-xs text-slate-400 mt-1">ms</p>
            </div>
          </div>
        </div>

        {/* Default Filters */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-semibold text-white">
              {t('systemSettings.alerts.defaultFilters.title')}
            </h3>
          </div>

          <p className="text-sm text-slate-400 mb-4">
            {t('systemSettings.alerts.defaultFilters.description')}
          </p>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="l2-plus-filter"
              checked={true} // Mock default
              disabled={!canEdit}
              className="rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500/20"
            />
            <label htmlFor="l2-plus-filter" className="text-slate-300">
              {t('systemSettings.alerts.defaultFilters.l2Plus')}
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