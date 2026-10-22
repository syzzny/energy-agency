import type { ReactNode } from 'react';
import styles from './Article.module.scss';

export function ArticleRoot({ children }: { children: ReactNode }) {
  return <article className={styles.article}>{children}</article>;
}
