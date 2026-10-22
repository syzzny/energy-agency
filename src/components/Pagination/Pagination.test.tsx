// @vitest-environment jsdom
import { describe, expect, it, afterEach } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Pagination } from './Pagination';

afterEach(cleanup);

const renderAt = (page: number, totalPages: number) =>
  render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Pagination page={page} totalPages={totalPages} hrefFor={(n) => `/list?page=${n}`} />
    </MemoryRouter>,
  );

describe('<Pagination /> (실제 이동 모드)', () => {
  it('첫 페이지에서는 처음 · 이전 버튼이 비활성화된다', () => {
    renderAt(1, 3);
    expect(screen.getByText('첫 페이지').parentElement?.getAttribute('aria-disabled')).toBe('true');
    expect(screen.getByText('이전 페이지').parentElement?.getAttribute('aria-disabled')).toBe('true');
    expect(screen.getByText('다음 페이지').closest('a')?.getAttribute('href')).toBe('/list?page=2');
  });

  it('현재 페이지는 링크가 아니고 aria-current 로 표시된다', () => {
    renderAt(2, 3);
    const current = document.querySelector('[aria-current="page"]')!;
    expect(current.tagName).toBe('STRONG');
    expect(current.textContent).toContain('2');
  });

  it('번호는 최대 5개, 현재 페이지가 가운데 오도록 보여 준다', () => {
    renderAt(10, 20);
    const numbers = Array.from(document.querySelectorAll('nav a, nav strong'))
      .map((el) => el.textContent?.replace(/\D/g, ''))
      .filter(Boolean);
    expect(numbers).toEqual(['8', '9', '10', '11', '12']);
  });
});
