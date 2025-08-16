// src/data/system/__tests__/settings.mock.test.ts
import { mockSystemSettingsClient } from '../settings.mock';

describe('MockSystemSettingsClient', () => {
  beforeEach(() => {
    // Reset the mock client state if needed
  });

  test('getSystemSettings returns default settings', async () => {
    const settings = await mockSystemSettingsClient.getSystemSettings();
    
    expect(settings).toBeDefined();
    expect(settings.org.name).toBe('学生安全监控平台');
    expect(settings.auth.defaultRole).toBe('professor');
    expect(settings.auth.codes).toHaveLength(2); // Default professor and director codes
    expect(settings.alerts.okMax).toBe(0.2);
    expect(settings.flags.classrooms).toBe(true);
  });

  test('getSystemInfo returns mock system information', async () => {
    const info = await mockSystemSettingsClient.getSystemInfo();
    
    expect(info).toBeDefined();
    expect(info.version).toBe('2.1.3');
    expect(info.dataMode).toBe('mock');
    expect(info.wsStatus).toBe('connected');
  });

  test('updateSystemSettings modifies settings', async () => {
    const newOrgName = 'Updated Organization';
    await mockSystemSettingsClient.updateSystemSettings({
      org: { name: newOrgName }
    });

    const settings = await mockSystemSettingsClient.getSystemSettings();
    expect(settings.org.name).toBe(newOrgName);
  });

  test('generateOneTimeCode creates new code', async () => {
    const result = await mockSystemSettingsClient.generateOneTimeCode('professor');
    
    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.masked).toMatch(/\*\*\*\*-[A-Z0-9]{4}/);
    expect(result.code).toHaveLength(8);

    // Verify code was added to settings
    const settings = await mockSystemSettingsClient.getSystemSettings();
    const newCode = settings.auth.codes.find(code => code.id === result.id);
    expect(newCode).toBeDefined();
    expect(newCode?.role).toBe('professor');
  });

  test('revokeOneTimeCode marks code as revoked', async () => {
    const settings = await mockSystemSettingsClient.getSystemSettings();
    const codeToRevoke = settings.auth.codes[0];
    
    await mockSystemSettingsClient.revokeOneTimeCode(codeToRevoke.id);
    
    const updatedSettings = await mockSystemSettingsClient.getSystemSettings();
    const revokedCode = updatedSettings.auth.codes.find(code => code.id === codeToRevoke.id);
    expect(revokedCode?.revoked).toBe(true);
  });

  test('testNotification returns success', async () => {
    const result = await mockSystemSettingsClient.testNotification('email');
    expect(result).toBe('ok');
  });

  test('testIntegration returns test results', async () => {
    const apiResult = await mockSystemSettingsClient.testIntegration('api');
    expect(apiResult.ok).toBe(true);
    expect(apiResult.detail).toBeDefined();

    const lmsResult = await mockSystemSettingsClient.testIntegration('lms');
    expect(lmsResult.ok).toBe(false); // Mock LMS failure
  });

  test('systemCheck returns diagnostic information', async () => {
    const issues = await mockSystemSettingsClient.systemCheck();
    
    expect(Array.isArray(issues)).toBe(true);
    expect(issues.length).toBeGreaterThan(0);
    
    const hasInfo = issues.some(issue => issue.level === 'info');
    const hasWarning = issues.some(issue => issue.level === 'warn');
    const hasError = issues.some(issue => issue.level === 'error');
    
    expect(hasInfo || hasWarning || hasError).toBe(true);
  });

  test('exportConfig returns JSON blob', () => {
    const blob = mockSystemSettingsClient.exportConfig();
    
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe('application/json');
  });

  test('getAuditLog returns audit entries', async () => {
    const auditLog = await mockSystemSettingsClient.getAuditLog();
    
    expect(Array.isArray(auditLog)).toBe(true);
    expect(auditLog.length).toBeGreaterThan(0);
    
    const entry = auditLog[0];
    expect(entry.id).toBeDefined();
    expect(entry.timestamp).toBeDefined();
    expect(entry.actor).toBeDefined();
    expect(entry.action).toBeDefined();
  });

  test('operations create audit entries', async () => {
    const initialLog = await mockSystemSettingsClient.getAuditLog();
    const initialCount = initialLog.length;

    // Perform an operation that should create an audit entry
    await mockSystemSettingsClient.generateOneTimeCode('director');
    
    const updatedLog = await mockSystemSettingsClient.getAuditLog();
    expect(updatedLog.length).toBe(initialCount + 1);
    
    const newEntry = updatedLog[0]; // Most recent entry
    expect(newEntry.action).toBe('GENERATE_CODE');
  });

  test('mock client simulates network delays', async () => {
    const start = Date.now();
    await mockSystemSettingsClient.getSystemSettings();
    const duration = Date.now() - start;
    
    // Should have some delay (mock latency)
    expect(duration).toBeGreaterThan(200); // At least 200ms delay
  });
});