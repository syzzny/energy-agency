import { useCallback, useState } from 'react';
import type { ChangeEvent } from 'react';
import { useToast } from '@/components/Toast';

/** 첨부파일 이름 표시 + 개수 검증 — `modules/form.js: initForms` 의 첨부파일 처리 대응 */
export function useFileValidation(maxFiles = 3) {
  const { show } = useToast();
  const [files, setFiles] = useState<File[]>([]);

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const selected = [...(e.target.files ?? [])];
      if (selected.length > maxFiles) {
        show(`첨부파일은 최대 ${maxFiles}개까지 선택할 수 있습니다.`);
        e.target.value = '';
        setFiles([]);
        return;
      }
      setFiles(selected);
    },
    [maxFiles, show],
  );

  const label = files.length ? files.map((f) => f.name).join(', ') : '선택된 파일 없음';

  return { files, onChange, label, hasFile: files.length > 0 };
}
