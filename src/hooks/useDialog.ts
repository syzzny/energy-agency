import { useCallback, useEffect, useRef, useState } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * 모달 다이얼로그 공통 훅 — 포커스 트랩 / ESC 닫기 / 스크롤 잠금 / 포커스 복귀.
 * `modules/dialog.js`의 `createDialog` 대응.
 */
export function useDialog<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [isOpen, setIsOpen] = useState(false);
  const opener = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const open = useCallback((trigger?: HTMLElement) => {
    opener.current = trigger ?? (document.activeElement as HTMLElement | null);
    setIsOpen(true);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!isOpen || !el) return;

    document.body.classList.add('is-locked');

    const visibleFocusable = () =>
      [...el.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((n) => n.offsetParent !== null || n === document.activeElement);

    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== 'Tab') return;
      const nodes = visibleFocusable();
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    el.addEventListener('keydown', onKeydown);
    const raf = requestAnimationFrame(() => visibleFocusable()[0]?.focus());

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('keydown', onKeydown);
      document.body.classList.remove('is-locked');
      opener.current?.focus();
    };
  }, [isOpen, close]);

  return { ref, isOpen, open, close };
}
