import { Link } from 'react-router-dom';
import { CardnewsCard } from '@/components/CardnewsCard';
import { isoDate } from '@/utils/date';
import type { CardnewsItem } from '@/data/types';
import styles from './GalleryItem.module.scss';

/** 카드뉴스 목록 한 칸 — 표지 카드를 그대로 줄여서 썸네일로 쓴다 */
export function GalleryItem({ item }: { item: CardnewsItem }) {
  return (
    <li className={styles.item}>
      <div className={styles.thumb} aria-hidden="true">
        <CardnewsCard item={item} index={0} />
      </div>
      <h3 className={styles.title}>
        <Link to={`/news/cardnews/${item.id}`}>{item.title}</Link>
      </h3>
      <p className={styles.meta}>
        <time className="num" dateTime={isoDate(item.date)}>
          {item.date}
        </time>
        <span>{item.pages}장</span>
      </p>
    </li>
  );
}
