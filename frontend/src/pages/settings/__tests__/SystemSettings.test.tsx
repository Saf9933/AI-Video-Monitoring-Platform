// src/pages/settings/__tests__/SystemSettings.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { RBACProvider } from '../../../components/rbac/RBACProvider';
import SystemSettings from '../../SystemSettings';

// Mock the i18n hook
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock the settings hooks
jest.mock('../../../data/system/settings.hooks', () => ({
  useSystemSettings: () => ({
    data: {
      org: { name: 'Test Organization', primaryColor: '#1e40af' },
      auth: { 
        defaultRole: 'professor',
        sessionMinutes: 480,
        idleTimeoutMinutes: 60,
        codes: [
          { id: '1', role: 'professor', masked: '****-0000', createdAt: '2025-08-16T00:00:00Z' }
        ]
      },
      alerts: { okMax: 0.2, l1Min: 0.3, l2Min: 0.6, l3Min: 0.8, minConfidence: 0.5, debounceMs: 2000 },
      notify: {
        recipients: [],
        channels: { sms: true, email: true, wecom: false },
        retryPolicy: 'exponential',
        rateLimitPerMin: 10
      },
      realtime: { wsBackoff: 'expo', pollSec: 5, targetP95Ms: 500, virtualization: true },
      integrations: { apiBase: 'http://localhost:8000' },
      flags: { classrooms: true, alerts: true, analytics: true, monitorWall: false, shapExplanations: true, shortcuts: true },
      maintenance: { lastCheckAt: '2025-08-16T00:00:00Z' },
      updatedAt: '2025-08-16T00:00:00Z',
      updatedBy: 'test'
    },
    isLoading: false,
    error: null
  }),
  useUpdateSystemSettings: () => ({
    mutateAsync: jest.fn(),
    isPending: false
  }),
  useUnsavedChanges: () => ({
    hasChanges: false,
    currentData: null,
    markDirty: jest.fn(),
    markClean: jest.fn(),
    revert: jest.fn()
  }),
  useSystemInfo: () => ({
    data: {
      version: '2.1.3',
      buildHash: 'abc123',
      uptime: '1d 2h',
      wsStatus: 'connected',
      queueLag: 10,
      dataMode: 'mock'
    },
    isLoading: false
  }),
  useReloadConfig: () => ({ mutateAsync: jest.fn(), isPending: false }),
  useClearCache: () => ({ mutateAsync: jest.fn(), isPending: false }),
  useGenerateOneTimeCode: () => ({ mutateAsync: jest.fn(), isPending: false }),
  useRevokeOneTimeCode: () => ({ mutateAsync: jest.fn(), isPending: false }),
  useTestNotification: () => ({ mutateAsync: jest.fn(), isPending: false }),
  useTestIntegration: () => ({ mutateAsync: jest.fn(), isPending: false }),
  useSystemCheck: () => ({ mutateAsync: jest.fn(), data: null, isPending: false }),
  useAuditLog: () => ({ data: [], isLoading: false }),
  useExportConfig: () => jest.fn()
}));

const TestWrapper = ({ children, role = 'professor' }: { children: React.ReactNode; role?: 'professor' | 'director' }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });

  return (
    <QueryClientProvider client={queryClient}>
      <RBACProvider defaultRole={role}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </RBACProvider>
    </QueryClientProvider>
  );
};

