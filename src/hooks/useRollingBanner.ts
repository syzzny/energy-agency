import { useCallback, useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

/**
 * 관련 사이트 롤링 배너 — 트랙을 한 칸씩 이동. `modules/slider.js: initRolling` 대응.
 * `trackRef`를 `[data-track]` 역할의 요소에 연결해 쓴다.
 */
export function useRollingBanner(itemCount: number, intervalMs = 3000) {
  const reduced = usePrefersReducedMotion();
  const trackRef = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(reduced);
  const [translate, setTranslate] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track || !track.children.length) return { perView: 1, step: 0 };
    const first = track.children[0] as HTMLElement;
    const itemWidth = first.getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(track).columnGap || '12');
    const viewportWidth = track.parentElement?.clientWidth ?? itemWidth;
    const perView = Math.round(viewportWidth / itemWidth) || 1;
    return { perView, step: itemWidth + gap };
  }, []);

  const goTo = useCallback(
    (n: number) => {
      const { perView, step } = measure();
      const maxIndex = Math.max(0, itemCount - perView);
      const next = n > maxIndex ? 0 : n < 0 ? maxIndex : n;
      setIndex(next);
      setTranslate(-next * step);
    },
    [itemCount, measure],
  );

  useEffect(() => {
    clearInterval(timerRef.current);
    if (!paused) timerRef.current = setInterval(() => goTo(index + 1), intervalMs);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, intervalMs, index]);

  useEffect(() => {
    const onResize = () => goTo(index);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);
  const togglePause = useCallback(() => setPaused((p) => !p), []);

  const onFocusItem = useCallback(
    (itemIndex: number) => {
      clearInterval(timerRef.current);
      const { perView } = measure();
      const maxIndex = Math.max(0, itemCount - perView);
      if (itemIndex < index || itemIndex >= index + perView) goTo(Math.min(itemIndex, maxIndex));
    },
    [index, itemCount, measure, goTo],
  );

  return { trackRef, index, paused, translate, next, prev, togglePause, onFocusItem };
}
