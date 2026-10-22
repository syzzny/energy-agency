import { SearchFilter } from '@/components/SearchFilter';
import { ListInfo } from '@/components/ListInfo';
import { BoardTable } from '@/components/BoardTable';
import { QnaRow } from '@/components/QnaRow';
import { Pagination } from '@/components/Pagination';
import { qna } from '@/data/qna';

const COLS = [
  { label: '번호', className: 'colNo' },
  { label: '제목' },
  { label: '작성자', className: 'colWriter' },
  { label: '작성일', className: 'colDate' },
  { label: '상태', className: 'colState' },
];

export default function QnaListPage() {
  return (
    <>
      <SearchFilter id="qnaKeyword" options={['제목+내용', '제목', '작성자']} />
      <ListInfo total="2,031" pages="204" actionLabel="질문 등록" actionHref="/participation/petition" actionIcon="edit" />
      <BoardTable caption="묻고 답하기 목록 — 번호, 제목, 작성자, 작성일, 답변 상태" cols={COLS}>
        {qna.map((q) => (
          <QnaRow key={q.no} qna={q} />
        ))}
      </BoardTable>
      <Pagination />
    </>
  );
}
