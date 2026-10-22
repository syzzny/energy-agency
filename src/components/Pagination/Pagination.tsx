import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { Icon } from '@/components/Icon';
import styles from './Pagination.module.scss';

export interface PaginationProps {
  /** 현재 페이지 · 전체 페이지 · 페이지 주소를 넘기면 실제로 이동하는 페이지네이션이 된다 */
  page?: number;
  totalPages?: number;
  hrefFor?: (page: number) => string;
}

/** 한 번에 보여 줄 번호 개수 */
const WINDOW = 5;

/**
 * 페이지네이션
 * - props 를 넘기면: 주소(?page=n) 기반으로 실제 이동. 맨 앞/뒤에서는 이동 버튼이 비활성화된다.
 * - props 가 없으면: 정적 데모 (1~5페이지 모양만)
 */
export function Pagination({ page = 1, totalPages, hrefFor }: PaginationProps) {
  const live = Boolean(totalPages && hrefFor);
  const total = Math.max(1, totalPages ?? 5);
  const start = Math.max(1, Math.min(page - Math.floor(WINDOW / 2), total - WINDOW + 1));
  const pages = Array.from({ length: Math.min(WINDOW, total) }, (_, i) => start + i);
  const href = (n: number) => (live ? hrefFor!(n) : '#');

  const arrow = (target: number, icon: string, label: string, far = false) => {
    const disabled = live && (target < 1 || target > total || target === page);
    const cls = clsx(styles.arrow, far && styles.isFar, disabled && styles.disabled);
    const content: ReactNode = (
      <>
        <Icon name={icon} />
        <span className="sr-only">{label}</span>
      </>
    );
    if (disabled) {
      return (
        <span className={cls} aria-disabled="true">
          {content}
        </span>
      );
    }
    return live ? (
      <Link to={href(target)} className={cls}>
        {content}
      </Link>
    ) : (
      <a href="#" className={cls}>
        {content}
      </a>
    );
  };

  return (
    <nav className={styles.pagination} aria-label="페이지 이동">
      {arrow(1, 'dleft', '첫 페이지', true)}
      {arrow(page - 1, 'left', '이전 페이지')}
      {pages.map((n) =>
        n === page ? (
          <strong key={n} aria-current="page">
            <span className="sr-only">현재 페이지</span>
            {n}
          </strong>
        ) : live ? (
          <Link key={n} to={href(n)}>
            <span className="sr-only">페이지</span>
            {n}
          </Link>
        ) : (
          <a key={n} href="#">
            <span className="sr-only">페이지</span>
            {n}
          </a>
        ),
      )}
      {arrow(page + 1, 'right', '다음 페이지')}
      {arrow(total, 'dright', '마지막 페이지', true)}
    </nav>
  );
}
