// src/data/system/settings.mock.ts
import type { 
  SystemSettingsClient, 
  SystemSettings, 
  SystemInfo, 
  AuditEntry, 
  TestResult, 
  MaintenanceIssue 
} from './settings.types';

class MockSystemSettingsClient implements SystemSettingsClient {
  private settings: SystemSettings;
  private auditLog: AuditEntry[];
  private nextCodeId = 1;

  constructor() {
    this.settings = this.getDefaultSettings();
    this.auditLog = this.getDefaultAuditLog();
  }

  private getDefaultSettings(): SystemSettings {
    return {
      org: {
        name: '学生安全监控平台',
        logoUrl: undefined,
        primaryColor: '#1e40af',
        faviconUrl: undefined,
      },
      auth: {
        defaultRole: 'professor',
        sessionMinutes: 480, // 8 hours
        idleTimeoutMinutes: 60,
        codes: [
          {
            id: 'code-1',
            role: 'professor',
            masked: '****-0000',
            createdAt: '2025-08-15T10:00:00Z',
          },
          {
            id: 'code-2',
            role: 'director',
            masked: '****-0303',
            createdAt: '2025-08-15T10:00:00Z',
          },
        ],
      },
      alerts: {
        okMax: 0.2,
        l1Min: 0.3,
        l2Min: 0.6,
        l3Min: 0.8,
        minConfidence: 0.5,
        debounceMs: 2000,
      },
      notify: {
        recipients: [
          { id: 'rec-1', name: '张辅导员', role: 'counselor' },
          { id: 'rec-2', name: '李主任', role: 'director' },
          { id: 'rec-3', name: '王辅导员', role: 'counselor' },
        ],
        channels: {
          sms: true,
          email: true,
          wecom: false,
        },
        retryPolicy: 'exponential',
        rateLimitPerMin: 10,
      },
      realtime: {
        wsBackoff: 'expo',
        pollSec: 5,
        targetP95Ms: 500,
        virtualization: true,
      },
      integrations: {
        apiBase: 'http://localhost:8000/api/v1',
        wsBase: 'ws://localhost:8000/ws',
        lmsBase: 'https://lms.university.edu',
        kafkaBrokers: 'localhost:9092',
      },
      flags: {
        classrooms: true,
        alerts: true,
        analytics: true,
        monitorWall: false,
        shapExplanations: true,
        shortcuts: true,
      },
      maintenance: {
        lastCheckAt: '2025-08-16T02:00:00Z',
        issues: [
          { level: 'info', message: '系统运行正常' },
          { level: 'warn', message: '磁盘使用率达到 75%' },
        ],
      },
      updatedAt: '2025-08-16T01:00:00Z',
      updatedBy: 'system',
    };
  }

  private getDefaultAuditLog(): AuditEntry[] {
    return [
      {
        id: 'audit-1',
        timestamp: '2025-08-16T01:30:00Z',
        actor: 'director@platform',
        action: 'UPDATE_ALERT_THRESHOLDS',
        details: 'Modified L2 threshold from 0.5 to 0.6',
        hash: 'abc123',
      },
      {
        id: 'audit-2',
        timestamp: '2025-08-16T01:00:00Z',
        actor: 'director@platform',
        action: 'GENERATE_CODE',
        details: 'Generated professor code ****-A7F2',
        hash: 'def456',
      },
      {
        id: 'audit-3',
        timestamp: '2025-08-15T23:30:00Z',
        actor: 'system',
        action: 'CONFIG_RELOAD',
        details: 'Automatic configuration reload',
        hash: 'ghi789',
      },
    ];
  }

