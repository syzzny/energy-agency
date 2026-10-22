import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

export interface UseTabsOptions {
  ids: string[];
  /** 기본 선택 탭 (지정 없으면 첫 번째) */
  defaultId?: string;
  /** true면 location.hash(#panel-id)로 초기 탭을 결정하고 hashchange도 반영한다 */
  syncHash?: boolean;
}

/**
 * ARIA 탭 (role="tablist") — 좌우 화살표 / Home / End 키보드 이동.
 * `modules/ui.js: initTabs` 대응.
 */
export function useTabs({ ids, defaultId, syncHash = false }: UseTabsOptions) {
  const fromHash = () => {
    if (!syncHash) return undefined;
    const id = location.hash.replace('#panel-', '').replace('#', '');
    return ids.includes(id) ? id : undefined;
  };

  const [activeId, setActiveId] = useState(() => fromHash() ?? defaultId ?? ids[0]);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    if (!syncHash) return;
    const onHashChange = () => {
      const id = fromHash();
      if (id) setActiveId(id);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [syncHash]);

  const select = useCallback((id: string, focus = true) => {
    setActiveId(id);
    if (focus) tabRefs.current[id]?.focus();
  }, []);

  const onKeyDown = useCallback(
    (e: KeyboardEvent, index: number) => {
      const map: Record<string, number> = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: ids.length - 1 };
      if (!(e.key in map)) return;
      e.preventDefault();
      const nextIndex = ((map[e.key] % ids.length) + ids.length) % ids.length;
      select(ids[nextIndex]);
    },
    [ids, select],
  );

  const getTabProps = useCallback(
    (id: string, index: number) => ({
      ref: (el: HTMLButtonElement | null) => {
        tabRefs.current[id] = el;
      },
      role: 'tab' as const,
      id: `tab-${id}`,
      'aria-controls': `panel-${id}`,
      'aria-selected': id === activeId,
      tabIndex: id === activeId ? 0 : -1,
      onClick: () => select(id, false),
      onKeyDown: (e: KeyboardEvent) => onKeyDown(e, index),
    }),
    [activeId, onKeyDown, select],
  );

  const getPanelProps = useCallback(
    (id: string) => ({
      role: 'tabpanel' as const,
      id: `panel-${id}`,
      'aria-labelledby': `tab-${id}`,
      hidden: id !== activeId,
      tabIndex: 0,
    }),
    [activeId],
  );

  return useMemo(
    () => ({ activeId, setActiveId: select, getTabProps, getPanelProps }),
    [activeId, select, getTabProps, getPanelProps],
  );
}
