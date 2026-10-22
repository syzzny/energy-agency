import { Badge } from '@/components/Badge';
import { Icon } from '@/components/Icon';
import type { FaqItem } from '@/data/types';
import styles from './AccordionItem.module.scss';

export function AccordionItem({ item, isOpen, onToggle }: { item: FaqItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className={styles.item} data-category={item.category}>
      <h3 className={styles.header}>
        <button type="button" className={styles.btn} aria-expanded={isOpen} aria-controls={`faq-panel-${item.id}`} id={`faq-btn-${item.id}`} onClick={onToggle}>
          <span className={styles.q}>Q</span>
          <Badge label={item.categoryLabel} />
          <span className={styles.qText}>{item.q}</span>
          <Icon name="down" className={styles.chevron} />
        </button>
      </h3>
      <div className={styles.panel} id={`faq-panel-${item.id}`} role="region" aria-labelledby={`faq-btn-${item.id}`} hidden={!isOpen}>
        <div className={styles.answer}>
          <span className={styles.a}>A</span>
          <p>{item.a}</p>
        </div>
      </div>
    </div>
  );
}
