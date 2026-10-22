import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@/components/Icon';
import styles from './Button.module.scss';

export function MoreLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className={styles.moreLink}>
      {children}
      <Icon name="right" />
    </Link>
  );
}
