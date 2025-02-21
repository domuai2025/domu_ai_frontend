import { useCallback } from 'react';

type MessageData = {
  metrics: MetricsData;
  notifications: NotificationData;
  agent_logs: AgentLog;
};

type WebSocketCallback<T extends keyof MessageData> = (data: MessageData[T]) => void;

interface WebSocketClient {
  subscribe: <T extends keyof MessageData>(channel: T, callback: WebSocketCallback<T>) => void;
  unsubscribe: (channel: keyof MessageData) => void;
  send: (message: { type: string; action?: string; agentId?: string }) => Promise<void>;
}

export interface MetricsData {
  id: string;
  value: number;
  timestamp: string;
}

export interface NotificationData {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'error';
  timestamp: string;
}

export interface AgentLog {
  agentId: string;
  status: 'active' | 'idle' | 'stopped';
  message: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error';
}

export function useWebSocket(): WebSocketClient {
  const subscribe = useCallback(<T extends keyof MessageData>(
    channel: T,
    callback: WebSocketCallback<T>
  ) => {
    // In a real implementation, this would connect to your WebSocket server
    console.log(`Subscribed to ${channel}`);

    // Mock subscription - replace with actual WebSocket implementation
    const mockData = {
      metrics: { id: '1', value: 100, timestamp: new Date().toISOString() },
      notifications: { id: '1', message: 'Test', type: 'info', timestamp: new Date().toISOString() },
      agent_logs: {
        agentId: '1',
        status: 'active',
        message: 'Agent started',
        timestamp: new Date().toISOString(),
        level: 'info'
      }
    };

    // Simulate real-time updates
    setInterval(() => {
      callback(mockData[channel] as MessageData[T]);
    }, 5000);
  }, []);

  const unsubscribe = useCallback((channel: keyof MessageData) => {
    console.log(`Unsubscribed from ${channel}`);
  }, []);

  const send = useCallback(async (message: { type: string; action?: string; agentId?: string }) => {
    console.log('Sending message:', message);
    // Implement actual WebSocket send logic here
  }, []);

  return { subscribe, unsubscribe, send };
}