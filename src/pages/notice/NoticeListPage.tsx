import { SearchFilter } from '@/components/SearchFilter';
import { ListInfo } from '@/components/ListInfo';
import { BoardTable } from '@/components/BoardTable';
import { NoticeRow } from '@/components/NoticeRow';
import { Pagination } from '@/components/Pagination';
import { notices } from '@/data/notices';

const COLS = [
  { label: '번호', className: 'colNo' },
  { label: '제목' },
  { label: '첨부', className: 'colFile' },
  { label: '작성일', className: 'colDate' },
  { label: '조회', className: 'colHit' },
];

export default function NoticeListPage() {
  return (
    <>
      <SearchFilter id="boardKeyword" />
      <ListInfo total="1,248" pages="125" sort />
      <BoardTable caption="공지사항 목록 — 번호, 제목, 첨부파일, 작성일, 조회수" cols={COLS}>
        {notices.map((n) => (
          <NoticeRow key={n.id} notice={n} />
        ))}
      </BoardTable>
      <Pagination />
    </>
  );
}
