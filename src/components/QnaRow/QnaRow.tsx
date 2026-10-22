import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { Badge } from '@/components/Badge';
import { Icon } from '@/components/Icon';
import type { Qna } from '@/api/qna';
import { statusVariant } from '@/utils/status';
import { formatDate, isoDate } from '@/utils/date';
import styles from '@/components/BoardTable/BoardTable.module.scss';

/** 묻고 답하기 목록 한 줄 — 번호는 화면에 보이는 순번, 비공개 글은 제목 뒤에 자물쇠 아이콘 */
export function QnaRow({ qna, no }: { qna: Qna; no: number }) {
  const date = formatDate(qna.createdAt);
  return (
    <tr>
      <td className={clsx(styles.no, styles.isNumber, 'num')}>{no}</td>
      <td className={styles.title}>
        <Link to={`/support/qna/${qna.id}`}>
          <span>{qna.title}</span>
          {qna.isPrivate && <Icon name="lock" label="비공개 글" />}
        </Link>
      </td>
      <td className={styles.writer}>{qna.writer}</td>
      <td className={clsx(styles.date, 'num')}>
        <time dateTime={isoDate(date)}>{date}</time>
      </td>
      <td className={styles.state}>
        <Badge label={qna.status} variant={statusVariant(qna.status)} />
      </td>
    </tr>
  );
}
