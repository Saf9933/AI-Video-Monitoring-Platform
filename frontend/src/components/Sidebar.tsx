// src/components/Sidebar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home,
  AlertTriangle, 
  Users, 
  TrendingUp, 
  Settings, 
  Shield, 
  Bell,
  ChevronLeft,
  ChevronRight,
  MonitorSpeaker
} from 'lucide-react';

const items = [
  { path: '/', label: '首页', labelEn: 'Home', icon: Home },
  { path: '/alerts', label: '预警中心', labelEn: 'Alerts', icon: AlertTriangle },
  { path: '/analytics', label: '数据分析', labelEn: 'Analytics', icon: TrendingUp },
  { path: '/students', label: '学生档案', labelEn: 'Students', icon: Users },
  { path: '/notifications', label: '通知中心', labelEn: 'Notifications', icon: Bell },
  { path: '/scenarios', label: '监控场景', labelEn: 'Scenarios', icon: MonitorSpeaker },
  { path: '/settings', label: '系统设置', labelEn: 'Settings', icon: Settings },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: (collapsed: boolean) => void;
}

export default function Sidebar({ isCollapsed, onToggleCollapse }: SidebarProps) {
  const handleToggle = () => {
    onToggleCollapse(!isCollapsed);
  };

  return (
    <aside className={`${isCollapsed ? 'w-16' : 'w-64'} shrink-0 fixed left-0 top-0 h-screen z-50 lg:flex flex-col bg-slate-900/80 border-r border-slate-800 transition-all duration-200 hidden`}>
      {/* Header with collapse toggle */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white">学生安全监控平台</h1>
              <p className="text-xs text-slate-400">Safety Platform</p>
            </div>
          </div>
        )}
        <button
          onClick={handleToggle}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-4 space-y-1 px-3 flex-1">
        {items.map(({ path, label, labelEn, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              [
                'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-slate-800 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              ].join(' ')
            }
            end={path === '/'}
            title={isCollapsed ? label : undefined}
          >
            <Icon className="h-5 w-5 text-slate-400 group-hover:text-white flex-shrink-0" />
            {!isCollapsed && (
              <div className="min-w-0">
                <div className="text-sm font-medium">{label}</div>
                <div className="text-xs text-slate-400 group-hover:text-slate-300">{labelEn}</div>
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800">
        {!isCollapsed ? (
          <div className="text-center">
            <p className="text-xs text-slate-400">学生安全监控平台</p>
            <p className="text-xs text-slate-500 mt-1">v2.1.3</p>
          </div>
        ) : (
          <div className="text-center">
            <span className="text-xs text-slate-400">v2.1</span>
          </div>
        )}
      </div>
    </aside>
  );
}