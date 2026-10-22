import { useCallback, useEffect, useRef, useState } from 'react';

/** 통합검색 토글 — `modules/header.js: initSearch` 대응 */
export function useHeaderSearch<I extends HTMLElement = HTMLInputElement, B extends HTMLElement = HTMLButtonElement>() {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<I>(null);
  const buttonRef = useRef<B>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const toggle = useCallback(() => setOpen((v) => !v), []);
  const close = useCallback(() => {
    setOpen(false);
    buttonRef.current?.focus();
  }, []);

  return { open, toggle, close, inputRef, buttonRef };
}
