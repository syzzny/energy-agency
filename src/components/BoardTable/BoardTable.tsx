import type { ReactNode } from 'react';
import clsx from 'clsx';
import styles from './BoardTable.module.scss';

export interface BoardTableCol {
  label: string;
  className?: string;
}

export interface BoardTableProps {
  caption: string;
  cols: BoardTableCol[];
  variant?: 'board' | 'disclosure';
  children: ReactNode;
}

/** 게시판 목록 표 셸 — `board-table`/`disclosure-table` 공통. 모바일에서 카드형으로 바뀐다 */
export function BoardTable({ caption, cols, variant = 'board', children }: BoardTableProps) {
  return (
    <table className={clsx(styles.boardTable, variant === 'disclosure' && styles.disclosureTable)}>
      <caption>{caption}</caption>
      <colgroup>
        {cols.map((col) => (
          <col key={col.label} className={col.className && styles[col.className]} />
        ))}
      </colgroup>
      <thead>
        <tr>
          {cols.map((col) => (
            <th key={col.label} scope="col">
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
}
