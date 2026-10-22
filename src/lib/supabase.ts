import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { ConfigError } from './errors';

/**
 * Supabase 클라이언트 (브라우저용 공개 키 사용)
 * - 키는 .env(로컬) / Vercel 환경변수(배포)에서 읽는다. 코드·GitHub 에는 키를 두지 않는다.
 * - 보안은 키가 아니라 DB 쪽 규칙(RLS · 공개용 뷰)이 맡는다.
 */
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export { ConfigError };

let client: SupabaseClient | null = null;

/** 설정이 없으면 앱 전체가 멈추지 않도록, 호출하는 순간에 오류를 던져 화면에서 안내한다 */
export function getSupabase(): SupabaseClient {
  if (!url || !key) throw new ConfigError();
  client ??= createClient(url, key, { auth: { persistSession: false } });
  return client;
}
