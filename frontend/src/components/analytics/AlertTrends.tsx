import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { chartColors } from '../../styles/tokens';

interface AlertTrendsData {
  dateZh: string;
  dateEn: string;
  danger: number;
  high: number;
  medium: number;
  low: number;
  total?: number;
}

interface AlertTrendsProps {
  data?: AlertTrendsData[];
  useMockData?: boolean;
}

// Mock data for display with safety validation
const mockData: AlertTrendsData[] = [
  { dateZh: "1月1日 周一", dateEn: "Mon Jan 1", danger: 6, high: 14, medium: 18, low: 7 },
  { dateZh: "1月2日 周二", dateEn: "Tue Jan 2", danger: 5, high: 20, medium: 17, low: 10 },
  { dateZh: "1月3日 周三", dateEn: "Wed Jan 3", danger: 4, high: 9, medium: 22, low: 13 },
  { dateZh: "1月4日 周四", dateEn: "Thu Jan 4", danger: 7, high: 16, medium: 19, low: 21 },
  { dateZh: "1月5日 周五", dateEn: "Fri Jan 5", danger: 3, high: 12, medium: 23, low: 3 },
  { dateZh: "1月6日 周六", dateEn: "Sat Jan 6", danger: 4, high: 15, medium: 21, low: 15 },
  { dateZh: "1月7日 周日", dateEn: "Sun Jan 7", danger: 5, high: 11, medium: 20, low: 12 }
].filter(item => item && typeof item === 'object' && item.dateZh && item.dateEn); // Validate mock data structure

// Severity levels configuration
const severityConfig = [
  { 
    key: 'danger', 
    colorZh: '危险', 
    colorEn: 'Danger', 
    color: '#ef4444',
    visible: true 
  },
  { 
    key: 'high', 
    colorZh: '高', 
    colorEn: 'High', 
    color: '#fb923c',
    visible: true 
  },
  { 
    key: 'medium', 
    colorZh: '中等', 
    colorEn: 'Medium', 
    color: '#facc15',
    visible: true 
  },
  { 
    key: 'low', 
    colorZh: '低', 
    colorEn: 'Low', 
    color: '#60a5fa',
    visible: true 
  }
];

