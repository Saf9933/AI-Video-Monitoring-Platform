import AlertSummary from '../components/AlertSummary';
import RecentActivity from '../components/RecentActivity';
import QuickActions from '../components/QuickActions';
import { useDashboardData } from '../hooks/useDashboardData';
import { websocketService } from '../services/websocket';

export default function Dashboard() {
  const { alerts, isLoading, error, stats, classroomStats } = useDashboardData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <span className="text-red-500 text-xl mr-2">⚠️</span>
          <div>
            <h3 className="text-red-800 font-medium">Error Loading Dashboard</h3>
            <p className="text-red-600 text-sm mt-1">Unable to fetch alert data. Please try refreshing the page.</p>
          </div>
        </div>
      </div>
    );
  }

  // Get privacy compliance status
  const privacyCompliant = Object.values(classroomStats).every(room => room.privacyCompliance);
  const totalClassrooms = Object.keys(classroomStats).length;
  const activeClassrooms = Object.values(classroomStats).filter(room => room.newAlerts > 0).length;

  return (
    <div className="space-y-6">
      {/* Page Header with Privacy & Compliance Status */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Safety Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Real-time student safety monitoring across {totalClassrooms} classrooms
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {/* System Status Indicators */}
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${websocketService.isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                <span className="text-gray-600">
                  {websocketService.isConnected ? 'Live monitoring active' : 'Connection lost'}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${privacyCompliant ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                <span className="text-gray-600">
                  Privacy {privacyCompliant ? 'compliant' : 'review needed'}
                </span>
              </div>
              <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                SLO: &lt;3s p95 response time
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Summary Cards with Enhanced Metrics */}
      <AlertSummary alerts={alerts} stats={stats} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity - Takes up 2 columns on large screens */}
        <div className="lg:col-span-2">
          <RecentActivity alerts={alerts} limit={8} />
        </div>

        {/* Quick Actions - Takes up 1 column */}
        <div>
          <QuickActions 
            alertStats={{
              newAlerts: stats.newAlerts,
              criticalAlerts: stats.criticalAlerts,
              acknowledgedAlerts: stats.acknowledgedAlerts,
              escalatedAlerts: stats.escalatedAlerts,
              inProgressAlerts: stats.inProgressAlerts
            }}
          />
        </div>
      </div>

      {/* Enhanced Classroom Status Overview with Privacy Compliance */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Classroom Status</h3>
              <p className="text-sm text-gray-500">
                {totalClassrooms} monitored rooms • {activeClassrooms} with active alerts
              </p>
            </div>
            <div className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {Object.keys(classroomStats).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(classroomStats).map(([classroomId, classroomData]) => (
                <div key={classroomId} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">{classroomId}</h4>
                    <div className="flex items-center space-x-2">
                      {/* Privacy Compliance Indicator */}
                      <div className={`w-2 h-2 rounded-full ${classroomData.privacyCompliance ? 'bg-green-500' : 'bg-yellow-500'}`} 
                           title={`Privacy ${classroomData.privacyCompliance ? 'compliant' : 'needs review'}`}></div>
                      {/* Alert Status Indicator */}
                      <span className={`w-3 h-3 rounded-full ${
                        classroomData.newAlerts > 0 ? 'bg-red-500' : 'bg-green-500'
                      }`}></span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Active Alerts:</span>
                      <span className={classroomData.newAlerts > 0 ? 'text-red-600 font-medium' : 'text-gray-900'}>
                        {classroomData.newAlerts}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Alerts:</span>
                      <span className="text-gray-900">{classroomData.totalAlerts}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Avg Risk:</span>
                      <span className={
                        classroomData.avgRiskScore > 75 ? 'text-red-600' : 
                        classroomData.avgRiskScore > 50 ? 'text-yellow-600' : 'text-green-600'
                      }>
                        {classroomData.avgRiskScore}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Consent:</span>
                      <span className={
                        classroomData.consentStatus === 'full_consent' ? 'text-green-600' :
                        classroomData.consentStatus === 'partial_redacted' ? 'text-yellow-600' : 'text-red-600'
                      }>
                        {classroomData.consentStatus.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs border-t pt-2 mt-2">
                      <span className="text-gray-500">Last Activity:</span>
                      <span className="text-gray-700">{new Date(classroomData.lastActivity).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">🏫</div>
              <p className="text-gray-500">No classroom data available</p>
              <p className="text-xs text-gray-400 mt-1">Check edge device connectivity</p>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced System Status Footer with SLO Monitoring */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>System Online</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${websocketService.isConnected ? 'bg-blue-500' : 'bg-red-500'}`}></div>
              <span>WebSocket {websocketService.isConnected ? 'Connected' : 'Disconnected'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${privacyCompliant ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
              <span>FERPA/COPPA Compliant</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>False Positive Rate: {stats.falsePositiveRate}%</span>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-xs">
            <span>Last Updated: {new Date().toLocaleTimeString()}</span>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
              API: https://api.safety-platform.edu/v1
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}