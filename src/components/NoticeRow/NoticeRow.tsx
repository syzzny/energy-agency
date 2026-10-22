import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { Badge, NewBadge } from '@/components/Badge';
import { Icon } from '@/components/Icon';
import type { NoticeItem } from '@/data/types';
import styles from '@/components/BoardTable/BoardTable.module.scss';

export function NoticeRow({ notice }: { notice: NoticeItem }) {
  return (
    <tr className={clsx(notice.pinned && styles.pinned)}>
      {notice.pinned ? (
        <td className={styles.no}>
          <Badge label="공지" variant="solid" />
        </td>
      ) : (
        <td className={clsx(styles.no, styles.isNumber, 'num')}>{notice.no}</td>
      )}
      <td className={styles.title}>
        <Link to={`/news/notice/${notice.id}`}>
          <span>{notice.title}</span>
          {notice.isNew && <NewBadge />}
        </Link>
      </td>
      <td className={styles.file}>{notice.attach && <Icon name="clip" label="첨부파일 있음" />}</td>
      <td className={clsx(styles.date, 'num')}>{notice.date}</td>
      <td className={clsx(styles.hit, 'num')}>{notice.hits}</td>
    </tr>
  );
}
