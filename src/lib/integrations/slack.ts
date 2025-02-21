interface SlackConfig {
  webhookUrl: string;
  botToken: string;
  channelId: string;
}

export class SlackIntegration {
  constructor(private config: SlackConfig) {}

  async sendCommand(command: string) {
    try {
      const response = await fetch(this.config.webhookUrl, {
        method: 'POST',
        body: JSON.stringify({ command }),
      });
      return response.ok;
    } catch (error) {
      console.error('Slack command failed:', error);
      return false;
    }
  }

  async setupNotifications(settings: {
    leadAlerts: boolean;
    agentStatus: boolean;
    performanceUpdates: boolean;
  }) {
    try {
      await fetch(this.config.webhookUrl, {
        method: 'POST',
        body: JSON.stringify({ settings }),
      });
    } catch (error) {
      console.error('Slack notification setup failed:', error);
    }
  }
}