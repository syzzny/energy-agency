import { useCallback, useState } from 'react';
import { useToast } from '@/components/Toast';

/**
 * 필수값 검증 (브라우저 기본 말풍선 대신 접근성 있는 오류 메시지).
 * `modules/form.js: initForms` 의 커스텀 validate 대응. `<form noValidate>`와 함께 쓴다.
 */
export function useFormValidation() {
  const { show } = useToast();
  const [errors, setErrors] = useState<Set<string>>(new Set());

  const validate = useCallback(
    (form: HTMLFormElement): boolean => {
      const invalidFields: HTMLInputElement[] = [];
      const next = new Set<string>();
      form.querySelectorAll<HTMLInputElement>('[required]').forEach((field) => {
        const valid = field.type === 'checkbox' ? field.checked : field.value.trim() !== '';
        const key = field.name || field.id;
        if (!valid) {
          next.add(key);
          invalidFields.push(field);
        }
      });
      setErrors(next);
      const firstInvalid = invalidFields[0];
      if (firstInvalid) {
        firstInvalid.focus();
        show('필수 입력 항목을 확인해 주세요.');
        return false;
      }
      return true;
    },
    [show],
  );

  const clearError = useCallback((name: string) => {
    setErrors((prev) => {
      if (!prev.has(name)) return prev;
      const next = new Set(prev);
      next.delete(name);
      return next;
    });
  }, []);

  const isInvalid = useCallback((name: string) => errors.has(name), [errors]);

  return { validate, clearError, isInvalid };
}
