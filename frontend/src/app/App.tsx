// src/app/App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RBACProvider } from '../components/rbac/RBACProvider';
import MainLayout from '../layout/MainLayout';
import Homepage from '../pages/Homepage';
import Alerts from '../pages/Alerts';
import Analytics from '../pages/Analytics';
import StudentManagement from '../pages/StudentManagement';
import NotificationsCenter from '../pages/NotificationsCenter';
import SystemSettings from '../pages/SystemSettings';
import ScenariosHub from '../pages/scenarios/ScenariosHub';
import ScenarioPage from '../pages/scenarios/ScenarioPage';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RBACProvider defaultRole="professor">
        <Router>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Homepage />} />
              <Route path="alerts" element={<Alerts />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="students" element={<StudentManagement />} />
              <Route path="notifications" element={<NotificationsCenter />} />
              <Route path="scenarios" element={<ScenariosHub />} />
              <Route path="scenarios/:scenarioId" element={<ScenarioPage />} />
              <Route path="settings" element={<SystemSettings />} />
            </Route>
          </Routes>
        </Router>
      </RBACProvider>
    </QueryClientProvider>
  );
}
