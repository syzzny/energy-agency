// @vitest-environment jsdom
import { describe, expect, it, afterEach } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { PasswordGrade } from './PasswordGrade';

afterEach(cleanup);

describe('<PasswordGrade />', () => {
  it('비어 있으면 안내 문장을 보여 준다', () => {
    render(<PasswordGrade password="" id="g" />);
    expect(screen.getByText('입력하면 안전 등급을 알려 드려요')).toBeTruthy();
  });

  it('등급과 설명을 글자로 알려 준다 (색만으로 전달하지 않음)', () => {
    render(<PasswordGrade password="energy2026" id="g" />);
    const live = document.querySelector('[aria-live="polite"]')!;
    expect(live.textContent).toBe('안전 등급 3등급 보통이에요');
  });

  it('충족한 조건은 스크린리더에 "충족"으로 읽힌다', () => {
    render(<PasswordGrade password="abc" id="g" />);
    const items = screen.getAllByRole('listitem').map((li) => li.textContent);
    expect(items).toEqual(['영문 충족', '숫자 미충족', '8자 이상 미충족']);
  });
});
