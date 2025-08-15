import React from 'react';

interface SystemStatusProps {
  density?: 'normal' | 'compact';
}

const Card: React.FC<React.PropsWithChildren<{className?: string}>> = ({ children, className = '' }) => (
  <div className={`rounded-2xl bg-[#121a23] ring-1 ring-white/5 shadow-[0_1px_0_#ffffff0a_inset,0_8px_24px_#000000c0] p-4 md:p-5 h-auto min-h-[152px] flex flex-col ${className}`}>
    {children}
  </div>
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function SystemStatus({ density = 'compact' }: SystemStatusProps) {
  return (
    <Card>
      <h4 className="text-[clamp(14px,1.2vw,16px)] font-semibold text-white mb-4">系统状态</h4>
      <div className="flex-1 overflow-hidden">
        <div className="space-y-3">
          <div className="flex items-center justify-between py-1">
            <span className="text-[clamp(11px,0.95vw,13px)] text-white/55">API 响应</span>
            <span className="text-green-300 font-semibold text-[clamp(11px,0.95vw,13px)]">2.3s</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-[clamp(11px,0.95vw,13px)] text-white/55">系统可用性</span>
            <span className="text-green-300 font-semibold text-[clamp(11px,0.95vw,13px)]">94.2%</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-[clamp(11px,0.95vw,13px)] text-white/55">隐私合规</span>
            <span className="text-green-300 font-semibold text-[clamp(11px,0.95vw,13px)]">100%</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-[clamp(11px,0.95vw,13px)] text-white/55">在线教室</span>
            <span className="text-blue-300 font-semibold text-[clamp(11px,0.95vw,13px)]">24/25</span>
          </div>
        </div>
      </div>
    </Card>
  );
}