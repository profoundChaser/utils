import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import { ViteAliases } from "vite-aliases";

import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

const pathSrc = path.resolve(__dirname, "src");
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    ViteAliases({
      prefix: "@",
    }),
    AutoImport({
      imports: ["vue"],
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers:[ElementPlusResolver()],
      dirs:['src/components','src/layout/components']
    })
  ],
  css:{
    preprocessorOptions:{
      scss: {
        javascriptEnabled: true,
      }
    }
  },
  server: {
    host: '0.0.0.0'
  },
});
