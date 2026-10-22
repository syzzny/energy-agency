import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { useToast } from '@/components/Toast';

/**
 * 민원 처리현황 조회 (데모) — `modules/ui.js: initLookup` 대응
 * 결과 영역은 예시로 처음부터 보여 주고, [조회]를 누르면 결과 영역으로 포커스를 옮겨 스크린리더가 읽게 한다.
 */
export function useLookup<T extends HTMLElement>() {
  const { show } = useToast();
  const resultRef = useRef<T>(null);
  const [count, setCount] = useState(0);

  const onSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      setCount((n) => n + 1);
      show('조회 결과를 불러왔습니다.');
    },
    [show],
  );

  useEffect(() => {
    if (count === 0) return;
    resultRef.current?.focus();
    resultRef.current?.scrollIntoView({ block: 'start' });
  }, [count]);

  return { submitted: count > 0, onSubmit, resultRef };
}
