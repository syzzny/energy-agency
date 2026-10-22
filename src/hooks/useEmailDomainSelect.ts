import { useCallback, useState } from 'react';
import type { ChangeEvent } from 'react';

/** 이메일 도메인 선택 → 입력칸 채우기 — `modules/form.js: initForms` 대응 */
export function useEmailDomainSelect() {
  const [domain, setDomain] = useState('');
  const [isCustom, setIsCustom] = useState(true);

  const onSelectChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    const custom = e.target.value === '';
    setIsCustom(custom);
    setDomain(custom ? '' : e.target.value);
  }, []);

  const onDomainChange = useCallback((e: ChangeEvent<HTMLInputElement>) => setDomain(e.target.value), []);

  return { domain, isCustom, onSelectChange, onDomainChange };
}
