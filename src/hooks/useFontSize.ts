import { useCallback, useEffect, useState } from 'react';

const MIN = -1;
const MAX = 2;
const LABELS: Record<number, string> = { [-1]: '작게', 0: '보통', 1: '크게', 2: '가장 크게' };
const STORAGE_KEY = 'fontScale';

/** 글자크기 조절 (-1 ~ +2단계, localStorage 기억) — `modules/header.js: initFontSize` 대응 */
export function useFontSize() {
  const [scale, setScale] = useState(() => {
    try {
      return Number(localStorage.getItem(STORAGE_KEY)) || 0;
    } catch {
      return 0;
    }
  });
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    const root = document.documentElement;
    if (scale === 0) root.removeAttribute('data-font-scale');
    else root.setAttribute('data-font-scale', String(scale));
    try {
      localStorage.setItem(STORAGE_KEY, String(scale));
    } catch {
      /* ignore */
    }
  }, [scale]);

  const change = useCallback((dir: 'up' | 'down') => {
    setScale((prev) => {
      const next = Math.min(MAX, Math.max(MIN, prev + (dir === 'up' ? 1 : -1)));
      setAnnouncement(`글자 크기: ${LABELS[next]}`);
      return next;
    });
  }, []);

  return { scale, change, announcement, canDown: scale > MIN, canUp: scale < MAX };
}
