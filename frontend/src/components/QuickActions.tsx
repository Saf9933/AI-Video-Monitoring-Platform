import { useMutation, useQueryClient } from '@tanstack/react-query';
import { acknowledgeAlert, resolveAlert } from '../services/api/alerts';

interface QuickActionsProps {
  alertStats: {
    newAlerts: number;
    criticalAlerts: number;
    acknowledgedAlerts: number;
    escalatedAlerts?: number;
    inProgressAlerts?: number;
  };
}

export default function QuickActions({ alertStats }: QuickActionsProps) {
  const queryClient = useQueryClient();

  const actions = [
    {
      id: 'view-critical',
      title: 'Critical Alerts',
      description: `${alertStats.criticalAlerts} require immediate attention`,
      icon: '🚨',
      color: 'red',
      action: () => {
        // This would navigate to alerts filtered by critical priority
        window.location.hash = '#alerts?priority=critical';
      },
      disabled: alertStats.criticalAlerts === 0
    },
    {
      id: 'view-escalated',
      title: 'Escalated Cases',
      description: `${alertStats.escalatedAlerts || 0} need administrative review`,
      icon: '📈',
      color: 'orange',
      action: () => {
        window.location.hash = '#alerts?status=escalated';
      },
      disabled: (alertStats.escalatedAlerts || 0) === 0
    },
    {
      id: 'view-new',
      title: 'New Alerts',
      description: `${alertStats.newAlerts} pending review`,
      icon: '🔔',
      color: 'blue',
      action: () => {
        window.location.hash = '#alerts?status=new';
      },
      disabled: alertStats.newAlerts === 0
    },
    {
      id: 'view-in-progress',
      title: 'In Progress',
      description: `${alertStats.inProgressAlerts || 0} being investigated`,
      icon: '🔍',
      color: 'yellow',
      action: () => {
        window.location.hash = '#alerts?status=in_progress';
      },
      disabled: (alertStats.inProgressAlerts || 0) === 0
    },
    {
      id: 'classroom-overview',
      title: 'Classroom Status',
      description: 'View all monitored rooms',
      icon: '🏫',
      color: 'green',
      action: () => {
        window.location.hash = '#classrooms';
      },
      disabled: false
    },
    {
      id: 'privacy-dashboard',
      title: 'Privacy Dashboard',
      description: 'FERPA/COPPA compliance status',
      icon: '🛡️',
      color: 'purple',
      action: () => {
        window.location.hash = '#privacy';
      },
      disabled: false
    }
  ];

  // Core Safety Scenarios Quick Access
  const coreScenarios = [
    {
      id: 'exam-pressure',
      title: 'Exam Pressure',
      description: 'Academic stress monitoring',
      icon: '📚',
      color: 'blue',
      action: () => window.location.hash = '#alerts?type=exam_pressure'
    },
    {
      id: 'isolation-bullying',
      title: 'Isolation Bullying',
      description: 'Social exclusion detection',
      icon: '👥',
      color: 'orange',
      action: () => window.location.hash = '#alerts?type=isolation_bullying'
    },
    {
      id: 'self-harm',
      title: 'Self Harm',
      description: 'Crisis intervention triggers',
      icon: '🆘',
      color: 'red',
      action: () => window.location.hash = '#alerts?type=self_harm'
    },
    {
      id: 'teacher-abuse',
      title: 'Teacher Abuse',
      description: 'Authority misconduct alerts',
      icon: '🗣️',
      color: 'red',
      action: () => window.location.hash = '#alerts?type=teacher_verbal_abuse'
    },
    {
      id: 'cyber-tracking',
      title: 'Cyber Tracking',
      description: 'Digital harassment detection',
      icon: '💻',
      color: 'purple',
      action: () => window.location.hash = '#alerts?type=cyber_tracking'
    }
  ];

  const getButtonStyles = (color: string, disabled: boolean) => {
    if (disabled) {
      return 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200';
    }

    const styles = {
      red: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100',
      blue: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
      green: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100',
      purple: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
      orange: 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100',
      yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100'
    };

    return styles[color as keyof typeof styles] || styles.blue;
  };

  return (
    <div className="space-y-6">
      {/* Main Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
          <p className="text-sm text-gray-500">Common tasks and shortcuts</p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {actions.map((action) => (
              <button
                key={action.id}
                onClick={action.action}
                disabled={action.disabled}
                className={`p-4 border rounded-lg text-left transition-colors ${getButtonStyles(action.color, action.disabled)}`}
              >
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{action.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-medium">{action.title}</h4>
                    <p className="text-sm opacity-75 mt-1">{action.description}</p>
                  </div>
                  {!action.disabled && (
                    <div className="text-xl opacity-50">→</div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Core Safety Scenarios */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Core Safety Scenarios</h3>
          <p className="text-sm text-gray-500">5 primary monitoring patterns</p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 gap-3">
            {coreScenarios.map((scenario) => (
              <button
                key={scenario.id}
                onClick={scenario.action}
                className={`p-3 border rounded-lg text-left transition-colors ${getButtonStyles(scenario.color, false)}`}
              >
                <div className="flex items-center space-x-3">
                  <div className="text-lg">{scenario.icon}</div>
                  <div className="flex-1">
                    <h5 className="font-medium text-sm">{scenario.title}</h5>
                    <p className="text-xs opacity-75">{scenario.description}</p>
                  </div>
                  <div className="text-sm opacity-50">→</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Emergency Procedures */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Emergency Procedures</h3>
          <p className="text-sm text-gray-500">For immediate threats requiring intervention</p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button className="flex items-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
              <span>🚨</span>
              <span className="text-sm font-medium">Emergency Alert</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-3 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors">
              <span>📞</span>
              <span className="text-sm font-medium">Call Security</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              <span>🏥</span>
              <span className="text-sm font-medium">Medical Emergency</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
              <span>🔒</span>
              <span className="text-sm font-medium">Lockdown Protocol</span>
            </button>
          </div>
          
          {/* SLO Performance Indicators */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-3">System Performance (SLO)</h4>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">Response Time (p95):</span>
                <span className="text-green-600 font-medium">&lt; 3s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Availability (7AM-6PM):</span>
                <span className="text-green-600 font-medium">99.5%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Alert Generation:</span>
                <span className="text-green-600 font-medium">&lt; 1.2s avg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Privacy Compliance:</span>
                <span className="text-green-600 font-medium">100%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}