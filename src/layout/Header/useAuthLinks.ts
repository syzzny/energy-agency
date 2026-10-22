import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth';
import { useToast } from '@/components/Toast';

/** 헤더 · 전체메뉴가 함께 쓰는 로그인 관련 링크 동작 */
export function useAuthLinks() {
  const auth = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const here = location.pathname + location.search;
  const onAuthPage = /^\/(login|signup)\b/.test(location.pathname);
  // 로그인 후 지금 보던 화면으로 돌아오도록
  const loginHref = onAuthPage || location.pathname === '/' ? '/login' : `/login?next=${encodeURIComponent(here)}`;

  const onSignOut = async () => {
    try {
      await auth.signOut();
      toast.show('로그아웃되었어요.');
      if (location.pathname.startsWith('/support/qna/mine')) navigate('/', { replace: true });
    } catch {
      toast.show('로그아웃하지 못했어요. 잠시 후 다시 시도해 주세요.');
    }
  };

  return { user: auth.user, loginHref, onSignOut };
}
