// src/pages/settings/FlagsTab.tsx
import { useTranslation } from 'react-i18next';
import { Flag, Puzzle } from 'lucide-react';
import type { SystemSettings } from '../../data/system/settings.types';

interface FlagsTabProps {
  data: SystemSettings;
  canEdit: boolean;
  onChange: (patch: Partial<SystemSettings>) => void;
}

export default function FlagsTab({ data, canEdit, onChange }: FlagsTabProps) {
  const { t } = useTranslation();

  const handleFlagToggle = (flag: keyof SystemSettings['flags']) => {
    if (!canEdit) return;
    onChange({
      flags: {
        ...data.flags,
        [flag]: !data.flags[flag],
      },
    });
  };

  const moduleFlags = [
    { key: 'classrooms', label: t('systemSettings.flags.modules.classrooms') },
    { key: 'alerts', label: t('systemSettings.flags.modules.alerts') },
    { key: 'analytics', label: t('systemSettings.flags.modules.analytics') },
    { key: 'monitorWall', label: t('systemSettings.flags.modules.monitorWall') },
  ];

  const featureFlags = [
    { key: 'shapExplanations', label: t('systemSettings.flags.features.shapExplanations') },
    { key: 'shortcuts', label: t('systemSettings.flags.features.shortcuts') },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">{t('systemSettings.flags.title')}</h2>
        <p className="text-slate-400 mt-1">{t('systemSettings.flags.subtitle')}</p>
      </div>

      <div className="space-y-6">
        {/* Modules */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Puzzle className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">
              {t('systemSettings.flags.modules.title')}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {moduleFlags.map(({ key, label }) => (
              <label key={key} className="flex items-center space-x-3 p-4 bg-slate-700/50 border border-slate-600 rounded-lg cursor-pointer hover:bg-slate-700/70 transition-colors">
                <input
                  type="checkbox"
                  checked={data.flags[key as keyof typeof data.flags]}
                  onChange={() => handleFlagToggle(key as keyof SystemSettings['flags'])}
                  disabled={!canEdit}
                  className="rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500/20"
                />
                <span className="text-white font-medium">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Flag className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-semibold text-white">
              {t('systemSettings.flags.features.title')}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featureFlags.map(({ key, label }) => (
              <label key={key} className="flex items-center space-x-3 p-4 bg-slate-700/50 border border-slate-600 rounded-lg cursor-pointer hover:bg-slate-700/70 transition-colors">
                <input
                  type="checkbox"
                  checked={data.flags[key as keyof typeof data.flags]}
                  onChange={() => handleFlagToggle(key as keyof SystemSettings['flags'])}
                  disabled={!canEdit}
                  className="rounded border-slate-600 bg-slate-700 text-emerald-500 focus:ring-emerald-500/20"
                />
                <span className="text-white font-medium">{label}</span>
              </label>
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