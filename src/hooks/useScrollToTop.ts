import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** 라우트 변경 시 스크롤 위치 리셋 — 멀티페이지 빌드에서는 공짜였던 동작을 SPA에서 명시적으로 복원 */
export function useScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
}
