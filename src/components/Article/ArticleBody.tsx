import type { ReactNode } from 'react';
import styles from './Article.module.scss';

export function ArticleBody({ children }: { children: ReactNode }) {
  return <div className={styles.body}>{children}</div>;
}
