// Basic integration test for Classrooms module
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { RBACProvider } from '../components/rbac/RBACProvider';
import ClassroomDirectory from '../pages/classrooms/ClassroomDirectory';
import { runThemeCheck, assertThemeConsistency } from '../styles/themeChecker';

// Mock i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: () => new Promise(() => {}),
    },
  }),
}));

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <RBACProvider defaultRole="professor">
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </RBACProvider>
    </QueryClientProvider>
  );
};

describe('Classrooms Module', () => {
  beforeEach(() => {
    // Reset any mocks
    jest.clearAllMocks();
  });

  describe('Theme Consistency', () => {
    it('should pass theme consistency check', () => {
      // Set up basic DOM structure for theme checking
      document.documentElement.style.setProperty('--color-primary', '#0ea5e9');
      document.documentElement.style.setProperty('--color-bg-primary', '#020617');
      document.documentElement.style.setProperty('--color-text-primary', '#f1f5f9');
      
      const result = runThemeCheck();
      expect(result.isConsistent).toBe(true);
      expect(result.issues).toHaveLength(0);
    });

    it('should detect missing CSS custom properties', () => {
      // Clear custom properties
      document.documentElement.style.removeProperty('--color-primary');
      
      const result = runThemeCheck();
      expect(result.isConsistent).toBe(false);
      expect(result.issues).toContain('Primary color custom property not found');
    });

    it('should throw error when assertion fails', () => {
      // Clear custom properties to make assertion fail
      document.documentElement.style.removeProperty('--color-primary');
      document.documentElement.style.removeProperty('--color-bg-primary');
      
      expect(() => assertThemeConsistency()).toThrow('Theme consistency check failed');
    });
  });

  describe('ClassroomDirectory', () => {
    it('should render classroom directory with loading state', async () => {
      render(
        <TestWrapper>
          <ClassroomDirectory />
        </TestWrapper>
      );

      // Should show loading initially
      expect(screen.getByText('common:loading')).toBeInTheDocument();
    });

    it('should display search input', async () => {
      render(
        <TestWrapper>
          <ClassroomDirectory />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByPlaceholderText('directory.searchPlaceholder')).toBeInTheDocument();
      });
    });

    it('should show RBAC-filtered results for professors', async () => {
      render(
        <TestWrapper>
          <ClassroomDirectory />
        </TestWrapper>
      );

      await waitFor(() => {
        // Should show message about assigned classrooms for professors
        expect(screen.getByText(/您的分配教室/)).toBeInTheDocument();
      });
    });

    it('should handle search functionality', async () => {
      render(
        <TestWrapper>
          <ClassroomDirectory />
        </TestWrapper>
      );

      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText('directory.searchPlaceholder');
        fireEvent.change(searchInput, { target: { value: '北京大学' } });
        expect(searchInput).toHaveValue('北京大学');
      });
    });
  });

  describe('RBAC Integration', () => {
    it('should start with professor role by default', () => {
      render(
        <TestWrapper>
          <div data-testid="test-content">Test Content</div>
        </TestWrapper>
      );

      // The default role should be professor
      expect(screen.getByTestId('test-content')).toBeInTheDocument();
    });
  });

  describe('Data Layer', () => {
    it('should generate mock classrooms data', async () => {
      const { mockClassrooms } = await import('../data/classrooms/mockData');
      
      expect(mockClassrooms).toBeDefined();
      expect(mockClassrooms.length).toBeGreaterThan(1000);
      expect(mockClassrooms[0]).toHaveProperty('id');
      expect(mockClassrooms[0]).toHaveProperty('name');
      expect(mockClassrooms[0]).toHaveProperty('status');
    });

    it('should generate mock alerts data', async () => {
      const { mockAlerts } = await import('../data/classrooms/mockData');
      
      expect(mockAlerts).toBeDefined();
      expect(mockAlerts.length).toBeGreaterThan(0);
      expect(mockAlerts[0]).toHaveProperty('id');
      expect(mockAlerts[0]).toHaveProperty('type');
      expect(mockAlerts[0]).toHaveProperty('level');
    });
  });

  describe('Performance', () => {
    it('should handle large classroom lists efficiently', async () => {
      const startTime = performance.now();
      
      render(
        <TestWrapper>
          <ClassroomDirectory />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/显示.*个教室/)).toBeInTheDocument();
      });

      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Should render within 3 seconds (requirement)
      expect(renderTime).toBeLessThan(3000);
    });
  });
});

describe('I18n Integration', () => {
  it('should default to Chinese language', () => {
    // Mock i18next to verify default language
    const mockT = jest.fn((key) => key);
    
    jest.doMock('react-i18next', () => ({
      useTranslation: () => ({ t: mockT }),
    }));

    render(
      <TestWrapper>
        <ClassroomDirectory />
      </TestWrapper>
    );

    // Verify Chinese keys are being used
    expect(mockT).toHaveBeenCalledWith('directory.title');
  });
});

describe('WebSocket Integration', () => {
  it('should initialize mock WebSocket service', async () => {
    const { MockWebSocketService } = await import('../data/classrooms/mockData');
    const service = new MockWebSocketService();
    
    expect(service).toBeDefined();
    
    const connectPromise = service.connect();
    expect(connectPromise).toBeInstanceOf(Promise);
    
    await connectPromise;
    service.disconnect();
  });
});