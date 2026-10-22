import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { Badge } from '@/components/Badge';
import { Icon } from '@/components/Icon';
import type { QnaItem } from '@/data/types';
import { statusVariant } from '@/utils/status';
import styles from '@/components/BoardTable/BoardTable.module.scss';

/** 묻고 답하기 목록 한 줄 — 비공개 글은 제목 뒤에 자물쇠 아이콘 */
export function QnaRow({ qna }: { qna: QnaItem }) {
  return (
    <tr>
      <td className={clsx(styles.no, styles.isNumber, 'num')}>{qna.no}</td>
      <td className={styles.title}>
        <Link to={`/support/qna/${qna.no}`}>
          <span>{qna.title}</span>
          {qna.private && <Icon name="lock" label="비공개 글" />}
        </Link>
      </td>
      <td className={styles.writer}>{qna.writer}</td>
      <td className={clsx(styles.date, 'num')}>{qna.date}</td>
      <td className={styles.state}>
        <Badge label={qna.status} variant={statusVariant(qna.status)} />
      </td>
    </tr>
  );
}
