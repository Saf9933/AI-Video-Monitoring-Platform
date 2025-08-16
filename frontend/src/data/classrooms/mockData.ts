import { 
  Classroom, 
  Alert, 
  ClassroomMetrics, 
  AnalyticsData, 
  Intervention, 
  InterventionTemplate, 
  ClassroomSettings, 
  AuditEntry, 
  User,
  Role,
  ClassroomFilter,
  AlertFilter,
  AuditFilter,
  PaginationParams,
  PaginatedResponse,
  ApiResponse,
  DeviceHealth,
  TrendData,
  AlertType,
  AlertLevel,
  AlertStatus,
  InterventionType,
  InterventionStatus,
  TimeRange
} from './types';

// Generate realistic mock data for the classroom management system

// Helper functions for generating mock data
const generateId = (): string => Math.random().toString(36).substring(2, 15);

const randomChoice = <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)];

const randomDate = (start: Date, end: Date): string => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
};

const generateTrendData = (baseValue: number, variance: number = 10, points: number = 15): TrendData => {
  const generatePoints = () => {
    const data = [];
    let current = baseValue;
    for (let i = 0; i < points; i++) {
      current += (Math.random() - 0.5) * variance;
      current = Math.max(0, Math.min(100, current));
      data.push({
        timestamp: new Date(Date.now() - (points - i) * 60000).toISOString(),
        value: Math.round(current * 10) / 10
      });
    }
    return data;
  };

  return {
    stress: generatePoints(),
    isolation: generatePoints(),
    aggression: generatePoints(),
    timeRange: '15m'
  };
};

