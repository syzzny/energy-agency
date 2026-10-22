import { useParams } from 'react-router-dom';
import { Badge } from '@/components/Badge';
import { ArticleRoot, ArticleHead, Kogl, PostNav, ListBtn } from '@/components/Article';
import { CardnewsViewer, TextAlt } from '@/components/CardnewsViewer';
import { Button } from '@/components/Button';
import { cardnews } from '@/data/cardnews';
import { isoDate } from '@/utils/date';
import styles from './CardnewsViewPage.module.scss';

export default function CardnewsViewPage() {
  const { id } = useParams();
  const idx = Math.max(0, cardnews.findIndex((c) => c.id === id));
  const item = cardnews[idx];
  // 목록(최신순) 기준 이웃 글 — 이전글은 더 오래된 글, 다음글은 더 최근 글. 없으면 표시하지 않는다
  const navItem = (c?: typeof item) => c && { href: `/news/cardnews/${c.id}`, title: c.title, date: c.date };
  const prevItem = cardnews[idx + 1];
  const nextItem = cardnews[idx - 1];

  return (
    <>
      {/* 게시글 본문 (원본 .article) — 아래 공공누리·이전/다음글·버튼은 본문 밖 형제 요소 */}
      <ArticleRoot>
        <ArticleHead
          badges={<Badge label="카드뉴스" variant="primary" />}
          title={item.title}
          meta={[
            { label: '담당부서', value: '홍보소통실' },
            { label: '등록일', value: <time dateTime={isoDate(item.date)} className="num">{item.date}</time> },
            { label: '조회수', value: <span className="num">2,215</span> },
          ]}
        />

        <CardnewsViewer key={item.id} item={item} />
        <TextAlt item={item} />
        <div className={styles.related}>
          <Button href={item.related.to} variant="line" pill icon="arrow">
            {item.related.label}
          </Button>
        </div>
      </ArticleRoot>

      <Kogl />
      <PostNav
        prev={navItem(prevItem)}
        next={navItem(nextItem)}
      />
      <ListBtn href="/news/cardnews" />
    </>
  );
}
