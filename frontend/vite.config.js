import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      // путь к твоим TS биндингам (после pnpm build внутри packages/liquidity_pool)
      'liquidity_pool': path.resolve(__dirname, '../packages/liquidity_pool/dist/index.js'),
    },
  },
  // Нужно для BigInt и Soroban SDK
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext',
    },
  },
  build: {
    target: 'esnext',
  },
});
