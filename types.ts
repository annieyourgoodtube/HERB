
export enum AppTab {
  MEDICINE = 'MEDICINE',
  SYNC = 'SYNC'
}

export interface Medicine {
  id: string;
  name: string;
  slot: string;
  category: string;
  properties: string;
  usage: string;
  description: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  groundingUrls?: Array<{ title: string; uri: string }>;
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: Date;
}
