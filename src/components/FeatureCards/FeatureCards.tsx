import type { ReactNode } from 'react';
import { Icon } from '@/components/Icon';
import styles from './FeatureCards.module.scss';

export interface FeatureCardItem {
  icon: string;
  title: string;
  content: ReactNode;
}

export function FeatureCards({ items }: { items: FeatureCardItem[] }) {
  return (
    <ul className={styles.featureCards}>
      {items.map((item) => (
        <li key={item.title} className={styles.item}>
          <span className={styles.icon} aria-hidden="true">
            <Icon name={item.icon} />
          </span>
          <h4>{item.title}</h4>
          {item.content}
        </li>
      ))}
    </ul>
  );
}
