import React, { useState, useEffect } from 'react';
import Header from './homepage/Header';
import Sidebar from './homepage/Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function MainLayout({ children, currentPage, onNavigate }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Listen for navigation events from Sidebar
  useEffect(() => {
    const handleSwitchLayout = (event: CustomEvent) => {
      const { page } = event.detail;
      onNavigate(page);
    };

    window.addEventListener('switchToOldLayout', handleSwitchLayout as EventListener);
    return () => window.removeEventListener('switchToOldLayout', handleSwitchLayout as EventListener);
  }, [onNavigate]);

  // Update sidebar active state based on current page
  useEffect(() => {
    // Force sidebar to update active state
    const sidebarEvent = new CustomEvent('updateActivePage', { detail: { currentPage } });
    window.dispatchEvent(sidebarEvent);
  }, [currentPage]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <Header onMenuClick={() => setSidebarOpen(true)} />
      
      <div className="flex">
        {/* Sidebar */}
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
          currentPage={currentPage}
        />
        
        {/* Main Content */}
        <main className={`flex-1 transition-all duration-200 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-16'}`}>
          <div className="p-8 lg:p-10 xl:p-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}