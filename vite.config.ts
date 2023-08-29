import { defineConfig, loadEnv } from 'vite'

import viteBaseConfig from "./vite.base.config";
import viteDevConfig from "./vite.dev.config";
import viteProdConfig from "./vite.prod.config";

const envResolver = {
    "build":() => ({...viteBaseConfig,...viteProdConfig}),
    "serve":() => ({...viteBaseConfig,...viteDevConfig})
}

// https://vitejs.dev/config/
export default defineConfig(({command,mode})=>{
  const env = loadEnv(mode,process.cwd(),'')
  return envResolver[command]()
})
