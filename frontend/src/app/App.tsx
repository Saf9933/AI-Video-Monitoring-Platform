// src/app/App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import Homepage from '../pages/Homepage';
import Dashboard from '../pages/Dashboard';
import Alerts from '../pages/Alerts';
import Analytics from '../pages/Analytics';
import StudentManagement from '../pages/StudentManagement';
import NotificationsCenter from '../pages/NotificationsCenter';
import ClassroomDirectory from '../pages/classrooms/ClassroomDirectory';
import ClassroomMonitoring from '../pages/classrooms/ClassroomMonitoring';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Homepage />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="students" element={<StudentManagement />} />
            <Route path="notifications" element={<NotificationsCenter />} />
            <Route path="classrooms" element={<ClassroomDirectory />} />
            <Route path="classrooms/:id" element={<ClassroomMonitoring />} />
            <Route path="privacy" element={
              <div className="text-white p-8">
                <h1 className="text-2xl font-bold mb-4">隐私合规</h1>
                <p>Privacy Compliance features coming soon...</p>
              </div>
            } />
            <Route path="settings" element={
              <div className="text-white p-8">
                <h1 className="text-2xl font-bold mb-4">系统设置</h1>
                <p>System Settings coming soon...</p>
              </div>
            } />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}
