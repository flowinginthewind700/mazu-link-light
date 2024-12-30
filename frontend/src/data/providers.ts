export interface Provider {
  id: string;
  name: string;
  logo: string;
  apiKeyUrl: string;
  models: string[];
}

export const providers: Provider[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    logo: '/placeholder.svg',
    apiKeyUrl: 'https://platform.openai.com/api-keys',
    models: ['gpt-4', 'gpt-3.5-turbo'],
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    logo: '/placeholder.svg',
    apiKeyUrl: 'https://console.anthropic.com/account/keys',
    models: ['claude-3-opus', 'claude-3-sonnet'],
  },
  {
    id: 'google',
    name: 'Google AI',
    logo: '/placeholder.svg',
    apiKeyUrl: 'https://makersuite.google.com/app/apikeys',
    models: ['gemini-pro', 'gemini-pro-vision'],
  },
]

