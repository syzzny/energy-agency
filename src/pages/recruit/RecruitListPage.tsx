import { ChipFilter } from '@/components/ChipFilter';
import { RecruitItem } from '@/components/RecruitItem';
import { NoticeBox } from '@/components/NoticeBox';
import { useChipFilter } from '@/hooks';
import { recruit, recruitStatus } from '@/data/recruit';
import recruitStyles from '@/components/RecruitItem/RecruitItem.module.scss';

export default function RecruitListPage() {
  const { active, select, filtered } = useChipFilter(recruit, (r) => r.status);

  return (
    <>
      <ChipFilter label="채용 상태" items={recruitStatus} active={active} onSelect={select} />
      <ul className={recruitStyles.list}>
        {filtered.map((r) => (
          <RecruitItem key={r.id} item={r} />
        ))}
      </ul>
      <NoticeBox variant="info">
        모든 채용은 블라인드 방식으로 진행되며, 원서 접수는 채용 전용 누리집에서만 받습니다. 채용 관련 문의: 인사총무팀 <span className="num">051-000-0102</span>
      </NoticeBox>
    </>
  );
}