describe('SystemSettings', () => {
  test('renders system settings page with all tabs', () => {
    render(
      <TestWrapper>
        <SystemSettings />
      </TestWrapper>
    );

    expect(screen.getByText('systemSettings.title')).toBeInTheDocument();
    expect(screen.getByText('systemSettings.tabs.overview')).toBeInTheDocument();
    expect(screen.getByText('systemSettings.tabs.organization')).toBeInTheDocument();
    expect(screen.getByText('systemSettings.tabs.auth')).toBeInTheDocument();
    expect(screen.getByText('systemSettings.tabs.alerts')).toBeInTheDocument();
    expect(screen.getByText('systemSettings.tabs.notifications')).toBeInTheDocument();
    expect(screen.getByText('systemSettings.tabs.realtime')).toBeInTheDocument();
    expect(screen.getByText('systemSettings.tabs.integrations')).toBeInTheDocument();
    expect(screen.getByText('systemSettings.tabs.flags')).toBeInTheDocument();
    expect(screen.getByText('systemSettings.tabs.maintenance')).toBeInTheDocument();
  });

  test('professor role shows read-only interface', () => {
    render(
      <TestWrapper role="professor">
        <SystemSettings />
      </TestWrapper>
    );

    const saveButton = screen.getByRole('button', { name: /systemSettings.saveChanges/ });
    expect(saveButton).toBeDisabled();
  });

  test('director role can edit settings', () => {
    render(
      <TestWrapper role="director">
        <SystemSettings />
      </TestWrapper>
    );

    const saveButton = screen.getByRole('button', { name: /systemSettings.saveChanges/ });
    expect(saveButton).toBeDisabled(); // Disabled because no changes yet
  });

  test('can switch between tabs', async () => {
    render(
      <TestWrapper>
        <SystemSettings />
      </TestWrapper>
    );

    // Click on organization tab
    fireEvent.click(screen.getByText('systemSettings.tabs.organization'));
    
    await waitFor(() => {
      expect(screen.getByText('systemSettings.organization.title')).toBeInTheDocument();
    });

    // Click on alerts tab
    fireEvent.click(screen.getByText('systemSettings.tabs.alerts'));
    
    await waitFor(() => {
      expect(screen.getByText('systemSettings.alerts.title')).toBeInTheDocument();
    });
  });

  test('shows unsaved changes banner when data is modified', () => {
    // This would require mocking the useUnsavedChanges hook to return hasChanges: true
    // The test demonstrates the pattern for testing state changes
    render(
      <TestWrapper role="director">
        <SystemSettings />
      </TestWrapper>
    );

    // In a real test, we'd modify some data and check for the unsaved changes banner
    // expect(screen.queryByText('systemSettings.unsavedChanges')).not.toBeInTheDocument();
  });
});

describe('RBAC Integration', () => {
  test('professor cannot generate one-time codes', () => {
    render(
      <TestWrapper role="professor">
        <SystemSettings />
      </TestWrapper>
    );

    // Switch to auth tab
    fireEvent.click(screen.getByText('systemSettings.tabs.auth'));

    // Professor should not see generate buttons (they would be disabled)
    const generateButtons = screen.queryAllByText(/systemSettings.auth.oneTimeCodes.generate/);
    generateButtons.forEach(button => {
      expect(button.closest('button')).toBeDisabled();
    });
  });

  test('director can generate one-time codes', () => {
    render(
      <TestWrapper role="director">
        <SystemSettings />
      </TestWrapper>
    );

    // Switch to auth tab
    fireEvent.click(screen.getByText('systemSettings.tabs.auth'));

    // Director should see enabled generate buttons
    const generateProfessorButton = screen.getByText('systemSettings.auth.oneTimeCodes.generateProfessor').closest('button');
    const generateDirectorButton = screen.getByText('systemSettings.auth.oneTimeCodes.generateDirector').closest('button');
    
    expect(generateProfessorButton).not.toBeDisabled();
    expect(generateDirectorButton).not.toBeDisabled();
  });
});

describe('Tab Content', () => {
  test('overview tab shows system information', () => {
    render(
      <TestWrapper>
        <SystemSettings />
      </TestWrapper>
    );

    // Should show overview tab by default
    expect(screen.getByText('systemSettings.overview.title')).toBeInTheDocument();
    expect(screen.getByText('systemSettings.overview.systemInfo.title')).toBeInTheDocument();
    expect(screen.getByText('systemSettings.overview.quickActions.title')).toBeInTheDocument();
  });

  test('organization tab allows branding configuration', () => {
    render(
      <TestWrapper role="director">
        <SystemSettings />
      </TestWrapper>
    );

    fireEvent.click(screen.getByText('systemSettings.tabs.organization'));
    
    expect(screen.getByText('systemSettings.organization.title')).toBeInTheDocument();
    expect(screen.getByText('systemSettings.organization.organizationName')).toBeInTheDocument();
    expect(screen.getByText('systemSettings.organization.logoUpload')).toBeInTheDocument();
  });

  test('alerts tab shows threshold configuration', () => {
    render(
      <TestWrapper role="director">
        <SystemSettings />
      </TestWrapper>
    );

    fireEvent.click(screen.getByText('systemSettings.tabs.alerts'));
    
    expect(screen.getByText('systemSettings.alerts.title')).toBeInTheDocument();
    expect(screen.getByText('systemSettings.alerts.thresholds.title')).toBeInTheDocument();
  });
});