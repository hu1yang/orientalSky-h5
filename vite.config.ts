import {defineConfig, loadEnv} from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig((config) => {
  const env = loadEnv(config.mode, process.cwd(), '');
  return {
    plugins: [react(), tailwindcss()],
    base: '/h5',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    server: {
      host: `h5.group.com`,
      port: 8083,
      proxy: {
        '/identityApi': {
          target: env.VITE_IDENTITY_API,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/identityApi/, '')
        },
        '/groupApi': {
          target: env.VITE_GROUP_API,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/groupApi/, '')
        },
        '/agentApi': {
          target: env.VITE_AGENT_API,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/agentApi/, '')
        },
        '/transferApi': {
          target: env.VITE_TRANSFER_API,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/transferApi/, '')
        },
      }
    },
    build: {
      outDir: `build/h5`,
    }
  }
})
