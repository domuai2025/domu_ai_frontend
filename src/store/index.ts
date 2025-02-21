import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { MetricsData, NotificationData } from '@/hooks/use-websocket';

interface AppNotification {
  title: string;
  body: string;
  type: 'info' | 'warning' | 'error';
  timestamp: string;
  badge?: string;
  dir?: string;
  data?: object;
}

interface AppState {
  theme: 'light' | 'dark';
  sidebarCollapsed: boolean;
  currentWorkspace: string | null;
  notifications: AppNotification[];
  metrics: MetricsData[];
  // Actions
  setTheme: (theme: 'light' | 'dark') => void;
  toggleSidebar: () => void;
  setWorkspace: (id: string | null) => void;
  addNotification: (notification: AppNotification) => void;
  clearNotifications: () => void;
  // Add action types
  updateMetrics: (data: MetricsData) => void;
  updateNotifications: (data: NotificationData) => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        theme: 'light',
        sidebarCollapsed: false,
        currentWorkspace: null,
        notifications: [],
        metrics: [],

        setTheme: (theme) => set({ theme }),
        toggleSidebar: () => set((state) => ({
          sidebarCollapsed: !state.sidebarCollapsed
        })),
        setWorkspace: (id) => set({ currentWorkspace: id }),
        addNotification: (notification) => set((state) => ({
          notifications: [notification, ...state.notifications].slice(0, 5)
        })),
        clearNotifications: () => set({ notifications: [] }),
        updateMetrics: (data) => set((state) => ({ metrics: [...state.metrics, data] })),
        updateNotifications: (data: NotificationData) => set((state) => ({
          notifications: [{
            title: data.message,
            body: data.message,
            type: data.type,
            timestamp: data.timestamp,
            badge: '',
            dir: 'auto',
            data: {},
          }, ...state.notifications].slice(0, 5)
        }))
      }),
      { name: 'app-storage' }
    )
  )
);