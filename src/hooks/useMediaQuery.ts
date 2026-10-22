import { useEffect, useState } from 'react';

/** CSS 미디어쿼리 일치 여부를 상태로 돌려준다 (창 크기가 바뀌면 다시 계산) */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

/** 모바일(768px 미만) 여부 — 디자인 토큰의 down('md') 와 같은 기준 */
export const useIsMobile = () => useMediaQuery('(max-width: 767.98px)');
