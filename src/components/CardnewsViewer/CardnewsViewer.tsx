import { useRef, type KeyboardEvent, type TouchEvent } from 'react';
import clsx from 'clsx';
import { IconButton } from '@/components/Button';
import { CardnewsCard } from '@/components/CardnewsCard';
import type { CardnewsItem } from '@/data/types';
import { useSlider } from '@/hooks';
import styles from './CardnewsViewer.module.scss';

/**
 * 카드뉴스 상세 뷰어 — 수동 넘김 전용(자동재생 없음)
 * 버튼 · 좌우 화살표 키 · 모바일 스와이프로 넘긴다. 지금 장만 스크린리더에 노출하고, 넘길 때 바뀐 장 번호를 알린다.
 */
export function CardnewsViewer({ item }: { item: CardnewsItem }) {
  const total = item.slides.length;
  const slider = useSlider({ slideCount: total, hasToggle: false });
  const touchX = useRef<number | null>(null);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') slider.next();
    if (e.key === 'ArrowLeft') slider.prev();
  };
  const onTouchStart = (e: TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 40) (dx < 0 ? slider.next : slider.prev)();
    touchX.current = null;
  };

  return (
    <section className={styles.viewer} aria-roledescription="carousel" aria-label={`카드뉴스: ${item.title}`}>
      <div className={styles.slides} onKeyDown={onKeyDown} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {item.slides.map((_, i) => (
          <div
            key={i}
            className={clsx(styles.slide, i === slider.index && styles.active)}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} / ${total}`}
            aria-hidden={i !== slider.index}
          >
            <CardnewsCard item={item} index={i} className={styles.card} />
          </div>
        ))}
      </div>

      <div className={styles.controls}>
        <IconButton icon="left" label="이전 장" onClick={slider.prev} onKeyDown={onKeyDown} />
        <p className={clsx(styles.counter, 'num')} aria-live="polite">
          <strong>{slider.index + 1}</strong> / {total}
          <span className="sr-only">장</span>
        </p>
        <IconButton icon="right" label="다음 장" onClick={slider.next} onKeyDown={onKeyDown} />
      </div>

      {/* 썸네일 점프 */}
      <ol className={styles.thumbs} aria-label="장 바로가기">
        {item.slides.map((_, i) => (
          <li key={i}>
            <button
              type="button"
              className={clsx(styles.thumb, i === slider.index && styles.thumbOn)}
              aria-current={i === slider.index ? 'true' : undefined}
              onClick={() => slider.goTo(i)}
            >
              <span aria-hidden="true">
                <CardnewsCard item={item} index={i} />
              </span>
              <span className="sr-only">{i + 1}장 보기</span>
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}
