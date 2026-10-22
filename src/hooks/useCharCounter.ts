import { useCallback, useState } from 'react';
import type { ChangeEvent } from 'react';

/** 글자 수 카운터 — `modules/form.js: initForms` 의 글자 수 카운터 대응 */
export function useCharCounter(max: number) {
  const [value, setValue] = useState('');

  const onChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => setValue(e.target.value), []);

  return { value, onChange, text: `${value.length.toLocaleString()} / ${max.toLocaleString()}자` };
}
