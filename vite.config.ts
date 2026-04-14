import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Check if we are running in Vercel to build the app (index.html) instead of the library
  const isVercel = process.env.VERCEL === '1';

  return {
    base: '/', // Ensure base path is correct for Vercel
    plugins: [
      react(),
      dts({ include: ['src'] })
    ],
    server: {
      port: 3000,
      open: true
    },
    build: {
      outDir: 'dist',
      // If we are on Vercel, build the app (index.html). Otherwise, build the library.
      ...(isVercel ? {} : {
        lib: {
          entry: resolve(__dirname, 'src/index.ts'),
          name: 'VidQuiz',
          fileName: 'vidquiz'
        },
        rollupOptions: {
          external: ['react', 'react-dom'],
          output: {
            globals: {
              react: 'React',
              'react-dom': 'ReactDOM'
            }
          }
        }
      })
    }
  };
});
