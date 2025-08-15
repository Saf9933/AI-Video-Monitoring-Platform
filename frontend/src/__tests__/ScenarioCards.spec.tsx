// src/__tests__/ScenarioCards.spec.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ScenarioCards from '../components/homepage/ScenarioCards';

// Mock the hooks
jest.mock('../hooks/useScenarioCounts');
jest.mock('../services/websocket');

import { useScenarioCounts } from '../hooks/useScenarioCounts';
const mockUseScenarioCounts = useScenarioCounts as jest.MockedFunction<typeof useScenarioCounts>;

// Mock data
const mockScenarioCounts = [
  {
    id: 'exam_pressure' as const,
    count: 42,
    unresolved_count: 8,
    recent_7d_count: 12
  },
  {
    id: 'isolation_bullying' as const,
    count: 23,
    unresolved_count: 5,
    recent_7d_count: 7
  },
  {
    id: 'self_harm' as const,
    count: 15,
    unresolved_count: 3,
    recent_7d_count: 4
  },
  {
    id: 'teacher_verbal_abuse' as const,
    count: 18,
    unresolved_count: 2,
    recent_7d_count: 6
  },
  {
    id: 'cyber_tracking' as const,
    count: 31,
    unresolved_count: 7,
    recent_7d_count: 9
  }
];

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        {children}
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('ScenarioCards', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseScenarioCounts.mockReturnValue({
      scenarioCounts: mockScenarioCounts,
      isLoading: false,
      error: null,
      refetch: jest.fn()
    });
  });

  test('renders scenario cards with live counts', () => {
    render(
      <TestWrapper>
        <ScenarioCards />
      </TestWrapper>
    );

    expect(screen.getByText('核心安全场景监控')).toBeInTheDocument();
    expect(screen.getByText('考试压力')).toBeInTheDocument();
    expect(screen.getByText('孤立霸凌')).toBeInTheDocument();
    expect(screen.getByText('自伤行为')).toBeInTheDocument();
    expect(screen.getByText('教师言语暴力')).toBeInTheDocument();
    expect(screen.getByText('网络跟踪')).toBeInTheDocument();

    // Check counts are displayed
    expect(screen.getByText('42')).toBeInTheDocument(); // exam_pressure count
    expect(screen.getByText('15')).toBeInTheDocument(); // self_harm count
  });

  test('clicking "自伤行为" navigates with ?scenario=self_harm', () => {
    render(
      <TestWrapper>
        <ScenarioCards />
      </TestWrapper>
    );

    const selfHarmCard = screen.getByRole('button', { name: /查看 自伤行为 相关预警/ });
    expect(selfHarmCard).toBeInTheDocument();
    expect(selfHarmCard.getAttribute('href')).toBe('/alerts?scenario=self_harm');
  });

  test('all scenario cards have correct navigation links', () => {
    render(
      <TestWrapper>
        <ScenarioCards />
      </TestWrapper>
    );

    expect(screen.getByRole('button', { name: /查看 考试压力 相关预警/ }))
      .toHaveAttribute('href', '/alerts?scenario=exam_pressure');
    expect(screen.getByRole('button', { name: /查看 孤立霸凌 相关预警/ }))
      .toHaveAttribute('href', '/alerts?scenario=isolation_bullying');
    expect(screen.getByRole('button', { name: /查看 自伤行为 相关预警/ }))
      .toHaveAttribute('href', '/alerts?scenario=self_harm');
    expect(screen.getByRole('button', { name: /查看 教师言语暴力 相关预警/ }))
      .toHaveAttribute('href', '/alerts?scenario=teacher_verbal_abuse');
    expect(screen.getByRole('button', { name: /查看 网络跟踪 相关预警/ }))
      .toHaveAttribute('href', '/alerts?scenario=cyber_tracking');
  });

  test('keyboard Enter key navigation works', () => {
    render(
      <TestWrapper>
        <ScenarioCards />
      </TestWrapper>
    );

    const selfHarmCard = screen.getByRole('button', { name: /查看 自伤行为 相关预警/ });
    
    // Mock window.location.href
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, href: '' };

    fireEvent.keyDown(selfHarmCard, { key: 'Enter', code: 'Enter' });
    expect(window.location.href).toBe('/alerts?scenario=self_harm');

    // Restore original location
    window.location = originalLocation;
  });

  test('tooltips render on hover and focus', async () => {
    render(
      <TestWrapper>
        <ScenarioCards />
      </TestWrapper>
    );

    const selfHarmCard = screen.getByRole('button', { name: /查看 自伤行为 相关预警/ });
    
    // Test hover
    fireEvent.mouseEnter(selfHarmCard);
    await waitFor(() => {
      expect(screen.getByText('点击查看 自伤行为 预警详情')).toBeInTheDocument();
    });

    fireEvent.mouseLeave(selfHarmCard);
    await waitFor(() => {
      expect(screen.queryByText('点击查看 自伤行为 预警详情')).not.toBeInTheDocument();
    });

    // Test focus
    fireEvent.focus(selfHarmCard);
    await waitFor(() => {
      expect(screen.getByText('点击查看 自伤行为 预警详情')).toBeInTheDocument();
    });
  });

  test('kebab menu appears and quick filters work', async () => {
    // Mock window.location.href for navigation testing
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, href: '' };

    render(
      <TestWrapper>
        <ScenarioCards />
      </TestWrapper>
    );

    // Find and click kebab menu button for first card
    const kebabButtons = screen.getAllByLabelText('快速操作');
    fireEvent.click(kebabButtons[0]);

    // Check if menu items appear
    await waitFor(() => {
      expect(screen.getByText('未处理')).toBeInTheDocument();
      expect(screen.getByText('最近7天')).toBeInTheDocument();
      expect(screen.getByText('导出')).toBeInTheDocument();
    });

    // Click on "未处理" filter
    const unresolvedFilter = screen.getByText('未处理');
    fireEvent.click(unresolvedFilter);

    expect(window.location.href).toContain('status=new,acknowledged,in_progress');
    expect(window.location.href).toContain('scenario=exam_pressure');

    // Restore original location
    window.location = originalLocation;
  });

  test('loading state displays skeleton cards', () => {
    mockUseScenarioCounts.mockReturnValue({
      scenarioCounts: [],
      isLoading: true,
      error: null,
      refetch: jest.fn()
    });

    render(
      <TestWrapper>
        <ScenarioCards />
      </TestWrapper>
    );

    expect(screen.getByText('核心安全场景监控')).toBeInTheDocument();
    // Check for loading skeleton elements
    const skeletons = screen.getAllByRole('generic');
    expect(skeletons.some(el => el.className.includes('animate-pulse'))).toBe(true);
  });

  test('error state displays error message and retry button', () => {
    const mockRefetch = jest.fn();
    mockUseScenarioCounts.mockReturnValue({
      scenarioCounts: [],
      isLoading: false,
      error: new Error('Failed to load data'),
      refetch: mockRefetch
    });

    render(
      <TestWrapper>
        <ScenarioCards />
      </TestWrapper>
    );

    expect(screen.getByText('加载失败')).toBeInTheDocument();
    expect(screen.getByText('无法加载场景数据')).toBeInTheDocument();

    const retryButton = screen.getByRole('button', { name: /重试/ });
    fireEvent.click(retryButton);
    expect(mockRefetch).toHaveBeenCalled();
  });

  test('accessibility features are present', () => {
    render(
      <TestWrapper>
        <ScenarioCards />
      </TestWrapper>
    );

    const cards = screen.getAllByRole('button');
    cards.forEach(card => {
      expect(card).toHaveAttribute('tabIndex', '0');
      expect(card).toHaveAttribute('aria-label');
    });
  });

  test('cards have proper hover and focus styles', () => {
    render(
      <TestWrapper>
        <ScenarioCards />
      </TestWrapper>
    );

    const selfHarmCard = screen.getByRole('button', { name: /查看 自伤行为 相关预警/ });
    
    expect(selfHarmCard.className).toContain('hover:shadow-md');
    expect(selfHarmCard.className).toContain('hover:scale-[1.01]');
    expect(selfHarmCard.className).toContain('focus:ring-2');
    expect(selfHarmCard.className).toContain('focus:ring-blue-500');
  });

  test('risk levels are properly displayed', () => {
    render(
      <TestWrapper>
        <ScenarioCards />
      </TestWrapper>
    );

    // Check for risk level indicators (colored dots)
    const cards = screen.getAllByRole('button');
    cards.forEach(card => {
      const riskDot = card.querySelector('[class*="rounded-full"]');
      expect(riskDot).toBeInTheDocument();
    });
  });
});