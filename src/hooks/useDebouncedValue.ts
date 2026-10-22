import { useEffect, useState } from 'react';

/** 값이 바뀐 뒤 delay(ms) 동안 다시 바뀌지 않으면 그때 반영한다 — 검색어 입력마다 요청하지 않도록 */
export function useDebouncedValue<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}
