import { useCallback } from 'react';
import { useToast } from '@/components/Toast';

/** 텍스트 복사 — `modules/ui.js: initCopy` 대응 */
export function useCopyToClipboard() {
  const { show } = useToast();

  return useCallback(
    async (text: string | undefined | null, successMessage = '주소가 복사되었습니다.') => {
      if (!text) return;
      try {
        await navigator.clipboard.writeText(text.trim());
        show(successMessage);
      } catch {
        show('복사를 지원하지 않는 브라우저입니다.');
      }
    },
    [show],
  );
}
