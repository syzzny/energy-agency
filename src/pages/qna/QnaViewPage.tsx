import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { ArticleRoot, ArticleHead, ArticleBody, AnswerBlock, ListBtn } from '@/components/Article';
import { ArticleSkeleton, StateMessage } from '@/components/AsyncState';
import { NoticeBox } from '@/components/NoticeBox';
import { errorMessage, fetchQna } from '@/api/qna';
import { statusVariant } from '@/utils/status';
import { formatDate, isoDate } from '@/utils/date';

/** 줄바꿈을 문단으로 */
const paragraphs = (text: string) =>
  text
    .split(/\n+/)
    .filter((t) => t.trim())
    .map((t, i) => <p key={i}>{t}</p>);

export default function QnaViewPage() {
  const { id } = useParams();
  const qnaId = Number(id);
  const validId = Number.isInteger(qnaId) && qnaId > 0;

  const { data: item, error, isPending, isError, refetch } = useQuery({
    queryKey: ['qna', 'detail', qnaId],
    queryFn: ({ signal }) => fetchQna(qnaId, signal),
    enabled: validId,
  });

  if (validId && isPending) {
    return (
      <div aria-busy="true">
        <p className="sr-only" role="status">
          게시글을 불러오는 중입니다.
        </p>
        <ArticleSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <>
        <StateMessage
          variant="error"
          title="게시글을 불러오지 못했어요"
          desc={errorMessage(error)}
          action={
            <Button variant="line" icon="right" onClick={() => refetch()}>
              다시 시도
            </Button>
          }
        />
        <ListBtn href="/support/qna" />
      </>
    );
  }

  if (!validId || !item) {
    return (
      <>
        <StateMessage variant="empty" title="게시글을 찾을 수 없어요" desc="삭제되었거나 주소가 잘못되었을 수 있어요. 목록에서 다시 찾아 주세요." />
        <ListBtn href="/support/qna" />
      </>
    );
  }

  const date = formatDate(item.createdAt);

  return (
    <>
      <ArticleRoot>
        <ArticleHead
          badges={<Badge label={item.status} variant={statusVariant(item.status)} />}
          title={item.title}
          meta={[
            { label: '작성자', value: item.writer },
            { label: '작성일', value: <time dateTime={isoDate(date)} className="num">{date}</time> },
          ]}
        />

        <ArticleBody>
          {item.isPrivate ? (
            <NoticeBox variant="info">비공개 글입니다. 작성자 본인과 담당 부서만 내용을 확인할 수 있어요.</NoticeBox>
          ) : (
            paragraphs(item.content ?? '')
          )}
        </ArticleBody>

        {item.answer && (
          <AnswerBlock dept={item.answerDept ?? '담당 부서'} date={item.answeredAt ? formatDate(item.answeredAt) : date}>
            {paragraphs(item.answer)}
          </AnswerBlock>
        )}
      </ArticleRoot>

      <ListBtn href="/support/qna" />
    </>
  );
}
