import type { FormEvent } from 'react';
import clsx from 'clsx';
import { Button } from '@/components/Button';
import { formStyles } from '@/components/Form';
import styles from './SearchFilter.module.scss';

export type SearchOption = string | { value: string; label: string };

export interface SearchFilterProps {
  id: string;
  /** 검색 조건 옵션 (예: ['제목+내용', '제목', '작성자'] 또는 { value, label }) */
  options?: SearchOption[];
  /** 아래 값들을 넘기면 실제로 검색하는 제어 컴포넌트가 되고, 넘기지 않으면 데모(화면만)로 동작한다 */
  keyword?: string;
  onKeywordChange?: (keyword: string) => void;
  field?: string;
  onFieldChange?: (field: string) => void;
  onSubmit?: () => void;
}

const optValue = (o: SearchOption) => (typeof o === 'string' ? o : o.value);
const optLabel = (o: SearchOption) => (typeof o === 'string' ? o : o.label);

/** 게시판 검색 필터 — `components/search-filter.hbs` 대응 */
export function SearchFilter({ id, options = ['제목+내용', '제목', '내용'], keyword, onKeywordChange, field, onFieldChange, onSubmit }: SearchFilterProps) {
  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit?.();
  };

  return (
    <form className={styles.searchFilter} role="search" onSubmit={submit}>
      <label className={clsx(formStyles.select, styles.select)}>
        <span className="sr-only">검색 조건</span>
        <select name="type" value={field} onChange={onFieldChange && ((e) => onFieldChange(e.target.value))}>
          {options.map((opt) => (
            <option key={optValue(opt)} value={optValue(opt)}>
              {optLabel(opt)}
            </option>
          ))}
        </select>
      </label>
      <label className="sr-only" htmlFor={id}>
        검색어
      </label>
      <input
        type="search"
        id={id}
        className={clsx(formStyles.input, styles.input)}
        placeholder="검색어를 입력해 주세요"
        value={keyword}
        onChange={onKeywordChange && ((e) => onKeywordChange(e.target.value))}
      />
      <Button type="submit" icon="search" iconFirst>
        검색
      </Button>
    </form>
  );
}
