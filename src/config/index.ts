import serverConfig from "./server.config";
import envConfig from "./env.config";


export default {
  ...envConfig,
  server: serverConfig,
}

export * from './env.config'
export * from './server.config'