import { Link } from 'react-router-dom';
import { ChipFilter } from '@/components/ChipFilter';
import { BoardTable } from '@/components/BoardTable';
import { DisclosureRow } from '@/components/DisclosureRow';
import { Pagination } from '@/components/Pagination';
import { Icon } from '@/components/Icon';
import { TextNote } from '@/components/TextNote';
import { useChipFilter } from '@/hooks';
import { disclosure, disclosureCategories } from '@/data/disclosure';
import styles from './DisclosureListPage.module.scss';

const COLS = [
  { label: '번호', className: 'colNo' },
  { label: '분류', className: 'colCat' },
  { label: '공표항목' },
  { label: '공표주기', className: 'colCycle' },
  { label: '공표시기', className: 'colTime' },
  { label: '담당부서', className: 'colDept' },
  { label: '바로가기', className: 'colGo' },
];

const LINKS = [
  { to: '/info/request', icon: 'edit', title: '정보공개 청구', desc: '공개되지 않은 정보 요청' },
  { to: '/about/org', icon: 'users', title: '담당부서 찾기', desc: '부서별 업무와 연락처' },
  { to: '/support/qna', icon: 'message', title: '묻고 답하기', desc: '궁금한 내용 문의' },
];

export default function DisclosureListPage() {
  const { active, select, filtered } = useChipFilter(disclosure, (d) => d.category);

  return (
    <>
      <div className={styles.introBox}>
        <span className={styles.introBoxIcon} aria-hidden="true">
          <Icon name="book" />
        </span>
        <div>
          <strong>사전정보공표란?</strong>
          <p>「공공기관의 정보공개에 관한 법률」 제7조에 따라 국민의 알 권리 보장을 위해, 청구가 없어도 주기적으로 공개하는 정보입니다.</p>
        </div>
      </div>

      <ul className={styles.linkCards}>
        {LINKS.map((l) => (
          <li key={l.to}>
            <Link to={l.to}>
              <span className={styles.linkCardsIcon} aria-hidden="true">
                <Icon name={l.icon} />
              </span>
              <span>
                <strong>{l.title}</strong>
                <small>{l.desc}</small>
              </span>
              <Icon name="right" />
            </Link>
          </li>
        ))}
      </ul>

      <ChipFilter label="공표 분류" items={disclosureCategories} active={active} onSelect={select} className="mt-lg" />

      <BoardTable caption="사전정보공표 목록 — 번호, 분류, 공표항목, 공표주기, 공표시기, 담당부서, 바로가기" cols={COLS} variant="disclosure">
        {filtered.map((item) => (
          <DisclosureRow key={item.no} item={item} />
        ))}
      </BoardTable>

      <Pagination />

      <TextNote>공표 목록에 없는 정보는 「정보공개 청구」를 통해 요청하실 수 있습니다.</TextNote>
    </>
  );
}
