import React from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { chartColors } from '../../styles/tokens';

interface SparkMiniProps {
  data: Array<{ t: string | number; y: number }>;
  color?: 'green' | 'blue' | 'yellow' | 'red';
  className?: string;
  width?: number;
  height?: number;
}

const getColorConfig = (color: 'green' | 'blue' | 'yellow' | 'red') => {
  switch (color) {
    case 'green':
      return {
        stroke: chartColors.green.main,
        fill: chartColors.green.gradient,
      };
    case 'blue':
      return {
        stroke: chartColors.blue.main,
        fill: chartColors.blue.gradient,
      };
    case 'yellow':
      return {
        stroke: chartColors.yellow.main,
        fill: chartColors.yellow.gradient,
      };
    case 'red':
      return {
        stroke: chartColors.red.main,
        fill: chartColors.red.gradient,
      };
  }
};

export default function SparkMini({
  data,
  color = 'blue',
  className = '',
  width = 40,
  height = 20,
}: SparkMiniProps) {
  const colorConfig = getColorConfig(color);

  if (data.length === 0) {
    return (
      <div 
        className={`bg-slate-700/30 rounded animate-pulse ${className}`}
        style={{ width, height }}
      />
    );
  }

  return (
    <div 
      className={`${className}`}
      style={{ width, height }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart 
          data={data} 
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id={`mini-gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colorConfig.stroke} stopOpacity={0.4} />
              <stop offset="100%" stopColor={colorConfig.stroke} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="y"
            stroke={colorConfig.stroke}
            strokeWidth={1.5}
            fill={`url(#mini-gradient-${color})`}
            isAnimationActive={true}
            animationDuration={600}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}