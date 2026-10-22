import type { ReactNode } from 'react';
import { Icon } from '@/components/Icon';
import styles from './InfoBanner.module.scss';

/** 안내 박스 (아이콘 + 제목 + 설명) — `.intro-box` 대응 */
export function IntroBox({ icon, title, children }: { icon: string; title: string; children: ReactNode }) {
  return (
    <div className={styles.introBox}>
      <span className={styles.introBoxIcon} aria-hidden="true">
        <Icon name={icon} />
      </span>
      <div>
        <strong>{title}</strong>
        <p>{children}</p>
      </div>
    </div>
  );
}

/** 하단 유도 배너 — `.cta-banner` 대응 */
export function CtaBanner({ title, desc, action }: { title: string; desc: ReactNode; action: ReactNode }) {
  return (
    <div className={styles.ctaBanner}>
      <div>
        <strong>{title}</strong>
        <p>{desc}</p>
      </div>
      {action}
    </div>
  );
}
