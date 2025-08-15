import React from 'react';
import ScenarioCards from '../components/homepage/ScenarioCards';
import MonthlyStats from '../components/homepage/MonthlyStats';
import RecentAlerts from '../components/homepage/RecentAlerts';
import SystemStatus from '../components/homepage/SystemStatus';
import QuickActions from '../components/homepage/QuickActions';
import KpiSparkCard from '../components/kpi/KpiSparkCard';
import { mockHomeData } from '../data/mockHomeData';
import { 
  ClockIcon, 
  ChartBarIcon, 
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

// Helper function to generate realistic demo data for sparklines
const generateKpiSeries = (baseValue: number, variance: number, trend: 'up' | 'down' | 'flat' = 'flat') => {
  const points = [];
  let currentValue = baseValue;
  
  for (let i = 0; i < 24; i++) {
    // Add some realistic variation
    const randomChange = (Math.random() - 0.5) * variance;
    const trendChange = trend === 'up' ? 0.1 : trend === 'down' ? -0.1 : 0;
    
    currentValue += randomChange + trendChange;
    currentValue = Math.max(0, currentValue); // Ensure non-negative
    
    points.push({
      t: i,
      y: parseFloat(currentValue.toFixed(2))
    });
  }
  
  return points;
};

export default function Homepage() {
  // Safe destructuring with defaults
  const {
    scenarios = [],
    monthlyStats = [],
    recentAlerts = [],
  } = mockHomeData ?? {};

  // Generate demo KPI data
  const kpiData = {
    responseTime: {
      value: '2.3s',
      deltaPct: -12,
      direction: 'down' as const,
      series: generateKpiSeries(2.3, 0.3, 'down'),
    },
    accuracy: {
      value: '94.2%',
      deltaPct: 3,
      direction: 'up' as const,
      series: generateKpiSeries(94.2, 2, 'up'),
    },
    falsePositive: {
      value: '5.8%',
      deltaPct: -8,
      direction: 'down' as const,
      series: generateKpiSeries(5.8, 1.2, 'down'),
    },
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:gap-8">
      {/* Core Scenario Cards */}
      <ScenarioCards scenarios={scenarios} density="compact" />
      
      {/* Monthly Statistics Overview */}
      <MonthlyStats stats={monthlyStats} density="compact" />
      
      {/* Key Performance Metrics - New KPI Spark Cards */}
      <section aria-labelledby="metrics-title">
        <h2 id="metrics-title" className="text-2xl lg:text-2xl font-semibold text-white mb-6 lg:mb-6">
          关键指标 <span className="text-white/60 ml-2">Key Performance Metrics</span>
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <KpiSparkCard
            titleCn="平均响应时间"
            titleEn="Avg Response Time"
            value={kpiData.responseTime.value}
            deltaPct={kpiData.responseTime.deltaPct}
            deltaDirection={kpiData.responseTime.direction}
            series={kpiData.responseTime.series}
            color="green"
            icon={<ClockIcon />}
            subtitleCn="系统处理请求平均用时"
          />
          <KpiSparkCard
            titleCn="检测准确率"
            titleEn="Detection Accuracy"
            value={kpiData.accuracy.value}
            deltaPct={kpiData.accuracy.deltaPct}
            deltaDirection={kpiData.accuracy.direction}
            series={kpiData.accuracy.series}
            color="blue"
            icon={<ChartBarIcon />}
            subtitleCn="AI模型检测精度"
          />
          <KpiSparkCard
            titleCn="误报率"
            titleEn="False Positive Rate"
            value={kpiData.falsePositive.value}
            deltaPct={kpiData.falsePositive.deltaPct}
            deltaDirection={kpiData.falsePositive.direction}
            series={kpiData.falsePositive.series}
            color="yellow"
            icon={<ExclamationTriangleIcon />}
            subtitleCn="错误预警占比"
          />
        </div>
      </section>
      
      {/* System Status */}
      <SystemStatus density="compact" />
      
      {/* Quick Actions */}
      <QuickActions density="compact" />
      
      {/* Recent Alerts */}
      <RecentAlerts alerts={recentAlerts} density="compact" />
    </div>
  );
}