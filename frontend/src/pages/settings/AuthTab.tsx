// src/pages/settings/AuthTab.tsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Shield, 
  Plus, 
  Copy, 
  Trash2, 
  Key, 
  Clock,
  CheckCircle 
} from 'lucide-react';
import { 
  useGenerateOneTimeCode, 
  useRevokeOneTimeCode 
} from '../../data/system/settings.hooks';
import type { SystemSettings, OneTimeCode } from '../../data/system/settings.types';

interface AuthTabProps {
  data: SystemSettings;
  canEdit: boolean;
  onChange: (patch: Partial<SystemSettings>) => void;
}

export default function AuthTab({ data, canEdit, onChange }: AuthTabProps) {
  const { t } = useTranslation();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [newCode, setNewCode] = useState<string | null>(null);
  
  const generateCodeMutation = useGenerateOneTimeCode();
  const revokeCodeMutation = useRevokeOneTimeCode();

  const handleAuthChange = (field: keyof SystemSettings['auth'], value: any) => {
    if (!canEdit) return;
    onChange({
      auth: {
        ...data.auth,
        [field]: value,
      },
    });
  };

  const handleGenerateCode = async (role: 'professor' | 'director') => {
    if (!canEdit) return;
    
    try {
      const result = await generateCodeMutation.mutateAsync(role);
      setNewCode(result.code);
      // The mutation will update the data automatically through the query cache
    } catch (error) {
      console.error('Failed to generate code:', error);
    }
  };

  const handleRevokeCode = async (codeId: string) => {
    if (!canEdit) return;
    
    try {
      await revokeCodeMutation.mutateAsync(codeId);
      // The mutation will update the data automatically through the query cache
    } catch (error) {
      console.error('Failed to revoke code:', error);
    }
  };

  const copyToClipboard = async (text: string, codeId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(codeId);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const dismissNewCode = () => {
    setNewCode(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">{t('systemSettings.auth.title')}</h2>
        <p className="text-slate-400 mt-1">{t('systemSettings.auth.subtitle')}</p>
      </div>

      {/* New Code Alert */}
      {newCode && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-emerald-300 font-medium">{t('systemSettings.messages.generateCodeSuccess')}</h4>
                <div className="mt-2 bg-slate-800 rounded-lg p-3 font-mono text-sm">
                  <div className="text-slate-300">完整登录码:</div>
                  <div className="text-white font-bold text-lg">{newCode}</div>
                </div>
                <p className="text-emerald-200 text-sm mt-2">
                  请立即复制此登录码，它只会显示一次。
                </p>
              </div>
            </div>
            <button
              onClick={dismissNewCode}
              className="text-slate-400 hover:text-white"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* One-time Codes */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Key className="w-5 h-5 text-yellow-400" />
              <h3 className="text-lg font-semibold text-white">
                {t('systemSettings.auth.oneTimeCodes.title')}
              </h3>
            </div>
            
            {canEdit && (
              <div className="flex space-x-2">
                <button
                  onClick={() => handleGenerateCode('professor')}
                  disabled={generateCodeMutation.isPending}
                  className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t('systemSettings.auth.oneTimeCodes.generateProfessor')}</span>
                </button>
                <button
                  onClick={() => handleGenerateCode('director')}
                  disabled={generateCodeMutation.isPending}
                  className="flex items-center space-x-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t('systemSettings.auth.oneTimeCodes.generateDirector')}</span>
                </button>
              </div>
            )}
          </div>

          <p className="text-sm text-slate-400 mb-4">
            {t('systemSettings.auth.oneTimeCodes.description')}
          </p>

          {/* Active Codes Table */}
          <div className="overflow-hidden rounded-lg border border-slate-700">
            <table className="w-full">
              <thead className="bg-slate-700/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">
                    {t('systemSettings.auth.oneTimeCodes.role')}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">
                    {t('systemSettings.auth.oneTimeCodes.code')}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">
                    {t('systemSettings.auth.oneTimeCodes.created')}
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-slate-300">
                    {t('common.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {data.auth.codes.map((code) => (
                  <tr key={code.id} className="bg-slate-800/30">
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        code.role === 'director' 
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}>
                        {t(`rbac.roles.${code.role}`)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <code className={`font-mono text-sm ${
                        code.revoked ? 'text-slate-500 line-through' : 'text-white'
                      }`}>
                        {code.masked}
                      </code>
                      {code.revoked && (
                        <span className="ml-2 text-xs text-red-400">
                          {t('systemSettings.auth.oneTimeCodes.revoked')}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-400">
                      {new Date(code.createdAt).toLocaleString('zh-CN')}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {!code.revoked && (
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => copyToClipboard(code.masked, code.id)}
                            className="flex items-center space-x-1 px-2 py-1 text-slate-400 hover:text-white rounded transition-colors"
                            title={t('systemSettings.auth.oneTimeCodes.copy')}
                          >
                            {copiedCode === code.id ? (
                              <CheckCircle className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                          {canEdit && (
                            <button
                              onClick={() => handleRevokeCode(code.id)}
                              disabled={revokeCodeMutation.isPending}
                              className="flex items-center space-x-1 px-2 py-1 text-red-400 hover:text-red-300 rounded transition-colors"
                              title={t('systemSettings.auth.oneTimeCodes.revoke')}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Role Defaults */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">
              {t('systemSettings.auth.roleDefaults.title')}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t('systemSettings.auth.roleDefaults.defaultRole')}
              </label>
              <select
                value={data.auth.defaultRole}
                onChange={(e) => handleAuthChange('defaultRole', e.target.value)}
                disabled={!canEdit}
                className={`w-full px-3 py-2 rounded-lg border text-white ${
                  canEdit
                    ? 'bg-slate-700 border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                <option value="professor">{t('rbac.roles.professor')}</option>
                <option value="director">{t('rbac.roles.director')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t('systemSettings.auth.roleDefaults.sessionLength')}
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="30"
                  max="1440"
                  value={data.auth.sessionMinutes}
                  onChange={(e) => handleAuthChange('sessionMinutes', parseInt(e.target.value))}
                  disabled={!canEdit}
                  className={`w-full px-3 py-2 pr-12 rounded-lg border text-white ${
                    canEdit
                      ? 'bg-slate-700 border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                />
                <Clock className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t('systemSettings.auth.roleDefaults.idleTimeout')}
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="5"
                  max="120"
                  value={data.auth.idleTimeoutMinutes}
                  onChange={(e) => handleAuthChange('idleTimeoutMinutes', parseInt(e.target.value))}
                  disabled={!canEdit}
                  className={`w-full px-3 py-2 pr-12 rounded-lg border text-white ${
                    canEdit
                      ? 'bg-slate-700 border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                />
                <Clock className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
              </div>
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