// src/pages/SystemSettings.tsx
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Save, RotateCcw } from 'lucide-react';
import { useRBAC } from '../components/rbac/RBACProvider';
import { 
  useSystemSettings, 
  useUpdateSystemSettings, 
  useUnsavedChanges 
} from '../data/system/settings.hooks';
import type { SystemSettings } from '../data/system/settings.types';

// Tab components
import OverviewTab from './settings/OverviewTab';
import OrganizationTab from './settings/OrganizationTab';
import AuthTab from './settings/AuthTab';
import AlertsTab from './settings/AlertsTab';
import NotificationsTab from './settings/NotificationsTab';
import RealtimeTab from './settings/RealtimeTab';
import IntegrationsTab from './settings/IntegrationsTab';
import FlagsTab from './settings/FlagsTab';
import MaintenanceTab from './settings/MaintenanceTab';

type TabId = 'overview' | 'organization' | 'auth' | 'alerts' | 'notifications' | 'realtime' | 'integrations' | 'flags' | 'maintenance';

const tabs: Array<{ id: TabId; key: string }> = [
  { id: 'overview', key: 'overview' },
  { id: 'organization', key: 'organization' },
  { id: 'auth', key: 'auth' },
  { id: 'alerts', key: 'alerts' },
  { id: 'notifications', key: 'notifications' },
  { id: 'realtime', key: 'realtime' },
  { id: 'integrations', key: 'integrations' },
  { id: 'flags', key: 'flags' },
  { id: 'maintenance', key: 'maintenance' },
];

export default function SystemSettings() {
  const { t } = useTranslation();
  const { currentRole } = useRBAC();
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  
  // Data fetching
  const { data: settings, isLoading, error } = useSystemSettings();
  const updateMutation = useUpdateSystemSettings();
  
  // Unsaved changes tracking
  const { 
    hasChanges, 
    currentData, 
    markDirty, 
    markClean, 
    revert 
  } = useUnsavedChanges();

  // Initialize data when settings load
  useEffect(() => {
    if (settings && !currentData) {
      markClean(settings);
    }
  }, [settings, currentData, markClean]);

  const canEdit = currentRole === 'director';

  const handleDataChange = (patch: Partial<SystemSettings>) => {
    if (!canEdit) return;
    
    const newData = { ...currentData, ...patch } as SystemSettings;
    markDirty(newData);
  };

  const handleSave = async () => {
    if (!canEdit || !currentData) return;

    try {
      await updateMutation.mutateAsync(currentData);
      markClean(currentData);
      // Toast success is handled by the mutation
    } catch (error) {
      console.error('Failed to save settings:', error);
      // Toast error is handled by the mutation
    }
  };

  const handleDiscard = () => {
    const originalData = revert();
    if (originalData) {
      // Force re-render with original data
      markClean(originalData);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-400 border-t-transparent mb-4 mx-auto" />
          <div className="text-white font-medium">{t('common.loading')}</div>
          <div className="text-slate-400 text-sm">{t('systemSettings.subtitle')}</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-400">
          <Shield className="w-12 h-12 mx-auto mb-4" />
          <div className="font-medium">{t('common.error')}</div>
          <div className="text-sm text-slate-400">{error.message}</div>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    const props = {
      data: currentData || settings!,
      canEdit,
      onChange: handleDataChange,
    };

    switch (activeTab) {
      case 'overview':
        return <OverviewTab {...props} />;
      case 'organization':
        return <OrganizationTab {...props} />;
      case 'auth':
        return <AuthTab {...props} />;
      case 'alerts':
        return <AlertsTab {...props} />;
      case 'notifications':
        return <NotificationsTab {...props} />;
      case 'realtime':
        return <RealtimeTab {...props} />;
      case 'integrations':
        return <IntegrationsTab {...props} />;
      case 'flags':
        return <FlagsTab {...props} />;
      case 'maintenance':
        return <MaintenanceTab {...props} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Shield className="w-6 h-6 text-blue-400" />
              <div>
                <h1 className="text-xl font-bold text-white">{t('systemSettings.title')}</h1>
                <p className="text-sm text-slate-400">{t('systemSettings.subtitle')}</p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center space-x-3">
              {hasChanges && (
                <div className="flex items-center space-x-2">
                  <div className="px-3 py-1 bg-yellow-500/20 text-yellow-300 text-sm rounded-lg border border-yellow-500/30">
                    {t('systemSettings.unsavedChanges')}
                  </div>
                  <button
                    onClick={handleDiscard}
                    className="px-3 py-2 text-slate-300 hover:text-white text-sm font-medium hover:bg-slate-800 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>{t('systemSettings.discardChanges')}</span>
                  </button>
                </div>
              )}
              
              <button
                onClick={handleSave}
                disabled={!canEdit || !hasChanges || updateMutation.isPending}
                className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center space-x-2 transition-colors ${
                  canEdit && hasChanges
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                }`}
                title={!canEdit ? t('systemSettings.restrictedByRole') : undefined}
              >
                <Save className="w-4 h-4" />
                <span>
                  {updateMutation.isPending ? t('common.loading') : t('systemSettings.saveChanges')}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-8">
          {/* Tab Navigation */}
          <div className="w-64 flex-shrink-0">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-slate-800 text-white border border-slate-700'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  {t(`systemSettings.tabs.${tab.key}`)}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="flex-1 min-w-0">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}