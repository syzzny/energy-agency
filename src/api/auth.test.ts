import { describe, expect, it } from 'vitest';
import { authErrorMessage, toAuthUser } from './auth';

describe('authErrorMessage', () => {
  it('Supabase Auth 오류 코드를 한국어 안내로 바꾼다', () => {
    expect(authErrorMessage({ code: 'invalid_credentials' })).toBe('이메일 또는 비밀번호가 맞지 않아요.');
    expect(authErrorMessage({ code: 'user_already_exists' })).toContain('이미 가입된');
    expect(authErrorMessage({ code: 'email_not_confirmed' })).toContain('이메일 인증');
    expect(authErrorMessage({ code: 'over_email_send_rate_limit' })).toContain('몇 분 뒤');
  });
  it('알 수 없는 오류도 빈 문장 없이 안내한다', () => {
    expect(authErrorMessage(null)).toContain('잠시 후');
    expect(authErrorMessage(new TypeError('Failed to fetch'))).toContain('인터넷 연결');
  });
});

describe('toAuthUser', () => {
  it('가입 때 넣은 이름을 쓰고, 없으면 이메일 앞부분을 쓴다', () => {
    expect(toAuthUser({ id: '1', email: 'yejin@example.com', user_metadata: { name: ' 김예진 ' } }).name).toBe('김예진');
    expect(toAuthUser({ id: '1', email: 'yejin@example.com', user_metadata: {} }).name).toBe('yejin');
  });
});
