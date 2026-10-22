import type { User } from '@supabase/supabase-js';
import { getSupabase } from '@/lib/supabase';

/**
 * 회원 인증 API (Supabase Auth — 내부적으로 REST 호출)
 *  회원가입  POST /auth/v1/signup
 *  로그인    POST /auth/v1/token?grant_type=password
 *  로그아웃  POST /auth/v1/logout
 * 받은 토큰은 supabase-js 가 저장 · 갱신하고, 이후 DB 요청 헤더(Authorization)에 자동으로 실어 보낸다.
 */
export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export const toAuthUser = (u: Pick<User, 'id' | 'email' | 'user_metadata'>): AuthUser => ({
  id: u.id,
  email: u.email ?? '',
  name: (u.user_metadata?.name as string | undefined)?.trim() || (u.email ?? '').split('@')[0],
});

export interface SignUpInput {
  name: string;
  email: string;
  password: string;
}

/** 가입 후 바로 로그인되면 needsConfirm=false, 이메일 인증이 필요하면 true */
export async function signUp({ name, email, password }: SignUpInput): Promise<{ needsConfirm: boolean }> {
  const { data, error } = await getSupabase().auth.signUp({
    email: email.trim(),
    password,
    options: {
      data: { name: name.trim() },
      emailRedirectTo: `${window.location.origin}${import.meta.env.BASE_URL}login?verified=1`,
    },
  });
  if (error) throw error;
  // 이메일 인증을 켜 둔 경우, 이미 가입된 이메일이면 오류 대신 빈 계정 정보가 온다 (가입 여부 노출 방지)
  if (data.user && data.user.identities?.length === 0) throw Object.assign(new Error('User already registered'), { code: 'user_already_exists' });
  return { needsConfirm: !data.session };
}

export async function signIn(email: string, password: string): Promise<void> {
  const { error } = await getSupabase().auth.signInWithPassword({ email: email.trim(), password });
  if (error) throw error;
}

export async function signOut(): Promise<void> {
  const { error } = await getSupabase().auth.signOut();
  if (error) throw error;
}

/** 인증 오류 → 사용자에게 보여 줄 문장 */
export function authErrorMessage(error: unknown): string {
  const e = error as { code?: string; status?: number; message?: string; name?: string } | null;
  if (e?.name === 'ConfigError') return '데이터 연결 설정이 아직 되어 있지 않아요. 관리자에게 문의해 주세요.';
  switch (e?.code) {
    case 'invalid_credentials':
      return '이메일 또는 비밀번호가 맞지 않아요.';
    case 'email_not_confirmed':
      return '이메일 인증이 아직 완료되지 않았어요. 받은 메일의 링크를 눌러 주세요.';
    case 'user_already_exists':
    case 'email_exists':
      return '이미 가입된 이메일이에요. 로그인해 주세요.';
    case 'weak_password':
      return '비밀번호가 너무 쉬워요. 영문과 숫자를 섞어 8자 이상으로 만들어 주세요.';
    case 'email_address_invalid':
      return '사용할 수 없는 이메일 주소예요.';
    case 'over_email_send_rate_limit':
    case 'over_request_rate_limit':
      return '요청이 많아 잠시 막혀 있어요. 몇 분 뒤에 다시 시도해 주세요.';
    case 'signup_disabled':
      return '지금은 회원가입을 받을 수 없어요.';
  }
  if (error instanceof TypeError || e?.status === 0) return '인터넷 연결을 확인한 뒤 다시 시도해 주세요.';
  return '일시적인 오류가 발생했어요. 잠시 후 다시 시도해 주세요.';
}
