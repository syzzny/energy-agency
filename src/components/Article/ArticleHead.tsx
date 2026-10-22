import type { ReactNode } from 'react';
import styles from './Article.module.scss';

export interface ArticleMetaItem {
  label: string;
  value: ReactNode;
}

export function ArticleHead({ badges, title, meta }: { badges: ReactNode; title: string; meta: ArticleMetaItem[] }) {
  return (
    <header className={styles.head}>
      <div className={styles.headBadges}>{badges}</div>
      <h3 className={styles.headTitle}>{title}</h3>
      <dl className={styles.headMeta}>
        {meta.map((m) => (
          <div key={m.label}>
            <dt>{m.label}</dt>
            <dd>{m.value}</dd>
          </div>
        ))}
      </dl>
    </header>
  );
}
