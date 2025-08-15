import React from 'react';
import { text, cardBase, sectionTitle, layouts } from '../../styles/tokens';

interface MonthlyData {
  month: string;
  alerts: number;
  resolved: number;
  falsePositives: number;
}

interface MonthlyStatsProps {
  stats?: MonthlyData[];
  density?: 'normal' | 'compact';
}

export default function MonthlyStats({ stats = [], density = 'normal' }: MonthlyStatsProps) {
  const safeStats = Array.isArray(stats) ? stats : [];
  const maxAlerts = safeStats.length > 0 ? Math.max(...safeStats.map(s => s.alerts)) : 1;
  
  // Compact density styles
  const isCompact = density === 'compact';
  const containerPadding = isCompact ? 'p-6 lg:p-6' : layouts.tightPadding;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const titleSize = isCompact ? 'text-2xl lg:text-2xl font-semibold' : sectionTitle;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const rowHeight = isCompact ? 'h-4' : 'h-3';
  const headerMargin = isCompact ? 'mb-4' : 'mb-4';
  
  return (
    <div className={`${cardBase} h-full flex flex-col min-h-[260px]`}>
      <div className={`${containerPadding}`}>
        <div className={`flex items-center justify-between ${headerMargin}`}>
          <div>
            <h3 className="text-2xl lg:text-2xl font-semibold text-white">月度统计概览</h3>
            <p className="text-xs md:text-sm text-slate-300">Monthly Statistics Overview</p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-slate-300">预警</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-slate-300">解决</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <span className="text-slate-300">误报</span>
            </div>
          </div>
        </div>
        
        {/* Chart */}
        <div className="flex-1 overflow-hidden">
          <div className="space-y-4">
            {safeStats.map((data, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className={`${text.h4} font-medium`}>{data.month}</span>
                  <div className="flex items-center space-x-3 text-[10px]">
                    <span className="text-blue-300 flex items-center">
                      <span className="mr-1">总:</span> 
                      <span className="text-blue-200 font-semibold">{data.alerts}</span>
                    </span>
                    <span className="text-green-300 flex items-center">
                      <span className="mr-1">解决:</span> 
                      <span className="text-green-200 font-semibold">{data.resolved}</span>
                    </span>
                    <span className="text-red-300 flex items-center">
                      <span className="mr-1">误报:</span> 
                      <span className="text-red-200 font-semibold">{data.falsePositives}</span>
                    </span>
                  </div>
                </div>
                
                {/* Bar visualization - compact */}
                <div className="relative h-4 bg-slate-700/50 rounded-full overflow-hidden shadow-inner">
                  {/* Total alerts background */}
                  <div 
                    className="absolute left-0 top-0 h-full bg-blue-500/20 rounded-full transition-all duration-300"
                    style={{ width: `${(data.alerts / maxAlerts) * 100}%` }}
                  ></div>
                  
                  {/* Resolved bar */}
                  <div 
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-300"
                    style={{ width: `${(data.resolved / maxAlerts) * 100}%` }}
                  ></div>
                  
                  {/* False positives bar - positioned at the end */}
                  <div 
                    className="absolute right-0 top-0 h-full bg-gradient-to-l from-red-500 to-red-400 rounded-full transition-all duration-300"
                    style={{ width: `${(data.falsePositives / maxAlerts) * 100}%` }}
                  ></div>
                  
                  {/* Percentage label */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-[9px] font-semibold drop-shadow">
                      {data.alerts > 0 && `${Math.round((data.resolved / data.alerts) * 100)}%`}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Summary */}
        <div className="mt-4 pt-3 border-t border-slate-700">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-slate-700/30 rounded-md p-2 border border-slate-600">
              <div className={`text-2xl lg:text-2xl text-blue-300 mb-1`}>
                {safeStats.reduce((sum, s) => sum + s.alerts, 0)}
              </div>
              <div className="text-xs md:text-sm text-slate-300">总预警数</div>
            </div>
            <div className="bg-slate-700/30 rounded-md p-2 border border-slate-600">
              <div className={`text-2xl lg:text-2xl text-green-300 mb-1`}>
                {safeStats.length > 0 ? Math.round((safeStats.reduce((sum, s) => sum + s.resolved, 0) / safeStats.reduce((sum, s) => sum + s.alerts, 0)) * 100) : 0}%
              </div>
              <div className="text-xs md:text-sm text-slate-300">解决率</div>
            </div>
            <div className="bg-slate-700/30 rounded-md p-2 border border-slate-600">
              <div className={`text-2xl lg:text-2xl text-red-300 mb-1`}>
                {safeStats.length > 0 ? Math.round((safeStats.reduce((sum, s) => sum + s.falsePositives, 0) / safeStats.reduce((sum, s) => sum + s.alerts, 0)) * 100) : 0}%
              </div>
              <div className="text-xs md:text-sm text-slate-300">误报率</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}