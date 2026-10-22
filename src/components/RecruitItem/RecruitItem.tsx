import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { Badge } from '@/components/Badge';
import type { RecruitItem as RecruitItemType } from '@/data/types';
import styles from './RecruitItem.module.scss';

export function RecruitItem({ item }: { item: RecruitItemType }) {
  const isClosed = item.status === 'closed';

  return (
    <li className={clsx(styles.item, isClosed && styles.closed)} data-category={item.status}>
      <div>
        <div className={styles.badges}>
          <Badge label={isClosed ? '마감' : '진행중'} variant={isClosed ? undefined : 'green'} />
          <Badge label={item.type} variant="primary" />
        </div>
        <h3 className={styles.title}>
          <Link to={`/news/recruit/${item.id}`}>{item.title}</Link>
        </h3>
        <dl className={styles.meta}>
          <div>
            <dt>접수기간</dt>
            <dd className="num">{item.period}</dd>
          </div>
          <div>
            <dt>모집분야</dt>
            <dd>{item.field}</dd>
          </div>
        </dl>
      </div>
      <p className={styles.dday}>
        <strong>{isClosed ? '마감' : item.dday}</strong>
        <span>{isClosed ? '결과 발표' : '접수 마감까지'}</span>
      </p>
    </li>
  );
}
