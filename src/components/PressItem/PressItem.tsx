import { Link } from 'react-router-dom';
import { Thumb } from '@/components/Thumb';
import { Icon } from '@/components/Icon';
import type { PressItem as PressItemType } from '@/data/types';
import { imageUrl } from '@/utils/asset';
import styles from './PressItem.module.scss';

export function PressItem({ item }: { item: PressItemType }) {
  return (
    <li className={styles.item}>
      <Thumb className={styles.thumb}>
        <img src={imageUrl(`${item.image}-sm`)} alt="" width={200} height={132} loading="lazy" />
      </Thumb>
      <div className={styles.body}>
        <h3 className={styles.title}>
          <Link to={`/news/press/${item.id}`}>{item.title}</Link>
        </h3>
        <p className={styles.summary}>{item.summary}</p>
        <p className={styles.meta}>
          <span className="num">{item.date}</span>
          <span>{item.dept}</span>
          {item.attach && (
            <span>
              <Icon name="clip" />첨부
            </span>
          )}
        </p>
      </div>
    </li>
  );
}
