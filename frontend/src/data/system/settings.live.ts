// src/data/system/settings.live.ts
import type { 
  SystemSettingsClient, 
  SystemSettings, 
  SystemInfo, 
  AuditEntry, 
  TestResult, 
  MaintenanceIssue 
} from './settings.types';

class LiveSystemSettingsClient implements SystemSettingsClient {
  private apiBase: string;
  private wsBase: string;

  constructor() {
    this.apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api/v1';
    this.wsBase = import.meta.env.VITE_WS_BASE || 'ws://localhost:8000/ws';
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.apiBase}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  async getSystemSettings(): Promise<SystemSettings> {
    return this.request<SystemSettings>('/system/settings');
  }

  async getSystemInfo(): Promise<SystemInfo> {
    return this.request<SystemInfo>('/system/info');
  }

  async getAuditLog(): Promise<AuditEntry[]> {
    return this.request<AuditEntry[]>('/system/audit');
  }

  async updateSystemSettings(patch: Partial<SystemSettings>): Promise<void> {
    await this.request('/system/settings', {
      method: 'PATCH',
      body: JSON.stringify(patch),
    });
  }

  async generateOneTimeCode(role: 'professor' | 'director'): Promise<{ id: string; masked: string; code: string }> {
    return this.request<{ id: string; masked: string; code: string }>('/system/auth/codes', {
      method: 'POST',
      body: JSON.stringify({ role }),
    });
  }

  async revokeOneTimeCode(id: string): Promise<void> {
    await this.request(`/system/auth/codes/${id}`, {
      method: 'DELETE',
    });
  }

  async testNotification(channel: 'sms' | 'email' | 'wecom'): Promise<'ok'> {
    await this.request(`/system/notifications/test`, {
      method: 'POST',
      body: JSON.stringify({ channel }),
    });
    return 'ok';
  }

  async testIntegration(kind: 'api' | 'ws' | 'lms' | 'kafka'): Promise<TestResult> {
    return this.request<TestResult>(`/system/integrations/test`, {
      method: 'POST',
      body: JSON.stringify({ kind }),
    });
  }

  exportConfig(): Blob {
    // In live mode, this would trigger a download from the server
    // For now, return a placeholder blob
    const placeholder = {
      error: 'Live export not implemented',
      message: 'Please use the server API to export configuration',
    };
    
    return new Blob([JSON.stringify(placeholder, null, 2)], {
      type: 'application/json',
    });
  }

  async systemCheck(): Promise<MaintenanceIssue[]> {
    return this.request<MaintenanceIssue[]>('/system/check');
  }

  async reloadConfig(): Promise<void> {
    await this.request('/system/config/reload', {
      method: 'POST',
    });
  }

  async clearCache(): Promise<void> {
    await this.request('/system/cache/clear', {
      method: 'POST',
    });
  }
}

export const liveSystemSettingsClient = new LiveSystemSettingsClient();