// src/app/App.tsx
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navigation from '../components/Navigation';
import Dashboard from '../pages/Dashboard';
import Alerts from '../pages/Alerts';

const qc = new QueryClient();

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'alerts':
        return <Alerts />;
      case 'classrooms':
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <div className="text-4xl mb-4">🏫</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Classrooms</h2>
            <p className="text-gray-500">Classroom management features coming soon...</p>
          </div>
        );
      case 'students':
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <div className="text-4xl mb-4">👥</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Students</h2>
            <p className="text-gray-500">Student profiles and management coming soon...</p>
          </div>
        );
      case 'reports':
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <div className="text-4xl mb-4">📋</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Reports</h2>
            <p className="text-gray-500">Analytics and reporting features coming soon...</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <QueryClientProvider client={qc}>
      <div className="min-h-screen bg-gray-50">
        <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            {renderPage()}
          </div>
        </main>
      </div>
    </QueryClientProvider>
  );
}
