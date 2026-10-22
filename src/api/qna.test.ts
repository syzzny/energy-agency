import { describe, expect, it } from 'vitest';
import { ConfigError } from '@/lib/errors';
import { errorMessage, maskName } from './qna';

describe('maskName', () => {
  it('첫 글자만 남기고 가린다 (최소 두 글자 가림)', () => {
    expect(maskName('홍길동')).toBe('홍**');
    expect(maskName('김')).toBe('김**');
    expect(maskName('남궁민수')).toBe('남***');
    expect(maskName('  이수민 ')).toBe('이**');
    expect(maskName('')).toBe('');
  });
});

describe('errorMessage', () => {
  it('원인에 따라 사용자에게 할 말을 고른다', () => {
    expect(errorMessage(new ConfigError())).toContain('설정');
    expect(errorMessage(new TypeError('Failed to fetch'))).toContain('인터넷 연결');
    expect(errorMessage({ code: '23514' })).toContain('2~100자');
    expect(errorMessage({ code: '42501' })).toContain('권한');
    expect(errorMessage(new Error('???'))).toContain('잠시 후');
  });
});
