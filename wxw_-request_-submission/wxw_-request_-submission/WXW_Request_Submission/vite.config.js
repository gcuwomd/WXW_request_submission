import { fileURLToPath, URL } from 'node:url'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    host: '0.0.0.0', // 允许通过 IP 访问
    port: 5173,      // 前端端口
    proxy: {
      // 匹配 /login，但排除 /login/callback 以免影响前端路由
      '^/login(?!/callback)': {
        target: 'http://117.72.16.195:6600',
        changeOrigin: true,
      },
      // 匹配所有以 /permission 开头的请求 (新增加用于用户信息接口转发)
      '/permission': {
        target: 'http://117.72.16.195:6600',
        changeOrigin: true,
      },
      // 匹配所有以 /check 开头的请求
      '/check': {
        target: 'http://117.72.16.195:6600', // 后端部署地址
        changeOrigin: true, // 开启代理，允许跨域
      }
    }
  }
})