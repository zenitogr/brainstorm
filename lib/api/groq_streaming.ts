export class GroqStreamingAPI {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.groq.com/v1';
  }

  async* streamCompletion(prompt: string, options?: {
    model?: string,
    temperature?: number,
    maxTokens?: number
  }) {
    const endpoint = `${this.baseUrl}/completion/stream`;
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: options?.model || 'mixtral-8x7b-32768',
        prompt,
        temperature: options?.temperature || 0.7,
        max_tokens: options?.maxTokens || 1024,
        stream: true
      })
    });

    if (!response.body) {
      throw new Error('Response body is null');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value);
      yield JSON.parse(chunk);
    }
  }
}