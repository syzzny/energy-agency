import { useEffect, useRef, useState } from 'react';

/**
 * 본문 앵커 탭 — 스크롤 위치에 따라 활성 탭 갱신 (IntersectionObserver).
 * `modules/ui.js: initAnchorTabs` 대응. SPA에서는 라우트 전환 시 반드시 disconnect 해야 누수가 없다.
 */
export function useAnchorTabs(sectionIds: string[]) {
  const [activeId, setActiveId] = useState(sectionIds[0]);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const sections = sectionIds.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => Boolean(el));
    if (!sections.length) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-35% 0px -55% 0px' },
    );
    sections.forEach((s) => observerRef.current!.observe(s));

    return () => observerRef.current?.disconnect();
  }, [sectionIds]);

  return activeId;
}
