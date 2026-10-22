import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { AuthUser, SignUpInput } from '@/api/auth';

type Status = 'loading' | 'authenticated' | 'guest';

interface AuthContextValue {
  status: Status;
  user: AuthUser | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (input: SignUpInput) => Promise<{ needsConfirm: boolean }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/** supabase-js 가 저장해 둔 세션(sb-<프로젝트>-auth-token)을 동기로 읽는다 — 라이브러리를 받기 전에 헤더를 바로 그리기 위해 */
function readStoredUser(): AuthUser | null {
  try {
    for (const key of Object.keys(localStorage)) {
      if (!/^sb-.+-auth-token$/.test(key)) continue;
      const u = JSON.parse(localStorage.getItem(key) ?? 'null')?.user;
      if (u?.id) return { id: u.id, email: u.email ?? '', name: u.user_metadata?.name?.trim() || (u.email ?? '').split('@')[0] };
    }
  } catch {
    /* 저장소 접근이 막힌 환경(시크릿 모드 등) */
  }
  return null;
}

/** 이메일 인증 링크로 돌아온 경우 — 주소에 담긴 토큰을 처리해야 한다 */
const hasAuthParams = () => /access_token=|refresh_token=|[?&]code=|error_description=/.test(window.location.hash + window.location.search);

/**
 * 로그인 상태를 앱 전체에 제공
 * - 성능: 인증 라이브러리(supabase-js)는 기본 번들에 넣지 않는다.
 *   저장된 세션이 있거나 · 인증 링크로 들어왔거나 · 로그인/가입을 시도할 때만 불러온다.
 *   그래서 처음 방문한 손님은 이 라이브러리를 내려받지 않는다.
 * - 로그인/로그아웃이 일어나면 묻고 답하기 캐시를 비워, 비공개 글 내용 등이 계정에 맞게 다시 조회된다.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [state, setState] = useState<{ status: Status; user: AuthUser | null }>(() => {
    const stored = readStoredUser();
    if (stored || hasAuthParams()) return { status: 'loading', user: stored };
    return { status: 'guest', user: null };
  });

  const ready = useRef<Promise<typeof import('@/api/auth')> | null>(null);

  /** 라이브러리를 불러오고 세션 변화를 구독한다 (한 번만) */
  const ensureClient = useCallback(() => {
    ready.current ??= (async () => {
      const [api, { getSupabase }] = await Promise.all([import('@/api/auth'), import('@/lib/supabase')]);
      const sb = getSupabase();
      const { data } = await sb.auth.getSession();
      setState({ status: data.session ? 'authenticated' : 'guest', user: data.session ? api.toAuthUser(data.session.user) : null });
      sb.auth.onAuthStateChange((event, session) => {
        setState({ status: session ? 'authenticated' : 'guest', user: session ? api.toAuthUser(session.user) : null });
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') queryClient.invalidateQueries({ queryKey: ['qna'] });
      });
      return api;
    })().catch((error) => {
      ready.current = null;
      setState({ status: 'guest', user: null });
      throw error;
    });
    return ready.current;
  }, [queryClient]);

  useEffect(() => {
    if (state.status === 'loading') ensureClient().catch(() => {});
    // 처음 한 번만
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      signIn: async (email, password) => (await ensureClient()).signIn(email, password),
      signUp: async (input) => (await ensureClient()).signUp(input),
      signOut: async () => (await ensureClient()).signOut(),
    }),
    [state, ensureClient],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth는 AuthProvider 내부에서만 사용할 수 있습니다.');
  return ctx;
}
