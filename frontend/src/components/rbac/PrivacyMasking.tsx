// Privacy masking component for role-based media access control
// Directors see original media, Professors see blurred content with privacy banners

import React, { useState } from 'react';
import { useRBAC } from '../rbac/RBACProvider';
import { Eye, EyeOff, Shield, Lock } from 'lucide-react';

interface PrivacyMaskedMediaProps {
  children: React.ReactNode;
  mediaType?: 'video' | 'image' | 'audio';
  classroomId?: string;
  showControls?: boolean;
}

export function PrivacyMaskedMedia({ 
  children, 
  mediaType = 'video', 
  classroomId,
  showControls = true 
}: PrivacyMaskedMediaProps) {
  const { currentRole, hasPermission } = useRBAC();
  const [isBlurred, setIsBlurred] = useState(currentRole === 'professor');
  const [showWarning, setShowWarning] = useState(true);
  
  const canViewOriginal = hasPermission('viewOriginalVideo');
  const shouldBlur = currentRole === 'professor' && isBlurred;

  return (
    <div className="relative overflow-hidden rounded-lg">
      {/* Media Container */}
      <div className={`relative ${shouldBlur ? 'filter blur-md' : ''} transition-all duration-300`}>
        {children}
        
        {/* Privacy Overlay for Professors */}
        {shouldBlur && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <div className="bg-slate-900/80 rounded-lg p-3 text-center">
              <Lock className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
              <div className="text-sm text-white font-medium">隐私保护模式</div>
              <div className="text-xs text-slate-300">Privacy Protection Mode</div>
            </div>
          </div>
        )}
      </div>

      {/* Privacy Banner */}
      {currentRole === 'professor' && showWarning && (
        <div className="absolute top-2 left-2 right-2 bg-yellow-900/90 border border-yellow-700 rounded-lg p-2 text-xs z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-yellow-400 flex-shrink-0" />
              <div>
                <div className="text-yellow-200 font-medium">基于角色已启用隐私遮罩</div>
                <div className="text-yellow-300">Privacy masking enabled based on role</div>
              </div>
            </div>
            <button
              onClick={() => setShowWarning(false)}
              className="text-yellow-400 hover:text-yellow-300 ml-2"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Director Full Access Banner */}
      {currentRole === 'director' && showWarning && (
        <div className="absolute top-2 left-2 right-2 bg-green-900/90 border border-green-700 rounded-lg p-2 text-xs z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-green-400 flex-shrink-0" />
              <div>
                <div className="text-green-200 font-medium">主任权限 - 完整媒体访问</div>
                <div className="text-green-300">Director Access - Full Media Access</div>
              </div>
            </div>
            <button
              onClick={() => setShowWarning(false)}
              className="text-green-400 hover:text-green-300 ml-2"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Media Controls for Professors */}
      {showControls && currentRole === 'professor' && (
        <div className="absolute bottom-2 right-2 flex space-x-2">
          <button
            onClick={() => setIsBlurred(!isBlurred)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              isBlurred 
                ? 'bg-yellow-700 hover:bg-yellow-600 text-yellow-100' 
                : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
            }`}
            title={isBlurred ? '临时显示原始画面 / Temporarily show original' : '启用隐私遮罩 / Enable privacy masking'}
          >
            {isBlurred ? (
              <>
                <EyeOff className="w-3 h-3 inline mr-1" />
                显示原始 / Show Original
              </>
            ) : (
              <>
                <Eye className="w-3 h-3 inline mr-1" />
                隐私模式 / Privacy Mode
              </>
            )}
          </button>
        </div>
      )}

      {/* Access Level Indicator */}
      <div className="absolute bottom-2 left-2 bg-slate-900/80 rounded px-2 py-1 text-xs">
        <div className="flex items-center space-x-1">
          {currentRole === 'director' ? (
            <>
              <Shield className="w-3 h-3 text-green-400" />
              <span className="text-green-300">完整访问 / Full Access</span>
            </>
          ) : (
            <>
              <Lock className="w-3 h-3 text-yellow-400" />
              <span className="text-yellow-300">受限访问 / Restricted Access</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Higher-order component for wrapping any media element
export function withPrivacyMasking<P extends object>(
  MediaComponent: React.ComponentType<P>,
  options: { mediaType?: 'video' | 'image' | 'audio'; showControls?: boolean } = {}
) {
  return function PrivacyMaskedComponent(props: P) {
    return (
      <PrivacyMaskedMedia {...options}>
        <MediaComponent {...props} />
      </PrivacyMaskedMedia>
    );
  };
}

// Specialized components for different media types
export function PrivacyMaskedVideo({ 
  src, 
  className = '', 
  classroomId,
  ...props 
}: { 
  src: string; 
  className?: string; 
  classroomId?: string;
  [key: string]: any;
}) {
  return (
    <PrivacyMaskedMedia mediaType="video" classroomId={classroomId}>
      <video
        src={src}
        className={`w-full h-full object-cover ${className}`}
        {...props}
      />
    </PrivacyMaskedMedia>
  );
}

export function PrivacyMaskedImage({ 
  src, 
  alt, 
  className = '', 
  classroomId,
  ...props 
}: { 
  src: string; 
  alt: string; 
  className?: string; 
  classroomId?: string;
  [key: string]: any;
}) {
  return (
    <PrivacyMaskedMedia mediaType="image" classroomId={classroomId}>
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover ${className}`}
        {...props}
      />
    </PrivacyMaskedMedia>
  );
}

// Role-based media access guard
export function MediaAccessGuard({ 
  children, 
  requiredPermission = 'viewBlurredVideo',
  fallback 
}: {
  children: React.ReactNode;
  requiredPermission?: string;
  fallback?: React.ReactNode;
}) {
  const { hasPermission, currentRole } = useRBAC();
  
  if (!hasPermission(requiredPermission as any)) {
    return (
      <div className="flex items-center justify-center bg-slate-800 rounded-lg p-8 text-center">
        <div>
          <Lock className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-white mb-2">媒体访问受限</h3>
          <p className="text-slate-400 text-sm mb-1">Media Access Restricted</p>
          <p className="text-xs text-slate-500">
            当前角色 ({currentRole === 'director' ? '主任' : '教授'}) 无权访问此媒体内容
          </p>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
}