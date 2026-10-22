import { useCallback } from 'react';
import type { FormEvent } from 'react';
import { useToast } from '@/components/Toast';

/** 만족도 조사 제출 (데모) — `modules/ui.js: initSurvey` 대응 */
export function useSurvey() {
  const { show } = useToast();

  return useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      show('소중한 의견 감사합니다.');
    },
    [show],
  );
}
