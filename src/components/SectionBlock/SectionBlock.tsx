import type { ReactNode, Ref } from 'react';
import { Heading } from '@/components/Heading';
import styles from './SectionBlock.module.scss';

export interface SectionBlockProps {
  id: string;
  title: ReactNode;
  desc?: ReactNode;
  /** 제목 오른쪽 요소 (상태 배지 등) */
  aside?: ReactNode;
  children: ReactNode;
}

/** `.section-block` + `.heading` 묶음 — 서브페이지 본문 섹션 공통 셸 */
export function SectionBlock({ id, title, desc, aside, children, ...rest }: SectionBlockProps & { tabIndex?: number; sectionRef?: Ref<HTMLElement> }) {
  return (
    <section className={styles.sectionBlock} id={id} aria-labelledby={`${id}Title`} tabIndex={rest.tabIndex} ref={rest.sectionRef}>
      <Heading id={`${id}Title`} title={title} desc={desc} aside={aside} />
      {children}
    </section>
  );
}

export function ContentText({ children }: { children: ReactNode }) {
  return <p className={styles.contentText}>{children}</p>;
}

export function IntroGroup({ children }: { children: ReactNode }) {
  return <div className={styles.introGroup}>{children}</div>;
}
