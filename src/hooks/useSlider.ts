import { useCallback, useEffect, useRef, useState, type FocusEvent } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

export interface UseSliderOptions {
  slideCount: number;
  intervalMs?: number;
  /** 정지/재생 토글 버튼이 없는 슬라이더는 자동재생하지 않는다 */
  hasToggle?: boolean;
}

/**
 * 접근성을 고려한 경량 슬라이더 훅 — 자동재생 정지/재생, reduced-motion 비활성화,
 * hover/focus 중 일시정지. `modules/slider.js: initSliders` 대응.
 * 진행바는 `resetKey`를 key로 걸어 재시작 애니메이션을 트리거한다.
 */
export function useSlider({ slideCount, intervalMs = 5000, hasToggle = true }: UseSliderOptions) {
  const reduced = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(() => reduced || !hasToggle);
  const [held, setHeld] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  const goTo = useCallback(
    (i: number) => {
      setIndex(((i % slideCount) + slideCount) % slideCount);
      setResetKey((k) => k + 1);
    },
    [slideCount],
  );
  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    clearInterval(timerRef.current);
    if (!paused && !held) {
      timerRef.current = setInterval(() => setIndex((i) => (i + 1) % slideCount), intervalMs);
    }
    return () => clearInterval(timerRef.current);
  }, [paused, held, intervalMs, slideCount, resetKey]);

  const togglePause = useCallback(() => setPaused((p) => !p), []);

  const onMouseEnter = useCallback(() => setHeld(true), []);
  const onMouseLeave = useCallback(() => setHeld(false), []);
  const onFocus = useCallback(() => setHeld(true), []);
  const onBlur = useCallback((e: FocusEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHeld(false);
  }, []);

  return {
    index,
    paused,
    held,
    resetKey,
    intervalMs,
    goTo,
    next,
    prev,
    togglePause,
    containerProps: { onMouseEnter, onMouseLeave, onFocus, onBlur },
  };
}
