import type { ReactNode } from 'react';
import styles from './Heading.module.scss';

/** 블루 점 + 아이브로우 텍스트 (섹션 상단 킥커) */
export function Eyebrow({ children }: { children: ReactNode }) {
  return <span className={styles.eyebrow}>{children}</span>;
}

export interface HeadingProps {
  id: string;
  title: ReactNode;
  desc?: ReactNode;
  /** 제목 오른쪽에 붙는 요소 (필수 표시 안내, 상태 배지 등) */
  aside?: ReactNode;
}

/** 섹션 제목 (좌측 블루 바 + 제목 + 설명) */
export function Heading({ id, title, desc, aside }: HeadingProps) {
  return (
    <div className={styles.heading}>
      <div>
        <h3 className={styles.title} id={id}>
          {title}
        </h3>
        {desc && <p className={styles.desc}>{desc}</p>}
      </div>
      {aside}
    </div>
  );
}
