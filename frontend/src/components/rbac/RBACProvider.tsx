// RBAC (Role-Based Access Control) Context and Provider
// Supports Professor and Director roles with PIN-based authentication

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { Role, Permission, User, RoleContext } from '../data/classrooms/types';

// PIN Configuration
const ROLE_PINS = {
  professor: '0000',
  director: '0303'
} as const;

// Permission definitions for each role
const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  professor: [
    'viewAssignedClassrooms',
    'viewBlurredVideo', 
    'acknowledgeAlerts',
    'assignAlerts'
  ],
  director: [
    'viewAllClassrooms',
    'viewOriginalVideo',
    'exportAuditLogs',
    'modifySettings',
    'acknowledgeAlerts',
    'assignAlerts',
    'escalateAlerts'
  ]
} as const;

// Mock user data - in real implementation this would come from authentication
const MOCK_USERS: Record<Role, User> = {
  professor: {
    id: 'user_prof_demo',
    name: '张教授',
    email: 'zhang.prof@university.edu.cn',
    role: 'professor',
    assignedClassrooms: ['classroom_001', 'classroom_002', 'classroom_003', 'classroom_004', 'classroom_005'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  director: {
    id: 'user_dir_demo',
    name: '王主任',
    email: 'wang.director@university.edu.cn',
    role: 'director',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
};

interface RBACContextType {
  currentRole: Role;
  user: User;
  permissions: Permission[];
  switchRole: (newRole: Role, pin: string) => Promise<boolean>;
  hasPermission: (permission: Permission) => boolean;
  canAccessClassroom: (classroomId: string) => boolean;
  isAuthenticated: boolean;
}

const RBACContext = createContext<RBACContextType | undefined>(undefined);

// Local storage key for role persistence
const STORAGE_KEY = 'classroom_rbac_role';

// Simple checksum for basic validation (not cryptographically secure, just for demo)
const generateChecksum = (role: Role): string => {
  return btoa(role + Date.now().toString()).slice(0, 8);
};

const validateStoredRole = (stored: any): Role | null => {
  try {
    if (stored && typeof stored === 'object' && stored.role && stored.checksum) {
      const { role, checksum, timestamp } = stored;
      // Validate role is valid
      if (role !== 'professor' && role !== 'director') return null;
      // Simple checksum validation (in real app, this would be more secure)
      if (typeof checksum === 'string' && checksum.length === 8) {
        return role;
      }
    }
  } catch {
    return null;
  }
  return null;
};

interface RBACProviderProps {
  children: ReactNode;
  defaultRole?: Role;
}

export function RBACProvider({ children, defaultRole = 'professor' }: RBACProviderProps) {
  // Initialize role from localStorage or default
  const [currentRole, setCurrentRole] = useState<Role>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const validatedRole = validateStoredRole(parsed);
        if (validatedRole) {
          return validatedRole;
        }
      }
    } catch {
      // Invalid storage data, use default
    }
    return defaultRole;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // Get current user and permissions based on role
  const user = MOCK_USERS[currentRole];
  const permissions = ROLE_PERMISSIONS[currentRole];

  // Persist role to localStorage
  useEffect(() => {
    const roleData = {
      role: currentRole,
      checksum: generateChecksum(currentRole),
      timestamp: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(roleData));
  }, [currentRole]);

  const switchRole = useCallback(async (newRole: Role, pin: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Validate PIN
    if (ROLE_PINS[newRole] !== pin) {
      return false;
    }

    // Switch role
    setCurrentRole(newRole);
    return true;
  }, []);

  const hasPermission = useCallback((permission: Permission): boolean => {
    return permissions.includes(permission);
  }, [permissions]);

  const canAccessClassroom = useCallback((classroomId: string): boolean => {
    if (currentRole === 'director') {
      // Directors can access all classrooms
      return true;
    } else {
      // Professors can only access their assigned classrooms
      return user.assignedClassrooms?.includes(classroomId) ?? false;
    }
  }, [currentRole, user.assignedClassrooms]);

  const value: RBACContextType = {
    currentRole,
    user,
    permissions,
    switchRole,
    hasPermission,
    canAccessClassroom,
    isAuthenticated
  };

  return (
    <RBACContext.Provider value={value}>
      {children}
    </RBACContext.Provider>
  );
}

// Hook to use RBAC context
export function useRBAC(): RBACContextType {
  const context = useContext(RBACContext);
  if (context === undefined) {
    throw new Error('useRBAC must be used within an RBACProvider');
  }
  return context;
}

// Higher-order component for role-based route protection
export function withRoleGuard<P extends object>(
  Component: React.ComponentType<P>,
  requiredPermission?: Permission,
  requiredRole?: Role,
  redirectTo?: string
) {
  return function GuardedComponent(props: P) {
    const { hasPermission, currentRole } = useRBAC();
    
    // Check role requirement
    if (requiredRole && currentRole !== requiredRole) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">权限不足</h3>
            <p className="text-slate-400 mb-4">需要{requiredRole === 'director' ? '主任' : '教授'}权限才能访问此页面</p>
            <p className="text-sm text-slate-500">Access Denied - {requiredRole === 'director' ? 'Director' : 'Professor'} role required</p>
          </div>
        </div>
      );
    }

    // Check permission requirement
    if (requiredPermission && !hasPermission(requiredPermission)) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">权限不足</h3>
            <p className="text-slate-400 mb-4">您当前的角色无法执行此操作</p>
            <p className="text-sm text-slate-500">Insufficient permissions for this operation</p>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}

// Component wrapper for conditional rendering based on permissions
interface RoleGuardProps {
  children: ReactNode;
  permission?: Permission;
  role?: Role;
  fallback?: ReactNode;
  classroomId?: string; // For classroom-specific access checks
}

export function RoleGuard({ 
  children, 
  permission, 
  role, 
  fallback = null, 
  classroomId 
}: RoleGuardProps) {
  const { hasPermission, currentRole, canAccessClassroom } = useRBAC();
  
  // Check role requirement
  if (role && currentRole !== role) {
    return <>{fallback}</>;
  }
  
  // Check permission requirement
  if (permission && !hasPermission(permission)) {
    return <>{fallback}</>;
  }
  
  // Check classroom access
  if (classroomId && !canAccessClassroom(classroomId)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}

// Utility hook for classroom access checks
export function useClassroomAccess() {
  const { canAccessClassroom, currentRole, user } = useRBAC();
  
  return {
    canAccessClassroom,
    getAccessibleClassrooms: () => {
      if (currentRole === 'director') {
        return 'all'; // Director can access all classrooms
      } else {
        return user.assignedClassrooms || [];
      }
    },
    isDirector: currentRole === 'director',
    isProfessor: currentRole === 'professor'
  };
}