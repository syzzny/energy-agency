import clsx from 'clsx';
import { Button } from '@/components/Button';
import { formStyles } from '@/components/Form';
import styles from './ListInfo.module.scss';

export interface ListInfoProps {
  total?: string;
  pages?: string;
  /** 현재 페이지 (기본 1) */
  page?: number;
  /** 건수가 바뀔 때 스크린리더에 읽어 줄지 (검색 결과 등) */
  live?: boolean;
  sort?: boolean;
  actionLabel?: string;
  actionHref?: string;
  actionIcon?: string;
}

/** 목록 상단 정보(총 건수 · 정렬 · 버튼) — `components/list-info.hbs` 대응 */
export function ListInfo({ total, pages, page = 1, live, sort, actionLabel, actionHref, actionIcon }: ListInfoProps) {
  return (
    <div className={styles.listInfo}>
      <p className={styles.count} aria-live={live ? 'polite' : undefined}>
        {total && (
          <>
            전체 <strong className="num">{total}</strong>건<span>
              ({page} / {pages} 페이지)
            </span>
          </>
        )}
      </p>
      {sort && (
        <label className={clsx(formStyles.select, styles.select)}>
          <span className="sr-only">정렬</span>
          <select name="sort">
            <option>최신순</option>
            <option>조회순</option>
          </select>
        </label>
      )}
      {actionLabel && actionHref && (
        <Button href={actionHref} variant="dark" size="sm" pill icon={actionIcon} iconFirst>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
