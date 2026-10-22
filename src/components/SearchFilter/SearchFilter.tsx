import type { FormEvent } from 'react';
import clsx from 'clsx';
import { Button } from '@/components/Button';
import { formStyles } from '@/components/Form';
import styles from './SearchFilter.module.scss';

export interface SearchFilterProps {
  id: string;
  /** 검색 조건 select의 옵션 목록 (예: ['제목+내용', '제목', '작성자']) — 기존 `options` prop이 실제로 반영되도록 수정 */
  options?: string[];
}

/** 게시판 검색 필터 — `components/search-filter.hbs` 대응 (데모: 제출해도 실제 검색은 하지 않음) */
export function SearchFilter({ id, options = ['제목+내용', '제목', '내용'] }: SearchFilterProps) {
  const onSubmit = (e: FormEvent) => e.preventDefault();

  return (
    <form className={styles.searchFilter} role="search" onSubmit={onSubmit}>
      <label className={clsx(formStyles.select, styles.select)}>
        <span className="sr-only">검색 조건</span>
        <select name="type">
          {options.map((opt) => (
            <option key={opt}>{opt}</option>
          ))}
        </select>
      </label>
      <label className="sr-only" htmlFor={id}>
        검색어
      </label>
      <input type="search" id={id} className={clsx(formStyles.input, styles.input)} placeholder="검색어를 입력해 주세요" />
      <Button type="submit" icon="search" iconFirst>
        검색
      </Button>
    </form>
  );
}
