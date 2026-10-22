import { useParams } from 'react-router-dom';
import { Badge } from '@/components/Badge';
import { ArticleRoot, ArticleHead, AttachmentList, ArticleBody, Figure, Kogl, PostNav, ListBtn } from '@/components/Article';
import { Survey } from '@/components/Survey';
import { press } from '@/data/press';
import { imageUrl } from '@/utils/asset';
import { isoDate } from '@/utils/date';

export default function PressViewPage() {
  const { id } = useParams();
  const item = press.find((p) => p.id === id) ?? press[0];

  return (
    <>
      {/* 게시글 본문 (원본 .article) — 아래 공공누리·이전/다음글·버튼은 본문 밖 형제 요소 */}
      <ArticleRoot>
        <ArticleHead
          badges={<Badge label="보도자료" variant="primary" />}
          title={item.title}
          meta={[
            { label: '담당부서', value: item.dept },
            { label: '배포일', value: <time dateTime={isoDate(item.date)} className="num">{item.date}</time> },
            { label: '조회수', value: <span className="num">1,894</span> },
          ]}
        />

        <AttachmentList
          files={
            item.detail?.files ?? [
              { name: `[보도자료] ${item.title}.hwp`, size: '184KB' },
              { name: `[사진] ${item.title}.jpg`, size: '2.6MB' },
            ]
          }
        />

        <ArticleBody>
          <Figure
            src={imageUrl(item.image)}
            alt={item.detail?.figure.alt ?? `${item.title} 관련 사진`}
            caption={item.detail?.figure.caption ?? `${item.title} (사진 제공: 에너지전환진흥원)`}
          />
          {(item.detail?.blocks ?? [{ type: 'p', text: item.summary }]).map((block, i) =>
            block.type === 'h4' ? <h4 key={i}>{block.text}</h4> : <p key={i}>{block.text}</p>,
          )}
        </ArticleBody>
      </ArticleRoot>

      <Kogl />
      <PostNav
        prev={{ href: '/news/press/p2', title: '재생에너지 보급률 32.4% 달성… 전년 대비 4.1%p 상승', date: '2026.10.11' }}
        next={{ href: '/news/press/p4', title: '에너지바우처 하반기 신청 기간 11월 말까지 연장', date: '2026.09.18' }}
      />
      <ListBtn href="/news/press" />
      <Survey dept="홍보소통실" />
    </>
  );
}
