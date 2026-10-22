import clsx from 'clsx';
import type { ReactNode } from 'react';
import type { BusinessTableCol } from '@/data/types';
import styles from './DataTable.module.scss';

export interface DataTableProps {
  caption: string;
  cols: BusinessTableCol[];
  rows: ReactNode[][];
  /** 첫 칸을 행 제목(th scope=row)으로 쓸지 — 기본 true */
  rowHeader?: boolean;
}

export function DataTable({ caption, cols, rows, rowHeader = true }: DataTableProps) {
  return (
    // 모바일에서 가로 스크롤되는 영역이므로 키보드로도 스크롤할 수 있게 초점을 받는다
    <div className={styles.wrap} tabIndex={0} role="region" aria-label={`${caption} (표)`}>
      <table className={styles.table}>
        <caption>{caption}</caption>
        <colgroup>
          {cols.map((col) => (
            <col key={col.label} style={col.width ? { width: col.width } : undefined} />
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
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) =>
                ci === 0 && rowHeader ? (
                  <th key={ci} scope="row">
                    {cell}
                  </th>
                ) : (
                  <td key={ci} className={clsx(cols[ci]?.style && styles[cols[ci].style as string])}>
                    {cell}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
