import type { ReactNode } from 'react';
import clsx from 'clsx';
import { Icon } from '@/components/Icon';
import styles from './NoticeBox.module.scss';

export function NoticeBox({ variant, children }: { variant?: 'info'; children: ReactNode }) {
  return (
    <p className={clsx(styles.noticeBox, variant && styles[variant])}>
      <Icon name="info" />
      <span>{children}</span>
    </p>
  );
}
