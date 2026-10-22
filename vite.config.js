import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

const root = path.resolve(import.meta.dirname);

export default defineConfig({
  // SPA(BrowserRouter)는 절대 경로 base 가 필요합니다. './' 이면 /about/greeting 처럼 깊은 주소로
  // 바로 들어가거나 새로고침할 때 JS·CSS를 /about/assets/ 에서 찾다가 빈 화면이 됩니다.
  // GitHub Pages 처럼 하위 폴더에 올릴 때:  BASE_PATH=/저장소이름/ npm run build
  base: process.env.BASE_PATH ?? '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.join(root, 'src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: [path.join(root, 'src/styles')],
      },
    },
  },
  server: { open: true },
});
