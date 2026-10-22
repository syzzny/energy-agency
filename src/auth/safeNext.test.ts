import { describe, expect, it } from 'vitest';
import { safeNext } from './RequireAuth';

describe('safeNext (로그인 후 돌아갈 주소)', () => {
  it('사이트 안쪽 경로만 허용한다', () => {
    expect(safeNext('/support/qna/mine')).toBe('/support/qna/mine');
    expect(safeNext('/support/qna?page=2')).toBe('/support/qna?page=2');
  });
  it('외부 주소 · 프로토콜 상대 주소는 막고 기본값으로 보낸다 (오픈 리다이렉트 방지)', () => {
    expect(safeNext('https://evil.example')).toBe('/');
    expect(safeNext('//evil.example')).toBe('/');
    expect(safeNext('javascript:alert(1)')).toBe('/');
    expect(safeNext(null, '/support/qna')).toBe('/support/qna');
  });
});
