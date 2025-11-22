export interface ServerConfig {
  api_url: string;
  static_url: string;
}

export default {
  api_url: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  static_url: import.meta.env.VITE_STATIC_BASE_URL || 'http://localhost:3000/static',
} as ServerConfig;