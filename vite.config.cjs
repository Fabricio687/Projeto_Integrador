import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.jpg', '**/*.png', '**/*.svg'],
  server: {
    port: 5173,
    open: true,
    watch: {
      // Ignorar mudanças em arquivos .env para evitar reinicializações em cascata
      ignored: ['**/.env', '**/.env.*', '**/node_modules/**'],
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3100',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.error('❌ Erro no proxy:', err.message);
            console.error('💡 Verifique se o backend está rodando na porta 3100');
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('🔄 Proxy:', req.method, req.url, '→', 'http://localhost:3100' + req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            if (proxyRes.statusCode >= 500) {
              console.error('❌ Backend retornou erro', proxyRes.statusCode, 'para', req.url);
            }
          });
        },
      },
    },
  },
  build: {
    outDir: 'dist',
  },
});
