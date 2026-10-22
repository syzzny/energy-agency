import { useCallback, useRef, useState } from 'react';
import type { KeyboardEvent, FocusEvent } from 'react';

/** 단순 드롭다운 (패밀리사이트) — `modules/header.js: initDropdowns` 대응 */
export function useDropdown<T extends HTMLElement, B extends HTMLElement = HTMLButtonElement>() {
  const wrapRef = useRef<T>(null);
  const buttonRef = useRef<B>(null);
  const [open, setOpen] = useState(false);

  const toggle = useCallback(() => setOpen((v) => !v), []);
  const close = useCallback(() => setOpen(false), []);

  const onBlur = useCallback(
    (e: FocusEvent<T>) => {
      if (!wrapRef.current?.contains(e.relatedTarget as Node | null)) close();
    },
    [close],
  );

  const onKeyDown = useCallback(
    (e: KeyboardEvent<T>) => {
      if (e.key === 'Escape') {
        close();
        buttonRef.current?.focus();
      }
    },
    [close],
  );

  return { wrapRef, buttonRef, open, toggle, close, onBlur, onKeyDown };
}
