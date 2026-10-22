import { Icon } from '@/components/Icon';
import type { BusinessFact } from '@/data/types';
import styles from './KeyFacts.module.scss';

export function KeyFacts({ items }: { items: BusinessFact[] }) {
  return (
    <dl className={styles.keyFacts}>
      {items.map((item) => (
        <div key={item.label} className={styles.item}>
          <span className={styles.icon} aria-hidden="true">
            <Icon name={item.icon} />
          </span>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
