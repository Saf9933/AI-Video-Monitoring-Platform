// Mock data for homepage components
export const mockHomeData = {
  scenarios: [
    {
      id: 'exam_pressure',
      name_cn: '考试压力',
      name_en: 'Exam Pressure',
      icon: 'book-open',
      count: 12,
      trend: 'up' as const,
      trendValue: 8,
      riskLevel: 'medium' as const
    },
    {
      id: 'isolation_bullying',
      name_cn: '孤立霸凌',
      name_en: 'Isolation Bullying',
      icon: 'users',
      count: 5,
      trend: 'down' as const,
      trendValue: 15,
      riskLevel: 'high' as const
    },
    {
      id: 'self_harm',
      name_cn: '自伤行为',
      name_en: 'Self Harm',
      icon: 'heart-pulse',
      count: 2,
      trend: 'stable' as const,
      trendValue: 0,
      riskLevel: 'critical' as const
    },
    {
      id: 'teacher_verbal_abuse',
      name_cn: '教师语言暴力',
      name_en: 'Teacher Verbal Abuse',
      icon: 'message-square-warning',
      count: 3,
      trend: 'down' as const,
      trendValue: 25,
      riskLevel: 'high' as const
    },
    {
      id: 'cyber_tracking',
      name_cn: '网络跟踪',
      name_en: 'Cyber Tracking',
      icon: 'monitor',
      count: 8,
      trend: 'up' as const,
      trendValue: 12,
      riskLevel: 'medium' as const
    }
  ],

  monthlyStats: [
    { month: '2024-07', alerts: 45, resolved: 38, falsePositives: 5 },
    { month: '2024-08', alerts: 52, resolved: 45, falsePositives: 4 },
    { month: '2024-09', alerts: 38, resolved: 35, falsePositives: 2 },
    { month: '2024-10', alerts: 41, resolved: 38, falsePositives: 3 },
    { month: '2024-11', alerts: 35, resolved: 32, falsePositives: 2 },
    { month: '2024-12', alerts: 30, resolved: 25, falsePositives: 3 }
  ],

  metrics: [
    {
      id: 'response_time',
      title: 'Avg Response Time',
      title_cn: '平均响应时间',
      value: '2.3s',
      change: -12,
      changeType: 'decrease' as const,
      icon: 'zap',
      color: 'green' as const
    },
    {
      id: 'accuracy',
      title: 'Detection Accuracy',
      title_cn: '检测准确率',
      value: '94.2%',
      change: 3,
      changeType: 'increase' as const,
      icon: 'target',
      color: 'blue' as const
    },
    {
      id: 'false_positive_rate',
      title: 'False Positive Rate',
      title_cn: '误报率',
      value: '5.8%',
      change: -8,
      changeType: 'decrease' as const,
      icon: 'alert-triangle',
      color: 'yellow' as const
    },
    {
      id: 'privacy_compliance',
      title: 'Privacy Compliance',
      title_cn: '隐私合规率',
      value: '100%',
      change: 0,
      changeType: 'stable' as const,
      icon: 'shield',
      color: 'green' as const
    },
    {
      id: 'active_classrooms',
      title: 'Active Classrooms',
      title_cn: '活跃教室',
      value: '24/25',
      change: 0,
      changeType: 'stable' as const,
      icon: 'school',
      color: 'blue' as const
    }
  ],

  recentAlerts: [
    {
      id: 'alert_001',
      type: 'exam_pressure',
      type_cn: '考试压力异常',
      icon: 'book-open',
      classroom: '教室 3-A',
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
      priority: 'high' as const,
      status: 'new' as const,
      riskScore: 0.78
    },
    {
      id: 'alert_002',
      type: 'cyber_tracking',
      type_cn: '网络跟踪检测',
      icon: 'monitor',
      classroom: '计算机室 B',
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 minutes ago
      priority: 'medium' as const,
      status: 'acknowledged' as const,
      riskScore: 0.65
    },
    {
      id: 'alert_003',
      type: 'isolation_bullying',
      type_cn: '孤立霸凌行为',
      icon: 'users',
      classroom: '体育馆',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      priority: 'critical' as const,
      status: 'resolved' as const,
      riskScore: 0.89
    },
    {
      id: 'alert_004',
      type: 'teacher_verbal_abuse',
      type_cn: '教师语言不当',
      icon: 'message-square-warning',
      classroom: '教室 2-C',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
      priority: 'high' as const,
      status: 'acknowledged' as const,
      riskScore: 0.72
    },
    {
      id: 'alert_005',
      type: 'self_harm',
      type_cn: '自伤风险',
      icon: 'heart-pulse',
      classroom: '咨询室',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
      priority: 'critical' as const,
      status: 'resolved' as const,
      riskScore: 0.95
    }
  ]
};