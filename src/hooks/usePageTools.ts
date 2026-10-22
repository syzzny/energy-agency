import { useCallback } from 'react';
import { useToast } from '@/components/Toast';

/** 페이지 공유 · 인쇄 — `modules/ui.js: initPageTools` 대응 */
export function usePageTools() {
  const { show } = useToast();

  const share = useCallback(async () => {
    const data = { title: document.title, url: location.href };
    if (navigator.share) {
      try {
        await navigator.share(data);
      } catch {
        /* 사용자 취소 등 */
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(location.href);
      show('페이지 주소가 복사되었습니다.');
    } catch {
      show('주소 복사를 지원하지 않는 브라우저입니다.');
    }
  }, [show]);

  const print = useCallback(() => window.print(), []);

  return { share, print };
}
