import type { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';
import { Icon } from '@/components/Icon';
import styles from './Button.module.scss';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  label: string;
  size?: 'xs' | 'sm' | 'md';
  onDark?: boolean;
}

/** 원형 아이콘 버튼 (크기 클래스는 Button 의 .sm/.lg 와 겹치지 않게 iconBtnSm/iconBtnXs 를 쓴다) — `.icon-btn` 대응 (슬라이더 화살표, 더보기 등) */
export function IconButton({ icon, label, size = 'md', onDark, className, ...rest }: IconButtonProps) {
  return (
    <button
      type="button"
      className={clsx(styles.iconBtn, size === 'sm' && styles.iconBtnSm, size === 'xs' && styles.iconBtnXs, onDark && styles.onDark, className)}
      {...rest}
    >
      <Icon name={icon} />
      <span className="sr-only">{label}</span>
    </button>
  );
}
