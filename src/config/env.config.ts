export interface EnvConfig {
  env: string;
}

export default {
  env: import.meta.env.MODE,
} as EnvConfig;