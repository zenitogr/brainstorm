interface GeminiLiveConfig {
  apiKey: string;
  baseUrl: string;
}

export class GeminiLiveAPI {
  private config: GeminiLiveConfig;
  private ws: WebSocket | null = null;

  constructor(apiKey: string) {
    this.config = {
      apiKey,
      baseUrl: 'wss://generativelanguage.googleapis.com/v1beta/models'
    };
  }

  connect(onMessage: (data: any) => void, onError?: (error: any) => void) {
    const wsUrl = `${this.config.baseUrl}/gemini-pro:streamGenerateContent?key=${this.config.apiKey}`;
    
    this.ws = new WebSocket(wsUrl);

    this.ws.onmessage = (event) => {
      onMessage(JSON.parse(event.data));
    };

    this.ws.onerror = (error) => {
      if (onError) onError(error);
    };
  }

  sendMessage(prompt: string) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket connection not established');
    }

    const message = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    };

    this.ws.send(JSON.stringify(message));
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}