import type { ReactNode } from 'react';
import styles from './Article.module.scss';

/** 세로형 정보 표 (항목 | 내용) */
export function InfoTable({ caption, rows }: { caption: string; rows: [string, ReactNode][] }) {
  return (
    <table className={styles.infoTable}>
      <caption>{caption}</caption>
      <tbody>
        {rows.map(([label, value]) => (
          <tr key={label}>
            <th scope="row">{label}</th>
            <td>{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
