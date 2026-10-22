import clsx from 'clsx';
import type { ReactNode } from 'react';
import type { BadgeVariant } from '@/utils/status';
import styles from './Badge.module.scss';

export interface BadgeProps {
  label?: ReactNode;
  variant?: BadgeVariant | null;
  className?: string;
}

export function Badge({ label, variant, className }: BadgeProps) {
  return <span className={clsx(styles.badge, variant && styles[variant], className)}>{label}</span>;
}

/** 새 글 'N' 표시 */
export function NewBadge({ className }: { className?: string }) {
  return (
    <span className={clsx(styles.newBadge, className)}>
      <span aria-hidden="true">N</span>
      <span className="sr-only">새 글</span>
    </span>
  );
}

export function ChipGroup({ children, label, className }: { children: ReactNode; label: string; className?: string }) {
  return (
    <div className={clsx(styles.chips, className)} role="group" aria-label={label}>
      {children}
    </div>
  );
}

export function Chip({
  active,
  onClick,
  children,
  count,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  count?: number;
}) {
  return (
    <button type="button" className={styles.chip} aria-pressed={active} onClick={onClick}>
      {children}
      {count !== undefined && <span className="num">{count}</span>}
    </button>
  );
}
