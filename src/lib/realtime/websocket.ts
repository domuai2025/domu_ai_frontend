interface MetricPayload {
  name: string;
  value: number;
  timestamp: string;
}

interface NotificationPayload {
  type: 'info' | 'warning' | 'error';
  message: string;
  timestamp: string;
}

export class RealtimeService {
  private socket: WebSocket;

  constructor() {
    this.socket = new WebSocket(process.env.NEXT_PUBLIC_WS_URL!);
    this.setupListeners();
  }

  private updateMetrics(payload: MetricPayload) {
    // Handle metric updates
    console.log('Updating metrics:', payload);
  }

  private handleNotification(payload: NotificationPayload) {
    // Handle notifications
    console.log('New notification:', payload);
  }

  private setupListeners() {
    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case 'METRIC_UPDATE':
          this.updateMetrics(data.payload);
          break;
        case 'NOTIFICATION':
          this.handleNotification(data.payload);
          break;
      }
    };
  }
}