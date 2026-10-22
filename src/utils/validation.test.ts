import { describe, expect, it } from 'vitest';
import { passwordGrade, passwordRules, validateQna, validateSignup } from './validation';

describe('passwordRules', () => {
  it('영문 · 숫자 · 8자 이상 조건을 각각 판단한다', () => {
    expect(passwordRules('abc').map((r) => r.ok)).toEqual([true, false, false]);
    expect(passwordRules('12345678').map((r) => r.ok)).toEqual([false, true, true]);
    expect(passwordRules('energy2026').every((r) => r.ok)).toBe(true);
  });
});

describe('passwordGrade', () => {
  it('짧고 단순할수록 5등급(약함)에 가깝다', () => {
    expect(passwordGrade('abc')).toBe(5);
    expect(passwordGrade('abcdefgh')).toBe(4);
  });
  it('길이 · 영문숫자 조합 · 기호 · 대소문자가 늘수록 등급이 좋아진다', () => {
    expect(passwordGrade('energy2026')).toBe(3);
    expect(passwordGrade('energy2026!')).toBe(2);
    expect(passwordGrade('Energy2026!safe')).toBe(1);
  });
  it('가장 좋은 등급은 1등급을 넘지 않는다', () => {
    expect(passwordGrade('Very-Long-Passw0rd-2026!')).toBe(1);
  });
});

describe('validateSignup', () => {
  const ok = { name: '김예진', email: 'yejin@example.com', password: 'energy2026', passwordConfirm: 'energy2026', agree: true };

  it('올바른 입력이면 오류가 없다', () => {
    expect(validateSignup(ok)).toEqual({});
  });
  it('항목마다 알맞은 오류 문장을 돌려준다', () => {
    const errors = validateSignup({ name: '김', email: 'yejin@', password: 'short', passwordConfirm: '', agree: false });
    expect(Object.keys(errors).sort()).toEqual(['agree', 'email', 'name', 'password']);
  });
  it('비밀번호가 조건을 통과했을 때만 확인 값을 비교한다', () => {
    expect(validateSignup({ ...ok, passwordConfirm: 'energy2027' })).toEqual({ passwordConfirm: '비밀번호가 서로 달라요.' });
    expect(validateSignup({ ...ok, password: 'weak', passwordConfirm: 'other' }).passwordConfirm).toBeUndefined();
  });
  it('이름 앞뒤 공백은 길이에 넣지 않는다', () => {
    expect(validateSignup({ ...ok, name: '  김  ' }).name).toBeDefined();
  });
});

describe('validateQna (DB check 제약과 같은 규칙)', () => {
  const ok = { writerName: '홍길동', title: '태양광 지원 문의', content: '신청 기간이 궁금합니다.' };

  it('올바른 입력이면 오류가 없다', () => {
    expect(validateQna(ok, true)).toEqual({});
  });
  it('비어 있으면 입력해 달라고, 길이가 맞지 않으면 범위를 알려 준다', () => {
    expect(validateQna({ ...ok, title: '' }, true).title).toBe('제목을 입력해 주세요.');
    expect(validateQna({ ...ok, title: '가' }, true).title).toBe('제목은 2~100자로 입력해 주세요.');
    expect(validateQna({ ...ok, content: 'a'.repeat(4001) }, true).content).toBe('내용은 5~4,000자로 입력해 주세요.');
  });
  it('경계값: 제목 100자 · 내용 4000자는 통과', () => {
    expect(validateQna({ ...ok, title: 'a'.repeat(100), content: 'a'.repeat(4000) }, true)).toEqual({});
  });
  it('동의하지 않으면 막는다', () => {
    expect(validateQna(ok, false)).toEqual({ agree: '개인정보 수집·이용에 동의해 주세요.' });
  });
});
