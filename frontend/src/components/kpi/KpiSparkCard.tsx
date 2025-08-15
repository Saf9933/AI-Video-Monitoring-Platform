import React, { ReactNode } from 'react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { ChevronUpIcon, ChevronDownIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { chartColors, transitions } from '../../styles/tokens';

interface KpiSparkCardProps {
  titleCn: string;
  titleEn?: string;
  value: string;
  deltaPct?: number;
  deltaDirection?: 'up' | 'down' | 'flat';
  series: Array<{ t: string | number; y: number }>;
  color: 'green' | 'blue' | 'yellow' | 'red';
  icon?: ReactNode;
  subtitleCn?: string;
  className?: string;
  height?: number;
  accentGlow?: boolean;
  onClick?: () => void;
}

// Delta color logic: down is good for error rates, up is good for performance metrics
const getDeltaColor = (deltaPct: number, direction: 'up' | 'down' | 'flat', isErrorMetric = false) => {
  if (direction === 'flat' || deltaPct === 0) return 'text-slate-400';
  
  const isPositiveChange = deltaPct > 0;
  const isGoodChange = isErrorMetric ? !isPositiveChange : isPositiveChange;
  
  return isGoodChange ? 'text-green-400' : 'text-red-400';
};

const getDeltaIcon = (direction: 'up' | 'down' | 'flat') => {
  switch (direction) {
    case 'up':
      return <ChevronUpIcon className="w-3 h-3" />;
    case 'down':
      return <ChevronDownIcon className="w-3 h-3" />;
    default:
      return <ArrowRightIcon className="w-3 h-3" />;
  }
};

const getColorConfig = (color: 'green' | 'blue' | 'yellow' | 'red') => {
  switch (color) {
    case 'green':
      return {
        stroke: chartColors.green.main,
        fill: chartColors.green.gradient,
        glow: 'drop-shadow-[0_0_8px_rgba(74,222,128,0.6)]',
      };
    case 'blue':
      return {
        stroke: chartColors.blue.main,
        fill: chartColors.blue.gradient,
        glow: 'drop-shadow-[0_0_8px_rgba(96,165,250,0.6)]',
      };
    case 'yellow':
      return {
        stroke: chartColors.yellow.main,
        fill: chartColors.yellow.gradient,
        glow: 'drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]',
      };
    case 'red':
      return {
        stroke: chartColors.red.main,
        fill: chartColors.red.gradient,
        glow: 'drop-shadow-[0_0_8px_rgba(248,113,113,0.6)]',
      };
  }
};

export default function KpiSparkCard({
  titleCn,
  titleEn,
  value,
  deltaPct,
  deltaDirection = 'flat',
  series,
  color,
  icon,
  subtitleCn,
  className = '',
  height = 88,
  accentGlow = true,
  onClick,
}: KpiSparkCardProps) {
  const colorConfig = getColorConfig(color);
  const isErrorMetric = titleCn.includes('误报') || titleCn.includes('错误');
  const deltaColor = deltaPct !== undefined ? getDeltaColor(deltaPct, deltaDirection, isErrorMetric) : '';
  
  const handleClick = () => {
    if (onClick) onClick();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (onClick && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      onClick();
    }
  };

  // Skeleton state when no data
  if (series.length === 0) {
    return (
      <div 
        className={`rounded-2xl bg-[#141B2D] border border-[#2A3446] p-6 ${transitions.default} ${className}`}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3">
            {icon && (
              <div className="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center animate-pulse">
                <div className="w-5 h-5 bg-slate-600 rounded"></div>
              </div>
            )}
            <div className="space-y-2">
              <div className="h-4 bg-slate-700 rounded animate-pulse w-24"></div>
              {titleEn && <div className="h-3 bg-slate-700 rounded animate-pulse w-20"></div>}
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-6 bg-slate-700 rounded animate-pulse w-16"></div>
          {subtitleCn && <div className="h-3 bg-slate-700 rounded animate-pulse w-20"></div>}
        </div>
        <div className="mt-4">
          <div className={`bg-slate-700/30 rounded animate-pulse`} style={{ height: height }}></div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`rounded-2xl bg-[#141B2D] border border-[#2A3446] p-6 ${transitions.default} hover:shadow-lg hover:shadow-black/20 hover:bg-[#1A2332] ${onClick ? 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#141B2D]' : ''} ${className}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? `${titleCn} 卡片，点击查看详情` : undefined}
    >
      {/* Header Section */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3 min-w-0 flex-1">
          {icon && (
            <div className="w-10 h-10 rounded-lg bg-slate-700/30 flex items-center justify-center flex-shrink-0">
              {React.cloneElement(icon as React.ReactElement, {
                className: `w-5 h-5 ${color === 'green' ? 'text-green-400' : color === 'blue' ? 'text-blue-400' : color === 'yellow' ? 'text-yellow-400' : 'text-red-400'}`
              })}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-[#E6EDF7] leading-tight truncate">
              {titleCn}
            </h3>
            {titleEn && (
              <p className="text-xs text-[#92A3B8] mt-0.5 leading-tight truncate">
                {titleEn}
              </p>
            )}
          </div>
        </div>

        {/* Delta Chip */}
        {deltaPct !== undefined && (
          <div className={`flex items-center space-x-1 bg-slate-700/30 rounded-full px-2.5 py-1 text-xs font-medium ${deltaColor} flex-shrink-0`}>
            {getDeltaIcon(deltaDirection)}
            <span>{deltaPct > 0 ? '+' : ''}{Math.abs(deltaPct)}%</span>
          </div>
        )}
      </div>

      {/* Value Section */}
      <div className="space-y-1 mb-4">
        <div className="text-2xl font-bold text-[#E6EDF7] leading-tight">
          {value}
        </div>
        {subtitleCn && (
          <div className="text-xs text-[#92A3B8]">
            {subtitleCn}
          </div>
        )}
        {deltaPct !== undefined && (
          <div className="text-xs text-[#92A3B8]">
            较上期
          </div>
        )}
      </div>

      {/* Chart Section */}
      <div className="relative" style={{ height: height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart 
            data={series} 
            margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
          >
            <defs>
              <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colorConfig.stroke} stopOpacity={0.3} />
                <stop offset="100%" stopColor={colorConfig.stroke} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="t" 
              axisLine={false} 
              tickLine={false} 
              tick={false}
              domain={['dataMin', 'dataMax']}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={false}
              domain={['dataMin - 0.1', 'dataMax + 0.1']}
            />
            <Area
              type="monotone"
              dataKey="y"
              stroke={colorConfig.stroke}
              strokeWidth={2.5}
              fill={`url(#gradient-${color})`}
              isAnimationActive={true}
              animationDuration={900}
              animationEasing="ease-out"
              className={accentGlow ? `hover:${colorConfig.glow} ${transitions.default}` : ''}
            />
          </AreaChart>
        </ResponsiveContainer>
        
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="w-full h-full" style={{
            background: `repeating-linear-gradient(
              90deg,
              transparent,
              transparent 20%,
              ${chartColors.border} 20%,
              ${chartColors.border} 20.5%
            )`
          }}></div>
        </div>
      </div>
    </div>
  );
}