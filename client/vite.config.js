import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  envPrefix: 'VITE_', // Ensuring custom env variables can be prefixed with VITE_
  server: {
    proxy: {
      // Proxy API requests to the backend server
      '/generateImage': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        logLevel: 'debug', // Enable debug logging
      },
      '/convertRasterToVector': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        logLevel: 'debug', // Debugging proxy
      },
      // Proxy TensorFlow Hub model requests (CORS bypass)
      '/tfhub': {
        target: 'https://tfhub.dev',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/tfhub/, ''), // Remove the '/tfhub' prefix in the URL path
      },
    },
  },
});
