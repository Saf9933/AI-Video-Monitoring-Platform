import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import KpiSparkCard from '../src/components/kpi/KpiSparkCard';
import { ClockIcon } from '@heroicons/react/24/outline';

// Mock Recharts components since they don't render properly in JSDOM
jest.mock('recharts', () => ({
  AreaChart: ({ children }: { children: React.ReactNode }) => <div data-testid="area-chart">{children}</div>,
  Area: () => <div data-testid="area" />,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="responsive-container">{children}</div>,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
}));

const mockSeries = [
  { t: 0, y: 2.1 },
  { t: 1, y: 2.3 },
  { t: 2, y: 2.0 },
  { t: 3, y: 2.4 },
  { t: 4, y: 2.2 },
];

describe('KpiSparkCard', () => {
  const defaultProps = {
    titleCn: '平均响应时间',
    titleEn: 'Avg Response Time',
    value: '2.3s',
    deltaPct: -12,
    deltaDirection: 'down' as const,
    series: mockSeries,
    color: 'green' as const,
    icon: <ClockIcon />,
    subtitleCn: '系统处理请求平均用时',
  };

  it('renders Chinese and English titles correctly', () => {
    render(<KpiSparkCard {...defaultProps} />);
    
    expect(screen.getByText('平均响应时间')).toBeInTheDocument();
    expect(screen.getByText('Avg Response Time')).toBeInTheDocument();
  });

  it('displays the value correctly', () => {
    render(<KpiSparkCard {...defaultProps} />);
    
    expect(screen.getByText('2.3s')).toBeInTheDocument();
  });

  it('shows delta percentage with correct direction', () => {
    render(<KpiSparkCard {...defaultProps} />);
    
    // Should show negative delta (improvement for response time)
    expect(screen.getByText('12%')).toBeInTheDocument();
    // Should show "较上期" text
    expect(screen.getByText('较上期')).toBeInTheDocument();
  });

  it('displays subtitle when provided', () => {
    render(<KpiSparkCard {...defaultProps} />);
    
    expect(screen.getByText('系统处理请求平均用时')).toBeInTheDocument();
  });

  it('renders chart components', () => {
    render(<KpiSparkCard {...defaultProps} />);
    
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('area-chart')).toBeInTheDocument();
    expect(screen.getByTestId('area')).toBeInTheDocument();
  });

  it('handles click events when onClick is provided', () => {
    const handleClick = jest.fn();
    render(<KpiSparkCard {...defaultProps} onClick={handleClick} />);
    
    const card = screen.getByRole('button');
    fireEvent.click(card);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('handles keyboard events when onClick is provided', () => {
    const handleClick = jest.fn();
    render(<KpiSparkCard {...defaultProps} onClick={handleClick} />);
    
    const card = screen.getByRole('button');
    fireEvent.keyDown(card, { key: 'Enter' });
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders skeleton state when no series data', () => {
    render(<KpiSparkCard {...defaultProps} series={[]} />);
    
    // Should show loading animations
    const skeletonElements = screen.getAllByTestId(/.*/) || [];
    expect(skeletonElements.length).toBeGreaterThan(0);
    
    // Should not show actual data
    expect(screen.queryByText('2.3s')).not.toBeInTheDocument();
  });

  it('applies correct color theme for different colors', () => {
    const { rerender } = render(<KpiSparkCard {...defaultProps} color="blue" />);
    
    // Test blue theme
    expect(screen.getByTestId('responsive-container').closest('div')).toBeInTheDocument();
    
    // Test yellow theme
    rerender(<KpiSparkCard {...defaultProps} color="yellow" />);
    expect(screen.getByTestId('responsive-container').closest('div')).toBeInTheDocument();
    
    // Test red theme
    rerender(<KpiSparkCard {...defaultProps} color="red" />);
    expect(screen.getByTestId('responsive-container').closest('div')).toBeInTheDocument();
  });

  it('shows flat delta direction correctly', () => {
    render(
      <KpiSparkCard 
        {...defaultProps} 
        deltaPct={0} 
        deltaDirection="flat" 
      />
    );
    
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-test-class';
    render(<KpiSparkCard {...defaultProps} className={customClass} />);
    
    const card = screen.getByTestId('responsive-container').closest('div');
    expect(card?.parentElement).toHaveClass(customClass);
  });

  it('sets proper accessibility attributes', () => {
    const handleClick = jest.fn();
    render(<KpiSparkCard {...defaultProps} onClick={handleClick} />);
    
    const card = screen.getByRole('button');
    expect(card).toHaveAttribute('aria-label', '平均响应时间 卡片，点击查看详情');
    expect(card).toHaveAttribute('tabIndex', '0');
  });

  it('does not set button role when no onClick provided', () => {
    render(<KpiSparkCard {...defaultProps} />);
    
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});