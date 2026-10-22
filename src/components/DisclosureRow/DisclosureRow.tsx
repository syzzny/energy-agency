import clsx from 'clsx';
import { Badge } from '@/components/Badge';
import { Icon } from '@/components/Icon';
import type { DisclosureItem } from '@/data/types';
import styles from '@/components/BoardTable/BoardTable.module.scss';

/** 사전정보공표 한 줄 — 모바일에서는 분류·제목 / 주기·시기·바로가기 2줄 카드로 바뀐다 */
export function DisclosureRow({ item }: { item: DisclosureItem }) {
  return (
    <tr data-category={item.category}>
      <td className={clsx(styles.no, 'num')}>{item.no}</td>
      <td className={styles.cat}>
        <Badge label={item.categoryLabel} />
      </td>
      <td className={styles.taL}>{item.title}</td>
      <td className={styles.cycle}>{item.cycle}</td>
      <td className={styles.time}>{item.time}</td>
      <td className={styles.dept}>{item.dept}</td>
      <td className={styles.go}>
        <a href="#" className={styles.goBtn} target="_blank" rel="noopener">
          보기
          <Icon name="external" />
          <span className="sr-only">{item.linkLabel} (새 창 열림)</span>
        </a>
      </td>
    </tr>
  );
}
