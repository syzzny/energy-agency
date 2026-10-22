import type { ReactNode } from 'react';
import { Icon } from '@/components/Icon';
import styles from './TextNote.module.scss';

/** 회색 보조 안내 한 줄 (ⓘ 아이콘 + 문구) — `.text-note` 대응 */
export function TextNote({ children, icon = 'info' }: { children: ReactNode; icon?: string }) {
  return (
    <p className={styles.textNote}>
      <Icon name={icon} />
      {children}
    </p>
  );
}
