import { invoke } from '@tauri-apps/api/core';

export async function getModelsForProvider(providerId: string): Promise<string[]> {
  let apiKey: string;
  try {
    apiKey = await invoke('get_api_key', { provider: providerId });
  } catch (error) {
    console.error('Failed to get API key:', error);
    throw new Error(`API key not found for provider: ${providerId}`);
  }

  if (!apiKey) {
    throw new Error(`API key not found for provider: ${providerId}`);
  }

  const apiEndpoints = {
    'gemini': 'https://generativelanguage.googleapis.com/v1/models',
    'groq': 'https://api.groq.com/v1/models'
  };

  const endpoint = apiEndpoints[providerId as keyof typeof apiEndpoints];
  
  if (!endpoint) {
    throw new Error(`Unsupported provider: ${providerId}`);
  }

  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Add provider-specific authentication
    if (providerId === 'gemini') {
      const url = `${endpoint}?key=${apiKey}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.models
        .filter((model: any) => model.name.includes('gemini'))
        .map((model: any) => model.name.split('/').pop());
    } else if (providerId === 'groq') {
      headers['Authorization'] = `Bearer ${apiKey}`;
      const response = await fetch(endpoint, { headers });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.data.map((model: any) => model.id);
    }

    return [];
  } catch (error) {
    console.error(`Error fetching models for ${providerId}:`, error);
    // Fallback to hardcoded models if API fails
    const fallbackModels = {
      'gemini': ['gemini-pro', 'gemini-pro-vision'],
      'groq': ['llama2-70b-4096', 'mixtral-8x7b-32768']
    };
    return fallbackModels[providerId as keyof typeof fallbackModels] || [];
  }
}
