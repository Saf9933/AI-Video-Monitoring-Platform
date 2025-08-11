// src/app/App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Alerts from '../pages/Alerts';

const qc = new QueryClient();
const router = createBrowserRouter([
  { path: '/', element: <Alerts /> },
  { path: '/alerts', element: <Alerts /> },
]);

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <header className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">AI Video Monitoring Platform</h1>
            <p className="text-gray-600 mt-1">Student Safety Alert Management</p>
          </header>
          <RouterProvider router={router} />
        </div>
      </div>
    </QueryClientProvider>
  );
}
