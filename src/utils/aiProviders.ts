export interface AIProvider {
  id: 'gemini' | 'groq' | 'openrouter';
  name: string;
  logo: string; // emoji logo
  description: string;
  freeInfo: string;
  getKeyUrl: string;
  keyPlaceholder: string;
  defaultModel: string;
  models: { id: string; label: string }[];
}

export const AI_PROVIDERS: AIProvider[] = [
  {
    id: 'gemini',
    name: 'Google Gemini',
    logo: '🔷',
    description: 'AI mạnh mẽ từ Google DeepMind, chất lượng cao, hỗ trợ tiếng Việt tốt.',
    freeInfo: '15 requests/phút miễn phí',
    getKeyUrl: 'https://aistudio.google.com/app/apikey',
    keyPlaceholder: 'AIza...',
    defaultModel: 'gemini-2.0-flash',
    models: [
      { id: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash (Khuyên dùng)' },
      { id: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash' },
      { id: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
    ],
  },
  {
    id: 'groq',
    name: 'Groq',
    logo: '⚡',
    description: 'Phản hồi cực nhanh (nhanh nhất thị trường), dùng các model Llama mã nguồn mở.',
    freeInfo: '30 requests/phút miễn phí',
    getKeyUrl: 'https://console.groq.com/keys',
    keyPlaceholder: 'gsk_...',
    defaultModel: 'llama-3.3-70b-versatile',
    models: [
      { id: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B (Khuyên dùng)' },
      { id: 'llama3-8b-8192', label: 'Llama 3 8B (Nhanh hơn)' },
      { id: 'mixtral-8x7b-32768', label: 'Mixtral 8x7B' },
    ],
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    logo: '🌐',
    description: 'Tổng hợp 100+ model AI, nhiều model hoàn toàn miễn phí (Llama, Mistral, Qwen...).',
    freeInfo: '$1 credit miễn phí khi đăng ký',
    getKeyUrl: 'https://openrouter.ai/settings/keys',
    keyPlaceholder: 'sk-or-v1-...',
    defaultModel: 'meta-llama/llama-4-maverick:free',
    models: [
      { id: 'meta-llama/llama-4-maverick:free', label: 'Llama 4 Maverick (Free)' },
      { id: 'meta-llama/llama-4-scout:free', label: 'Llama 4 Scout (Free)' },
      { id: 'google/gemma-3-27b-it:free', label: 'Gemma 3 27B (Free)' },
      { id: 'mistralai/mistral-7b-instruct:free', label: 'Mistral 7B (Free)' },
      { id: 'qwen/qvq-72b-preview:free', label: 'Qwen 72B (Free)' },
    ],
  },
];

export interface AISettings {
  providerId: AIProvider['id'];
  apiKey: string;
  model: string;
}

const STORAGE_KEY = 'aura_ai_settings';

export function loadAISettings(): AISettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as AISettings;
  } catch (_) {}
  // Default: Gemini with env key
  return {
    providerId: 'gemini',
    apiKey: (process.env.GEMINI_API_KEY as string) || '',
    model: 'gemini-2.0-flash',
  };
}

export function saveAISettings(settings: AISettings): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}
