// src/pages/settings/NotificationsTab.tsx
import { useTranslation } from 'react-i18next';
import { Bell, Send, RotateCcw } from 'lucide-react';
import { useTestNotification } from '../../data/system/settings.hooks';
import type { SystemSettings } from '../../data/system/settings.types';

interface NotificationsTabProps {
  data: SystemSettings;
  canEdit: boolean;
  onChange: (patch: Partial<SystemSettings>) => void;
}

export default function NotificationsTab({ data, canEdit, onChange }: NotificationsTabProps) {
  const { t } = useTranslation();
  const testNotificationMutation = useTestNotification();

  const handleNotifyChange = (field: keyof SystemSettings['notify'], value: any) => {
    if (!canEdit) return;
    onChange({
      notify: {
        ...data.notify,
        [field]: value,
      },
    });
  };

  const handleChannelToggle = (channel: keyof SystemSettings['notify']['channels']) => {
    if (!canEdit) return;
    handleNotifyChange('channels', {
      ...data.notify.channels,
      [channel]: !data.notify.channels[channel],
    });
  };

  const handleTestNotification = async (channel: 'sms' | 'email' | 'wecom') => {
    if (!canEdit) return;
    try {
      await testNotificationMutation.mutateAsync(channel);
    } catch (error) {
      console.error('Failed to test notification:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">{t('systemSettings.notifications.title')}</h2>
        <p className="text-slate-400 mt-1">{t('systemSettings.notifications.subtitle')}</p>
      </div>

      <div className="space-y-6">
        {/* Notification Channels */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Bell className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">
              {t('systemSettings.notifications.channels.title')}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(data.notify.channels).map(([channel, enabled]) => (
              <div key={channel} className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={enabled}
                      onChange={() => handleChannelToggle(channel as keyof typeof data.notify.channels)}
                      disabled={!canEdit}
                      className="rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500/20"
                    />
                    <span className="text-white font-medium">
                      {t(`systemSettings.notifications.channels.${channel}`)}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() => handleTestNotification(channel as 'sms' | 'email' | 'wecom')}
                  disabled={!canEdit || !enabled || testNotificationMutation.isPending}
                  className={`w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    canEdit && enabled
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-slate-800 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {testNotificationMutation.isPending
                      ? t('systemSettings.notifications.channels.testing')
                      : t('systemSettings.notifications.channels.testNotification')
                    }
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Retry Policies */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <RotateCcw className="w-5 h-5 text-yellow-400" />
            <h3 className="text-lg font-semibold text-white">
              {t('systemSettings.notifications.policies.title')}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t('systemSettings.notifications.policies.retryPolicy')}
              </label>
              <select
                value={data.notify.retryPolicy}
                onChange={(e) => handleNotifyChange('retryPolicy', e.target.value)}
                disabled={!canEdit}
                className={`w-full px-3 py-2 rounded-lg border text-white ${
                  canEdit
                    ? 'bg-slate-700 border-slate-600 focus:border-blue-500'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                <option value="none">{t('systemSettings.notifications.policies.none')}</option>
                <option value="simple">{t('systemSettings.notifications.policies.simple')}</option>
                <option value="exponential">{t('systemSettings.notifications.policies.exponential')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t('systemSettings.notifications.policies.rateLimitPerMin')}
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={data.notify.rateLimitPerMin}
                onChange={(e) => handleNotifyChange('rateLimitPerMin', parseInt(e.target.value))}
                disabled={!canEdit}
                className={`w-full px-3 py-2 rounded-lg border text-white ${
                  canEdit
                    ? 'bg-slate-700 border-slate-600 focus:border-blue-500'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              />
            </div>
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