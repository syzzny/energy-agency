import { QueryClient } from '@tanstack/react-query';
import { ConfigError } from './errors';

/**
 * 서버 데이터 캐시 설정
 * - 30초 동안은 같은 목록을 다시 요청하지 않는다 (뒤로 가기 시 즉시 표시)
 * - 네트워크 오류는 1번만 다시 시도, 설정 오류는 다시 시도해도 소용없으므로 바로 실패
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      retry: (count, error) => !(error instanceof ConfigError) && count < 1,
    },
  },
});
