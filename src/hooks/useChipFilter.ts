import { useCallback, useMemo, useState } from 'react';

/**
 * 칩 필터 (토글 버튼 그룹) — `modules/ui.js: initChipFilter` 대응.
 * `key === 'all'` 은 전체 보기. 결과 개수는 호출부에서 `onChange`로 받아 live-region에 알린다.
 */
export function useChipFilter<T>(items: T[], getCategory: (item: T) => string, defaultKey = 'all') {
  const [active, setActive] = useState(defaultKey);

  const filtered = useMemo(
    () => (active === 'all' ? items : items.filter((item) => getCategory(item).split(' ').includes(active))),
    [items, active, getCategory],
  );

  const select = useCallback(
    (key: string, onChange?: (count: number) => void) => {
      setActive(key);
      const next = key === 'all' ? items : items.filter((item) => getCategory(item).split(' ').includes(key));
      onChange?.(next.length);
    },
    [items, getCategory],
  );

  return { active, select, filtered };
}
