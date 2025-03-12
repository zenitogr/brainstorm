interface GroqConfig {
  apiKey: string;
  baseUrl: string;
}

export class GroqAPI {
  private config: GroqConfig;

  constructor(apiKey: string) {
    this.config = {
      apiKey,
      baseUrl: 'https://api.groq.com/v1'
    };
  }

  async generateText(prompt: string, options?: {
    model?: string,
    temperature?: number,
    maxTokens?: number
  }) {
    const endpoint = `${this.config.baseUrl}/completion`;
    
    const request = {
      model: options?.model || 'mixtral-8x7b-32768',
      prompt,
      temperature: options?.temperature || 0.7,
      max_tokens: options?.maxTokens || 1024
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`
      },
      body: JSON.stringify(request)
    });

    return await response.json();
  }
}