import clsx from 'clsx';
import { Button } from '@/components/Button';
import { formStyles } from '@/components/Form';
import styles from './ListInfo.module.scss';

export interface ListInfoProps {
  total?: string;
  pages?: string;
  sort?: boolean;
  actionLabel?: string;
  actionHref?: string;
  actionIcon?: string;
}

/** 목록 상단 정보(총 건수 · 정렬 · 버튼) — `components/list-info.hbs` 대응 */
export function ListInfo({ total, pages, sort, actionLabel, actionHref, actionIcon }: ListInfoProps) {
  return (
    <div className={styles.listInfo}>
      <p className={styles.count}>
        {total && (
          <>
            전체 <strong className="num">{total}</strong>건<span>(1 / {pages} 페이지)</span>
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