export default function AlertTrends({ data, useMockData = true }: AlertTrendsProps) {
  const [visibleSeries, setVisibleSeries] = useState<Record<string, boolean>>({
    danger: true,
    high: true,
    medium: true,
    low: true
  });
  const [isAnimated, setIsAnimated] = useState(false);

  // Process data and add totals with safety guards
  const rawData = useMockData ? mockData : (data || []);
  const processedData = rawData.map(item => {
    // Ensure all numeric values are valid numbers
    const danger = Number(item?.danger) || 0;
    const high = Number(item?.high) || 0;
    const medium = Number(item?.medium) || 0;
    const low = Number(item?.low) || 0;
    
    return {
      ...item,
      danger,
      high,
      medium,
      low,
      total: danger + high + medium + low,
      // Ensure required display properties exist
      dateZh: item?.dateZh || '未知日期',
      dateEn: item?.dateEn || 'Unknown Date'
    };
  });

  // Trigger animations on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Toggle series visibility
  const toggleSeries = (key: string) => {
    setVisibleSeries(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Custom tooltip with safe payload access
  const CustomTooltip = ({ active, payload, label }: any) => {
    // Safety guards for Recharts payload variations
    if (!active || !payload || !Array.isArray(payload) || payload.length === 0) {
      return null;
    }

    // Safely extract data from the first payload item
    const firstPayload = payload[0];
    if (!firstPayload || !firstPayload.payload) {
      return null;
    }

    const data = firstPayload.payload;
    
    // Ensure we have required data properties
    if (!data.dateZh || typeof data.dateZh !== 'string') {
      return null;
    }

    // Safely compute total if not present
    const safeTotal = typeof data.total === 'number' ? data.total : 
      (Number(data.danger || 0) + Number(data.high || 0) + Number(data.medium || 0) + Number(data.low || 0));

    return (
      <div className="bg-slate-900/95 border border-slate-700 rounded-lg p-4 shadow-lg backdrop-blur-sm">
        <div className="font-medium text-slate-100 mb-2">
          {data.dateZh}
          <div className="text-xs text-slate-400">{data.dateEn || ''}</div>
        </div>
        <div className="space-y-1">
          {severityConfig.map(config => {
            const value = Number(data[config.key]) || 0;
            return (
              <div key={config.key} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: config.color }}
                  />
                  <span className="text-slate-300">
                    {config.colorZh} / {config.colorEn}
                  </span>
                </div>
                <span className="text-slate-100 font-medium">{value}</span>
              </div>
            );
          })}
          <div className="border-t border-slate-700 pt-1 mt-2">
            <div className="flex items-center justify-between text-sm font-medium">
              <span className="text-slate-200">总计 / Total</span>
              <span className="text-white">{safeTotal}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Custom label for totals above bars with safe payload access
  const CustomLabel = (props: any) => {
    const { x, y, width, payload } = props;
    
    // Safety guards for Recharts label props
    if (!payload || typeof payload !== 'object') {
      return null;
    }

    // Safely compute total from payload data
    const safeTotal = typeof payload.total === 'number' ? payload.total : 
      (Number(payload.danger || 0) + Number(payload.high || 0) + Number(payload.medium || 0) + Number(payload.low || 0));

    // Don't render label if total is 0 or invalid
    if (!safeTotal || isNaN(safeTotal)) {
      return null;
    }

    // Ensure we have valid positioning data
    const safeX = Number(x) || 0;
    const safeY = Number(y) || 0;
    const safeWidth = Number(width) || 0;

    return (
      <text 
        x={safeX + safeWidth / 2} 
        y={safeY - 12} 
        fill="#e2e8f0" 
        textAnchor="middle" 
        fontSize="12"
        fontWeight="600"
        className="animate-fade-in"
      >
        {safeTotal}
      </text>
    );
  };

  return (
    <div className="rounded-xl bg-slate-800/60 border border-slate-700 p-6 transition-all duration-300 hover:bg-slate-800/70">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">预警趋势</h3>
          <p className="text-sm text-slate-400">Alert Trends</p>
        </div>
        
        {/* Interactive Legend */}
        <div className="flex flex-wrap items-center gap-4 text-sm">
          {severityConfig.map(config => (
            <button
              key={config.key}
              onClick={() => toggleSeries(config.key)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-md border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900 transform hover:scale-105 ${
                visibleSeries[config.key]
                  ? 'border-slate-600 bg-slate-800/60 hover:bg-slate-800 shadow-sm'
                  : 'border-slate-700 bg-slate-900/40 opacity-60 hover:opacity-80'
              }`}
              aria-label={`Toggle ${config.colorZh} / ${config.colorEn} series`}
            >
              <div 
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  visibleSeries[config.key] ? 'scale-100 shadow-sm' : 'scale-75 opacity-50'
                }`}
                style={{ 
                  backgroundColor: config.color,
                  boxShadow: visibleSeries[config.key] ? `0 0 8px ${config.color}40` : 'none'
                }}
              />
              <span className={`transition-colors duration-300 ${
                visibleSeries[config.key] ? 'text-slate-300' : 'text-slate-500'
              }`}>
                {config.colorZh}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-80 transition-all duration-500">
        {processedData.length === 0 ? (
          // Empty state with proper height
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-slate-400 text-sm mb-2">暂无数据 / No Data Available</div>
              <div className="text-slate-500 text-xs">请检查数据源或选择其他时间范围</div>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={processedData}
              margin={{ top: 35, right: 30, left: 20, bottom: 65 }}
              barCategoryGap="20%"
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#334155" 
                opacity={0.3}
                horizontal={true}
                vertical={false}
              />
              <XAxis 
                dataKey="dateZh"
                axisLine={false}
                tickLine={false}
                tick={{ 
                  fill: '#cbd5e1', 
                  fontSize: 12,
                  fontWeight: 500
                }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={65}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ 
                  fill: '#94a3b8', 
                  fontSize: 11 
                }}
                tickFormatter={(value) => `${Number(value) || 0}`}
              />
              <Tooltip 
                content={<CustomTooltip />}
                animationDuration={200}
                animationEasing="ease-out"
                cursor={false}
              />
              
              {/* Stacked Bars with Enhanced Animations */}
              {severityConfig.map((config, index) => (
                <Bar
                  key={config.key}
                  dataKey={config.key}
                  stackId="alerts"
                  fill={config.color}
                  style={{ 
                    display: visibleSeries[config.key] ? 'block' : 'none',
                    filter: visibleSeries[config.key] 
                      ? 'brightness(1) saturate(1)' 
                      : 'brightness(0.7) saturate(0.5)',
                    transition: 'all 0.3s ease-in-out'
                  }}
                  radius={index === 3 ? [4, 4, 0, 0] : [0, 0, 0, 0]} // Round top of stack
                  animationBegin={index * 100 + 200}
                  animationDuration={1000}
                  animationEasing="ease-out"
                  onMouseEnter={(data: any) => {
                    // Enhanced hover effect with glow - safe access
                    try {
                      if (data && data.target) {
                        data.target.style.filter = 'brightness(1.15) drop-shadow(0 0 8px rgba(255,255,255,0.2))';
                        data.target.style.transform = 'scale(1.02)';
                      }
                    } catch (error) {
                      console.warn('Chart hover effect error:', error);
                    }
                  }}
                  onMouseLeave={(data: any) => {
                    try {
                      if (data && data.target) {
                        data.target.style.filter = 'brightness(1)';
                        data.target.style.transform = 'scale(1)';
                      }
                    } catch (error) {
                      console.warn('Chart hover leave effect error:', error);
                    }
                  }}
                />
              ))}
              
              {/* Total Labels Above Bars */}
              <Bar
                dataKey="total"
                fill="transparent"
                label={<CustomLabel />}
                isAnimationActive={false}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Footer with additional info */}
      <div className="mt-4 pt-4 border-t border-slate-700/50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p className="text-xs text-slate-500">
            点击图例可切换显示/隐藏对应数据系列
          </p>
          <p className="text-xs text-slate-500">
            Click legend to toggle series visibility
          </p>
        </div>
      </div>
    </div>
  );
}