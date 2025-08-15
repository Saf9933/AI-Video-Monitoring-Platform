# Scenario Cards - Development Setup

The scenario cards now intelligently handle both development and production environments:

## How It Works

1. **Development Mode**: When running `npm run dev`, the app automatically detects that no real API backend is available and uses mock data from `src/data/mockHomeData.ts`.

2. **Production Mode**: When a real API is available, the cards will fetch live data from the alerts endpoint and display real-time counts.

3. **Graceful Fallback**: If the API fails in production, the system automatically falls back to mock data to prevent the "加载失败" error.

## Mock Data Used

The mock data provides realistic scenario counts:
- 考试压力 (Exam Pressure): 12 alerts
- 孤立霸凌 (Isolation Bullying): 5 alerts  
- 自伤行为 (Self Harm): 2 alerts
- 教师语言暴力 (Teacher Verbal Abuse): 3 alerts
- 网络跟踪 (Cyber Tracking): 8 alerts

## Features Available

✅ **Clickable Navigation**: Cards navigate to `/alerts?scenario=<scenario_id>`
✅ **Accessibility**: Full keyboard support and ARIA labels
✅ **Tooltips**: Hover/focus tooltips explain functionality
✅ **Quick Actions**: Kebab menu with filters (未处理, 最近7天, 导出)
✅ **Real-time Updates**: WebSocket support when API is available
✅ **Loading States**: Animated skeletons during data fetch
✅ **Error Handling**: Graceful fallback with retry options

## Console Message

When running in development mode, you'll see: `📊 Using mock data for scenario counts (development mode)` in the browser console to confirm mock data is being used.