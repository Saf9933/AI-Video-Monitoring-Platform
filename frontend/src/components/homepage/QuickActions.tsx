import React from 'react';
import { FileText, Bell, Shield, Settings } from 'lucide-react';

interface QuickActionsProps {
  density?: 'normal' | 'compact';
}

const Card: React.FC<React.PropsWithChildren<{className?: string}>> = ({ children, className = '' }) => (
  <div className={`rounded-2xl bg-[#121a23] ring-1 ring-white/5 shadow-[0_1px_0_#ffffff0a_inset,0_8px_24px_#000000c0] p-4 md:p-5 h-auto min-h-[152px] flex flex-col ${className}`}>
    {children}
  </div>
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function QuickActions({ density = 'compact' }: QuickActionsProps) {
  return (
    <Card>
      <h4 className="text-[clamp(14px,1.2vw,16px)] font-semibold text-white mb-4">快速操作</h4>
      <div className="flex-1 overflow-hidden">
        <div className="overflow-y-auto max-h-[280px]">
          <div className="space-y-1">
            <button className="w-full text-left px-3 py-2 text-[clamp(11px,0.95vw,13px)] text-gray-200 hover:bg-gray-600/50 hover:text-white rounded-md transition-all duration-200 flex items-center group">
              <FileText className="w-4 h-4 mr-2 group-hover:scale-105 transition-transform" />
              <span className="font-medium">生成报告</span>
            </button>
            <button className="w-full text-left px-3 py-2 text-[clamp(11px,0.95vw,13px)] text-gray-200 hover:bg-gray-600/50 hover:text-white rounded-md transition-all duration-200 flex items-center group">
              <Bell className="w-4 h-4 mr-2 group-hover:scale-105 transition-transform" />
              <span className="font-medium">设置预警</span>
            </button>
            <button className="w-full text-left px-3 py-2 text-[clamp(11px,0.95vw,13px)] text-gray-200 hover:bg-gray-600/50 hover:text-white rounded-md transition-all duration-200 flex items-center group">
              <Shield className="w-4 h-4 mr-2 group-hover:scale-105 transition-transform" />
              <span className="font-medium">隐私审查</span>
            </button>
            <button className="w-full text-left px-3 py-2 text-[clamp(11px,0.95vw,13px)] text-gray-200 hover:bg-gray-600/50 hover:text-white rounded-md transition-all duration-200 flex items-center group">
              <Settings className="w-4 h-4 mr-2 group-hover:scale-105 transition-transform" />
              <span className="font-medium">系统设置</span>
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}