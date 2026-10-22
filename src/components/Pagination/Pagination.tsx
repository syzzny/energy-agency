import clsx from 'clsx';
import { Icon } from '@/components/Icon';
import styles from './Pagination.module.scss';

/** 페이지네이션 (데모 — 원본 Handlebars 버전도 고정 5페이지 정적 마크업이었다) */
export function Pagination() {
  return (
    <nav className={styles.pagination} aria-label="페이지 이동">
      <a href="#" className={clsx(styles.arrow, styles.isFar)}>
        <Icon name="dleft" />
        <span className="sr-only">첫 페이지</span>
      </a>
      <a href="#" className={styles.arrow}>
        <Icon name="left" />
        <span className="sr-only">이전 페이지</span>
      </a>
      <strong aria-current="page">
        <span className="sr-only">현재 페이지</span>1
      </strong>
      {[2, 3, 4, 5].map((n) => (
        <a key={n} href="#">
          <span className="sr-only">페이지</span>
          {n}
        </a>
      ))}
      <a href="#" className={styles.arrow}>
        <Icon name="right" />
        <span className="sr-only">다음 페이지</span>
      </a>
      <a href="#" className={clsx(styles.arrow, styles.isFar)}>
        <Icon name="dright" />
        <span className="sr-only">마지막 페이지</span>
      </a>
    </nav>
  );
}
