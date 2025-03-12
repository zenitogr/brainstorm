'use client';

import { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Message, Provider } from '@/components/Chat/types';
import { ProviderSelector } from '@/components/Chat/ProviderSelector';
import { MessageList } from '@/components/Chat/MessageList';
import { ChatInput } from '@/components/Chat/ChatInput';
import { GeminiAPI } from '@/lib/api/gemini_request';
import { GroqAPI } from '@/lib/api/groq';
import { GeminiStreamingAPI } from '@/lib/api/gemini_streaming';
import { GroqStreamingAPI } from '@/lib/api/groq_streaming';
import { getModelsForProvider } from '@/lib/api/providers';

export default function Home() {
  const { theme } = useTheme();
  const [providers, setProviders] = useState<Provider[]>([
    { id: 'gemini', name: 'Google Gemini', models: [] },
    { id: 'groq', name: 'Groq', models: [] }
  ]);
  const [selectedProvider, setSelectedProvider] = useState<string>('gemini');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchModels();
  }, [selectedProvider]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function fetchModels() {
    try {
      const models = await getModelsForProvider(selectedProvider);
      setProviders(prevProviders => 
        prevProviders.map(provider => 
          provider.id === selectedProvider
            ? { ...provider, models }
            : provider
        )
      );
      
      // Set the first model as default if none is selected
      if (!selectedModel && models.length > 0) {
        setSelectedModel(models[0]);
      }
    } catch (error) {
      console.error('Failed to fetch models:', error);
    }
  }

  const handleProviderChange = (providerId: string) => {
    setSelectedProvider(providerId);
    setSelectedModel(''); // Reset selected model when provider changes
  };

  const handleSubmit = async () => {
    if (!input.trim() || !selectedModel) return;

    try {
      setIsLoading(true);
      const newMessage: Message = { role: 'user', content: input };
      setMessages(prev => [...prev, newMessage]);
      setInput('');

      // Add API call implementation here
      const response = await sendMessage(input);
      
      const assistantMessage: Message = { role: 'assistant', content: response };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (file: File) => {
    // Implementation of file handling
  };

  // Helper function to send messages based on selected provider
  async function sendMessage(content: string): Promise<string> {
    switch (selectedProvider) {
      case 'gemini':
        const gemini = isStreaming 
          ? new GeminiStreamingAPI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '')
          : new GeminiAPI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');
        // Add implementation
        return 'Gemini response';
        
      case 'groq':
        const groq = isStreaming
          ? new GroqStreamingAPI(process.env.NEXT_PUBLIC_GROQ_API_KEY || '')
          : new GroqAPI(process.env.NEXT_PUBLIC_GROQ_API_KEY || '');
        // Add implementation
        return 'Groq response';

      default:
        throw new Error('Unsupported provider');
    }
  }

  return (
    <div className="flex flex-col h-screen p-4 gap-4">
      <ProviderSelector
        providers={providers}
        selectedProvider={selectedProvider}
        selectedModel={selectedModel}
        onProviderChange={handleProviderChange}
        onModelChange={setSelectedModel}
      />
      <MessageList ref={chatEndRef} messages={messages} />
      <ChatInput
        input={input}
        onInputChange={setInput}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        onFileSelect={handleFileSelect}
      />
    </div>
  );
}
