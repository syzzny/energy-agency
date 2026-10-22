import { useParams } from 'react-router-dom';
import { Badge } from '@/components/Badge';
import { ArticleRoot, ArticleHead, AttachmentList, ArticleBody, InfoTable, ListBtn, PostNav } from '@/components/Article';
import { NoticeBox } from '@/components/NoticeBox';
import { Steps } from '@/components/Steps';
import { recruit } from '@/data/recruit';
import { isoDate } from '@/utils/date';

const PROCESS_STEPS = [
  { title: '서류전형', desc: '적격자 전원 필기 응시' },
  { title: '필기전형', desc: 'NCS 직업기초 · 전공' },
  { title: '면접전형', desc: '직무 · 인성 면접' },
  { title: '최종 합격', desc: '신원조사 · 임용' },
];

export default function RecruitViewPage() {
  const { id } = useParams();
  const item = recruit.find((r) => r.id === id) ?? recruit[0];
  const isClosed = item.status === 'closed';

  return (
    <>
      {/* 게시글 본문 (원본 .article) — 아래 공공누리·이전/다음글·버튼은 본문 밖 형제 요소 */}
      <ArticleRoot>
        <ArticleHead
          badges={
            <>
              <Badge label={isClosed ? '마감' : '진행중'} variant={isClosed ? undefined : 'green'} />
              <Badge label={item.type} variant="primary" />
            </>
          }
          title={item.title}
          meta={[
            { label: '담당부서', value: '인사총무팀' },
            { label: '등록일', value: <time dateTime={isoDate(item.date)} className="num">{item.date}</time> },
            { label: '접수마감', value: <span className="num">{item.dday}</span> },
          ]}
        />

        <AttachmentList
          files={[
            { name: item.detail?.noticeFile ?? `[공고문] ${item.title}.pdf`, size: '620KB' },
            { name: '[서식] 입사지원서 및 자기소개서.hwp', size: '96KB' },
          ]}
        />

        <ArticleBody>
          <p>에너지전환진흥원은 국민이 체감하는 에너지전환을 함께 이끌어 갈 인재를 다음과 같이 공개 채용합니다. 모든 전형은 블라인드 방식으로 진행합니다.</p>
          <h4>1. 채용 개요</h4>
          <InfoTable
            caption="채용 개요 — 채용분야, 채용인원, 접수기간, 접수방법, 근무지"
            rows={[
              ['채용분야', item.detail?.field ?? item.field],
              ['채용인원', '총 18명 (신입 14명, 경력 4명)'],
              ['접수기간', item.detail?.period ?? item.period],
              ['접수방법', '채용 전용 누리집 온라인 접수 (방문·우편 접수 불가)'],
              ['근무지', '부산 본원 및 권역별 지역에너지 지원센터'],
            ]}
          />
          <h4>2. 전형 절차</h4>
        </ArticleBody>

        <Steps items={PROCESS_STEPS} />

        <NoticeBox>입사지원서에 출신 학교, 가족관계 등 직무와 무관한 개인정보를 기재하면 불이익을 받을 수 있습니다.</NoticeBox>
      </ArticleRoot>

      <PostNav
        prev={{ href: '/news/recruit/r2', title: '에너지바우처 상담센터 상담원 채용', date: '2026.10.20' }}
        next={{ href: '/news/recruit/r4', title: '2026년 체험형 청년인턴 채용', date: '2026.08.18' }}
      />
      <ListBtn href="/news/recruit" applyLabel="원서 접수하기" applyHref="#" applySr="(채용 누리집, 새 창 열림)" />
    </>
  );
}
