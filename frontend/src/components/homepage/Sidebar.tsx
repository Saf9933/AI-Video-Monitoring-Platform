import React from 'react';
import { 
  Home,
  BarChart3, 
  AlertTriangle, 
  School, 
  Users, 
  TrendingUp, 
  Settings, 
  Shield, 
  HelpCircle,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage?: string;
}

export default function Sidebar({ isOpen, onClose, currentPage = 'home' }: SidebarProps) {
  const navigation = [
    { name: '主页', nameEn: 'Home', icon: Home, href: '#home', pageId: 'home' },
    { name: '预警管理', nameEn: 'Alerts', icon: AlertTriangle, href: '#alerts', pageId: 'alerts' },
    { name: '数据分析', nameEn: 'Analytics', icon: TrendingUp, href: '#analytics', pageId: 'analytics' },
    { name: '学生档案', nameEn: 'Students', icon: Users, href: '#students', pageId: 'students' },
    { name: '通知中心', nameEn: 'Notifications', icon: HelpCircle, href: '#notifications', pageId: 'notifications' },
    { name: '教室监控', nameEn: 'Classrooms', icon: School, href: '#classrooms', pageId: 'classrooms' },
    { name: '隐私合规', nameEn: 'Privacy', icon: Shield, href: '#privacy', pageId: 'privacy' },
    { name: '系统设置', nameEn: 'Settings', icon: Settings, href: '#settings', pageId: 'settings' }
  ];

  const handleNavigation = (pageId: string) => {
    // Dispatch custom event to switch layout
    const event = new CustomEvent('switchToOldLayout', { detail: { page: pageId } });
    window.dispatchEvent(event);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full bg-gray-800 border-r border-gray-700 z-50 transition-all duration-200
        ${isOpen ? 'w-64' : 'w-16 lg:w-16'}
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full pt-20">
          {/* Navigation */}
          <nav className="flex-1 px-2 py-6 space-y-1">
            {navigation.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.pageId)}
                  className={`
                    w-full flex items-center justify-center p-4 rounded-xl transition-all duration-200
                    ${currentPage === item.pageId
                      ? 'bg-gray-700 text-white shadow-lg' 
                      : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                    }
                    ${!isOpen ? 'h-12' : 'px-4 py-3 justify-start'}
                  `}
                  title={!isOpen ? item.name : undefined}
                >
                  <IconComponent className={`${isOpen ? 'w-5 h-5' : 'w-5 h-5'}`} />
                  {isOpen && (
                    <div className="ml-3 truncate">
                      <div className="text-sm font-medium">{item.name}</div>
                      {item.nameEn && (
                        <div className="text-xs text-gray-400 font-normal">{item.nameEn}</div>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
          
          {/* Footer */}
          <div className="p-4 border-t border-gray-700">
            {isOpen ? (
              <div className="text-center">
                <p className="text-gray-400 text-xs">学生安全监控平台</p>
                <p className="text-gray-500 text-xs mt-1">v2.1.3</p>
              </div>
            ) : (
              <div className="text-center">
                <span className="text-gray-400 text-xs">v2.1</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Close button for mobile */}
        {isOpen && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-700 transition-colors lg:hidden"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>
    </>
  );
}