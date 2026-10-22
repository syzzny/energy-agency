import type { ReactNode } from 'react';
import clsx from 'clsx';
import styles from './SlideStack.module.scss';

export interface SlideStackProps {
  slides: ReactNode[];
  activeIndex: number;
  className?: string;
  /** 슬라이드 하나하나에 role="group" 등 캐러셀 접근성 속성을 줄지 */
  roledescription?: string;
}

/**
 * hero / board-card / cardnews-viewer 가 공유하는 grid-stack 슬라이드 패턴.
 * 포지셔닝·크로스페이드만 담당한다 — 자동재생/진행바 등은 useSlider가 소유.
 * 비활성 슬라이드는 inert 로 포커스·스크린리더 접근을 막는다(수동 tabIndex 조정 불필요).
 */
export default function SlideStack({ slides, activeIndex, className, roledescription }: SlideStackProps) {
  return (
    <div className={clsx(styles.stack, className)}>
      {slides.map((slide, i) => {
        const isActive = i === activeIndex;
        return (
          <div
            key={i}
            className={clsx(styles.slide, isActive && styles.active)}
            aria-hidden={!isActive}
            // @ts-expect-error inert는 React 18 타입에 아직 없을 수 있음 — 표준 HTML 불리언 속성
            inert={isActive ? undefined : ''}
            role={roledescription ? 'group' : undefined}
            aria-roledescription={roledescription}
          >
            {slide}
          </div>
        );
      })}
    </div>
  );
}
