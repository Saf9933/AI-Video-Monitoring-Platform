// Role Toggle Component with PIN Authentication
// Allows switching between Professor (0000) and Director (0303) roles

import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, User, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { useRBAC } from './RBACProvider';
import { Role } from '../../data/classrooms/types';

interface RoleToggleWithPinProps {
  className?: string;
}

export function RoleToggleWithPin({ className = '' }: RoleToggleWithPinProps) {
  const { t } = useTranslation();
  const { currentRole, user, switchRole } = useRBAC();
  const [showModal, setShowModal] = useState(false);
  const [targetRole, setTargetRole] = useState<Role>('professor');
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [shakeAnimation, setShakeAnimation] = useState(false);
  const pinInputRef = useRef<HTMLInputElement>(null);

  // Role display configuration
  const roleConfig = {
    professor: {
      icon: User,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-500/30'
    },
    director: {
      icon: Shield,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/20',
      borderColor: 'border-emerald-500/30'
    }
  };

  const currentConfig = roleConfig[currentRole];
  const targetConfig = roleConfig[targetRole];
  const CurrentIcon = currentConfig.icon;
  const TargetIcon = targetConfig.icon;

  // Handle role switch initiation
  const handleRoleSwitchClick = (newRole: Role) => {
    if (newRole === currentRole) return;
    
    setTargetRole(newRole);
    setShowModal(true);
    setPin('');
    setError('');
    setTimeout(() => pinInputRef.current?.focus(), 100);
  };

  // Handle PIN submission
  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 4) return;

    setIsLoading(true);
    setError('');

    try {
      const success = await switchRole(targetRole, pin);
      
      if (success) {
        // Success toast
        setShowModal(false);
        setPin('');
        
        // Show success notification
        const successToast = document.createElement('div');
        successToast.className = 'fixed top-4 right-4 z-50 bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2';
        successToast.innerHTML = `
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span>${t('switchSuccess', { role: t(`roles.${targetRole}`) })}</span>
        `;
        document.body.appendChild(successToast);
        setTimeout(() => document.body.removeChild(successToast), 3000);
      } else {
        // Wrong PIN
        setError(t('errors.wrongPin'));
        setPin('');
        setShakeAnimation(true);
        setTimeout(() => setShakeAnimation(false), 500);
        
        // Show error toast
        const errorToast = document.createElement('div');
        errorToast.className = 'fixed top-4 right-4 z-50 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2';
        errorToast.innerHTML = `
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          <span>${t('errors.wrongPin')}</span>
        `;
        document.body.appendChild(errorToast);
        setTimeout(() => document.body.removeChild(errorToast), 3000);
        
        setTimeout(() => pinInputRef.current?.focus(), 100);
      }
    } catch (error) {
      setError(t('errors.systemError'));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle PIN input change
  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setPin(value);
    setError('');
  };

  // Handle modal close
  const handleCloseModal = () => {
    setShowModal(false);
    setPin('');
    setError('');
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseModal();
      }
    };

    if (showModal) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [showModal]);

  return (
    <>
      {/* Current Role Display & Switch Buttons */}
      <div className={`flex items-center space-x-3 ${className}`}>
        {/* Current Role Badge */}
        <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${currentConfig.bgColor} ${currentConfig.borderColor} border`}>
          <CurrentIcon className={`w-4 h-4 ${currentConfig.color}`} />
          <span className="text-sm font-medium text-white">
            {t(`rbac.roles.${currentRole}`)}
          </span>
        </div>

        {/* Role Switch Buttons */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => handleRoleSwitchClick('professor')}
            disabled={currentRole === 'professor'}
            className={`p-2 rounded-lg transition-all duration-200 ${
              currentRole === 'professor'
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-blue-400'
            }`}
            title={t(`rbac.roles.professor`)}
          >
            <User className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => handleRoleSwitchClick('director')}
            disabled={currentRole === 'director'}
            className={`p-2 rounded-lg transition-all duration-200 ${
              currentRole === 'director'
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-emerald-400'
            }`}
            title={t(`rbac.roles.director`)}
          >
            <Shield className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* PIN Input Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div 
            className={`bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-md mx-4 transform transition-all duration-200 ${
              shakeAnimation ? 'animate-shake' : ''
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${targetConfig.bgColor} ${targetConfig.borderColor} border`}>
                  <TargetIcon className={`w-5 h-5 ${targetConfig.color}`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {t('rbac.toggle.title')}
                  </h3>
                  <p className="text-sm text-slate-400">
                    {t('rbac.toggle.switchTo')} {t(`rbac.roles.${targetRole}`)}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-1 text-slate-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* PIN Input Form */}
            <form onSubmit={handlePinSubmit}>
              <div className="mb-4">
                <label htmlFor="pin-input" className="block text-sm font-medium text-slate-200 mb-2">
                  {t('rbac.toggle.enterPin')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    ref={pinInputRef}
                    id="pin-input"
                    type="password"
                    value={pin}
                    onChange={handlePinChange}
                    placeholder={t('rbac.toggle.pinPlaceholder')}
                    className={`w-full pl-10 pr-4 py-3 bg-slate-800 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                      error 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                        : 'border-slate-600 focus:border-slate-500 focus:ring-slate-500/20'
                    }`}
                    maxLength={4}
                    autoComplete="off"
                    disabled={isLoading}
                  />
                  {pin.length === 4 && !error && (
                    <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-emerald-400" />
                  )}
                </div>
                {error && (
                  <div className="flex items-center space-x-2 mt-2 text-red-400">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('rbac.toggle.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={pin.length !== 4 || isLoading}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    targetRole === 'director' 
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      <span>验证中...</span>
                    </div>
                  ) : (
                    t('rbac.toggle.confirm')
                  )}
                </button>
              </div>
            </form>

            {/* Helper Text */}
            <div className="mt-4 p-3 bg-slate-800/50 rounded-lg">
              <div className="text-xs text-slate-400 space-y-1">
                <div className="flex items-center space-x-2">
                  <User className="w-3 h-3" />
                  <span>教授/Professor PIN: 0000</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-3 h-3" />
                  <span>主任/Director PIN: 0303</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add shake animation styles */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </>
  );
}

// Compact version for header/toolbar use
interface CompactRoleToggleProps {
  className?: string;
}

export function CompactRoleToggle({ className = '' }: CompactRoleToggleProps) {
  const { currentRole, user } = useRBAC();
  const [showDropdown, setShowDropdown] = useState(false);
  
  const config = {
    professor: { icon: User, color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
    director: { icon: Shield, color: 'text-emerald-400', bgColor: 'bg-emerald-500/20' }
  };
  
  const currentConfig = config[currentRole];
  const Icon = currentConfig.icon;

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${currentConfig.bgColor} border border-slate-600 hover:border-slate-500 transition-colors`}
      >
        <Icon className={`w-4 h-4 ${currentConfig.color}`} />
        <span className="text-sm font-medium text-white">{user.name}</span>
        <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showDropdown && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute top-full right-0 mt-2 w-48 bg-slate-800 border border-slate-600 rounded-lg shadow-lg z-20">
            <div className="p-3">
              <div className="text-xs text-slate-400 mb-2">当前角色 / Current Role</div>
              <div className="text-sm text-white font-medium">{currentRole === 'professor' ? '教授' : '主任'}</div>
            </div>
            <div className="border-t border-slate-600 p-2">
              <RoleToggleWithPin className="w-full" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}