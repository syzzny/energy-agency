import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { SearchFilter } from '@/components/SearchFilter';
import { ListInfo } from '@/components/ListInfo';
import { BoardTable } from '@/components/BoardTable';
import { QnaRow } from '@/components/QnaRow';
import { Pagination } from '@/components/Pagination';
import { Button } from '@/components/Button';
import { StateMessage, TableMessageRow, TableSkeleton } from '@/components/AsyncState';
import { errorMessage, fetchQnaList, type QnaSearchField } from '@/api/qna';
import { useDebouncedValue } from '@/hooks';

const PAGE_SIZE = 10;

const COLS = [
  { label: '번호', className: 'colNo' },
  { label: '제목' },
  { label: '작성자', className: 'colWriter' },
  { label: '작성일', className: 'colDate' },
  { label: '상태', className: 'colState' },
];

const FIELDS: { value: QnaSearchField; label: string }[] = [
  { value: 'all', label: '제목+내용' },
  { value: 'title', label: '제목' },
  { value: 'writer', label: '작성자' },
];

const toField = (v: string | null): QnaSearchField => (v === 'title' || v === 'writer' ? v : 'all');

/**
 * 묻고 답하기 목록 — Supabase(REST) 에서 페이지 단위로 불러온다
 * - 검색 조건 · 검색어 · 페이지는 주소(?page=&q=&field=)에 남겨 새로고침 · 뒤로가기 · 공유에도 유지
 * - 검색어는 입력을 멈추고 0.4초 뒤에 요청 (엔터를 누르면 바로)
 * - 다음 페이지를 불러오는 동안 이전 목록을 그대로 보여 줘 화면이 깜빡이지 않게 한다
 */
export default function QnaListPage() {
  const [params, setParams] = useSearchParams();
  const page = Math.max(1, Number(params.get('page')) || 1);
  const q = params.get('q') ?? '';
  const field = toField(params.get('field'));

  const [keyword, setKeyword] = useState(q);
  const debounced = useDebouncedValue(keyword, 400);

  // 주소가 바뀌면(뒤로가기 등) 입력창도 맞춘다
  useEffect(() => setKeyword(q), [q]);

  const applySearch = (nextQ: string, nextField: QnaSearchField = field) => {
    const next = new URLSearchParams();
    if (nextQ.trim()) next.set('q', nextQ.trim());
    if (nextField !== 'all') next.set('field', nextField);
    setParams(next, { replace: true });
  };

  useEffect(() => {
    if (debounced.trim() !== q) applySearch(debounced);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  const { data, error, isPending, isError, isFetching, isPlaceholderData, refetch } = useQuery({
    queryKey: ['qna', 'list', { page, q, field }],
    queryFn: ({ signal }) => fetchQnaList({ page, pageSize: PAGE_SIZE, keyword: q, field }, signal),
    placeholderData: keepPreviousData,
  });

  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const hrefFor = (n: number) => {
    const next = new URLSearchParams(params);
    if (n > 1) next.set('page', String(n));
    else next.delete('page');
    const s = next.toString();
    return `/support/qna${s ? `?${s}` : ''}`;
  };

  let body;
  if (isPending) {
    body = <TableSkeleton rows={PAGE_SIZE} cols={COLS.length} />;
  } else if (isError) {
    body = (
      <TableMessageRow colSpan={COLS.length}>
        <StateMessage
          variant="error"
          title="목록을 불러오지 못했어요"
          desc={errorMessage(error)}
          action={
            <Button variant="line" icon="right" onClick={() => refetch()}>
              다시 시도
            </Button>
          }
        />
      </TableMessageRow>
    );
  } else if (data.items.length === 0) {
    body = (
      <TableMessageRow colSpan={COLS.length}>
        {q ? (
          <StateMessage variant="empty" title={`‘${q}’ 검색 결과가 없어요`} desc="검색어를 바꾸거나 검색 조건을 ‘제목+내용’으로 넓혀 보세요." />
        ) : (
          <StateMessage
            variant="empty"
            title="아직 등록된 질문이 없어요"
            desc="궁금한 점을 남겨 주시면 담당 부서에서 답변해 드려요."
            action={
              <Button href="/support/qna/new" icon="edit">
                질문 등록
              </Button>
            }
          />
        )}
      </TableMessageRow>
    );
  } else {
    body = data.items.map((item, i) => <QnaRow key={item.id} qna={item} no={total - (page - 1) * PAGE_SIZE - i} />);
  }

  return (
    <>
      <SearchFilter
        id="qnaKeyword"
        options={FIELDS}
        keyword={keyword}
        onKeywordChange={setKeyword}
        field={field}
        onFieldChange={(v) => applySearch(keyword, toField(v))}
        onSubmit={() => applySearch(keyword)}
      />
      <ListInfo
        total={isPending || isError ? undefined : total.toLocaleString()}
        pages={totalPages.toLocaleString()}
        page={page}
        live
        actionLabel="질문 등록"
        actionHref="/support/qna/new"
        actionIcon="edit"
      />
      <BoardTable caption="묻고 답하기 목록 — 번호, 제목, 작성자, 작성일, 답변 상태" cols={COLS} busy={isFetching}>
        {body}
      </BoardTable>
      {!isError && total > 0 && (
        <div style={{ opacity: isPlaceholderData ? 0.6 : 1, transition: 'opacity .2s' }}>
          <Pagination page={Math.min(page, totalPages)} totalPages={totalPages} hrefFor={hrefFor} />
        </div>
      )}
    </>
  );
}
