import { useCallback, useState } from 'react';

/** 아코디언 (FAQ) — `modules/ui.js: initAccordion` 대응. 여러 패널 동시 열림 허용. */
export function useAccordion(initialOpenIds: string[] = []) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set(initialOpenIds));

  const toggle = useCallback((id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const isOpen = useCallback((id: string) => openIds.has(id), [openIds]);

  return { isOpen, toggle };
}
