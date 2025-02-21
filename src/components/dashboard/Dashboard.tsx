'use client';

import { memo } from 'react';
import { useTheme, useSidebarState } from '@/store/selectors';
import { useAppStore } from '@/store';

// Memoized child components
const DashboardHeader = memo(() => {
  const theme = useTheme();
  const toggleSidebar = useAppStore((state) => state.toggleSidebar);

  return (
    <header className={`theme-${theme}`}>
      <button onClick={toggleSidebar}>Toggle Sidebar</button>
    </header>
  );
});
DashboardHeader.displayName = 'DashboardHeader';

const DashboardSidebar = memo(() => {
  const isCollapsed = useSidebarState();

  return (
    <aside className={isCollapsed ? 'collapsed' : ''}>
      {/* Sidebar content */}
    </aside>
  );
});
DashboardSidebar.displayName = 'DashboardSidebar';

// Main Dashboard component
export const Dashboard = memo(() => {
  return (
    <div className="dashboard-container">
      <DashboardHeader />
      <DashboardSidebar />
      <main>{/* Main content */}</main>
    </div>
  );
});

Dashboard.displayName = 'Dashboard';