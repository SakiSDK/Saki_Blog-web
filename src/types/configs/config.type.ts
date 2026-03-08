export interface ServerConfig {
  apiUrl: string;
  apiBaseUrl: string;
  staticUrl: string;
  timeout: number;
  retry: boolean;
  retryDelay: number;
  retryCount: number;
  signSecret: string;
}
export interface EnvConfig {
  env: string;
}