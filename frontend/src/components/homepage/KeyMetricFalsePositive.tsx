import React from 'react';
import { AlertTriangle, TrendingDown } from 'lucide-react';

interface KeyMetricFalsePositiveProps {
  density?: 'normal' | 'compact';
}

const Card: React.FC<React.PropsWithChildren<{className?: string}>> = ({ children, className = '' }) => (
  <div className={`rounded-2xl bg-[#121a23] ring-1 ring-white/5 shadow-[0_1px_0_#ffffff0a_inset,0_8px_24px_#000000c0] p-4 md:p-5 h-auto min-h-[152px] flex flex-col ${className}`}>
    {children}
  </div>
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function KeyMetricFalsePositive({ density = 'compact' }: KeyMetricFalsePositiveProps) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center">
          <AlertTriangle className="w-4 h-4 text-yellow-400/80" />
        </div>
        <div className="text-xs text-green-400/80 flex items-center bg-gray-700/50 rounded px-2 py-1">
          <TrendingDown className="w-3 h-3" />
          <span className="ml-1 font-bold">8%</span>
        </div>
      </div>
      
      <div className="space-y-1 flex-1">
        <div className="text-[clamp(22px,2vw,28px)] font-semibold text-slate-100">5.8%</div>
        <div className="text-[clamp(14px,1.2vw,16px)] font-semibold text-slate-200">误报率</div>
        <div className="text-[clamp(11px,0.95vw,13px)] text-white/55">False Positive Rate</div>
      </div>
    </Card>
  );
}