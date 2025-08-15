import React from 'react';
import { School, ArrowRight } from 'lucide-react';

interface KeyMetricActiveClassroomsProps {
  density?: 'normal' | 'compact';
}

const Card: React.FC<React.PropsWithChildren<{className?: string}>> = ({ children, className = '' }) => (
  <div className={`rounded-2xl bg-[#121a23] ring-1 ring-white/5 shadow-[0_1px_0_#ffffff0a_inset,0_8px_24px_#000000c0] p-4 md:p-5 h-auto min-h-[152px] flex flex-col ${className}`}>
    {children}
  </div>
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function KeyMetricActiveClassrooms({ density = 'compact' }: KeyMetricActiveClassroomsProps) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
          <School className="w-4 h-4 text-blue-400/80" />
        </div>
        <div className="text-xs text-gray-400/80 flex items-center bg-gray-700/50 rounded px-2 py-1">
          <ArrowRight className="w-3 h-3" />
          <span className="ml-1 font-bold">0%</span>
        </div>
      </div>
      
      <div className="space-y-1 flex-1">
        <div className="text-[clamp(22px,2vw,28px)] font-semibold text-slate-100">24/25</div>
        <div className="text-[clamp(14px,1.2vw,16px)] font-semibold text-slate-200">活跃教室</div>
        <div className="text-[clamp(11px,0.95vw,13px)] text-white/55">Active Classrooms</div>
      </div>
    </Card>
  );
}