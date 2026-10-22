import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';

/** 로그인해야 볼 수 있는 화면 — 손님이면 로그인 페이지로 보내고, 로그인 후 원래 화면으로 돌아온다 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  const location = useLocation();
  if (status === 'loading') {
    return (
      <p className="sr-only" role="status">
        로그인 정보를 확인하는 중입니다.
      </p>
    );
  }
  if (status === 'guest') {
    return <Navigate to={`/login?next=${encodeURIComponent(location.pathname + location.search)}`} replace />;
  }
  return <>{children}</>;
}

/** 로그인 후 돌아갈 주소 — 외부 주소로 보내는 공격을 막기 위해 사이트 안쪽 경로만 허용 */
export function safeNext(next: string | null, fallback = '/'): string {
  return next && next.startsWith('/') && !next.startsWith('//') ? next : fallback;
}
