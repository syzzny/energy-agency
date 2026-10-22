import { slideText } from '@/components/CardnewsCard';
import type { CardnewsItem } from '@/data/types';
import styles from './CardnewsViewer.module.scss';

/** 카드뉴스 전체를 한 번에 읽을 수 있는 텍스트 버전 */
export function TextAlt({ item }: { item: CardnewsItem }) {
  return (
    <details className={styles.textAlt}>
      <summary>카드뉴스 내용 텍스트로 보기</summary>
      <ol>
        {item.slides.map((s, i) => {
          const t = slideText(s);
          return (
            <li key={i}>
              <strong>{t.head}</strong> {t.body}
            </li>
          );
        })}
      </ol>
    </details>
  );
}
