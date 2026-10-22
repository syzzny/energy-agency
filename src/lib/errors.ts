/** 환경변수(Supabase 주소 · 키)가 없을 때 — supabase 라이브러리와 분리해 두어 기본 번들에 끌려 들어가지 않게 한다 */
export class ConfigError extends Error {
  constructor() {
    super('데이터 연결 설정(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)이 없습니다.');
    this.name = 'ConfigError';
  }
}
