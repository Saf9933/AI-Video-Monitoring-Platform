import type { Alert, DashboardStats } from '../types/api';

interface AlertSummaryProps {
  alerts: Alert[];
  stats?: DashboardStats;
}

interface MetricCard {
  title: string;
  value: string | number;
  subtitle?: string;
  color: 'red' | 'yellow' | 'green' | 'blue' | 'purple' | 'orange';
  icon: string;
}

export default function AlertSummary({ alerts, stats }: AlertSummaryProps) {
  // Calculate metrics from alerts if stats not provided
  const totalAlerts = stats?.total || alerts.length;
  const newAlerts = stats?.newAlerts || alerts.filter(a => a.status === 'new').length;
  const criticalAlerts = stats?.criticalAlerts || alerts.filter(a => a.priority === 'critical').length;
  const escalatedAlerts = stats?.escalatedAlerts || alerts.filter(a => a.status === 'escalated').length;
  const inProgressAlerts = stats?.inProgressAlerts || alerts.filter(a => a.status === 'in_progress').length;
  const resolvedToday = stats?.resolvedToday || alerts.filter(a => {
    const today = new Date().toDateString();
    return a.status === 'resolved' && new Date(a.timestamp).toDateString() === today;
  }).length;
  
  const avgRiskScore = stats?.avgRiskScore || (alerts.length > 0 
    ? Math.round(alerts.reduce((sum, a) => sum + a.risk_score, 0) / alerts.length * 100) 
    : 0);

  const falsePositiveRate = stats?.falsePositiveRate || (alerts.length > 0 
    ? Math.round(alerts.filter(a => a.status === 'false_positive').length / alerts.length * 100) 
    : 0);

  // Count alerts by the 5 core safety scenarios
  const coreScenarios = {
    exam_pressure: alerts.filter(a => a.alert_type === 'exam_pressure').length,
    isolation_bullying: alerts.filter(a => a.alert_type === 'isolation_bullying').length,
    self_harm: alerts.filter(a => a.alert_type === 'self_harm').length,
    teacher_verbal_abuse: alerts.filter(a => a.alert_type === 'teacher_verbal_abuse').length,
    cyber_tracking: alerts.filter(a => a.alert_type === 'cyber_tracking').length
  };

  const metrics: MetricCard[] = [
    {
      title: 'Active Alerts',
      value: newAlerts,
      subtitle: `${totalAlerts} total alerts`,
      color: newAlerts > 0 ? 'red' : 'green',
      icon: '🚨'
    },
    {
      title: 'Critical Priority',
      value: criticalAlerts,
      subtitle: 'Immediate attention required',
      color: criticalAlerts > 0 ? 'red' : 'green',
      icon: '⚠️'
    },
    {
      title: 'Escalated Cases',
      value: escalatedAlerts,
      subtitle: 'Administrative oversight',
      color: escalatedAlerts > 0 ? 'orange' : 'green',
      icon: '📈'
    },
    {
      title: 'In Progress',
      value: inProgressAlerts,
      subtitle: 'Being investigated',
      color: inProgressAlerts > 0 ? 'yellow' : 'green',
      icon: '🔍'
    },
    {
      title: 'Resolved Today',
      value: resolvedToday,
      subtitle: 'Incidents handled',
      color: 'green',
      icon: '✅'
    },
    {
      title: 'Avg Risk Score',
      value: `${avgRiskScore}%`,
      subtitle: 'Across all alerts',
      color: avgRiskScore > 75 ? 'red' : avgRiskScore > 50 ? 'yellow' : 'green',
      icon: '📊'
    },
    {
      title: 'False Positive Rate',
      value: `${falsePositiveRate}%`,
      subtitle: 'Model accuracy indicator',
      color: falsePositiveRate > 10 ? 'red' : falsePositiveRate > 5 ? 'yellow' : 'green',
      icon: '🎯'
    },
    {
      title: 'Core Scenarios',
      value: Object.values(coreScenarios).reduce((sum, count) => sum + count, 0),
      subtitle: '5 primary safety patterns',
      color: 'blue',
      icon: '🛡️'
    }
  ];

  const getCardColor = (color: string) => {
    const colors = {
      red: 'border-red-700 bg-red-900/30',
      yellow: 'border-yellow-700 bg-yellow-900/30',
      green: 'border-green-700 bg-green-900/30',
      blue: 'border-blue-700 bg-blue-900/30',
      purple: 'border-purple-700 bg-purple-900/30',
      orange: 'border-orange-700 bg-orange-900/30'
    };
    return colors[color as keyof typeof colors];
  };

  const getTextColor = (color: string) => {
    const colors = {
      red: 'text-red-300',
      yellow: 'text-yellow-300',
      green: 'text-green-300',
      blue: 'text-blue-300',
      purple: 'text-purple-300',
      orange: 'text-orange-300'
    };
    return colors[color as keyof typeof colors];
  };

  const getSubtextColor = (color: string) => {
    const colors = {
      red: 'text-red-400',
      yellow: 'text-yellow-400',
      green: 'text-green-400',
      blue: 'text-blue-400',
      purple: 'text-purple-400',
      orange: 'text-orange-400'
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <div className="space-y-6">
      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className={`p-4 border rounded-lg ${getCardColor(metric.color)}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">{metric.title}</p>
                <p className={`text-2xl font-bold ${getTextColor(metric.color)}`}>
                  {metric.value}
                </p>
                {metric.subtitle && (
                  <p className={`text-xs mt-1 ${getSubtextColor(metric.color)}`}>
                    {metric.subtitle}
                  </p>
                )}
              </div>
              <div className="text-2xl">
                {metric.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Core Safety Scenarios Breakdown */}
      <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-white">核心安全场景</h3>
          <span className="text-sm text-slate-400">5 primary monitoring patterns</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { key: 'exam_pressure', label: 'Exam Pressure', icon: '📚', desc: 'Academic stress detection' },
            { key: 'isolation_bullying', label: 'Isolation Bullying', icon: '👥', desc: 'Social exclusion patterns' },
            { key: 'self_harm', label: 'Self Harm', icon: '🆘', desc: 'Crisis intervention triggers' },
            { key: 'teacher_verbal_abuse', label: 'Verbal Abuse', icon: '🗣️', desc: 'Authority misconduct' },
            { key: 'cyber_tracking', label: 'Cyber Tracking', icon: '💻', desc: 'Digital harassment' }
          ].map((scenario) => {
            const count = coreScenarios[scenario.key as keyof typeof coreScenarios];
            return (
              <div key={scenario.key} className="text-center p-3 border border-slate-600 rounded-lg bg-slate-700/30">
                <div className="text-2xl mb-1">{scenario.icon}</div>
                <div className="text-lg font-semibold text-white">{count}</div>
                <div className="text-sm font-medium text-slate-300">{scenario.label}</div>
                <div className="text-xs text-slate-400 mt-1">{scenario.desc}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}