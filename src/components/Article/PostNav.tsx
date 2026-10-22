import { Link } from 'react-router-dom';
import { Icon } from '@/components/Icon';
import { isoDate } from '@/utils/date';
import styles from './Article.module.scss';

export interface PostNavItem {
  href: string;
  title: string;
  date: string;
}

export function PostNav({ prev, next }: { prev?: PostNavItem; next?: PostNavItem }) {
  return (
    <nav className={styles.postNav} aria-label="이전글 다음글">
      {prev && (
        <p className={styles.postNavItem}>
          <span className={styles.postNavLabel}>
            <Icon name="up" />
            이전글
          </span>
          <Link to={prev.href}>{prev.title}</Link>
          <time dateTime={isoDate(prev.date)}>{prev.date}</time>
        </p>
      )}
      {next && (
        <p className={styles.postNavItem}>
          <span className={styles.postNavLabel}>
            <Icon name="down" />
            다음글
          </span>
          <Link to={next.href}>{next.title}</Link>
          <time dateTime={isoDate(next.date)}>{next.date}</time>
        </p>
      )}
    </nav>
  );
}