  private delay(ms: number = 300): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private generateMaskedCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const suffix = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    return `****-${suffix}`;
  }

  private generateFullCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  }

  private addAuditEntry(action: string, details?: string, actor: string = 'director@platform'): void {
    const entry: AuditEntry = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor,
      action,
      details,
      hash: Math.random().toString(36).substring(2, 8),
    };
    this.auditLog.unshift(entry);
    // Keep only last 50 entries
    if (this.auditLog.length > 50) {
      this.auditLog = this.auditLog.slice(0, 50);
    }
  }

  async getSystemSettings(): Promise<SystemSettings> {
    await this.delay();
    return { ...this.settings };
  }

  async getSystemInfo(): Promise<SystemInfo> {
    await this.delay(100);
    return {
      version: '2.1.3',
      buildHash: 'abc123def456',
      uptime: '2d 14h 32m',
      wsStatus: 'connected',
      queueLag: 12,
      dataMode: 'mock',
    };
  }

  async getAuditLog(): Promise<AuditEntry[]> {
    await this.delay(200);
    return [...this.auditLog];
  }

  async updateSystemSettings(patch: Partial<SystemSettings>): Promise<void> {
    await this.delay();
    
    const oldSettings = { ...this.settings };
    this.settings = {
      ...this.settings,
      ...patch,
      updatedAt: new Date().toISOString(),
      updatedBy: 'director@platform',
    };

    // Generate audit entry for changes
    const changes = [];
    if (patch.alerts && JSON.stringify(patch.alerts) !== JSON.stringify(oldSettings.alerts)) {
      changes.push('Alert thresholds');
    }
    if (patch.notify && JSON.stringify(patch.notify) !== JSON.stringify(oldSettings.notify)) {
      changes.push('Notification settings');
    }
    if (patch.realtime && JSON.stringify(patch.realtime) !== JSON.stringify(oldSettings.realtime)) {
      changes.push('Realtime settings');
    }
    if (patch.flags && JSON.stringify(patch.flags) !== JSON.stringify(oldSettings.flags)) {
      changes.push('Feature flags');
    }
    if (patch.org && JSON.stringify(patch.org) !== JSON.stringify(oldSettings.org)) {
      changes.push('Organization settings');
    }
    if (patch.auth && JSON.stringify(patch.auth) !== JSON.stringify(oldSettings.auth)) {
      changes.push('Auth settings');
    }
    if (patch.integrations && JSON.stringify(patch.integrations) !== JSON.stringify(oldSettings.integrations)) {
      changes.push('Integration settings');
    }

    if (changes.length > 0) {
      this.addAuditEntry('UPDATE_SETTINGS', `Modified: ${changes.join(', ')}`);
    }
  }

  async generateOneTimeCode(role: 'professor' | 'director'): Promise<{ id: string; masked: string; code: string }> {
    await this.delay();
    
    const id = `code-${this.nextCodeId++}`;
    const fullCode = this.generateFullCode();
    const masked = this.generateMaskedCode();
    
    const newCode = {
      id,
      role,
      masked,
      createdAt: new Date().toISOString(),
    };

    this.settings.auth.codes.push(newCode);
    this.addAuditEntry('GENERATE_CODE', `Generated ${role} code ${masked}`);

    return { id, masked, code: fullCode };
  }

  async revokeOneTimeCode(id: string): Promise<void> {
    await this.delay();
    
    const codeIndex = this.settings.auth.codes.findIndex(code => code.id === id);
    if (codeIndex >= 0) {
      const code = this.settings.auth.codes[codeIndex];
      this.settings.auth.codes[codeIndex] = { ...code, revoked: true };
      this.addAuditEntry('REVOKE_CODE', `Revoked ${code.role} code ${code.masked}`);
    }
  }

  async testNotification(channel: 'sms' | 'email' | 'wecom'): Promise<'ok'> {
    await this.delay(1000); // Simulate network delay
    return 'ok';
  }

  async testIntegration(kind: 'api' | 'ws' | 'lms' | 'kafka'): Promise<TestResult> {
    await this.delay(800);
    
    // Simulate some connection tests
    const results: Record<string, TestResult> = {
      api: { ok: true, detail: 'API endpoint responding normally' },
      ws: { ok: true, detail: 'WebSocket connection established' },
      lms: { ok: false, detail: 'Connection timeout after 5s' },
      kafka: { ok: true, detail: 'Kafka brokers reachable' },
    };

    return results[kind] || { ok: false, detail: 'Unknown integration type' };
  }

  exportConfig(): Blob {
    const config = {
      exportedAt: new Date().toISOString(),
      version: '2.1.3',
      settings: this.settings,
    };

    return new Blob([JSON.stringify(config, null, 2)], {
      type: 'application/json',
    });
  }

  async systemCheck(): Promise<MaintenanceIssue[]> {
    await this.delay(1500);
    
    return [
      { level: 'info', message: '系统版本: 2.1.3 (最新)' },
      { level: 'info', message: '数据库连接: 正常' },
      { level: 'info', message: 'WebSocket 服务: 运行中' },
      { level: 'warn', message: '磁盘空间: 75% 已使用' },
      { level: 'info', message: '内存使用: 45% (4.2GB / 8GB)' },
      { level: 'info', message: '活跃连接: 142 个客户端' },
      { level: 'error', message: 'LMS 集成: 连接超时' },
      { level: 'info', message: '最近备份: 2 小时前' },
    ];
  }

  async reloadConfig(): Promise<void> {
    await this.delay(500);
    this.addAuditEntry('RELOAD_CONFIG', 'Manual configuration reload', 'director@platform');
  }

  async clearCache(): Promise<void> {
    await this.delay(300);
    this.addAuditEntry('CLEAR_CACHE', 'Cache cleared manually', 'director@platform');
  }
}

export const mockSystemSettingsClient = new MockSystemSettingsClient();