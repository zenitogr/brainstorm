export interface Message {
  role: 'user' | 'assistant';
  content: string;
  attachments?: {
    type: 'image' | 'audio' | 'file';
    data: string;
  }[];
}

export interface Provider {
  id: string;
  name: string;
  models: string[];
}