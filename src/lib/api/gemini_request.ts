import { type } from '@tauri-apps/api';

interface GeminiConfig {
  apiKey: string;
  baseUrl: string;
}

interface GeminiTextRequest {
  contents: {
    parts: {
      text: string;
    }[];
  }[];
  safetySettings?: SafetySetting[];
  generationConfig?: GenerationConfig;
}

interface SafetySetting {
  category: string;
  threshold: string;
}

interface GenerationConfig {
  temperature?: number;
  topK?: number;
  topP?: number;
  maxOutputTokens?: number;
}

export class GeminiAPI {
  private config: GeminiConfig;

  constructor(apiKey: string) {
    this.config = {
      apiKey,
      baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models'
    };
  }

  async generateText(prompt: string, options?: {
    temperature?: number,
    safetySettings?: SafetySetting[]
  }) {
    const endpoint = `${this.config.baseUrl}/gemini-pro:generateContent?key=${this.config.apiKey}`;
    
    const request: GeminiTextRequest = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    };

    if (options?.safetySettings) {
      request.safetySettings = options.safetySettings;
    }

    if (options?.temperature) {
      request.generationConfig = {
        temperature: options.temperature
      };
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    });

    return await response.json();
  }

  async generateImageFromText(prompt: string, imageData: string) {
    const endpoint = `${this.config.baseUrl}/gemini-pro-vision:generateContent?key=${this.config.apiKey}`;
    
    const request = {
      contents: [{
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: imageData
            }
          }
        ]
      }]
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    });

    return await response.json();
  }
}