// Mock Users Data
export const mockUsers: User[] = [
  {
    id: 'user_prof_001',
    name: '张教授',
    email: 'zhang.prof@university.edu.cn',
    role: 'professor',
    assignedClassrooms: ['classroom_001', 'classroom_002', 'classroom_003'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'user_prof_002', 
    name: '李教授',
    email: 'li.prof@university.edu.cn',
    role: 'professor',
    assignedClassrooms: ['classroom_004', 'classroom_005'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'user_dir_001',
    name: '王主任',
    email: 'wang.director@university.edu.cn', 
    role: 'director',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

// Mock Classrooms Data (1000+ for performance testing)
export const generateMockClassrooms = (count: number = 1200): Classroom[] => {
  const schools = ['北京大学', '清华大学', '中国人民大学', '北京师范大学', '中央财经大学'];
  const departments = ['计算机学院', '数学学院', '物理学院', '化学学院', '生物学院', '经济学院', '管理学院'];
  const instructors = ['张教授', '李教授', '王教授', '刘教授', '陈教授', '杨教授', '赵教授'];
  const statuses: Classroom['status'][] = ['online', 'offline', 'warning', 'error'];
  const healthStatuses: DeviceHealth['heartbeat'][] = ['healthy', 'degraded', 'offline'];
  const gpuStatuses: DeviceHealth['gpu'][] = ['idle', 'normal', 'high', 'overload'];

  return Array.from({ length: count }, (_, i) => {
    const school = randomChoice(schools);
    const department = randomChoice(departments);
    const instructor = randomChoice(instructors);
    const status = randomChoice(statuses);
    
    return {
      id: `classroom_${String(i + 1).padStart(3, '0')}`,
      name: `${school}${department}${String(i + 1).padStart(3, '0')}教室`,
      school,
      department,
      instructor,
      instructorId: `instructor_${i % 20 + 1}`,
      status,
      location: `${school}主楼${Math.floor(i / 50) + 1}层${(i % 50) + 1}室`,
      capacity: Math.floor(Math.random() * 100) + 50,
      currentOccupancy: Math.floor(Math.random() * 80) + 20,
      deviceHealth: {
        heartbeat: randomChoice(healthStatuses),
        gpu: randomChoice(gpuStatuses),
        streamLatency: Math.floor(Math.random() * 500) + 50,
        fps: Math.floor(Math.random() * 10) + 25,
        lastHeartbeat: randomDate(new Date(Date.now() - 300000), new Date()).slice(0, 19) + 'Z'
      },
      lastEventTime: randomDate(new Date(Date.now() - 3600000), new Date()),
      recentTrends: generateTrendData(Math.random() * 40 + 10),
      alert24hCount: Math.floor(Math.random() * 20),
      createdAt: randomDate(new Date('2024-01-01'), new Date('2024-06-01')),
      updatedAt: randomDate(new Date('2024-06-01'), new Date())
    };
  });
};

export const mockClassrooms = generateMockClassrooms();

// Mock Alerts Data
export const generateMockAlerts = (classrooms: Classroom[], count: number = 500): Alert[] => {
  const types: AlertType[] = ['stress', 'isolation', 'aggression', 'disruption', 'anomaly'];
  const levels: AlertLevel[] = ['l0', 'l1', 'l2', 'l3'];
  const statuses: AlertStatus[] = ['new', 'acknowledged', 'assigned', 'inProgress', 'resolved', 'closed'];
  const priorities: Alert['priority'][] = ['low', 'medium', 'high', 'critical'];
  const sources: Alert['source'][] = ['video', 'audio', 'text', 'behavioral'];

  const alertTitles = {
    stress: ['学生压力水平异常', '考试焦虑检测', '学习压力预警'],
    isolation: ['社交孤立行为', '同学排斥现象', '群体隔离检测'],
    aggression: ['言语冲突检测', '肢体冲突预警', '攻击性行为'],
    disruption: ['课堂扰动检测', '注意力分散', '秩序混乱'],
    anomaly: ['异常行为检测', '未知模式识别', '行为异常']
  };

  return Array.from({ length: count }, (_, i) => {
    const type = randomChoice(types);
    const level = randomChoice(levels);
    const status = randomChoice(statuses);
    const classroom = randomChoice(classrooms);
    
    return {
      id: `alert_${String(i + 1).padStart(4, '0')}`,
      classroomId: classroom.id,
      type,
      level,
      title: randomChoice(alertTitles[type]),
      description: `在${classroom.name}检测到${type}相关异常行为，置信度${Math.floor(Math.random() * 30) + 70}%`,
      confidence: Math.random() * 0.3 + 0.7,
      status,
      priority: randomChoice(priorities),
      source: randomChoice(sources),
      assignedTo: status === 'assigned' || status === 'inProgress' ? randomChoice(mockUsers).id : undefined,
      acknowledgedBy: status !== 'new' ? randomChoice(mockUsers).id : undefined,
      acknowledgedAt: status !== 'new' ? randomDate(new Date(Date.now() - 3600000), new Date()) : undefined,
      resolvedAt: status === 'resolved' || status === 'closed' ? randomDate(new Date(Date.now() - 1800000), new Date()) : undefined,
      evidence: [
        {
          id: `evidence_${i}_1`,
          type: 'image',
          url: `/api/evidence/image_${i}.jpg`,
          thumbnail: `/api/evidence/thumb_${i}.jpg`,
          isBlurred: Math.random() > 0.3,
          timestamp: randomDate(new Date(Date.now() - 7200000), new Date())
        }
      ],
      shap: {
        topFactors: [
          { feature: '面部表情', importance: Math.random() * 0.4 + 0.3, description: '检测到焦虑表情' },
          { feature: '身体姿态', importance: Math.random() * 0.3 + 0.2, description: '紧张姿态变化' },
          { feature: '声音特征', importance: Math.random() * 0.2 + 0.1, description: '语音压力指标' }
        ],
        confidence: Math.random() * 0.3 + 0.7,
        modelVersion: '2.1.3',
        explanation: '基于多模态分析检测到异常行为模式'
      },
      metadata: {
        modelVersion: '2.1.3',
        processingTime: Math.floor(Math.random() * 1000) + 500,
        sourceFrame: Math.floor(Math.random() * 1000)
      },
      tags: [type, level, classroom.department],
      createdAt: randomDate(new Date(Date.now() - 86400000), new Date()),
      updatedAt: randomDate(new Date(Date.now() - 43200000), new Date())
    };
  });
};

export const mockAlerts = generateMockAlerts(mockClassrooms);

// Mock Intervention Templates
export const mockInterventionTemplates: InterventionTemplate[] = [
  {
    id: 'template_emotional',
    name: '情绪波动处理',
    type: 'emotional',
    description: '学生情绪异常时的标准化处理流程',
    checklist: [
      { description: '观察学生当前状态', required: true, estimatedMinutes: 2 },
      { description: '与学生进行初步沟通', required: true, estimatedMinutes: 5 },
      { description: '评估情绪严重程度', required: true, estimatedMinutes: 3 },
      { description: '提供适当心理疏导', required: false, estimatedMinutes: 10 },
      { description: '联系家长或监护人', required: false, estimatedMinutes: 5 },
      { description: '记录处理过程', required: true, estimatedMinutes: 2 }
    ],
    slaMinutes: 15,
    requiredRole: 'professor',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'template_disruption',
    name: '课堂扰动处理',
    type: 'disruption',
    description: '课堂秩序问题的处理标准流程',
    checklist: [
      { description: '识别扰动源头', required: true, estimatedMinutes: 1 },
      { description: '采取适当制止措施', required: true, estimatedMinutes: 3 },
      { description: '恢复课堂秩序', required: true, estimatedMinutes: 5 },
      { description: '与相关学生谈话', required: true, estimatedMinutes: 8 },
      { description: '评估后续影响', required: false, estimatedMinutes: 3 }
    ],
    slaMinutes: 10,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'template_selfharm',
    name: '自伤风险处理',
    type: 'selfHarm',
    description: '发现学生自伤倾向时的紧急处理流程',
    checklist: [
      { description: '立即确保学生安全', required: true, estimatedMinutes: 2 },
      { description: '联系心理咨询师', required: true, estimatedMinutes: 3 },
      { description: '通知学校医务室', required: true, estimatedMinutes: 2 },
      { description: '联系家长', required: true, estimatedMinutes: 5 },
      { description: '持续监护直至专业人员接手', required: true, estimatedMinutes: 15 },
      { description: '填写事件报告', required: true, estimatedMinutes: 8 }
    ],
    slaMinutes: 5,
    requiredRole: 'director',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'template_bullying',
    name: '霸凌事件处理', 
    type: 'bullying',
    description: '校园霸凌事件的处理标准流程',
    checklist: [
      { description: '分离相关学生', required: true, estimatedMinutes: 3 },
      { description: '收集事件详细信息', required: true, estimatedMinutes: 10 },
      { description: '联系所有相关家长', required: true, estimatedMinutes: 15 },
      { description: '制定后续处理方案', required: true, estimatedMinutes: 20 },
      { description: '安排心理支持', required: true, estimatedMinutes: 5 },
      { description: '上报学校管理层', required: true, estimatedMinutes: 5 }
    ],
    slaMinutes: 30,
    requiredRole: 'director',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

// Mock Audit Entries
export const generateMockAuditEntries = (count: number = 200): AuditEntry[] => {
  const actions: AuditEntry['action'][] = ['view', 'create', 'update', 'acknowledge', 'assign', 'resolve', 'export'];
  const targets: AuditEntry['target'][] = ['classroom', 'alert', 'setting', 'intervention'];
  const results: AuditEntry['result'][] = ['success', 'failure', 'partial'];

  return Array.from({ length: count }, (_, i) => {
    const user = randomChoice(mockUsers);
    const action = randomChoice(actions);
    const target = randomChoice(targets);
    
    return {
      id: `audit_${String(i + 1).padStart(4, '0')}`,
      userId: user.id,
      userName: user.name,
      action,
      target,
      targetId: target === 'classroom' ? randomChoice(mockClassrooms).id : `${target}_${Math.floor(Math.random() * 100)}`,
      details: {
        action,
        target,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      ipAddress: `192.168.1.${Math.floor(Math.random() * 254) + 1}`,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      result: randomChoice(results),
      payloadHash: `sha256_${Math.random().toString(36).substring(2, 15)}`,
      sessionId: `session_${Math.random().toString(36).substring(2, 15)}`,
      createdAt: randomDate(new Date(Date.now() - 2592000000), new Date()),
      updatedAt: randomDate(new Date(Date.now() - 2592000000), new Date())
    };
  });
};

export const mockAuditEntries = generateMockAuditEntries();

// WebSocket Message Simulator with RBAC scope filtering
export class MockWebSocketService {
  private listeners: Map<string, Function[]> = new Map();
  private intervalId: NodeJS.Timeout | null = null;
  private isConnected = false;
  private allowedRoomIds: '*' | string[] = '*';
  private currentRole: 'professor' | 'director' = 'professor';

  connect(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.isConnected = true;
        this.startSimulation();
        resolve();
      }, Math.random() * 1000 + 500); // Simulate connection delay
    });
  }

  disconnect(): void {
    this.isConnected = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  // Update scope for role-based filtering
  updateScope(allowedRoomIds: '*' | string[], role: 'professor' | 'director'): void {
    this.allowedRoomIds = allowedRoomIds;
    this.currentRole = role;
  }

  // Check if a classroom is accessible based on current scope
  private isClassroomAccessible(classroomId: string): boolean {
    if (this.allowedRoomIds === '*') {
      return true;
    }
    return this.allowedRoomIds.includes(classroomId);
  }

  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  private startSimulation(): void {
    // Simulate real-time alerts and updates with scope filtering
    this.intervalId = setInterval(() => {
      if (!this.isConnected) return;

      // Get classrooms accessible to current role
      const accessibleClassrooms = this.allowedRoomIds === '*' 
        ? mockClassrooms 
        : mockClassrooms.filter(c => this.isClassroomAccessible(c.id));

      if (accessibleClassrooms.length === 0) return;

      // Randomly generate new alerts (low frequency)
      if (Math.random() < 0.1) {
        const classroom = randomChoice(accessibleClassrooms);
        const newAlert = {
          id: `alert_live_${Date.now()}`,
          classroomId: classroom.id,
          type: randomChoice(['stress', 'isolation', 'aggression', 'disruption']),
          level: randomChoice(['l1', 'l2', 'l3']),
          title: '实时检测异常',
          confidence: Math.random() * 0.3 + 0.7,
          timestamp: new Date().toISOString()
        };
        
        // Only emit if classroom is accessible
        if (this.isClassroomAccessible(classroom.id)) {
          this.emit('alert.new', newAlert);
        }
      }

      // Simulate metrics updates (higher frequency)
      if (Math.random() < 0.3) {
        const activeAccessibleClassrooms = accessibleClassrooms.slice(0, 10); // Only active classrooms
        if (activeAccessibleClassrooms.length > 0) {
          const classroom = randomChoice(activeAccessibleClassrooms);
          const metrics = {
            classroomId: classroom.id,
            stress: Math.random() * 100,
            isolation: Math.random() * 100,
            aggression: Math.random() * 100,
            timestamp: new Date().toISOString()
          };
          
          // Only emit if classroom is accessible
          if (this.isClassroomAccessible(classroom.id)) {
            this.emit('metrics.update', metrics);
          }
        }
      }

      // Simulate device status updates
      if (Math.random() < 0.05) {
        const classroom = randomChoice(accessibleClassrooms);
        const deviceUpdate = {
          classroomId: classroom.id,
          heartbeat: randomChoice(['healthy', 'degraded', 'offline']),
          latency: Math.floor(Math.random() * 500) + 50,
          fps: Math.floor(Math.random() * 10) + 25,
          timestamp: new Date().toISOString()
        };
        
        // Only emit if classroom is accessible
        if (this.isClassroomAccessible(classroom.id)) {
          this.emit('device.status', deviceUpdate);
        }
      }
    }, 3000); // Update every 3 seconds
  }
}

// Export singleton instance
export const mockWebSocket = new MockWebSocketService();