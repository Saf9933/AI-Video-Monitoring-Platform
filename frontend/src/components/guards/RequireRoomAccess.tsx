// Route guard component for classroom access control
// Redirects unauthorized users with toast notifications

import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRBAC } from '../rbac/RBACProvider';

interface RequireRoomAccessProps {
  children: React.ReactNode;
}

// Toast notification for unauthorized access (simple implementation)
const showUnauthorizedToast = (roomId: string) => {
  // Create a simple toast notification
  const toast = document.createElement('div');
  toast.className = 'fixed top-4 right-4 z-50 bg-red-900/90 border border-red-700 text-red-200 px-4 py-3 rounded-lg shadow-lg max-w-sm';
  toast.innerHTML = `
    <div class="flex items-center space-x-2">
      <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
      </svg>
      <div>
        <div class="font-medium">无权访问该教室</div>
        <div class="text-xs mt-1 text-red-300">No access to classroom ${roomId}</div>
      </div>
    </div>
  `;
  
  document.body.appendChild(toast);
  
  // Remove toast after 5 seconds
  setTimeout(() => {
    if (document.body.contains(toast)) {
      document.body.removeChild(toast);
    }
  }, 5000);
};

export function RequireRoomAccess({ children }: RequireRoomAccessProps) {
  const { id: roomId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isRoomAccessible, currentRole } = useRBAC();
  
  useEffect(() => {
    if (roomId && !isRoomAccessible(roomId)) {
      // Show unauthorized toast
      showUnauthorizedToast(roomId);
      
      // Redirect to classrooms list
      navigate('/classrooms', { replace: true });
    }
  }, [roomId, isRoomAccessible, navigate]);
  
  // If no roomId or access is granted, render children
  if (!roomId || isRoomAccessible(roomId)) {
    return <>{children}</>;
  }
  
  // While redirecting, show loading state
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="w-16 h-16 bg-red-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">权限不足</h3>
        <p className="text-slate-400 mb-4">无权访问教室 {roomId}</p>
        <p className="text-sm text-slate-500">Access Denied - No access to classroom {roomId}</p>
      </div>
    </div>
  );
}

// Alternative implementation using error boundary pattern
export function ClassroomAccessBoundary({ children }: RequireRoomAccessProps) {
  const { id: roomId } = useParams<{ id: string }>();
  const { isRoomAccessible } = useRBAC();
  
  if (!roomId) {
    return <>{children}</>;
  }
  
  if (!isRoomAccessible(roomId)) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">访问受限</h2>
          <p className="text-slate-300 mb-2">您无权访问教室 {roomId}</p>
          <p className="text-sm text-slate-400 mb-6">Access Restricted - You don't have permission to access classroom {roomId}</p>
          
          <button 
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            返回 / Go Back
          </button>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
}