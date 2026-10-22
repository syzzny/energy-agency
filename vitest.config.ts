import { defineConfig } from 'vitest/config';
import path from 'node:path';

const root = path.resolve(import.meta.dirname);

/**
 * 테스트 설정 (Vitest)
 * - 순수 함수는 node 환경, 컴포넌트 테스트는 파일 맨 위 `// @vitest-environment jsdom` 으로 브라우저 흉내
 * - JSX 는 tsconfig 의 react-jsx 설정으로 변환되므로 React 플러그인 없이도 동작한다
 */
export default defineConfig({
  resolve: {
    alias: { '@': path.join(root, 'src') },
  },
  css: {
    preprocessorOptions: {
      scss: { loadPaths: [path.join(root, 'src/styles')] },
    },
  },
  test: {
    include: ['src/**/*.test.{ts,tsx}'],
    environment: 'node',
    css: { modules: { classNameStrategy: 'non-scoped' } },
  },
});
