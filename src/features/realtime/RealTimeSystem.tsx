import { useEffect } from 'react';
import { useWebSocket } from '@/hooks/use-websocket';
import { useAppStore } from '@/store';

interface MetricsData {
  id: string;
  value: number;
  timestamp: string;
}

interface NotificationData {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'error';
  timestamp: string;
}

export const RealTimeSystem = () => {
  const ws = useWebSocket();
  const { updateMetrics, updateNotifications } = useAppStore();

  useEffect(() => {
    // Subscribe to real-time updates
    ws.subscribe('metrics', (data: MetricsData) => {
      updateMetrics(data);
    });

    ws.subscribe('notifications', (data: NotificationData) => {
      updateNotifications(data);
    });

    return () => {
      ws.unsubscribe('metrics');
      ws.unsubscribe('notifications');
    };
  }, [ws, updateMetrics, updateNotifications]);

  return null; // This is a background system component
};