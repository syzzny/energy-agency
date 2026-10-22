import { useCallback, useEffect, useRef, useState, type FocusEvent } from 'react';

const isDesktop = () => window.matchMedia('(min-width: 1024px)').matches;

/**
 * GNB 메가메뉴 (데스크톱 전용)
 * - 1depth 에 hover / focus → 6개 2depth 컬럼이 한 패널에 모두 펼쳐짐 (가리킨 메뉴만 강조)
 * - 패널 영역(nav)을 벗어나면 살짝 지연 후 닫힘 — 대각선 이동 시 깜빡임 방지
 * - ESC: 닫고 가리키던 1depth 링크로 포커스 복귀 / Tab 으로 GNB 밖으로 나가면 닫힘
 * - 배경(dim) 클릭, 1024px 미만으로 줄어들면 닫힘
 */
export function useGnbMegaMenu() {
  const [openId, setOpenId] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>();
  // ESC 후 1depth 로 포커스를 돌려줄 때 onFocus 가 메뉴를 다시 여는 것을 막는 플래그
  const suppressFocusOpen = useRef(false);

  const open = useCallback((id: string) => {
    clearTimeout(closeTimer.current);
    setOpenId(id);
  }, []);

  const close = useCallback(() => {
    clearTimeout(closeTimer.current);
    setOpenId(null);
  }, []);

  const onItemEnter = useCallback((id: string) => isDesktop() && open(id), [open]);

  const onItemFocus = useCallback(
    (id: string) => {
      if (suppressFocusOpen.current) {
        suppressFocusOpen.current = false;
        return;
      }
      if (isDesktop()) open(id);
    },
    [open],
  );

  const onNavMouseLeave = useCallback(() => {
    closeTimer.current = setTimeout(close, 120);
  }, [close]);
  const onNavMouseEnter = useCallback(() => clearTimeout(closeTimer.current), []);

  /** 포커스가 GNB 바깥으로 나가면 닫기 */
  const onNavBlur = useCallback(
    (e: FocusEvent<HTMLElement>) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node | null)) close();
    },
    [close],
  );

  // ESC 로 닫기 + 1depth 링크로 포커스 복귀
  useEffect(() => {
    if (openId === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      const link = navRef.current?.querySelector<HTMLAnchorElement>(`[data-gnb-link="${openId}"]`);
      close();
      if (link && document.activeElement !== link) {
        suppressFocusOpen.current = true;
        link.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [openId, close]);

  useEffect(() => {
    const onResize = () => !isDesktop() && close();
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      clearTimeout(closeTimer.current);
    };
  }, [close]);

  return {
    navRef,
    openId,
    isOpen: openId !== null,
    close,
    onItemEnter,
    onItemFocus,
    onNavMouseEnter,
    onNavMouseLeave,
    onNavBlur,
  };
}

export type GnbMegaMenu = ReturnType<typeof useGnbMegaMenu>;
