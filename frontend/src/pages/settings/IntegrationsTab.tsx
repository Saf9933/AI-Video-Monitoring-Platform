// src/pages/settings/IntegrationsTab.tsx
import { useTranslation } from 'react-i18next';
import { Link, TestTube } from 'lucide-react';
import { useTestIntegration } from '../../data/system/settings.hooks';
import type { SystemSettings } from '../../data/system/settings.types';

interface IntegrationsTabProps {
  data: SystemSettings;
  canEdit: boolean;
  onChange: (patch: Partial<SystemSettings>) => void;
}

export default function IntegrationsTab({ data, canEdit, onChange }: IntegrationsTabProps) {
  const { t } = useTranslation();
  const testIntegrationMutation = useTestIntegration();

  const handleIntegrationsChange = (field: keyof SystemSettings['integrations'], value: string) => {
    if (!canEdit) return;
    onChange({
      integrations: {
        ...data.integrations,
        [field]: value,
      },
    });
  };

  const handleTestConnection = async (kind: 'api' | 'ws' | 'lms' | 'kafka') => {
    try {
      await testIntegrationMutation.mutateAsync(kind);
    } catch (error) {
      console.error('Failed to test integration:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">{t('systemSettings.integrations.title')}</h2>
        <p className="text-slate-400 mt-1">{t('systemSettings.integrations.subtitle')}</p>
      </div>

      <div className="space-y-6">
        {/* Endpoints */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Link className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">
              {t('systemSettings.integrations.endpoints.title')}
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {[
              { key: 'apiBase', label: t('systemSettings.integrations.endpoints.apiBase') },
              { key: 'wsBase', label: t('systemSettings.integrations.endpoints.wsBase') },
              { key: 'lmsBase', label: t('systemSettings.integrations.endpoints.lmsBase') },
              { key: 'kafkaBrokers', label: t('systemSettings.integrations.endpoints.kafkaBrokers') },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {label}
                </label>
                <input
                  type="text"
                  value={data.integrations[key as keyof typeof data.integrations] || ''}
                  onChange={(e) => handleIntegrationsChange(key as keyof SystemSettings['integrations'], e.target.value)}
                  disabled={!canEdit}
                  className={`w-full px-3 py-2 rounded-lg border text-white font-mono text-sm ${
                    canEdit
                      ? 'bg-slate-700 border-slate-600 focus:border-blue-500'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                  placeholder={`Enter ${label.toLowerCase()}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Connection Testing */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <TestTube className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-semibold text-white">
              {t('systemSettings.integrations.testing.title')}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { key: 'api', label: t('systemSettings.integrations.testing.testApi') },
              { key: 'ws', label: t('systemSettings.integrations.testing.testWs') },
              { key: 'lms', label: t('systemSettings.integrations.testing.testLms') },
              { key: 'kafka', label: t('systemSettings.integrations.testing.testKafka') },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => handleTestConnection(key as 'api' | 'ws' | 'lms' | 'kafka')}
                disabled={testIntegrationMutation.isPending}
                className="flex items-center justify-center space-x-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
              >
                <TestTube className="w-4 h-4" />
                <span>
                  {testIntegrationMutation.isPending
                    ? t('systemSettings.integrations.testing.testing')
                    : label
                  }
                </span>
              </button>
            ))}
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