import { useSearchParams } from 'react-router-dom';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { ListInfo } from '@/components/ListInfo';
import { BoardTable } from '@/components/BoardTable';
import { QnaRow } from '@/components/QnaRow';
import { Pagination } from '@/components/Pagination';
import { Button } from '@/components/Button';
import { StateMessage, TableMessageRow, TableSkeleton } from '@/components/AsyncState';
import { errorMessage, fetchMyQnaList } from '@/api/qna';
import { RequireAuth, useAuth } from '@/auth';

const PAGE_SIZE = 10;
const COLS = [
  { label: '번호', className: 'colNo' },
  { label: '제목' },
  { label: '작성자', className: 'colWriter' },
  { label: '작성일', className: 'colDate' },
  { label: '상태', className: 'colState' },
];

/** 내 질문 — 로그인한 사람만. 비공개 글도 본인에게는 내용 · 답변이 보인다 */
export default function MyQnaPage() {
  return (
    <RequireAuth>
      <MyQnaList />
    </RequireAuth>
  );
}

function MyQnaList() {
  const { user } = useAuth();
  const [params] = useSearchParams();
  const page = Math.max(1, Number(params.get('page')) || 1);

  const { data, error, isPending, isError, isFetching, refetch } = useQuery({
    queryKey: ['qna', 'mine', user!.id, page],
    queryFn: ({ signal }) => fetchMyQnaList({ userId: user!.id, page, pageSize: PAGE_SIZE }, signal),
    placeholderData: keepPreviousData,
  });

  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  let body;
  if (isPending) body = <TableSkeleton rows={4} cols={COLS.length} />;
  else if (isError)
    body = (
      <TableMessageRow colSpan={COLS.length}>
        <StateMessage
          variant="error"
          title="내 질문을 불러오지 못했어요"
          desc={errorMessage(error)}
          action={
            <Button variant="line" icon="right" onClick={() => refetch()}>
              다시 시도
            </Button>
          }
        />
      </TableMessageRow>
    );
  else if (data.items.length === 0)
    body = (
      <TableMessageRow colSpan={COLS.length}>
        <StateMessage
          variant="empty"
          title="아직 남긴 질문이 없어요"
          desc="궁금한 점을 남겨 주시면 담당 부서에서 답변해 드려요."
          action={
            <Button href="/support/qna/new" icon="edit">
              질문 등록
            </Button>
          }
        />
      </TableMessageRow>
    );
  else body = data.items.map((item, i) => <QnaRow key={item.id} qna={item} no={total - (page - 1) * PAGE_SIZE - i} />);

  return (
    <>
      <ListInfo
        total={isPending || isError ? undefined : total.toLocaleString()}
        pages={totalPages.toLocaleString()}
        page={page}
        live
        actionLabel="질문 등록"
        actionHref="/support/qna/new"
        actionIcon="edit"
      />
      <BoardTable caption={`${user!.name}님이 남긴 질문 목록 — 번호, 제목, 작성자, 작성일, 답변 상태`} cols={COLS} busy={isFetching}>
        {body}
      </BoardTable>
      {!isError && total > PAGE_SIZE && (
        <Pagination page={Math.min(page, totalPages)} totalPages={totalPages} hrefFor={(n) => (n > 1 ? `/support/qna/mine?page=${n}` : '/support/qna/mine')} />
      )}
    </>
  );
}
