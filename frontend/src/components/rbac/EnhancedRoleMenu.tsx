// Enhanced role menu with comprehensive role information and login code management
// Chinese-first UI with access scope, permissions, and demo login codes

import React, { useState } from 'react';
import { useRBAC } from '../rbac/RBACProvider';
import { Role } from '../../data/classrooms/types';
import { ChevronDown, Copy, RefreshCw, X, Shield, Users, Eye, Key } from 'lucide-react';

export function EnhancedRoleMenu() {
  const {
    currentRole,
    user,
    roleScope,
    scopeCount,
    loginCode,
    switchRole,
    regenerateLoginCode,
    revokeLoginCode
  } = useRBAC();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pin, setPin] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showPinModal, setShowPinModal] = useState(false);
  const [error, setError] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  const roleConfig = {
    professor: {
      zh: '教授',
      en: 'Professor',
      icon: Users,
      color: 'blue',
      pin: '0000'
    },
    director: {
      zh: '主任', 
      en: 'Director',
      icon: Shield,
      color: 'purple',
      pin: '0303'
    }
  };

  const handleRoleSwitch = (role: Role) => {
    setSelectedRole(role);
    setShowPinModal(true);
    setPin('');
    setError('');
  };

  const handlePinSubmit = async () => {
    if (!selectedRole) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const success = await switchRole(selectedRole, pin);
      if (success) {
        setShowPinModal(false);
        setIsOpen(false);
        setPin('');
      } else {
        setError('PIN码错误，请重试 / Incorrect PIN, please try again');
      }
    } catch (err) {
      setError('切换失败，请重试 / Switch failed, please try again');
    } finally {
      setIsLoading(false);
    }
  };

  const copyLoginCode = async () => {
    try {
      await navigator.clipboard.writeText(loginCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (err) {
      console.error('Failed to copy login code:', err);
    }
  };

  const currentConfig = roleConfig[currentRole];
  const otherRole = currentRole === 'professor' ? 'director' : 'professor';
  const otherConfig = roleConfig[otherRole];
  
  // Extract components to avoid JSX dynamic component issues
  const CurrentIcon = currentConfig.icon;
  const OtherIcon = otherConfig.icon;

  return (
    <>
      {/* Role Menu Button */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-slate-800/50 transition-colors group"
        >
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-${currentConfig.color}-900/50 border border-${currentConfig.color}-700`}>
            <CurrentIcon className={`w-4 h-4 text-${currentConfig.color}-300`} />
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-sm font-medium text-white">{currentConfig.zh}</div>
            <div className="text-xs text-slate-400">{currentConfig.en}</div>
          </div>
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-80 bg-slate-800 border border-slate-700 rounded-xl shadow-lg z-50">
            {/* Current Role Section */}
            <div className="p-4 border-b border-slate-700">
              <div className="flex items-center space-x-3 mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${currentConfig.color}-900/50 border border-${currentConfig.color}-700`}>
                  <CurrentIcon className={`w-5 h-5 text-${currentConfig.color}-300`} />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">当前角色 / Current Role</div>
                  <div className="text-lg font-bold text-white">{currentConfig.zh} / {currentConfig.en}</div>
                </div>
              </div>
              
              <div className="text-xs text-slate-400 mb-2">{user.name} • {user.email}</div>
            </div>

            {/* Access Scope Section */}
            <div className="p-4 border-b border-slate-700">
              <div className="flex items-center space-x-2 mb-2">
                <Eye className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-medium text-white">访问范围 / Access Scope</span>
              </div>
              <div className="text-sm text-slate-300 mb-2">{roleScope.description.zh}</div>
              <div className="text-xs text-slate-400 mb-3">{roleScope.description.en}</div>
              
              {/* Scope Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-700/50 rounded-lg p-2">
                  <div className="text-xs text-slate-400">教室数量 / Classrooms</div>
                  <div className="text-lg font-bold text-white">{scopeCount}</div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-2">
                  <div className="text-xs text-slate-400">查看范围 / View Scope</div>
                  <div className="text-sm font-medium text-white">{roleScope.accessLevel.zh}</div>
                  <div className="text-xs text-slate-400">{roleScope.accessLevel.en}</div>
                </div>
              </div>
            </div>

            {/* Login Code Section */}
            <div className="p-4 border-b border-slate-700">
              <div className="flex items-center space-x-2 mb-2">
                <Key className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-medium text-white">登录码 / Login Code</span>
                <span className="text-xs text-slate-500">(Demo Only)</span>
              </div>
              
              <div className="bg-slate-900/50 rounded-lg p-3 mb-3">
                <div className="font-mono text-sm text-slate-200 break-all mb-2">{loginCode}</div>
                <div className="flex space-x-2">
                  <button
                    onClick={copyLoginCode}
                    className="flex items-center space-x-1 px-2 py-1 text-xs bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedCode ? '已复制 / Copied' : '复制 / Copy'}</span>
                  </button>
                  <button
                    onClick={regenerateLoginCode}
                    className="flex items-center space-x-1 px-2 py-1 text-xs bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>重新生成 / Regenerate</span>
                  </button>
                  <button
                    onClick={revokeLoginCode}
                    className="flex items-center space-x-1 px-2 py-1 text-xs bg-red-700 hover:bg-red-600 text-white rounded transition-colors"
                  >
                    <X className="w-3 h-3" />
                    <span>撤销 / Revoke</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Role Switch Section */}
            <div className="p-4">
              <div className="text-sm font-medium text-white mb-3">切换角色 / Switch Role</div>
              <button
                onClick={() => handleRoleSwitch(otherRole)}
                className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-700/50 transition-colors group"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-${otherConfig.color}-900/50 border border-${otherConfig.color}-700`}>
                  <OtherIcon className={`w-4 h-4 text-${otherConfig.color}-300`} />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium text-white">{otherConfig.zh} / {otherConfig.en}</div>
                  <div className="text-xs text-slate-400">PIN: {otherConfig.pin}</div>
                </div>
                <div className="text-xs text-slate-400 group-hover:text-slate-300">切换 / Switch</div>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* PIN Modal */}
      {showPinModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">角色切换确认 / Role Switch Confirmation</h3>
              <button
                onClick={() => setShowPinModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {selectedRole && (() => {
              const SelectedRoleIcon = roleConfig[selectedRole].icon;
              const selectedConfig = roleConfig[selectedRole];
              return (
                <div className="mb-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${selectedConfig.color}-900/50 border border-${selectedConfig.color}-700`}>
                      <SelectedRoleIcon className={`w-5 h-5 text-${selectedConfig.color}-300`} />
                    </div>
                    <div>
                      <div className="text-sm text-slate-400">切换到 / Switch to</div>
                      <div className="text-lg font-bold text-white">
                        {selectedConfig.zh} / {selectedConfig.en}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                请输入PIN码 / Enter PIN Code
              </label>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handlePinSubmit()}
                placeholder="4位PIN码 / 4-digit PIN"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={4}
                autoFocus
              />
              {error && (
                <div className="mt-2 text-sm text-red-400">{error}</div>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowPinModal(false)}
                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                取消 / Cancel
              </button>
              <button
                onClick={handlePinSubmit}
                disabled={isLoading || pin.length !== 4}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                {isLoading ? '验证中... / Verifying...' : '确认切换 / Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}