import clsx from 'clsx';
import type { ReactNode } from 'react';
import styles from './Thumb.module.scss';

export type ThumbTone = 'blue' | 'green' | 'warm' | 'navy' | 'mint';

const TONE_CLASS: Record<ThumbTone, string | undefined> = {
  blue: undefined,
  green: 'green',
  warm: 'warm',
  navy: 'navy',
  mint: 'mint',
};

export function Thumb({ tone = 'blue', className, children }: { tone?: ThumbTone; className?: string; children?: ReactNode }) {
  const toneClass = TONE_CLASS[tone];
  return <div className={clsx(styles.thumb, toneClass && styles[toneClass], className)}>{children}</div>;
}
