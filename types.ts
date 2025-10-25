
export type SessionStatus = 'IDLE' | 'CONNECTING' | 'CONNECTED' | 'ERROR' | 'DISCONNECTED';

export interface TranscriptEntry {
  id: number;
  speaker: 'user' | 'ai';
  text: string;
}

export interface Language {
  code: string;
  name: string;
}
