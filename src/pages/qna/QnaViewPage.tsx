import { useParams } from 'react-router-dom';
import { Badge } from '@/components/Badge';
import { ArticleRoot, ArticleHead, ArticleBody, AnswerBlock, ListBtn, PostNav } from '@/components/Article';
import { qna } from '@/data/qna';
import { statusVariant } from '@/utils/status';
import { isoDate } from '@/utils/date';

export default function QnaViewPage() {
  const { id } = useParams();
  // 주소에 번호가 없으면 답변이 달린 대표 게시물을 보여준다
  const item = qna.find((q) => q.no === id) ?? qna.find((q) => q.detail) ?? qna[0];

  return (
    <>
      {/* 게시글 본문 (원본 .article) — 아래 공공누리·이전/다음글·버튼은 본문 밖 형제 요소 */}
      <ArticleRoot>
        <ArticleHead
          badges={<Badge label={item.status} variant={statusVariant(item.status)} />}
          title={item.title}
          meta={[
            { label: '작성자', value: item.writer },
            { label: '작성일', value: <time dateTime={isoDate(item.date)} className="num">{item.date}</time> },
            { label: '조회수', value: <span className="num">128</span> },
          ]}
        />

        <ArticleBody>
          {(item.detail?.question ?? ['안녕하세요. 문의 드린 내용에 대해 자세한 안내를 받고 싶습니다. 관련 절차와 유의사항을 알려주시면 감사하겠습니다.']).map((t, i) => (
            <p key={i}>{t}</p>
          ))}
        </ArticleBody>

        {item.status === '답변완료' && (
          <AnswerBlock dept={item.detail?.dept ?? '담당 부서'} date={item.detail?.answerDate ?? item.date}>
            {(item.detail?.answer ?? [
              '안녕하세요. 에너지전환진흥원입니다.',
              '문의해 주신 내용에 대해 담당 부서에서 확인한 결과를 안내드립니다. 추가로 궁금한 점은 고객센터(1600-0000)로 문의해 주세요. 감사합니다.',
            ]).map((t, i) => (
              <p key={i}>{t}</p>
            ))}
          </AnswerBlock>
        )}
      </ArticleRoot>

      <PostNav
        prev={{ href: '/support/qna/2028', title: '그린리모델링 지원 시 시공업체를 직접 선정할 수 있나요?', date: '2026.10.19' }}
        next={{ href: '/support/qna/2030', title: '비공개 질문입니다.', date: '2026.10.20' }}
      />
      <ListBtn href="/support/qna" />
    </>
  );
}
