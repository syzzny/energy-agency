import clsx from 'clsx';
import { useAnchorTabs } from '@/hooks';
import styles from './AnchorTabs.module.scss';

export function AnchorTabs({ items }: { items: { id: string; label: string }[] }) {
  const activeId = useAnchorTabs(items.map((i) => i.id));

  return (
    <nav className={styles.anchorTabs} aria-label="본문 바로가기">
      {items.map((item) => (
        <a key={item.id} href={`#${item.id}`} className={clsx(item.id === activeId && styles.active)} aria-current={item.id === activeId ? 'true' : undefined}>
          {item.label}
        </a>
      ))}
    </nav>
  );
}
