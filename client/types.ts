
export type Role = 'user' | 'model';

export interface Message {
  id: string;
  role: Role;
  text: string;
  timestamp: number;
  type?: 'text' | 'image' | 'video';
  mediaUrl?: string;
}

export interface ChatSession {
  id: string;
  messages: Message[];
}
