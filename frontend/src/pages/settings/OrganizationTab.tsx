// src/pages/settings/OrganizationTab.tsx
import { useTranslation } from 'react-i18next';
import { Building2, Upload, X, Palette } from 'lucide-react';
import type { SystemSettings } from '../../data/system/settings.types';

interface OrganizationTabProps {
  data: SystemSettings;
  canEdit: boolean;
  onChange: (patch: Partial<SystemSettings>) => void;
}

export default function OrganizationTab({ data, canEdit, onChange }: OrganizationTabProps) {
  const { t } = useTranslation();

  const handleOrgChange = (field: keyof SystemSettings['org'], value: string) => {
    if (!canEdit) return;
    onChange({
      org: {
        ...data.org,
        [field]: value,
      },
    });
  };

  const handleLogoUpload = () => {
    if (!canEdit) return;
    // Mock logo upload
    const mockUrl = 'https://via.placeholder.com/120x40/1e40af/ffffff?text=LOGO';
    handleOrgChange('logoUrl', mockUrl);
  };

  const handleFaviconUpload = () => {
    if (!canEdit) return;
    // Mock favicon upload
    const mockUrl = 'https://via.placeholder.com/32x32/1e40af/ffffff?text=ICO';
    handleOrgChange('faviconUrl', mockUrl);
  };

  const removeLogo = () => {
    if (!canEdit) return;
    handleOrgChange('logoUrl', '');
  };

  const removeFavicon = () => {
    if (!canEdit) return;
    handleOrgChange('faviconUrl', '');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">{t('systemSettings.organization.title')}</h2>
        <p className="text-slate-400 mt-1">{t('systemSettings.organization.subtitle')}</p>
      </div>

      <div className="space-y-6">
        {/* Organization Name */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Building2 className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">
              {t('systemSettings.organization.organizationName')}
            </h3>
          </div>

          <input
            type="text"
            value={data.org.name}
            onChange={(e) => handleOrgChange('name', e.target.value)}
            disabled={!canEdit}
            className={`w-full px-4 py-3 rounded-lg border text-white placeholder-slate-400 transition-colors ${
              canEdit
                ? 'bg-slate-700 border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
            placeholder="输入机构名称"
          />
        </div>

        {/* Logo Upload */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Upload className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-semibold text-white">
              {t('systemSettings.organization.logoUpload')}
            </h3>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-slate-400">
              {t('systemSettings.organization.logoUploadDesc')}
            </p>

            {data.org.logoUrl ? (
              <div className="flex items-center space-x-4">
                <img
                  src={data.org.logoUrl}
                  alt="Organization Logo"
                  className="h-10 w-auto bg-white rounded p-1"
                />
                <button
                  onClick={removeLogo}
                  disabled={!canEdit}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    canEdit
                      ? 'text-red-400 hover:bg-red-500/10 border border-red-500/20'
                      : 'text-slate-400 border border-slate-700 cursor-not-allowed'
                  }`}
                >
                  <X className="w-4 h-4" />
                  <span>{t('systemSettings.organization.removeLogo')}</span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogoUpload}
                disabled={!canEdit}
                className={`flex items-center space-x-2 px-4 py-3 border-2 border-dashed rounded-lg transition-colors ${
                  canEdit
                    ? 'border-slate-600 hover:border-blue-500 text-slate-300 hover:text-white'
                    : 'border-slate-700 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Upload className="w-5 h-5" />
                <span>{t('systemSettings.organization.uploadLogo')}</span>
              </button>
            )}
          </div>
        </div>

        {/* Theme Color */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Palette className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">
              {t('systemSettings.organization.primaryColor')}
            </h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <input
                type="color"
                value={data.org.primaryColor || '#1e40af'}
                onChange={(e) => handleOrgChange('primaryColor', e.target.value)}
                disabled={!canEdit}
                className={`w-12 h-12 rounded-lg border cursor-pointer ${
                  canEdit ? 'border-slate-600' : 'border-slate-700 cursor-not-allowed'
                }`}
              />
              <div>
                <input
                  type="text"
                  value={data.org.primaryColor || '#1e40af'}
                  onChange={(e) => handleOrgChange('primaryColor', e.target.value)}
                  disabled={!canEdit}
                  className={`px-3 py-2 rounded-lg border font-mono text-sm ${
                    canEdit
                      ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                  placeholder="#1e40af"
                />
              </div>
            </div>

            {/* Theme Preview */}
            <div className="mt-4">
              <h4 className="text-sm font-medium text-slate-300 mb-3">
                {t('systemSettings.organization.themePreview')}
              </h4>
              <div className="grid grid-cols-3 gap-3">
                <div 
                  className="h-8 rounded flex items-center justify-center text-white text-xs font-medium"
                  style={{ backgroundColor: data.org.primaryColor || '#1e40af' }}
                >
                  Primary
                </div>
                <div 
                  className="h-8 rounded flex items-center justify-center text-white text-xs font-medium"
                  style={{ backgroundColor: `${data.org.primaryColor || '#1e40af'}80` }}
                >
                  Primary/50
                </div>
                <div 
                  className="h-8 rounded flex items-center justify-center text-xs font-medium border"
                  style={{ 
                    backgroundColor: `${data.org.primaryColor || '#1e40af'}20`,
                    borderColor: `${data.org.primaryColor || '#1e40af'}40`,
                    color: data.org.primaryColor || '#1e40af'
                  }}
                >
                  Primary/10
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Favicon Upload */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Upload className="w-5 h-5 text-yellow-400" />
            <h3 className="text-lg font-semibold text-white">
              {t('systemSettings.organization.faviconUpload')}
            </h3>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-slate-400">
              {t('systemSettings.organization.faviconUploadDesc')}
            </p>

            {data.org.faviconUrl ? (
              <div className="flex items-center space-x-4">
                <img
                  src={data.org.faviconUrl}
                  alt="Favicon"
                  className="h-8 w-8 rounded bg-white p-1"
                />
                <button
                  onClick={removeFavicon}
                  disabled={!canEdit}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    canEdit
                      ? 'text-red-400 hover:bg-red-500/10 border border-red-500/20'
                      : 'text-slate-400 border border-slate-700 cursor-not-allowed'
                  }`}
                >
                  <X className="w-4 h-4" />
                  <span>{t('systemSettings.organization.removeFavicon')}</span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleFaviconUpload}
                disabled={!canEdit}
                className={`flex items-center space-x-2 px-4 py-3 border-2 border-dashed rounded-lg transition-colors ${
                  canEdit
                    ? 'border-slate-600 hover:border-yellow-500 text-slate-300 hover:text-white'
                    : 'border-slate-700 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Upload className="w-5 h-5" />
                <span>{t('systemSettings.organization.uploadFavicon')}</span>
              </button>
            )}
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